import { Person, ParentChild, Marriage, Branch } from './types';

export interface PersonCardItem {
  person: Person;
  role: 'PRIMARY' | 'SPOUSE';
  spouseOrder?: number;
  marriageNotes?: string;
}

export interface TreeNode {
  id: string;
  primaryPersonId: string;
  memberIds: string[];
  members: PersonCardItem[]; // Danh sách các card nhỏ bên trong card lớn
  generation: number;
  branchName?: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TreeLink {
  id: string;
  sourceId: string;
  targetId: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  childGender: 'MALE' | 'FEMALE' | 'OTHER';
}

export interface TreeLayoutResult {
  nodes: TreeNode[];
  links: TreeLink[];
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export function buildFamilyTreeLayout(
  persons: Person[],
  parentChildren: ParentChild[],
  marriages: Marriage[],
  branches: Branch[],
  selectedBranchId: string | null = null,
  selectedGeneration: number | null = null
): TreeLayoutResult {
  const SUB_CARD_WIDTH = 200;
  const SUB_CARD_GAP = 16;
  const CARD_PADDING = 24;
  const NODE_HEIGHT = 160;
  const FAMILY_GAP = 60;
  const VERTICAL_GAP = 140;

  // Lọc persons nếu có filter
  let activePersons = persons;
  if (selectedBranchId) {
    activePersons = activePersons.filter(
      (p) => !p.branchId || p.branchId === selectedBranchId || p.generationLevel === 1
    );
  }

  // Nhóm theo thế hệ
  const generationsMap = new Map<number, Person[]>();
  for (const person of activePersons) {
    const gen = person.generationLevel || 1;
    if (!generationsMap.has(gen)) {
      generationsMap.set(gen, []);
    }
    generationsMap.get(gen)!.push(person);
  }

  const sortedGens = Array.from(generationsMap.keys()).sort((a, b) => a - b);
  const nodes: TreeNode[] = [];
  const links: TreeLink[] = [];

  let overallMinX = Infinity;
  let overallMaxX = -Infinity;
  let overallMinY = Infinity;
  let overallMaxY = -Infinity;

  // Bản đồ ánh xạ từng personId -> Family TreeNode tương ứng
  const personToFamilyNodeMap = new Map<string, TreeNode>();

  sortedGens.forEach((gen, genIndex) => {
    if (selectedGeneration && gen !== selectedGeneration && selectedGeneration > 0) {
      // nếu lọc theo thế hệ
    }
    const genPersons = generationsMap.get(gen) || [];
    genPersons.sort((a, b) => (a.birthOrder || 1) - (b.birthOrder || 1));

    // Nhóm các thành viên thành các Hộ Gia Đình (Card Lớn)
    // 1 người chính + Tất cả các vợ (hoặc tất cả các chồng)
    const familyUnits: { primary: Person; spouses: { person: Person; notes?: string; order: number }[] }[] = [];
    const handledPersonIds = new Set<string>();

    // Bước 1: Ưu tiên thành viên dòng họ chính (nam đinh hoặc người có quan hệ cha-con)
    genPersons.forEach((person) => {
      if (handledPersonIds.has(person.id)) return;

      // Tìm tất cả các cuộc hôn nhân liên quan đến người này
      const spouseItems: { person: Person; notes?: string; order: number }[] = [];
      marriages.forEach((m) => {
        let spouseId: string | null = null;
        if (m.husbandId === person.id) spouseId = m.wifeId;
        if (m.wifeId === person.id) spouseId = m.husbandId;

        if (spouseId) {
          const spouse = persons.find((sp) => sp.id === spouseId);
          if (spouse && !handledPersonIds.has(spouse.id)) {
            spouseItems.push({
              person: spouse,
              notes: m.notes || (m.marriageOrder > 1 ? `Vợ thứ ${m.marriageOrder}` : 'Chánh Thất'),
              order: m.marriageOrder || 1,
            });
          }
        }
      });

      // Đánh dấu đã xử lý
      handledPersonIds.add(person.id);
      spouseItems.forEach((sp) => handledPersonIds.add(sp.person.id));

      familyUnits.push({
        primary: person,
        spouses: spouseItems,
      });
    });

    // Tính toán chiều rộng từng Card Lớn trong thế hệ này
    const familyWidths = familyUnits.map((fam) => {
      const memberCount = 1 + fam.spouses.length;
      return memberCount * SUB_CARD_WIDTH + (memberCount - 1) * SUB_CARD_GAP + CARD_PADDING;
    });

    const totalWidthForGen = familyWidths.reduce((sum, w) => sum + w, 0) + (familyUnits.length - 1) * FAMILY_GAP;
    let currentX = -totalWidthForGen / 2;
    const currentY = genIndex * (NODE_HEIGHT + VERTICAL_GAP);

    familyUnits.forEach((fam, fIndex) => {
      const famWidth = familyWidths[fIndex];
      const branch = branches.find((b) => b.id === fam.primary.branchId);

      const membersList: PersonCardItem[] = [
        {
          person: fam.primary,
          role: 'PRIMARY',
        },
        ...fam.spouses.map((sp) => ({
          person: sp.person,
          role: 'SPOUSE' as const,
          spouseOrder: sp.order,
          marriageNotes: sp.notes,
        })),
      ];

      const allMemberIds = membersList.map((m) => m.person.id);

      const treeNode: TreeNode = {
        id: `fam-${fam.primary.id}`,
        primaryPersonId: fam.primary.id,
        memberIds: allMemberIds,
        members: membersList,
        generation: gen,
        branchName: branch?.name,
        x: currentX,
        y: currentY,
        width: famWidth,
        height: NODE_HEIGHT,
      };

      nodes.push(treeNode);

      // Đăng ký cho từng thành viên trong gia đình
      allMemberIds.forEach((mId) => {
        personToFamilyNodeMap.set(mId, treeNode);
      });

      overallMinX = Math.min(overallMinX, currentX);
      overallMaxX = Math.max(overallMaxX, currentX + famWidth);
      overallMinY = Math.min(overallMinY, currentY);
      overallMaxY = Math.max(overallMaxY, currentY + NODE_HEIGHT);

      currentX += famWidth + FAMILY_GAP;
    });
  });

  // Tạo liên kết links Cha/Mẹ (Card Lớn) -> Con (Card Lớn)
  const processedLinks = new Set<string>();

  parentChildren.forEach((pc) => {
    const parentFamNode = personToFamilyNodeMap.get(pc.parentId);
    const childFamNode = personToFamilyNodeMap.get(pc.childId);

    if (parentFamNode && childFamNode && parentFamNode.id !== childFamNode.id) {
      const linkKey = `${parentFamNode.id}-${childFamNode.id}`;
      if (processedLinks.has(linkKey)) return;
      processedLinks.add(linkKey);

      const childPerson = persons.find((p) => p.id === pc.childId);

      // Điểm xuất phát từ giữa đáy của Card Lớn Cha/Mẹ đến đỉnh giữa của Card Lớn Con
      const sourceX = parentFamNode.x + parentFamNode.width / 2;
      const sourceY = parentFamNode.y + parentFamNode.height;
      const targetX = childFamNode.x + childFamNode.width / 2;
      const targetY = childFamNode.y;

      links.push({
        id: `link-${linkKey}`,
        sourceId: parentFamNode.id,
        targetId: childFamNode.id,
        sourceX,
        sourceY,
        targetX,
        targetY,
        childGender: childPerson?.gender || 'MALE',
      });
    }
  });

  return {
    nodes,
    links,
    minX: overallMinX === Infinity ? 0 : overallMinX,
    maxX: overallMaxX === -Infinity ? 800 : overallMaxX,
    minY: overallMinY === Infinity ? 0 : overallMinY,
    maxY: overallMaxY === -Infinity ? 600 : overallMaxY,
  };
}

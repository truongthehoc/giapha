import { Person, ParentChild, Marriage, Branch } from './types';

export interface TreeNode {
  id: string;
  person: Person;
  spouses: Person[];
  children: TreeNode[];
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
  const NODE_WIDTH = 240;
  const NODE_HEIGHT = 120;
  const HORIZONTAL_GAP = 60;
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

  sortedGens.forEach((gen, genIndex) => {
    if (selectedGeneration && gen !== selectedGeneration && selectedGeneration > 0) {
      // nếu chọn lọc thế hệ
    }
    const genPersons = generationsMap.get(gen) || [];
    // Sắp xếp thứ tự sinh (con trưởng trước, con thứ sau)
    genPersons.sort((a, b) => (a.birthOrder || 1) - (b.birthOrder || 1));

    const totalWidthForGen = genPersons.length * (NODE_WIDTH + HORIZONTAL_GAP) - HORIZONTAL_GAP;
    const startX = -totalWidthForGen / 2;
    const currentY = genIndex * (NODE_HEIGHT + VERTICAL_GAP);

    genPersons.forEach((person, pIndex) => {
      const currentX = startX + pIndex * (NODE_WIDTH + HORIZONTAL_GAP);

      // Tìm vợ / chồng
      const spouseIds: string[] = [];
      marriages.forEach((m) => {
        if (m.husbandId === person.id) spouseIds.push(m.wifeId);
        if (m.wifeId === person.id) spouseIds.push(m.husbandId);
      });
      const spouses = persons.filter((p) => spouseIds.includes(p.id));

      const branch = branches.find((b) => b.id === person.branchId);

      const treeNode: TreeNode = {
        id: person.id,
        person: person,
        spouses: spouses,
        children: [],
        generation: gen,
        branchName: branch?.name,
        x: currentX,
        y: currentY,
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
      };

      nodes.push(treeNode);

      overallMinX = Math.min(overallMinX, currentX);
      overallMaxX = Math.max(overallMaxX, currentX + NODE_WIDTH);
      overallMinY = Math.min(overallMinY, currentY);
      overallMaxY = Math.max(overallMaxY, currentY + NODE_HEIGHT);
    });
  });

  // Tạo liên kết links Cha/Mẹ -> Con
  const nodeMap = new Map<string, TreeNode>();
  nodes.forEach((n) => nodeMap.set(n.id, n));

  parentChildren.forEach((pc) => {
    const parentNode = nodeMap.get(pc.parentId);
    const childNode = nodeMap.get(pc.childId);

    if (parentNode && childNode) {
      // Điểm xuất phát từ giữa đáy của cha/mẹ đến đỉnh giữa của con
      const sourceX = parentNode.x + parentNode.width / 2;
      const sourceY = parentNode.y + parentNode.height;
      const targetX = childNode.x + childNode.width / 2;
      const targetY = childNode.y;

      links.push({
        id: `link-${parentNode.id}-${childNode.id}`,
        sourceId: parentNode.id,
        targetId: childNode.id,
        sourceX,
        sourceY,
        targetX,
        targetY,
        childGender: childNode.person.gender || 'MALE',
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

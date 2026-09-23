import { Person, ParentChild, Marriage } from './types';

export interface KinshipResult {
  personA: Person;
  personB: Person;
  relationshipName: string; // Tên quan hệ (VD: Chú họ, Anh họ, Cháu...)
  callAToB: string; // A gọi B là gì
  callBToA: string; // B gọi A là gì
  explanation: string; // Giải thích chi tiết dòng nhánh
  commonAncestorName?: string;
  generationDiff: number;
}

export function calculateKinship(
  personAId: string,
  personBId: string,
  persons: Person[],
  parentChildren: ParentChild[],
  marriages: Marriage[]
): KinshipResult | null {
  const pA = persons.find((p) => p.id === personAId);
  const pB = persons.find((p) => p.id === personBId);

  if (!pA || !pB) return null;

  if (pA.id === pB.id) {
    return {
      personA: pA,
      personB: pB,
      relationshipName: 'Chính bản thân',
      callAToB: 'Tôi',
      callBToA: 'Tôi',
      explanation: 'Hai người được chọn là cùng một người.',
      generationDiff: 0,
    };
  }

  // 1. Kiểm tra quan hệ Vợ - Chồng
  const isMarriage = marriages.find(
    (m) =>
      (m.husbandId === pA.id && m.wifeId === pB.id) ||
      (m.husbandId === pB.id && m.wifeId === pA.id)
  );

  if (isMarriage) {
    const isAHusband = isMarriage.husbandId === pA.id;
    return {
      personA: pA,
      personB: pB,
      relationshipName: 'Vợ chồng',
      callAToB: isAHusband ? 'Vợ' : 'Chồng',
      callBToA: isAHusband ? 'Chồng' : 'Vợ',
      explanation: `${pA.fullName} và ${pB.fullName} có quan hệ hôn nhân (${isMarriage.notes || 'Vợ chồng'}).`,
      generationDiff: 0,
    };
  }

  // 2. Tìm danh sách tổ tiên của mỗi người (Ancestors Path)
  const getAncestors = (personId: string): { id: string; depth: number }[] => {
    const ancestors: { id: string; depth: number }[] = [];
    const queue: { id: string; depth: number }[] = [{ id: personId, depth: 0 }];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (visited.has(current.id)) continue;
      visited.add(current.id);

      if (current.id !== personId) {
        ancestors.push(current);
      }

      const parentLinks = parentChildren.filter((pc) => pc.childId === current.id);
      for (const link of parentLinks) {
        queue.push({ id: link.parentId, depth: current.depth + 1 });
      }
    }
    return ancestors;
  };

  const ancestorsA = getAncestors(pA.id);
  const ancestorsB = getAncestors(pB.id);

  // Kiểm tra trực hệ A là tổ tiên của B
  const isAAncestorOfB = ancestorsB.find((anc) => anc.id === pA.id);
  if (isAAncestorOfB) {
    const depth = isAAncestorOfB.depth;
    let titleA = '';
    let titleB = 'Cháu';

    if (depth === 1) {
      titleA = pA.gender === 'MALE' ? 'Cha (Bố)' : 'Mẹ';
      titleB = 'Con';
    } else if (depth === 2) {
      titleA = pA.gender === 'MALE' ? 'Ông' : 'Bà';
      titleB = 'Cháu';
    } else if (depth === 3) {
      titleA = pA.gender === 'MALE' ? 'Cụ ông (Cố)' : 'Cụ bà (Cố)';
      titleB = 'Chắt';
    } else if (depth >= 4) {
      titleA = pA.gender === 'MALE' ? 'Kỵ ông (Cao tổ)' : 'Kỵ bà';
      titleB = 'Chút';
    }

    return {
      personA: pA,
      personB: pB,
      relationshipName: `Trực hệ (${titleA} - ${titleB})`,
      callAToB: titleB,
      callBToA: titleA,
      explanation: `${pA.fullName} là bậc tiền bối trực hệ (${depth} đời) của ${pB.fullName}.`,
      generationDiff: pB.generationLevel - pA.generationLevel,
    };
  }

  // Kiểm tra trực hệ B là tổ tiên của A
  const isBAncestorOfA = ancestorsA.find((anc) => anc.id === pB.id);
  if (isBAncestorOfA) {
    const depth = isBAncestorOfA.depth;
    let titleB = '';
    let titleA = 'Cháu';

    if (depth === 1) {
      titleB = pB.gender === 'MALE' ? 'Cha (Bố)' : 'Mẹ';
      titleA = 'Con';
    } else if (depth === 2) {
      titleB = pB.gender === 'MALE' ? 'Ông' : 'Bà';
      titleA = 'Cháu';
    } else if (depth === 3) {
      titleB = pB.gender === 'MALE' ? 'Cụ ông (Cố)' : 'Cụ bà (Cố)';
      titleA = 'Chắt';
    } else if (depth >= 4) {
      titleB = pB.gender === 'MALE' ? 'Kỵ ông' : 'Kỵ bà';
      titleA = 'Chút';
    }

    return {
      personA: pA,
      personB: pB,
      relationshipName: `Trực hệ (${titleB} - ${titleA})`,
      callAToB: titleB,
      callBToA: titleA,
      explanation: `${pB.fullName} là bậc tiền bối trực hệ (${depth} đời) của ${pA.fullName}.`,
      generationDiff: pB.generationLevel - pA.generationLevel,
    };
  }

  // 3. Tìm Tổ tiên chung gần nhất (LCA)
  let commonAncestor: { id: string; depthA: number; depthB: number } | null = null;
  for (const ancA of ancestorsA) {
    const matchB = ancestorsB.find((ancB) => ancB.id === ancA.id);
    if (matchB) {
      if (!commonAncestor || ancA.depth + matchB.depth < commonAncestor.depthA + commonAncestor.depthB) {
        commonAncestor = { id: ancA.id, depthA: ancA.depth, depthB: matchB.depth };
      }
    }
  }

  const lcaPerson = commonAncestor ? persons.find((p) => p.id === commonAncestor!.id) : null;
  const genDiff = pB.generationLevel - pA.generationLevel; // > 0: A đời trên B, < 0: B đời trên A, = 0: Cùng đời

  // Cùng đời (Anh / Chị / Em)
  if (genDiff === 0) {
    const isSameParents = commonAncestor && commonAncestor.depthA === 1 && commonAncestor.depthB === 1;
    const isAOlder = (pA.birthOrder || 0) < (pB.birthOrder || 0) || (pA.dobSolar && pB.dobSolar && pA.dobSolar < pB.dobSolar);

    let roleA = '';
    let roleB = '';

    if (isSameParents) {
      if (isAOlder) {
        roleA = pA.gender === 'MALE' ? 'Anh ruột' : 'Chị ruột';
        roleB = 'Em ruột';
      } else {
        roleA = 'Em ruột';
        roleB = pB.gender === 'MALE' ? 'Anh ruột' : 'Chị ruột';
      }
    } else {
      if (isAOlder) {
        roleA = pA.gender === 'MALE' ? 'Anh họ' : 'Chị họ';
        roleB = 'Em họ';
      } else {
        roleA = 'Em họ';
        roleB = pB.gender === 'MALE' ? 'Anh họ' : 'Chị họ';
      }
    }

    return {
      personA: pA,
      personB: pB,
      relationshipName: isSameParents ? 'Anh/Chị/Em ruột' : 'Anh/Chị/Em họ (Cùng thế hệ)',
      callAToB: isAOlder ? 'Em' : (pB.gender === 'MALE' ? 'Anh' : 'Chị'),
      callBToA: isAOlder ? (pA.gender === 'MALE' ? 'Anh' : 'Chị') : 'Em',
      explanation: `${pA.fullName} và ${pB.fullName} cùng thuộc Đời thứ ${pA.generationLevel}.${lcaPerson ? ` Có tổ tiên chung là ${lcaPerson.fullName}.` : ''}`,
      commonAncestorName: lcaPerson?.fullName,
      generationDiff: 0,
    };
  }

  // A là đời trên của B (genDiff > 0: A có generationLevel nhỏ hơn B)
  if (genDiff === 1) {
    let callBtoA = 'Bác';
    if (pA.gender === 'MALE') {
      callBtoA = (pA.birthOrder || 1) === 1 ? 'Bác (Bác trai)' : 'Chú';
    } else {
      callBtoA = (pA.birthOrder || 1) === 1 ? 'Bác (Bác gái)' : 'Cô (O)';
    }

    return {
      personA: pA,
      personB: pB,
      relationshipName: `Quan hệ Bác/Chú/Cô - Cháu (Chênh 1 đời)`,
      callAToB: 'Cháu',
      callBToA: callBtoA,
      explanation: `${pA.fullName} (Đời ${pA.generationLevel}) là bề trên của ${pB.fullName} (Đời ${pB.generationLevel}). B gọi A là ${callBtoA}, A gọi B là Cháu.`,
      commonAncestorName: lcaPerson?.fullName,
      generationDiff: genDiff,
    };
  }

  if (genDiff === -1) {
    // B là đời trên của A
    let callAtoB = 'Bác';
    if (pB.gender === 'MALE') {
      callAtoB = (pB.birthOrder || 1) === 1 ? 'Bác (Bác trai)' : 'Chú';
    } else {
      callAtoB = (pB.birthOrder || 1) === 1 ? 'Bác (Bác gái)' : 'Cô (O)';
    }

    return {
      personA: pA,
      personB: pB,
      relationshipName: `Quan hệ Cháu - Bác/Chú/Cô (Chênh 1 đời)`,
      callAToB: callAtoB,
      callBToA: 'Cháu',
      explanation: `${pB.fullName} (Đời ${pB.generationLevel}) là bề trên của ${pA.fullName} (Đời ${pA.generationLevel}). A gọi B là ${callAtoB}, B gọi A là Cháu.`,
      commonAncestorName: lcaPerson?.fullName,
      generationDiff: genDiff,
    };
  }

  // Chênh lệch 2 đời trở lên
  if (genDiff >= 2) {
    const term = genDiff === 2 ? (pA.gender === 'MALE' ? 'Ông họ' : 'Bà họ') : 'Cụ họ';
    return {
      personA: pA,
      personB: pB,
      relationshipName: `Bậc ${term} - Cháu (${genDiff} đời)`,
      callAToB: genDiff === 2 ? 'Cháu' : 'Chắt',
      callBToA: term,
      explanation: `${pA.fullName} (Đời ${pA.generationLevel}) cao hơn ${pB.fullName} (Đời ${pB.generationLevel}) ${genDiff} thế hệ.`,
      commonAncestorName: lcaPerson?.fullName,
      generationDiff: genDiff,
    };
  } else {
    const absDiff = Math.abs(genDiff);
    const term = absDiff === 2 ? (pB.gender === 'MALE' ? 'Ông họ' : 'Bà họ') : 'Cụ họ';
    return {
      personA: pA,
      personB: pB,
      relationshipName: `Bậc Cháu - ${term} (${absDiff} đời)`,
      callAToB: term,
      callBToA: absDiff === 2 ? 'Cháu' : 'Chắt',
      explanation: `${pB.fullName} (Đời ${pB.generationLevel}) cao hơn ${pA.fullName} (Đời ${pA.generationLevel}) ${absDiff} thế hệ.`,
      commonAncestorName: lcaPerson?.fullName,
      generationDiff: genDiff,
    };
  }
}

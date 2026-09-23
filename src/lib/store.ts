import { 
  mockClan, 
  mockBranches, 
  mockPersons, 
  mockMarriages, 
  mockParentChildren, 
  mockEvents, 
  mockFunds, 
  mockTransactions, 
  mockArticles 
} from './data-mock';
import { 
  Clan, 
  Branch, 
  Person, 
  Marriage, 
  ParentChild, 
  MemorialEvent, 
  ClanFund, 
  FundTransaction, 
  Article 
} from './types';

// In-memory persistent state during server runtime
let currentClan: Clan = { ...mockClan };
let currentBranches: Branch[] = [...mockBranches];
let currentPersons: Person[] = [...mockPersons];
let currentMarriages: Marriage[] = [...mockMarriages];
let currentParentChildren: ParentChild[] = [...mockParentChildren];
let currentEvents: MemorialEvent[] = [...mockEvents];
let currentFunds: ClanFund[] = [...mockFunds];
let currentTransactions: FundTransaction[] = [...mockTransactions];
let currentArticles: Article[] = [...mockArticles];

export const giaPhaStore = {
  getClan: () => currentClan,
  updateClan: (updated: Partial<Clan>) => {
    currentClan = { ...currentClan, ...updated };
    return currentClan;
  },

  getBranches: () => currentBranches,
  addBranch: (branch: Omit<Branch, 'id'>) => {
    const newBranch: Branch = {
      ...branch,
      id: `branch-${Date.now()}`,
    };
    currentBranches.push(newBranch);
    return newBranch;
  },

  getPersons: () => currentPersons,
  getPersonById: (id: string) => currentPersons.find((p) => p.id === id),
  addPerson: (personData: Omit<Person, 'id'>, parentIds: string[] = [], spouseId?: string) => {
    const newPersonId = `p-${Date.now()}`;
    const newPerson: Person = {
      ...personData,
      id: newPersonId,
    };
    currentPersons.push(newPerson);

    // Liên kết cha/mẹ
    parentIds.forEach((pId) => {
      currentParentChildren.push({
        id: `pc-${Date.now()}-${Math.random()}`,
        parentId: pId,
        childId: newPersonId,
        relationType: 'BIOLOGICAL',
      });
    });

    // Liên kết hôn nhân nếu có
    if (spouseId) {
      const spouse = currentPersons.find((p) => p.id === spouseId);
      if (spouse) {
        const isMale = newPerson.gender === 'MALE';
        currentMarriages.push({
          id: `m-${Date.now()}`,
          husbandId: isMale ? newPersonId : spouseId,
          wifeId: isMale ? spouseId : newPersonId,
          marriageOrder: 1,
          status: 'MARRIED',
        });
      }
    }

    return newPerson;
  },

  updatePerson: (id: string, updated: Partial<Person>) => {
    const index = currentPersons.findIndex((p) => p.id === id);
    if (index !== -1) {
      currentPersons[index] = { ...currentPersons[index], ...updated };
      return currentPersons[index];
    }
    return null;
  },

  deletePerson: (id: string) => {
    currentPersons = currentPersons.filter((p) => p.id !== id);
    currentParentChildren = currentParentChildren.filter((pc) => pc.parentId !== id && pc.childId !== id);
    currentMarriages = currentMarriages.filter((m) => m.husbandId !== id && m.wifeId !== id);
    currentEvents = currentEvents.filter((e) => e.personId !== id);
  },

  getMarriages: () => currentMarriages,
  getParentChildren: () => currentParentChildren,

  getEvents: () => currentEvents,
  addEvent: (event: Omit<MemorialEvent, 'id'>) => {
    const newEvent: MemorialEvent = {
      ...event,
      id: `ev-${Date.now()}`,
    };
    currentEvents.push(newEvent);
    return newEvent;
  },

  getFunds: () => currentFunds,
  getTransactions: () => currentTransactions,
  addTransaction: (tx: Omit<FundTransaction, 'id'>) => {
    const newTx: FundTransaction = {
      ...tx,
      id: `tx-${Date.now()}`,
    };
    currentTransactions.unshift(newTx);

    // Cập nhật số dư quỹ
    const fund = currentFunds.find((f) => f.id === tx.fundId);
    if (fund) {
      if (tx.type === 'INCOME') {
        fund.currentBalance += Number(tx.amount);
      } else {
        fund.currentBalance -= Number(tx.amount);
      }
    }
    return newTx;
  },

  getArticles: () => currentArticles,
  getArticleBySlug: (slug: string) => currentArticles.find((a) => a.slug === slug),
};

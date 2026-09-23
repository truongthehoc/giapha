export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type RelationType = 'BIOLOGICAL' | 'ADOPTED' | 'STEP';
export type MarriageStatus = 'MARRIED' | 'DIVORCED' | 'WIDOWED';
export type EventType = 'DEATH_ANNIVERSARY' | 'CLAN_GATHERING' | 'TOMB_SWEEPING' | 'CUSTOM';
export type TransactionType = 'INCOME' | 'EXPENSE';
export type ArticleCategory = 'TOC_UOC' | 'HISTORY' | 'NEWS' | 'ORATION' | 'OTHER';

export interface Clan {
  id: string;
  name: string;
  ancestorName: string;
  originPlace: string;
  hallAddress: string;
  description: string;
  avatarUrl?: string;
  coverUrl?: string;
  establishedYear?: string;
}

export interface Branch {
  id: string;
  clanId: string;
  parentBranchId?: string | null;
  name: string;
  description?: string;
  headPersonId?: string;
}

export interface Person {
  id: string;
  clanId: string;
  branchId?: string | null;
  fullName: string;
  courtesyName?: string;
  posthumousName?: string;
  gender: Gender;
  avatarUrl?: string;
  generationLevel: number; // Đời thứ mấy
  birthOrder: number; // Con thứ mấy
  isAlive: boolean;
  
  // Ngày sinh
  dobSolar?: string; // YYYY-MM-DD
  dobLunarDay?: number;
  dobLunarMonth?: number;
  dobLunarYear?: string; // VD: Giáp Thìn 1964
  
  // Ngày mất
  dodSolar?: string;
  dodLunarDay?: number;
  dodLunarMonth?: number;
  dodLunarYear?: string;
  dodHour?: string;

  // Mộ phần
  burialPlace?: string;
  burialGps?: { lat: number; lng: number };
  
  biography?: string;
  phone?: string;
  email?: string;
  currentResidence?: string;
  
  // Liên kết quan hệ
  parentIds?: string[];
  spouseIds?: string[];
  childrenIds?: string[];
}

export interface Marriage {
  id: string;
  husbandId: string;
  wifeId: string;
  marriageOrder: number; // Vợ 1, Vợ 2...
  status: MarriageStatus;
  notes?: string;
}

export interface ParentChild {
  id: string;
  parentId: string;
  childId: string;
  relationType: RelationType;
}

export interface MemorialEvent {
  id: string;
  clanId: string;
  personId?: string;
  personName?: string;
  title: string;
  eventType: EventType;
  lunarDay?: number;
  lunarMonth?: number;
  isRecurringYearly: boolean;
  solarDate?: string;
  location?: string;
  description?: string;
}

export interface ClanFund {
  id: string;
  clanId: string;
  name: string;
  currentBalance: number;
  description: string;
}

export interface FundTransaction {
  id: string;
  fundId: string;
  fundName?: string;
  personId?: string;
  contributorName: string;
  type: TransactionType;
  amount: number;
  transactionDate: string;
  purpose: string;
  receiptImageUrl?: string;
}

export interface Article {
  id: string;
  clanId: string;
  category: ArticleCategory;
  title: string;
  slug: string;
  content: string;
  author?: string;
  createdAt: string;
}

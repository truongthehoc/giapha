import { Clan, Branch, Person, Marriage, ParentChild, MemorialEvent, ClanFund, FundTransaction, Article } from './types';

export const mockClan: Clan = {
  id: 'clan-1',
  name: 'Nguyễn Tộc - Chi Phái Tiên Điền',
  ancestorName: 'Cụ Khởi Tổ Nguyễn Văn Đức',
  originPlace: 'Làng Tiên Điền, Nghi Xuân, Hà Tĩnh',
  hallAddress: 'Số 18 Đường Cổ Tộc, Xã Tiên Điền, Huyện Nghi Xuân, Hà Tĩnh',
  description: 'Dòng họ Nguyễn Văn có truyền thống hiếu học, tôn sư trọng đạo và cần cù lao động từ thời Hậu Lê. Đến nay đã truyền qua nhiều thế hệ, con cháu phụng sự đất nước, hiếu kính tổ tiên.',
  avatarUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&auto=format&fit=crop&q=80',
  coverUrl: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?w=1200&auto=format&fit=crop&q=80',
  establishedYear: '1842',
};

export const mockBranches: Branch[] = [
  {
    id: 'branch-1',
    clanId: 'clan-1',
    name: 'Chi Trưởng (Nhánh Giáp Đông)',
    description: 'Trách nhiệm phụng sự hương khói Từ đường chính dòng họ.',
    headPersonId: 'p-3',
  },
  {
    id: 'branch-2',
    clanId: 'clan-1',
    name: 'Chi Thứ Hai (Nhánh Ất Nam)',
    description: 'Phát triển mạnh về ngành kinh thương và giáo dục.',
    headPersonId: 'p-4',
  },
  {
    id: 'branch-3',
    clanId: 'clan-1',
    name: 'Chi Thứ Ba (Nhánh Bính Bắc)',
    description: 'Lập nghiệp tại miền Nam và thủ đô.',
    headPersonId: 'p-5',
  },
];

export const mockPersons: Person[] = [
  // === ĐỜI 1: THỦY TỔ ===
  {
    id: 'p-1',
    clanId: 'clan-1',
    fullName: 'Nguyễn Văn Đức',
    courtesyName: 'Đức Phủ Quân',
    posthumousName: 'Thuần Chính Tiên Sinh',
    gender: 'MALE',
    generationLevel: 1,
    birthOrder: 1,
    isAlive: false,
    dobSolar: '1842-03-15',
    dobLunarDay: 4,
    dobLunarMonth: 2,
    dobLunarYear: 'Nhâm Dần 1842',
    dodSolar: '1918-10-24',
    dodLunarDay: 20,
    dodLunarMonth: 9,
    dodLunarYear: 'Mậu Ngọ 1918',
    dodHour: 'Giờ Thìn (7h-9h sáng)',
    burialPlace: 'Gò Cây Gạo, Nghĩa trang Dòng họ Tiên Điền',
    biography: 'Cụ Thủy Tổ khai sơn lập phái, từng làm Đốc học phụng sự triều đình, người có công khai hoang lập ấp và mở trường dạy chữ cho dân làng.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'p-1-w1',
    clanId: 'clan-1',
    fullName: 'Trần Thị Loan',
    courtesyName: 'Chánh Thất',
    posthumousName: 'Từ Mẫn Nhụ Nhân',
    gender: 'FEMALE',
    generationLevel: 1,
    birthOrder: 1,
    isAlive: false,
    dobLunarYear: 'Giáp Thìn 1844',
    dodLunarDay: 15,
    dodLunarMonth: 4,
    dodLunarYear: 'Kỷ Mùi 1919',
    burialPlace: 'Bên cạnh mộ Cụ Tổ, Gò Cây Gạo',
    biography: 'Cụ bà hiền thục, chu toàn việc hương hỏa, tần tảo nuôi dạy các con đỗ đạt.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  },

  // === ĐỜI 2 ===
  {
    id: 'p-2',
    clanId: 'clan-1',
    branchId: 'branch-1',
    fullName: 'Nguyễn Văn Phúc',
    courtesyName: 'Phúc Khang',
    posthumousName: 'Đôn Hậu Phủ Quân',
    gender: 'MALE',
    generationLevel: 2,
    birthOrder: 1,
    isAlive: false,
    dobSolar: '1870-05-12',
    dobLunarDay: 12,
    dobLunarMonth: 4,
    dobLunarYear: 'Canh Ngọ 1870',
    dodSolar: '1945-12-08',
    dodLunarDay: 5,
    dodLunarMonth: 11,
    dodLunarYear: 'Ất Dậu 1945',
    burialPlace: 'Đồi Thông, Nghĩa trang dòng họ',
    biography: 'Trưởng nam Đời 2, xây dựng và mở rộng Từ đường họ năm 1920.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'p-2-w1',
    clanId: 'clan-1',
    fullName: 'Lê Thị Diệu',
    courtesyName: 'Diệu Thục',
    gender: 'FEMALE',
    generationLevel: 2,
    birthOrder: 1,
    isAlive: false,
    dodLunarDay: 18,
    dodLunarMonth: 8,
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'p-2-2',
    clanId: 'clan-1',
    branchId: 'branch-2',
    fullName: 'Nguyễn Văn Lộc',
    gender: 'MALE',
    generationLevel: 2,
    birthOrder: 2,
    isAlive: false,
    dobLunarYear: 'Nhâm Thân 1872',
    dodLunarDay: 8,
    dodLunarMonth: 6,
    dodLunarYear: 'Bính Tuất 1946',
    biography: 'Sáng lập Chi Thứ Hai, tham gia phong trào Đông Du.',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'p-2-3',
    clanId: 'clan-1',
    branchId: 'branch-3',
    fullName: 'Nguyễn Văn Thọ',
    gender: 'MALE',
    generationLevel: 2,
    birthOrder: 3,
    isAlive: false,
    dobLunarYear: 'Ất Hợi 1875',
    dodLunarDay: 22,
    dodLunarMonth: 12,
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'p-2-4',
    clanId: 'clan-1',
    fullName: 'Nguyễn Thị Hương',
    gender: 'FEMALE',
    generationLevel: 2,
    birthOrder: 4,
    isAlive: false,
    dobLunarYear: 'Mậu Dần 1878',
    dodLunarDay: 9,
    dodLunarMonth: 3,
    biography: 'Gả về họ Vũ tại làng bên, đức hạnh vẹn toàn.',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
  },

  // === ĐỜI 3 ===
  {
    id: 'p-3',
    clanId: 'clan-1',
    branchId: 'branch-1',
    fullName: 'Nguyễn Văn Khang',
    gender: 'MALE',
    generationLevel: 3,
    birthOrder: 1,
    isAlive: false,
    dobSolar: '1905-08-20',
    dobLunarDay: 20,
    dobLunarMonth: 7,
    dobLunarYear: 'Ất Tỵ 1905',
    dodSolar: '1982-04-14',
    dodLunarDay: 21,
    dodLunarMonth: 3,
    dodLunarYear: 'Nhâm Tuất 1982',
    burialPlace: 'Nghĩa trang Xã Tiên Điền',
    biography: 'Nhà giáo mẫu mực, có công giữ gìn gia phả và văn khế dòng họ qua thời kỳ chiến tranh.',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'p-3-w1',
    clanId: 'clan-1',
    fullName: 'Phạm Thị Lan',
    gender: 'FEMALE',
    generationLevel: 3,
    birthOrder: 1,
    isAlive: false,
    dodLunarDay: 14,
    dodLunarMonth: 10,
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'p-4',
    clanId: 'clan-1',
    branchId: 'branch-2',
    fullName: 'Nguyễn Văn Thịnh',
    gender: 'MALE',
    generationLevel: 3,
    birthOrder: 1,
    isAlive: false,
    dobLunarYear: 'Đinh Mùi 1907',
    dodLunarDay: 3,
    dodLunarMonth: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'p-5',
    clanId: 'clan-1',
    branchId: 'branch-3',
    fullName: 'Nguyễn Văn Phát',
    gender: 'MALE',
    generationLevel: 3,
    birthOrder: 1,
    isAlive: false,
    dobLunarYear: 'Kỷ Dậu 1909',
    dodLunarDay: 16,
    dodLunarMonth: 1,
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
  },

  // === ĐỜI 4 (Bậc Cha Chú Hiện Nay) ===
  {
    id: 'p-4-1',
    clanId: 'clan-1',
    branchId: 'branch-1',
    fullName: 'Nguyễn Văn Trọng',
    gender: 'MALE',
    generationLevel: 4,
    birthOrder: 1,
    isAlive: true,
    dobSolar: '1948-06-18',
    dobLunarDay: 12,
    dobLunarMonth: 5,
    dobLunarYear: 'Mậu Tý 1948',
    phone: '0912345678',
    currentResidence: 'Tiên Điền, Nghi Xuân, Hà Tĩnh',
    biography: 'Hiện là Trưởng Tộc phụ trách quản lý Từ đường và công tác khuyến học dòng họ.',
    avatarUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'p-4-1-w1',
    clanId: 'clan-1',
    fullName: 'Hoàng Thị Mai',
    gender: 'FEMALE',
    generationLevel: 4,
    birthOrder: 1,
    isAlive: true,
    dobSolar: '1952-11-04',
    currentResidence: 'Hà Tĩnh',
    avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'p-4-2',
    clanId: 'clan-1',
    branchId: 'branch-1',
    fullName: 'Nguyễn Văn Minh',
    gender: 'MALE',
    generationLevel: 4,
    birthOrder: 2,
    isAlive: true,
    dobSolar: '1955-09-10',
    phone: '0988765432',
    currentResidence: 'Quận Ba Đình, Hà Nội',
    biography: 'Nguyên Đại tá Quân đội, tích cực đóng góp xây dựng quỹ Khuyến học họ.',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'p-4-3',
    clanId: 'clan-1',
    branchId: 'branch-2',
    fullName: 'Nguyễn Văn Dũng',
    gender: 'MALE',
    generationLevel: 4,
    birthOrder: 1,
    isAlive: true,
    dobSolar: '1958-02-14',
    phone: '0903112233',
    currentResidence: 'Quận 1, TP. Hồ Chí Minh',
    biography: 'Doanh nhân, Trưởng Ban Liên lạc Dòng họ phía Nam.',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
  },

  // === ĐỜI 5 (Thế hệ Trẻ / Đương đại) ===
  {
    id: 'p-5-1',
    clanId: 'clan-1',
    branchId: 'branch-1',
    fullName: 'Nguyễn Văn Hải',
    gender: 'MALE',
    generationLevel: 5,
    birthOrder: 1,
    isAlive: true,
    dobSolar: '1980-04-25',
    dobLunarDay: 11,
    dobLunarMonth: 3,
    dobLunarYear: 'Canh Thân 1980',
    phone: '0977112233',
    email: 'hai.nguyen@giapha.vn',
    currentResidence: 'Hà Nội',
    biography: 'Kỹ sư CNTT, khởi xướng số hóa gia phả dòng họ trên nền tảng số.',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'p-5-1-w1',
    clanId: 'clan-1',
    fullName: 'Vũ Thu Trang',
    gender: 'FEMALE',
    generationLevel: 5,
    birthOrder: 1,
    isAlive: true,
    dobSolar: '1984-08-12',
    currentResidence: 'Hà Nội',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'p-5-2',
    clanId: 'clan-1',
    branchId: 'branch-1',
    fullName: 'Nguyễn Thị Ngọc',
    gender: 'FEMALE',
    generationLevel: 5,
    birthOrder: 2,
    isAlive: true,
    dobSolar: '1986-10-18',
    phone: '0919887766',
    currentResidence: 'Đà Nẵng',
    biography: 'Thạc sĩ Y khoa, Bác sĩ Bệnh viện Đa khoa Đà Nẵng.',
    avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'p-5-3',
    clanId: 'clan-1',
    branchId: 'branch-1',
    fullName: 'Nguyễn Văn Tuấn',
    gender: 'MALE',
    generationLevel: 5,
    birthOrder: 1,
    isAlive: true,
    dobSolar: '1988-12-05',
    phone: '0966554433',
    currentResidence: 'Hà Nội',
    biography: 'Kiến trúc sư cảnh quan, phụ trách thiết kế khuôn viên Từ đường.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'p-5-4',
    clanId: 'clan-1',
    branchId: 'branch-2',
    fullName: 'Nguyễn Văn An',
    gender: 'MALE',
    generationLevel: 5,
    birthOrder: 1,
    isAlive: true,
    dobSolar: '1992-07-19',
    phone: '0933221100',
    currentResidence: 'TP. Hồ Chí Minh',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  }
];

export const mockMarriages: Marriage[] = [
  { id: 'm-1', husbandId: 'p-1', wifeId: 'p-1-w1', marriageOrder: 1, status: 'MARRIED', notes: 'Chánh Thất' },
  { id: 'm-2', husbandId: 'p-2', wifeId: 'p-2-w1', marriageOrder: 1, status: 'MARRIED', notes: 'Chánh Thất' },
  { id: 'm-3', husbandId: 'p-3', wifeId: 'p-3-w1', marriageOrder: 1, status: 'MARRIED', notes: 'Chánh Thất' },
  { id: 'm-4', husbandId: 'p-4-1', wifeId: 'p-4-1-w1', marriageOrder: 1, status: 'MARRIED', notes: 'Chánh Thất' },
  { id: 'm-5', husbandId: 'p-5-1', wifeId: 'p-5-1-w1', marriageOrder: 1, status: 'MARRIED', notes: 'Chánh Thất' },
];

export const mockParentChildren: ParentChild[] = [
  // Cụ Đời 1 sinh Đời 2
  { id: 'pc-1', parentId: 'p-1', childId: 'p-2', relationType: 'BIOLOGICAL' },
  { id: 'pc-2', parentId: 'p-1-w1', childId: 'p-2', relationType: 'BIOLOGICAL' },
  { id: 'pc-3', parentId: 'p-1', childId: 'p-2-2', relationType: 'BIOLOGICAL' },
  { id: 'pc-4', parentId: 'p-1', childId: 'p-2-3', relationType: 'BIOLOGICAL' },
  { id: 'pc-5', parentId: 'p-1', childId: 'p-2-4', relationType: 'BIOLOGICAL' },

  // Đời 2 sinh Đời 3
  { id: 'pc-6', parentId: 'p-2', childId: 'p-3', relationType: 'BIOLOGICAL' },
  { id: 'pc-7', parentId: 'p-2-w1', childId: 'p-3', relationType: 'BIOLOGICAL' },
  { id: 'pc-8', parentId: 'p-2-2', childId: 'p-4', relationType: 'BIOLOGICAL' },
  { id: 'pc-9', parentId: 'p-2-3', childId: 'p-5', relationType: 'BIOLOGICAL' },

  // Đời 3 sinh Đời 4
  { id: 'pc-10', parentId: 'p-3', childId: 'p-4-1', relationType: 'BIOLOGICAL' },
  { id: 'pc-11', parentId: 'p-3-w1', childId: 'p-4-1', relationType: 'BIOLOGICAL' },
  { id: 'pc-12', parentId: 'p-3', childId: 'p-4-2', relationType: 'BIOLOGICAL' },
  { id: 'pc-13', parentId: 'p-4', childId: 'p-4-3', relationType: 'BIOLOGICAL' },

  // Đời 4 sinh Đời 5
  { id: 'pc-14', parentId: 'p-4-1', childId: 'p-5-1', relationType: 'BIOLOGICAL' },
  { id: 'pc-15', parentId: 'p-4-1-w1', childId: 'p-5-1', relationType: 'BIOLOGICAL' },
  { id: 'pc-16', parentId: 'p-4-1', childId: 'p-5-2', relationType: 'BIOLOGICAL' },
  { id: 'pc-17', parentId: 'p-4-2', childId: 'p-5-3', relationType: 'BIOLOGICAL' },
  { id: 'pc-18', parentId: 'p-4-3', childId: 'p-5-4', relationType: 'BIOLOGICAL' },
];

export const mockEvents: MemorialEvent[] = [
  {
    id: 'ev-1',
    clanId: 'clan-1',
    personId: 'p-1',
    personName: 'Cụ Khởi Tổ Nguyễn Văn Đức',
    title: 'Lễ Giỗ Thủy Tổ Dòng Họ',
    eventType: 'DEATH_ANNIVERSARY',
    lunarDay: 20,
    lunarMonth: 9,
    isRecurringYearly: true,
    location: 'Nhà Thờ Họ Nguyễn Văn, Làng Tiên Điền',
    description: 'Toàn thể con cháu nội ngoại quy tụ dâng hương tưởng niệm Cụ Khởi Tổ, tổng kết công tác dòng họ trong năm.',
  },
  {
    id: 'ev-2',
    clanId: 'clan-1',
    personId: 'p-1-w1',
    personName: 'Cụ Bà Trần Thị Loan',
    title: 'Lễ Giỗ Cụ Bà Chánh Thất',
    eventType: 'DEATH_ANNIVERSARY',
    lunarDay: 15,
    lunarMonth: 4,
    isRecurringYearly: true,
    location: 'Nhà Thờ Họ Nguyễn Văn',
    description: 'Dâng hương giỗ cụ bà khai sáng dòng tộc.',
  },
  {
    id: 'ev-3',
    clanId: 'clan-1',
    title: 'Lễ Tảo Mộ Tiết Thanh Minh',
    eventType: 'TOMB_SWEEPING',
    lunarDay: 3,
    lunarMonth: 3,
    isRecurringYearly: true,
    location: 'Khu Lăng Mộ Dòng Họ Tiên Điền',
    description: 'Dọn dẹp, thắp hương và tu sửa phần mộ các bậc tiền nhân trong khu lăng mộ dòng họ.',
  },
  {
    id: 'ev-4',
    clanId: 'clan-1',
    title: 'Hội Đồng Tộc Đầu Xuân & Vinh Danh Khuyến Học',
    eventType: 'CLAN_GATHERING',
    lunarDay: 6,
    lunarMonth: 1,
    isRecurringYearly: true,
    location: 'Từ Đường Dòng Họ',
    description: 'Chúc thọ các cụ cao niên trên 70 tuổi và trao học bổng khuyến học cho các cháu học sinh, sinh viên đạt thành tích xuất sắc.',
  },
];

export const mockFunds: ClanFund[] = [
  {
    id: 'fund-1',
    clanId: 'clan-1',
    name: 'Quỹ Trùng Tu & Phụng Sự Từ Đường',
    currentBalance: 185500000,
    description: 'Dùng cho việc bảo dưỡng, tu sửa mái ngói, sơn son thếp vàng hoành phi câu đối và đèn nến hương hỏa.',
  },
  {
    id: 'fund-2',
    clanId: 'clan-1',
    name: 'Quỹ Khuyến Học & Ươm Mầm Tài Năng',
    currentBalance: 62400000,
    description: 'Trao thưởng cho con cháu đỗ đạt đại học, đạt giải quốc gia và học sinh nghèo vượt khó.',
  },
  {
    id: 'fund-3',
    clanId: 'clan-1',
    name: 'Quỹ Tương Trợ & Hiếu Hỉ',
    currentBalance: 28000000,
    description: 'Thăm hỏi các cụ đau ốm, chúc thọ và phúng viếng tang lễ.',
  },
];

export const mockTransactions: FundTransaction[] = [
  {
    id: 'tx-1',
    fundId: 'fund-1',
    contributorName: 'Ông Nguyễn Văn Dũng (Chi 2 - TP.HCM)',
    type: 'INCOME',
    amount: 50000000,
    transactionDate: '2026-01-15',
    purpose: 'Công đức tôn tạo hệ thống chiếu sáng Từ đường',
  },
  {
    id: 'tx-2',
    fundId: 'fund-2',
    contributorName: 'Bác Nguyễn Văn Minh (Chi 1 - Hà Nội)',
    type: 'INCOME',
    amount: 20000000,
    transactionDate: '2026-02-10',
    purpose: 'Ủng hộ quỹ khuyến học trao thưởng đầu xuân',
  },
  {
    id: 'tx-3',
    fundId: 'fund-2',
    contributorName: 'Ban Quản Trị Dòng Họ',
    type: 'EXPENSE',
    amount: 15000000,
    transactionDate: '2026-02-20',
    purpose: 'Trao thưởng khuyến học cho 15 cháu đạt học sinh giỏi và đỗ Đại học',
  },
  {
    id: 'tx-4',
    fundId: 'fund-1',
    contributorName: 'Anh Nguyễn Văn Hải',
    type: 'INCOME',
    amount: 10000000,
    transactionDate: '2026-03-01',
    purpose: 'Công đức xây dựng cổng tam quan',
  },
];

export const mockArticles: Article[] = [
  {
    id: 'art-1',
    clanId: 'clan-1',
    category: 'TOC_UOC',
    title: 'Tộc Ước Dòng Họ Nguyễn Văn (10 Điều Răn Dạy)',
    slug: 'toc-uoc-dong-ho-nguyen-van',
    content: `
### I. LỜI MỞ ĐẦU
Cây có cội mới trổ cành xanh lá, nước có nguồn mới biển rộng sông sâu. Người sinh ra có tổ tiên ông bà. Bản Tộc Ước này lập ra nhằm răn dạy con cháu muôn đời giữ gìn gia phong, lễ nghĩa.

### II. MƯỜI ĐIỀU TỘC ƯỚC
1. **Hiếu kính song thân:** Kính trọng, phụng dưỡng ông bà cha mẹ chu đáo.
2. **Kính trên nhường dưới:** Hòa thuận anh chị em, giữ đạo nghĩa xóm giềng.
3. **Hiếu học cần cù:** Luôn trau dồi tri thức, rèn luyện tay nghề, sống có ích cho non sông.
4. **Giữ gìn thanh bạch:** Sống liêm khiết, trung thực, không làm điều trái pháp luật, không bôi nhọ thanh danh dòng tộc.
5. **Chăm sóc mồ mả:** Hàng năm đến tiết Thanh Minh và ngày kỵ giỗ phải sửa sang mộ phần, hương khói trang nghiêm.
6. **Tương thân tương ái:** Con cháu trong họ khi gặp hoạn nạn, ốm đau cùng nhau chia sẻ, giúp đỡ.
7. **Hôn nhân thuận hòa:** Chọn bạn đời đức hạnh, giữ gìn mái ấm gia đình hạnh phúc.
8. **Minh bạch tài chính:** Các khoản quỹ đóng góp cho dòng họ phải công khai, minh bạch từng đồng.
9. **Bảo tồn văn tự:** Gìn giữ gia phả, bia ký, câu đối và hoành phi Từ đường cẩn trọng.
10. **Tập hợp dòng tộc:** Định kỳ hàng năm tề tựu tại Từ đường trong ngày Giỗ Tổ để gắn kết tình thân.
    `,
    author: 'Hội Đồng Tộc Biểu Quyết',
    createdAt: '2026-01-01',
  },
  {
    id: 'art-2',
    clanId: 'clan-1',
    category: 'HISTORY',
    title: 'Lược Sử Nguồn Gốc & Sự Phát Tích Của Dòng Họ',
    slug: 'luoc-su-nguon-goc-dong-ho',
    content: `
Dòng họ Nguyễn Văn tại Tiên Điền có nguồn gốc từ vùng đất cổ Thanh Hóa, theo chân tiền nhân mở cõi về phương Nam lập nghiệp vào giữa thế kỷ 19.

Cụ Khởi Tổ Nguyễn Văn Đức (1842 - 1918) là bậc túc nho uyên bác, lập nên trường tư thục đầu tiên tại vùng, đào tạo nhiều nhân tài. Đến thời kỳ hiện đại, con cháu dòng họ có mặt trên khắp mọi miền Tổ quốc và hải ngoại, nhiều người là giáo sư, bác sĩ, kỹ sư, sĩ quan và doanh nhân thành đạt.
    `,
    author: 'Ban Sử Tộc',
    createdAt: '2026-01-10',
  },
  {
    id: 'art-3',
    clanId: 'clan-1',
    category: 'ORATION',
    title: 'Bài Văn Tế Thủy Tổ Ngày Giỗ Họ (Xuân Thu Nhị Kỳ)',
    slug: 'bai-van-te-thuy-to',
    content: `
*Duy!*
*Cộng hòa Xã hội Chủ nghĩa Việt Nam...*
*Tiết ngày lành tháng tốt, con cháu nội ngoại tộc Nguyễn Văn thành tâm kính bái:*

*Nhớ linh xưa:*
*Đức dày tích tụ, phúc thọ miên trường.*
*Khai sơn phá thạch, lập nghiệp hiển vinh.*
*Ơn Tổ tông dạt dào như biển rộng,*
*Nghĩa Tiên nhân sừng sững tợ non cao.*

*Nay kính cáo:*
*Hương thơm một triền, lễ bạc lòng thành,*
*Cúi xin Thủy tổ giáng lâm chứng giám,*
*Phù hộ con cháu vạn sự hanh thông, đời đời rạng rỡ!*
*Thượng hưởng!*
    `,
    author: 'Trưởng Tộc Nguyễn Văn Trọng',
    createdAt: '2026-02-01',
  }
];

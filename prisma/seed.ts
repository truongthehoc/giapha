import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Bắt đầu nạp dữ liệu mẫu gia phả (MySQL Seed)...');

  // 1. Tạo Dòng Họ
  const clan = await prisma.clan.create({
    data: {
      name: 'Nguyễn Tộc - Chi Phái Tiên Điền',
      ancestorName: 'Cụ Khởi Tổ Nguyễn Văn Đức',
      originPlace: 'Làng Tiên Điền, Nghi Xuân, Hà Tĩnh',
      hallAddress: 'Số 18 Đường Cổ Tộc, Xã Tiên Điền, Huyện Nghi Xuân, Tỉnh Hà Tĩnh',
      description: 'Dòng họ Nguyễn Văn có truyền thống hiếu học, tôn sư trọng đạo từ thời Hậu Lê.',
    },
  });

  console.log('✅ Đã tạo dòng họ:', clan.name);

  // 2. Tạo các Chi Nhánh
  const branch1 = await prisma.branch.create({
    data: {
      clanId: clan.id,
      name: 'Chi Trưởng (Nhánh Giáp Đông)',
      description: 'Trách nhiệm phụng sự hương khói Từ đường chính.',
    },
  });

  const branch2 = await prisma.branch.create({
    data: {
      clanId: clan.id,
      name: 'Chi Thứ Hai (Nhánh Ất Nam)',
      description: 'Phát triển mạnh về kinh thương và giáo dục.',
    },
  });

  console.log('✅ Đã tạo các chi nhánh.');

  // 3. Tạo Thành Viên Đời 1
  const p1 = await prisma.person.create({
    data: {
      clanId: clan.id,
      fullName: 'Nguyễn Văn Đức',
      courtesyName: 'Đức Phủ Quân',
      posthumousName: 'Thuần Chính Tiên Sinh',
      gender: 'MALE',
      generationLevel: 1,
      birthOrder: 1,
      isAlive: false,
      dobSolar: new Date('1842-03-15'),
      dobLunarDay: 4,
      dobLunarMonth: 2,
      dobLunarYear: 'Nhâm Dần 1842',
      dodSolar: new Date('1918-10-24'),
      dodLunarDay: 20,
      dodLunarMonth: 9,
      dodLunarYear: 'Mậu Ngọ 1918',
      dodHour: 'Giờ Thìn',
      burialPlace: 'Gò Cây Gạo, Nghĩa trang Dòng họ Tiên Điền',
      biography: 'Cụ Thủy Tổ khai sơn lập phái, từng làm Đốc học phụng sự triều đình.',
    },
  });

  const p1Wife = await prisma.person.create({
    data: {
      clanId: clan.id,
      fullName: 'Trần Thị Loan',
      courtesyName: 'Chánh Thất',
      gender: 'FEMALE',
      generationLevel: 1,
      birthOrder: 1,
      isAlive: false,
      dodLunarDay: 15,
      dodLunarMonth: 4,
    },
  });

  // Tạo hôn nhân đời 1
  await prisma.marriage.create({
    data: {
      husbandId: p1.id,
      wifeId: p1Wife.id,
      marriageOrder: 1,
      notes: 'Chánh Thất',
    },
  });

  // 4. Tạo Thành Viên Đời 2
  const p2 = await prisma.person.create({
    data: {
      clanId: clan.id,
      branchId: branch1.id,
      fullName: 'Nguyễn Văn Phúc',
      courtesyName: 'Phúc Khang',
      gender: 'MALE',
      generationLevel: 2,
      birthOrder: 1,
      isAlive: false,
      dodLunarDay: 5,
      dodLunarMonth: 11,
      burialPlace: 'Đồi Thông, Nghĩa trang dòng họ',
    },
  });

  await prisma.parentChild.createMany({
    data: [
      { parentId: p1.id, childId: p2.id, relationType: 'BIOLOGICAL' },
      { parentId: p1Wife.id, childId: p2.id, relationType: 'BIOLOGICAL' },
    ],
  });

  console.log('✅ Hoàn tất nạp dữ liệu mẫu gia phả vào MySQL!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

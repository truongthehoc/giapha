# 🌳 Nền Tảng Quản Lý & Tra Cứu Gia Phả Đại Tộc (Genealogy Platform)

> Ứng dụng số hóa gia phả truyền thống Việt Nam, xây dựng trên nền tảng **Next.js 14**, **Tailwind CSS**, **D3.js**, và cơ sở dữ liệu **MySQL 8.0+** (kết hợp **Prisma ORM**).

---

## ✨ Các Tính Năng Nổi Bật

1. **🌳 Cây Phả Đồ Trực Quan 2D**:
   - Biểu đồ cây gia phả tương tác mượt mà (Zoom in/out, kéo thả Pan, căn giữa).
   - Hiển thị đầy đủ thông tin: Ảnh đại diện, Vợ/Chồng, Đời thứ mấy, Con thứ mấy, Trạng thái sống/mất.
   - Lọc theo Chi/Nhánh, lọc theo Thế Hệ (Đời 1 - 5).
   - Xuất cây phả đồ ra file ảnh PNG chất lượng cao để in ấn khổ lớn (A0, A1, A3).

2. **👤 Quản Lý Hồ Sơ Thành Viên**:
   - Quản lý danh sách con cháu nội ngoại và các bậc tiền nhân.
   - Lưu trữ song song Ngày sinh & Ngày mất theo **Dương Lịch $\leftrightarrow$ Âm Lịch**.
   - Quản lý tên tự, tên thụy (tên hèm cúng bái), vị trí mộ phần, tiểu sử sự nghiệp.

3. **🕯️ Lịch Giỗ Chạp & Lịch Vạn Niên Âm Lịch**:
   - Tích hợp thuật toán chuyển đổi Âm - Dương lịch Hồ Ngọc Đức chính xác cho Việt Nam.
   - Tự động quy đổi và lọc danh sách ngày giỗ trong tháng và cả năm.
   - Bảng đếm ngược đến ngày giỗ hoặc tế lễ gần nhất.

4. **🔍 Tra Cứu Quan Hệ & Xưng Hô Thông Minh (Kinship Calculator)**:
   - Thuật toán đồ thị tìm tổ tiên chung gần nhất (LCA) để suy ra chính xác thứ bậc và cách xưng hô chuẩn truyền thống Việt Nam (Cụ, Ông, Bác, Chú, Cô, Cậu, Dì, Anh họ, Cháu...).

5. **💰 Quản Lý Quỹ Dòng Họ & Bảng Vàng Công Đức**:
   - Quản lý các quỹ: Quỹ Khuyến học, Quỹ Trùng tu Từ đường, Quỹ Hiếu hỉ.
   - Minh bạch sổ thu chi và vinh danh những tấm lòng đóng góp.

6. **📜 Tộc Ước, Lịch Sử & Văn Tế**:
   - Lưu giữ 10 điều tộc ước dòng họ, lược sử phát tích của Thủy tổ và các bài văn tế cúng bái truyền thống.

---

## 🛠️ Công Nghệ Sử Dụng

- **Frontend & Backend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS với bảng màu di sản truyền thống (`#341d13`, `#6f432d`, `#fbf7f0`)
- **Phả Đồ Canvas/SVG**: D3.js Layout Engine + Custom Interactive Canvas
- **Database & ORM**: MySQL 8.0+ / Prisma ORM
- **Export**: html-to-image (Xuất ảnh PNG chất lượng cao)
- **Thuật toán Âm Lịch**: AmLich Astronomical Engine

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Dự Án

### 1. Cài đặt thư viện dependencies:
```bash
npm install
```

### 2. Cấu hình cơ sở dữ liệu MySQL (Tùy chọn):
Chỉnh sửa chuỗi kết nối trong file `.env`:
```env
DATABASE_URL="mysql://root:password@localhost:3306/giapha_db"
```

Đẩy cấu trúc bảng vào MySQL và nạp dữ liệu mẫu:
```bash
npm run db:push
npm run db:seed
```

### 3. Chạy môi trường phát triển (Development):
```bash
npm run dev
```
Mở trình duyệt truy cập: `http://localhost:3000`

---

## 📦 Đẩy Mã Nguồn Lên GitHub

```bash
git init
git add .
git commit -m "feat: complete genealogy management web application"
git branch -M main
git remote add origin https://github.com/truongthehoc/giapha.git
git push -u origin main
```

---
*Phát triển bởi đội ngũ kỹ sư yêu văn hóa cội nguồn dân tộc Việt Nam.*

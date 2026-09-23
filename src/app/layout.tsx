import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Gia Phả Đại Tộc - Nguyễn Tộc Tiên Điền',
  description: 'Nền tảng Quản lý & Tra cứu Phả Đồ Dòng Họ, Lịch Giỗ Âm Lịch, Quỹ Dòng Họ và Xưng Hô Họ Hàng Chuẩn Việt Nam.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen flex flex-col bg-[#fbf7f0] text-[#341d13] antialiased">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

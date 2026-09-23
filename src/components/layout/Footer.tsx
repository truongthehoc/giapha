import React from 'react';
import { MapPin, Phone, Mail, ShieldCheck, Heart } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#24130b] border-t border-[#5a3726] text-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Cột 1: Thông tin dòng họ */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-xl font-bold font-serif text-amber-300">
              Hội Đồng Gia Tộc Nguyễn Văn - Tiên Điền
            </h3>
            <p className="text-sm text-stone-400 leading-relaxed">
              &ldquo;Cây có cội mới trổ cành xanh lá, nước có nguồn mới biển rộng sông sâu. 
              Gìn giữ cội nguồn gia tộc, kết nối các thế hệ cháu con noi gương tiên tổ, 
              phát huy truyền thống hiếu học và phụng sự nước nhà.&rdquo;
            </p>
            <div className="space-y-2 text-sm text-stone-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 mt-1 flex-shrink-0" />
                <span>Từ Đường: Số 18 Đường Cổ Tộc, Xã Tiên Điền, Huyện Nghi Xuân, Tỉnh Hà Tĩnh</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Ban Trưởng Tộc: 0912.345.678 (Ông Nguyễn Văn Trọng)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Liên hệ: btt.nguyentoc@giapha.vn</span>
              </div>
            </div>
          </div>

          {/* Cột 2: Truy cập nhanh */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-amber-200">
              Liên kết Nhanh
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tree" className="hover:text-amber-300 transition-colors">
                  Phả Đồ Trực Quan
                </Link>
              </li>
              <li>
                <Link href="/members" className="hover:text-amber-300 transition-colors">
                  Danh Sách Đinh & Nữ
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-amber-300 transition-colors">
                  Lịch Giỗ Chạp & Tế Lễ
                </Link>
              </li>
              <li>
                <Link href="/kinship" className="hover:text-amber-300 transition-colors">
                  Tính Xưng Hô Họ Hàng
                </Link>
              </li>
              <li>
                <Link href="/funds" className="hover:text-amber-300 transition-colors">
                  Bảng Vàng Công Đức & Quỹ
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Tộc ước & Văn hóa */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-amber-200">
              Văn Hóa Dòng Tộc
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/culture#toc-uoc" className="hover:text-amber-300 transition-colors">
                  10 Điều Tộc Ước Dòng Họ
                </Link>
              </li>
              <li>
                <Link href="/culture#lich-su" className="hover:text-amber-300 transition-colors">
                  Lịch Sử Khởi Tổ & Tiền Nhân
                </Link>
              </li>
              <li>
                <Link href="/culture#van-te" className="hover:text-amber-300 transition-colors">
                  Văn Tế & Câu Đối Từ Đường
                </Link>
              </li>
            </ul>
            <div className="pt-2 flex items-center gap-2 text-xs text-amber-400/80">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Dữ liệu gia phả được lưu trữ bảo mật</span>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#452718] flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} Nền tảng Quản lý Gia Phả Việt Nam. Bản quyền thuộc Nguyễn Tộc Tiên Điền.</p>
          <p className="flex items-center gap-1 text-stone-400">
            Ứng dụng số hóa gia phả truyền thống <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}

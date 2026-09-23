'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  GitFork, 
  Users, 
  CalendarDays, 
  Coins, 
  Sparkles, 
  BookOpen, 
  Award, 
  ArrowRight,
  MapPin,
  Clock,
  Landmark,
  ShieldCheck
} from 'lucide-react';
import { Clan, Branch, Person, MemorialEvent, ClanFund } from '@/lib/types';
import { LunarDate } from '@/lib/amlich';

export default function HomePage() {
  const [clan, setClan] = useState<Clan | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [todayLunar, setTodayLunar] = useState<LunarDate | null>(null);
  const [funds, setFunds] = useState<ClanFund[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [clanRes, eventsRes, fundsRes] = await Promise.all([
          fetch('/api/clan'),
          fetch('/api/events'),
          fetch('/api/funds'),
        ]);

        const clanData = await clanRes.json();
        const eventsData = await eventsRes.json();
        const fundsData = await fundsRes.json();

        setClan(clanData.clan);
        setStats(clanData.stats);
        setBranches(clanData.branches);
        setUpcomingEvents(eventsData.events.slice(0, 4));
        setTodayLunar(eventsData.todayLunar);
        setFunds(fundsData.funds);
      } catch (err) {
        console.error('Failed to load home data', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-12 pb-16 pattern-bg">
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#341d13] via-[#5a3726] to-[#6f432d] text-amber-50 py-16 sm:py-24 border-b-4 border-amber-600 shadow-2xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs sm:text-sm font-semibold tracking-wider uppercase">
              <Sparkles className="w-4 h-4 text-amber-300" />
              Nền Tảng Quản Lý Phả Đồ Số Hóa
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-serif tracking-tight text-amber-100">
              {clan?.name || 'Nguyễn Tộc Tiên Điền'}
            </h1>

            <p className="text-lg sm:text-xl text-amber-200/90 font-serif italic">
              &ldquo;Ẩm thủy tư nguyên - Vạn thế lưu phương&rdquo;
            </p>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              Nơi lưu truyền gia phả, kết nối huyết thống, tôn vinh cội nguồn và phát huy truyền thống tốt đẹp của dòng họ qua muôn đời.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/tree"
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-base shadow-lg hover:from-amber-400 hover:to-amber-500 hover:shadow-amber-500/20 transition-all transform hover:-translate-y-0.5"
              >
                <GitFork className="w-5 h-5" />
                Khám Phá Cây Phả Đồ
              </Link>
              <Link
                href="/kinship"
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-stone-900/80 hover:bg-stone-900 text-amber-200 font-semibold text-base border border-amber-500/30 shadow-md transition-all"
              >
                <Sparkles className="w-5 h-5 text-amber-400" />
                Tính Xưng Hô Họ Hàng
              </Link>
            </div>
          </div>
        </div>

        {/* Âm lịch Header Bar */}
        {todayLunar && (
          <div className="mt-12 max-w-4xl mx-auto px-4">
            <div className="bg-[#24130b]/80 backdrop-blur-md rounded-2xl p-4 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300">
                  <CalendarDays className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-amber-300/80 uppercase font-medium">Hôm nay theo Âm Lịch</div>
                  <div className="text-base sm:text-lg font-bold text-amber-100 font-serif">
                    Ngày {todayLunar.day} tháng {todayLunar.month} năm {todayLunar.canChiYear}
                  </div>
                </div>
              </div>
              <div className="text-xs sm:text-sm text-stone-300">
                Dương lịch: <span className="text-amber-200 font-semibold">{todayLunar.solarDateString}</span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 2. STATS OVERVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-[#ead8c0] flex items-center gap-4">
            <div className="p-3.5 rounded-xl bg-amber-100 text-amber-800">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold font-serif text-[#341d13]">
                {stats?.totalMembers || 0}
              </div>
              <div className="text-xs sm:text-sm text-stone-600 font-medium">Thành viên dòng họ</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md border border-[#ead8c0] flex items-center gap-4">
            <div className="p-3.5 rounded-xl bg-emerald-100 text-emerald-800">
              <GitFork className="w-7 h-7" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold font-serif text-[#341d13]">
                {stats?.generationCount || 0} Đời
              </div>
              <div className="text-xs sm:text-sm text-stone-600 font-medium">Thế hệ truyền lưu</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md border border-[#ead8c0] flex items-center gap-4">
            <div className="p-3.5 rounded-xl bg-blue-100 text-blue-800">
              <Landmark className="w-7 h-7" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold font-serif text-[#341d13]">
                {stats?.branchCount || 0} Chi
              </div>
              <div className="text-xs sm:text-sm text-stone-600 font-medium">Chi phái / Nhánh</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md border border-[#ead8c0] flex items-center gap-4">
            <div className="p-3.5 rounded-xl bg-purple-100 text-purple-800">
              <Coins className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-extrabold font-serif text-emerald-700">
                {((funds.reduce((s, f) => s + f.currentBalance, 0)) / 1000000).toFixed(1)} Tr
              </div>
              <div className="text-xs sm:text-sm text-stone-600 font-medium">Tổng Quỹ Dòng Họ</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. LỊCH GIỖ & SỰ KIỆN GẦN NHẤT & THỦY TỔ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cột 1 & 2: Sự Kiện & Ngày Giỗ */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-[#ead8c0] space-y-6">
            <div className="flex items-center justify-between border-b border-[#ead8c0] pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-red-100 text-red-700">
                  <CalendarDays className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#341d13]">
                    Lễ Giỗ & Sự Kiện Dòng Họ
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500">
                    Danh sách các ngày kỵ nhật và tế lễ quan trọng theo Âm lịch
                  </p>
                </div>
              </div>
              <Link
                href="/events"
                className="text-xs sm:text-sm font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
              >
                Xem tất cả <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {upcomingEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="p-4 rounded-xl bg-[#fbf7f0] border border-[#ead8c0] hover:border-amber-400 transition-colors space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                      {ev.lunarDay ? `Ngày ${ev.lunarDay}/${ev.lunarMonth} (ÂL)` : 'Hàng năm'}
                    </span>
                    {ev.estimatedSolarDate && (
                      <span className="text-xs text-stone-500 font-medium">
                        DL: {ev.estimatedSolarDate}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-[#341d13] text-base line-clamp-1">
                    {ev.title}
                  </h3>
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {ev.description || 'Lễ cúng bái tưởng niệm trang nghiêm.'}
                  </p>
                  {ev.location && (
                    <div className="flex items-center gap-1.5 text-xs text-stone-500 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      <span className="truncate">{ev.location}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Cột 3: Vinh Danh Thủy Tổ & Từ Đường */}
          <div className="bg-gradient-to-br from-[#341d13] to-[#5a3726] text-amber-50 rounded-2xl p-6 sm:p-8 shadow-md border border-amber-600/40 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-amber-300 text-xs uppercase tracking-widest font-semibold">
                <Award className="w-4 h-4" />
                Cội Nguồn Tiên Nhân
              </div>
              <h2 className="text-2xl font-bold font-serif text-amber-100">
                {clan?.ancestorName || 'Cụ Khởi Tổ'}
              </h2>
              <p className="text-sm text-stone-300 leading-relaxed">
                Khởi dựng nền móng dòng họ từ năm {clan?.establishedYear || '1842'} tại {clan?.originPlace || 'Hà Tĩnh'}. Trải qua hơn một thế kỷ, con cháu luôn giữ gìn thanh danh và phát huy chí khí rạng rỡ.
              </p>

              <div className="p-4 rounded-xl bg-black/30 border border-amber-500/20 space-y-2 text-xs">
                <div className="font-semibold text-amber-300">Đôi Câu Đối Từ Đường:</div>
                <p className="italic text-amber-100">&ldquo;Tổ đức lưu truyền thiên cổ thịnh&rdquo;</p>
                <p className="italic text-amber-100">&ldquo;Tử tôn kế nghiệp vạn đại vinh&rdquo;</p>
              </div>
            </div>

            <Link
              href="/culture"
              className="mt-4 inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 text-sm font-semibold transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Xem Tộc Ước & Lịch Sử Đầy Đủ
            </Link>
          </div>

        </div>
      </section>

      {/* 4. CÁC PHÂN HỆ TÍNH NĂNG CHÍNH */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#341d13]">
            Các Phân Hệ Chức Năng Cốt Lõi
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            Hệ thống cung cấp đầy đủ công cụ quản lý gia phả thông minh, trực quan và dễ sử dụng.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            href="/tree"
            className="group bg-white rounded-2xl p-6 shadow-md border border-[#ead8c0] hover:border-amber-500 hover:shadow-xl transition-all duration-200 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-stone-950 transition-colors">
                <GitFork className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-serif text-[#341d13] group-hover:text-amber-700 transition-colors">
                Phả Đồ Trực Quan 2D
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Biểu đồ cây gia phả tương tác mượt mà, hỗ trợ phóng to/thu nhỏ, phân chi nhánh và xuất ảnh in ấn khổ lớn.
              </p>
            </div>
            <div className="text-xs font-bold text-amber-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Truy cập ngay <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            href="/members"
            className="group bg-white rounded-2xl p-6 shadow-md border border-[#ead8c0] hover:border-amber-500 hover:shadow-xl transition-all duration-200 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-serif text-[#341d13] group-hover:text-amber-700 transition-colors">
                Hồ Sơ & Danh Sách
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Quản lý chi tiết từng thành viên: Tên tự, tên thụy, ngày sinh/mất Âm - Dương, vị trí mộ phần, tiểu sử sự nghiệp.
              </p>
            </div>
            <div className="text-xs font-bold text-emerald-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Quản lý thành viên <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            href="/kinship"
            className="group bg-white rounded-2xl p-6 shadow-md border border-[#ead8c0] hover:border-amber-500 hover:shadow-xl transition-all duration-200 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-serif text-[#341d13] group-hover:text-amber-700 transition-colors">
                Tra Cứu Xưng Hô
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Thuật toán thông minh xác định chính xác vai vế và cách xưng hô chuẩn Việt Nam giữa bất kỳ hai người trong tộc.
              </p>
            </div>
            <div className="text-xs font-bold text-blue-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Thử tra cứu ngay <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            href="/funds"
            className="group bg-white rounded-2xl p-6 shadow-md border border-[#ead8c0] hover:border-amber-500 hover:shadow-xl transition-all duration-200 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Coins className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-serif text-[#341d13] group-hover:text-amber-700 transition-colors">
                Quỹ Dòng Họ & Công Đức
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Minh bạch thu chi Quỹ khuyến học, Quỹ trùng tu Từ đường và bảng vàng vinh danh những người con đóng góp.
              </p>
            </div>
            <div className="text-xs font-bold text-purple-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Xem sổ thu chi <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}

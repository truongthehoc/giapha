'use client';

import React, { useEffect, useState } from 'react';
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  Plus, 
  Calendar as CalendarIcon, 
  Sparkles, 
  X,
  Flame
} from 'lucide-react';
import { MemorialEvent } from '@/lib/types';
import { LunarDate } from '@/lib/amlich';

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [todayLunar, setTodayLunar] = useState<LunarDate | null>(null);
  const [filterMonth, setFilterMonth] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    eventType: 'DEATH_ANNIVERSARY',
    lunarDay: 15,
    lunarMonth: 8,
    isRecurringYearly: true,
    location: '',
    description: '',
  });

  const loadEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/events');
      const data = await res.json();
      setEvents(data.events || []);
      setTodayLunar(data.todayLunar);
    } catch (err) {
      console.error('Failed to load events', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clanId: 'clan-1', ...formData }),
      });
      setIsModalOpen(false);
      loadEvents();
    } catch (err) {
      console.error('Lỗi thêm sự kiện', err);
    }
  };

  const filteredEvents = events.filter((ev) => {
    if (filterMonth === 'CURRENT') {
      return todayLunar && ev.lunarMonth === todayLunar.month;
    }
    if (filterMonth !== 'ALL') {
      return ev.lunarMonth === Number(filterMonth);
    }
    return true;
  });

  // Tìm sự kiện gần nhất tiếp theo
  const nextEvent = events.find((ev) => {
    if (!todayLunar || !ev.lunarMonth) return false;
    if (ev.lunarMonth > todayLunar.month) return true;
    if (ev.lunarMonth === todayLunar.month && ev.lunarDay >= todayLunar.day) return true;
    return false;
  }) || events[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header & Thêm sự kiện */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ead8c0] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#341d13] flex items-center gap-3">
            <CalendarDays className="w-8 h-8 text-amber-700" />
            Lịch Giỗ Chạp & Tế Lễ Dòng Tộc
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Tự động quy đổi Âm - Dương lịch và nhắc nhở các ngày kỵ nhật trang nghiêm của tiền nhân.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold text-sm shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          Thêm Sự Kiện / Lễ Giỗ
        </button>
      </div>

      {/* BANNER ÂM LỊCH & SỰ KIỆN GẦN NHẤT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Banner Hôm nay Âm Lịch */}
        {todayLunar && (
          <div className="bg-gradient-to-br from-[#341d13] to-[#5a3726] text-amber-50 p-6 rounded-3xl shadow-lg border border-amber-600/30 space-y-3 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              Lịch Vạn Niên Hôm Nay
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold font-serif text-amber-200">
                Ngày {todayLunar.day}
              </div>
              <div className="text-lg font-serif text-amber-100">
                Tháng {todayLunar.month} • Năm {todayLunar.canChiYear}
              </div>
            </div>
            <div className="text-xs text-stone-300 border-t border-amber-500/20 pt-2">
              Dương lịch: <span className="text-amber-300 font-semibold">{todayLunar.solarDateString}</span>
            </div>
          </div>
        )}

        {/* Banner Sự kiện Kế Tiếp */}
        {nextEvent && (
          <div className="md:col-span-2 bg-gradient-to-br from-red-900 to-amber-950 text-white p-6 rounded-3xl shadow-lg border border-red-500/30 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/30 text-amber-200 border border-red-400/40">
                <Flame className="w-4 h-4 text-red-400 animate-pulse" />
                Sự Kiện / Lễ Giỗ Gần Nhất
              </span>
              <span className="text-xs text-amber-200 font-semibold">
                ÂL: Ngày {nextEvent.lunarDay}/{nextEvent.lunarMonth}
              </span>
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl font-bold font-serif text-amber-100">
                {nextEvent.title}
              </h3>
              <p className="text-sm text-stone-300 mt-1 line-clamp-2">
                {nextEvent.description || 'Toàn thể con cháu chuẩn bị lễ vật và tề tựu trang nghiêm.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-amber-200/90 border-t border-red-500/30 pt-3">
              {nextEvent.estimatedSolarDate && (
                <div className="flex items-center gap-1.5">
                  <CalendarIcon className="w-4 h-4 text-amber-400" />
                  <span>Dương lịch ước tính: <strong>{nextEvent.estimatedSolarDate}</strong></span>
                </div>
              )}
              {nextEvent.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>{nextEvent.location}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* BỘ LỌC THÁNG */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#ead8c0] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-amber-700" />
          <span className="font-bold text-sm text-[#341d13] font-serif">Lọc theo thời gian Âm Lịch:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFilterMonth('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterMonth === 'ALL'
                ? 'bg-amber-700 text-white shadow-sm'
                : 'bg-[#fbf7f0] text-stone-700 hover:bg-stone-200'
            }`}
          >
            Cả Năm
          </button>
          <button
            onClick={() => setFilterMonth('CURRENT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterMonth === 'CURRENT'
                ? 'bg-red-700 text-white shadow-sm'
                : 'bg-red-50 text-red-800 hover:bg-red-100'
            }`}
          >
            Tháng Này (Tháng {todayLunar?.month})
          </button>

          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
            <button
              key={m}
              onClick={() => setFilterMonth(m.toString())}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterMonth === m.toString()
                  ? 'bg-amber-700 text-white'
                  : 'bg-[#fbf7f0] text-stone-600 hover:bg-stone-200'
              }`}
            >
              Th.{m}
            </button>
          ))}
        </div>
      </div>

      {/* DANH SÁCH CÁC NGÀY GIỖ & SỰ KIỆN */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((ev) => {
          const isThisMonth = todayLunar && ev.lunarMonth === todayLunar.month;

          return (
            <div
              key={ev.id}
              className={`bg-white rounded-3xl p-6 shadow-sm border transition-all duration-200 flex flex-col justify-between space-y-4 ${
                isThisMonth
                  ? 'border-red-400 ring-2 ring-red-100 hover:shadow-md'
                  : 'border-[#ead8c0] hover:border-amber-400'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      isThisMonth
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    Ngày {ev.lunarDay} Tháng {ev.lunarMonth} (ÂL)
                  </span>
                  {ev.estimatedSolarDate && (
                    <span className="text-xs text-stone-500 font-medium">
                      DL: {ev.estimatedSolarDate}
                    </span>
                  )}
                </div>

                <h3 className="font-bold font-serif text-lg text-[#341d13]">
                  {ev.title}
                </h3>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {ev.description || 'Lễ cúng bái tưởng niệm trang nghiêm tại từ đường họ.'}
                </p>
              </div>

              <div className="space-y-2 border-t border-[#f4ede0] pt-3 text-xs text-stone-500">
                {ev.location && (
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>{ev.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-amber-800 font-medium">
                  <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Định kỳ hàng năm</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL THÊM SỰ KIỆN */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#ead8c0] space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#ead8c0] pb-4">
              <h3 className="text-xl font-bold font-serif text-[#341d13]">
                Thêm Sự Kiện / Lễ Giỗ Mới
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-stone-100">
                <X className="w-5 h-5 text-stone-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Tên sự kiện / Lễ giỗ *
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Lễ Giỗ Cụ Trưởng Chi 2"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#ddbd9b] bg-[#fbf7f0] focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Ngày Âm Lịch (1 - 30) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    required
                    value={formData.lunarDay}
                    onChange={(e) => setFormData({ ...formData, lunarDay: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#ddbd9b] bg-[#fbf7f0]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Tháng Âm Lịch (1 - 12) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    required
                    value={formData.lunarMonth}
                    onChange={(e) => setFormData({ ...formData, lunarMonth: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#ddbd9b] bg-[#fbf7f0]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Địa điểm tổ chức
                </label>
                <input
                  type="text"
                  placeholder="VD: Nhà Thờ Họ Nguyễn Văn, Xã Tiên Điền"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#ddbd9b] bg-[#fbf7f0]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Ghi chú nội dung tế lễ
                </label>
                <textarea
                  rows={3}
                  placeholder="Chi tiết nghi thức, người chủ trì..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#ddbd9b] bg-[#fbf7f0]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#ead8c0]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold"
                >
                  Lưu Sự Kiện
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

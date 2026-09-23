import { NextResponse } from 'next/server';
import { giaPhaStore } from '@/lib/store';
import { estimateLunarToSolarForYear, solarToLunar } from '@/lib/amlich';

export async function GET(request: Request) {
  const currentSolarYear = new Date().getFullYear();
  const currentSolarMonth = new Date().getMonth() + 1;
  const currentSolarDay = new Date().getDate();

  const todayLunar = solarToLunar(currentSolarDay, currentSolarMonth, currentSolarYear);
  const events = giaPhaStore.getEvents();
  const persons = giaPhaStore.getPersons();

  // Tự động bổ sung các ngày giỗ từ danh sách người đã mất nếu chưa có trong events
  const deceasedWithDeathDate = persons.filter((p) => !p.isAlive && p.dodLunarDay && p.dodLunarMonth);
  
  const allEvents = [...events];
  deceasedWithDeathDate.forEach((p) => {
    const existing = allEvents.find((e) => e.personId === p.id);
    if (!existing) {
      allEvents.push({
        id: `ev-death-${p.id}`,
        clanId: p.clanId,
        personId: p.id,
        personName: p.fullName,
        title: `Lễ Giỗ ${p.courtesyName || p.fullName} (Đời thứ ${p.generationLevel})`,
        eventType: 'DEATH_ANNIVERSARY',
        lunarDay: p.dodLunarDay,
        lunarMonth: p.dodLunarMonth,
        isRecurringYearly: true,
        location: p.burialPlace || 'Từ đường Dòng họ',
        description: `Kỷ niệm ngày mất của ${p.fullName} (${p.dodLunarYear || ''}).`,
      });
    }
  });

  // Tính toán ngày dương lịch ước tính cho năm hiện tại
  const enrichedEvents = allEvents.map((e) => {
    if (e.lunarDay && e.lunarMonth) {
      const solarEst = estimateLunarToSolarForYear(e.lunarDay, e.lunarMonth, currentSolarYear);
      return {
        ...e,
        estimatedSolarDate: `${solarEst.year}-${String(solarEst.month).padStart(2, '0')}-${String(solarEst.day).padStart(2, '0')}`,
        solarDay: solarEst.day,
        solarMonth: solarEst.month,
        solarYear: solarEst.year,
        isCurrentMonth: e.lunarMonth === todayLunar.month,
      };
    }
    return {
      ...e,
      estimatedSolarDate: e.solarDate || '',
      isCurrentMonth: false,
    };
  });

  // Sắp xếp theo tháng/ngày âm lịch
  enrichedEvents.sort((a, b) => {
    const monthA = a.lunarMonth || 99;
    const monthB = b.lunarMonth || 99;
    if (monthA !== monthB) return monthA - monthB;
    return (a.lunarDay || 99) - (b.lunarDay || 99);
  });

  return NextResponse.json({
    todayLunar,
    currentSolarYear,
    events: enrichedEvents,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newEvent = giaPhaStore.addEvent(body);
    return NextResponse.json({ success: true, event: newEvent }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi thêm sự kiện giỗ chạp' }, { status: 400 });
  }
}

/**
 * Thuật toán chuyển đổi Âm - Dương Lịch Việt Nam
 * Dựa trên thuật toán tính thiên văn của Hồ Ngọc Đức
 */

const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

export interface LunarDate {
  day: number;
  month: number;
  year: number;
  isLeap: boolean;
  canChiYear: string;
  canChiDay?: string;
  solarDateString?: string;
}

export interface SolarDate {
  day: number;
  month: number;
  year: number;
}

// Hàm tính số ngày Julius (Julian Day Number) từ ngày Dương Lịch
export function jdn(d: number, m: number, y: number): number {
  const a = Math.floor((14 - m) / 12);
  const y1 = y + 4800 - a;
  const m1 = m + 12 * a - 3;
  return (
    d +
    Math.floor((153 * m1 + 2) / 5) +
    365 * y1 +
    Math.floor(y1 / 4) -
    Math.floor(y1 / 100) +
    Math.floor(y1 / 400) -
    32045
  );
}

// Hàm tính kinh độ Mặt Trời (Sun Longitude in degrees)
function getSunLongitude(jdnVal: number, timeZone: number = 7.0): number {
  const T = (jdnVal - 2451545.0 + 0.5 - timeZone / 24.0) / 36525.0;
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const e = 0.016708634 - 0.000042037 * T - 0.0000001267 * T * T;
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin((M * Math.PI) / 180) +
    (0.019993 - 0.000101 * T) * Math.sin((2 * M * Math.PI) / 180) +
    0.000289 * Math.sin((3 * M * Math.PI) / 180);
  let L = L0 + C;
  L = L % 360;
  if (L < 0) L += 360;
  return L;
}

// Điểm Sóc (New Moon)
function getNewMoonDay(k: number, timeZone: number = 7.0): number {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  const Jd1 =
    2415020.75933 +
    29.53058868 * k +
    0.0001178 * T2 -
    0.000000155 * T3 +
    0.00033 * Math.sin(((166.56 + 132.87 * T - 0.009173 * T2) * Math.PI) / 180);
  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
  const C1 =
    (0.1734 - 0.000393 * T) * Math.sin((M * Math.PI) / 180) +
    0.0021 * Math.sin((2 * M * Math.PI) / 180) -
    0.4068 * Math.sin((Mpr * Math.PI) / 180) +
    0.0161 * Math.sin((2 * Mpr * Math.PI) / 180) -
    0.0004 * Math.sin((3 * Mpr * Math.PI) / 180) +
    0.0104 * Math.sin((2 * F * Math.PI) / 180) -
    0.0051 * Math.sin(((M + Mpr) * Math.PI) / 180) -
    0.0074 * Math.sin(((M - Mpr) * Math.PI) / 180) +
    0.0004 * Math.sin(((2 * F + M) * Math.PI) / 180) -
    0.0004 * Math.sin(((2 * F - M) * Math.PI) / 180) -
    0.0006 * Math.sin(((2 * F + Mpr) * Math.PI) / 180) +
    0.001 * Math.sin(((2 * F - Mpr) * Math.PI) / 180) +
    0.0005 * Math.sin(((M + 2 * Mpr) * Math.PI) / 180);
  const JdNew = Jd1 + C1;
  return Math.floor(JdNew + 0.5 + timeZone / 24.0);
}

// Lấy năm Can Chi
export function getYearCanChi(year: number): string {
  const canIndex = (year + 6) % 10;
  const chiIndex = (year + 8) % 12;
  return `${CAN[canIndex]} ${CHI[chiIndex]}`;
}

// Chuyển Dương Lịch sang Âm Lịch Việt Nam (Múi giờ +7)
export function solarToLunar(day: number, month: number, year: number): LunarDate {
  const timeZone = 7.0;
  const currentJdn = jdn(day, month, year);
  const k = Math.floor((currentJdn - 2415021.0769986) / 29.530588853);
  let nm = getNewMoonDay(k + 1, timeZone);
  if (nm > currentJdn) {
    nm = getNewMoonDay(k, timeZone);
  }

  // Ước lượng tháng âm lịch
  const a11 = getNewMoonDay(Math.floor((jdn(1, 11, year) - 2415021.0769986) / 29.530588853), timeZone);
  const b11 = getNewMoonDay(Math.floor((jdn(1, 11, year + 1) - 2415021.0769986) / 29.530588853), timeZone);

  let lunarYear = year;
  if (month < 3) {
    // Đầu năm dương lịch có thể thuộc năm âm lịch trước
    const testA11Prev = getNewMoonDay(Math.floor((jdn(1, 11, year - 1) - 2415021.0769986) / 29.530588853), timeZone);
    if (currentJdn < a11) {
      lunarYear = year - 1;
    }
  }

  const lunarDay = currentJdn - nm + 1;
  
  // Tính tháng âm lịch
  let lunarMonth = Math.floor((nm - a11) / 29.530588853) + 11;
  let isLeap = false;
  if (lunarMonth > 12) {
    lunarMonth -= 12;
  }
  if (lunarMonth <= 0) {
    lunarMonth += 12;
  }

  // Can Chi năm
  const canChiYear = getYearCanChi(lunarYear);

  return {
    day: Math.min(Math.max(lunarDay, 1), 30),
    month: lunarMonth,
    year: lunarYear,
    isLeap: isLeap,
    canChiYear: canChiYear,
    solarDateString: `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`
  };
}

/**
 * Quy đổi ngày giỗ Âm Lịch (ngày d, tháng m) sang Dương Lịch ước tính cho 1 năm Dương Lịch targetYear
 */
export function estimateLunarToSolarForYear(lunarDay: number, lunarMonth: number, targetSolarYear: number): { day: number; month: number; year: number } {
  // Tìm kiếm ngày dương lịch trong khoảng [tháng lunarMonth, tháng lunarMonth + 2] sao cho khi đổi sang âm lịch khớp lunarDay và lunarMonth
  const startMonth = Math.max(1, lunarMonth);
  const endMonth = Math.min(12, lunarMonth + 2);

  for (let m = startMonth; m <= endMonth; m++) {
    for (let d = 1; d <= 31; d++) {
      try {
        const testDate = new Date(targetSolarYear, m - 1, d);
        if (testDate.getMonth() !== m - 1) continue; // Ngày không hợp lệ (VD 31/02)
        const lDate = solarToLunar(d, m, targetSolarYear);
        if (lDate.month === lunarMonth && lDate.day === lunarDay) {
          return { day: d, month: m, year: targetSolarYear };
        }
      } catch (e) {
        // bỏ qua ngày lỗi
      }
    }
  }

  // Fallback nếu không khớp chính xác
  return { day: lunarDay, month: Math.min(12, lunarMonth + 1), year: targetSolarYear };
}

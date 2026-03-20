const GMT7_OFFSET_MS = 7 * 60 * 60 * 1000;

export function getTodayStartGMT7(): Date {
  const nowGMT7 = new Date(Date.now() + GMT7_OFFSET_MS);
  nowGMT7.setUTCHours(0, 0, 0, 0);
  return new Date(nowGMT7.getTime() - GMT7_OFFSET_MS);
}

export function getYesterdayRangeGMT7(): { start: Date; end: Date; dateStr: string } {
  const nowGMT7 = new Date(Date.now() + GMT7_OFFSET_MS);
  const yesterdayGMT7 = new Date(nowGMT7);
  yesterdayGMT7.setUTCDate(yesterdayGMT7.getUTCDate() - 1);
  yesterdayGMT7.setUTCHours(0, 0, 0, 0);

  const start = new Date(yesterdayGMT7.getTime() - GMT7_OFFSET_MS);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000 - 1);

  const y = yesterdayGMT7.getUTCFullYear();
  const m = String(yesterdayGMT7.getUTCMonth() + 1).padStart(2, "0");
  const d = String(yesterdayGMT7.getUTCDate()).padStart(2, "0");
  return { start, end, dateStr: `${y}-${m}-${d}` };
}

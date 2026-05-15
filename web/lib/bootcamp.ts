export const BOOTCAMP_START = new Date("2026-05-06T00:00:00");
export const BOOTCAMP_DAYS = 90;

export function getCurrentDay(): number {
  const today = new Date();
  const diff = Math.floor((today.getTime() - BOOTCAMP_START.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(1, Math.min(BOOTCAMP_DAYS, diff));
}

import { formatDistanceToNowStrict, format } from "date-fns";
import { ko } from "date-fns/locale";

export function timeAgo(date: Date | number): string {
  return formatDistanceToNowStrict(date, { addSuffix: true, locale: ko });
}

export function formatDate(date: Date | number, pattern = "yyyy. MM. dd"): string {
  return format(date, pattern, { locale: ko });
}

export function formatDateTime(date: Date | number): string {
  return format(date, "yyyy. MM. dd HH:mm", { locale: ko });
}

export function toUnixSeconds(date: Date | number): number {
  const ms = typeof date === "number" ? date : date.getTime();
  return Math.floor(ms / 1000);
}

export function fromUnixSeconds(seconds: number): Date {
  return new Date(seconds * 1000);
}

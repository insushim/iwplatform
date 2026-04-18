export function excerpt(text: string, length = 160): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= length) return clean;
  return clean.slice(0, length - 1).trimEnd() + "…";
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ");
}

export function pluralizeKo(n: number, one: string, many?: string): string {
  return `${n.toLocaleString("ko-KR")}${many ?? one}`;
}

export function formatNumber(n: number): string {
  if (n >= 10_000) return `${(n / 10_000).toFixed(1).replace(/\.0$/, "")}만`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}천`;
  return n.toLocaleString("ko-KR");
}

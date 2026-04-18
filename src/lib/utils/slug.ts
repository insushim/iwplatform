import slugify from "slugify";
import { nanoid } from "nanoid";

/**
 * 한글·영문 혼용 슬러그. 공백/특수문자 → -, 최대 60자. 끝에 랜덤 8자 접미사.
 */
export function makeSlug(title: string): string {
  const base = slugify(title, {
    lower: true,
    strict: false,
    remove: /[^\p{L}\p{N}\s-]/gu,
    trim: true,
  })
    .replace(/\s+/g, "-")
    .slice(0, 60)
    .replace(/-+$/, "");
  const suffix = nanoid(8);
  return base ? `${base}-${suffix}` : suffix;
}

export function id(): string {
  return nanoid(16);
}

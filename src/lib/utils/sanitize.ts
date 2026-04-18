import DOMPurify from "isomorphic-dompurify";

/**
 * HTML 입력을 안전하게 정화. 허용 태그 화이트리스트.
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p", "br", "h1", "h2", "h3", "h4", "h5", "h6",
      "strong", "em", "u", "s", "code", "pre",
      "blockquote", "ul", "ol", "li",
      "a", "img", "figure", "figcaption",
      "table", "thead", "tbody", "tr", "th", "td",
      "hr", "span", "div",
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "title", "class", "target", "rel", "width", "height"],
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|\/|#)/i,
  });
}

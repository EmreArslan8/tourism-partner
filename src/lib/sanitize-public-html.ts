import sanitizeHtml from "sanitize-html";

const ALLOWED_TAGS = [
  "a",
  "b",
  "blockquote",
  "br",
  "caption",
  "code",
  "div",
  "em",
  "figcaption",
  "figure",
  "h2",
  "h3",
  "h4",
  "hr",
  "i",
  "img",
  "li",
  "ol",
  "p",
  "pre",
  "span",
  "strong",
  "table",
  "tbody",
  "td",
  "th",
  "thead",
  "tr",
  "u",
  "ul",
] as const;

const ALLOWED_ATTRIBUTES = {
  a: ["href", "name", "target", "title", "rel"],
  img: ["alt", "height", "loading", "src", "title", "width"],
  th: ["colspan", "rowspan"],
  td: ["colspan", "rowspan"],
} satisfies sanitizeHtml.IOptions["allowedAttributes"];

export function sanitizePublicHtml(html: string | null | undefined): string | null {
  if (!html) return null;

  const sanitized = sanitizeHtml(html, {
    allowedTags: [...ALLOWED_TAGS],
    allowedAttributes: ALLOWED_ATTRIBUTES,
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesAppliedToAttributes: ["href", "src"],
    allowProtocolRelative: false,
    disallowedTagsMode: "discard",
    enforceHtmlBoundary: true,
    transformTags: {
      a: (tagName, attribs) => {
        const nextAttribs = { ...attribs };
        if (nextAttribs.target === "_blank") {
          nextAttribs.rel = "noopener noreferrer nofollow";
        } else {
          delete nextAttribs.target;
          delete nextAttribs.rel;
        }
        return { tagName, attribs: nextAttribs };
      },
      img: sanitizeHtml.simpleTransform("img", { loading: "lazy" }, true),
    },
  }).trim();

  return sanitized || null;
}

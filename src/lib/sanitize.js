// Minimal, dependency-free HTML sanitizer for admin-authored blog content.
//
// Blog posts are stored as HTML and rendered with `dangerouslySetInnerHTML`.
// Even though only admins can write posts, rendering raw HTML means a
// compromised/typo'd post can execute script in every reader's browser. This
// allow-lists safe tags/attributes and blocks `javascript:` URLs.

const ALLOWED_TAGS = new Set([
  'p', 'br', 'hr', 'div', 'span', 'strong', 'b', 'em', 'i', 'u', 's', 'strike',
  'del', 'ins', 'mark', 'small', 'sub', 'sup', 'blockquote', 'pre', 'code',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'dl', 'dt', 'dd',
  'a', 'img', 'figure', 'figcaption',
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption',
  'iframe', 'video', 'source',
]);

// Elements that must be removed together with their contents.
const DROP_WITH_CONTENT = new Set([
  'script', 'style', 'object', 'embed', 'form', 'input', 'button', 'textarea',
  'select', 'option', 'link', 'meta', 'base', 'noscript', 'template',
]);

const ALLOWED_ATTRS = new Set([
  'href', 'src', 'alt', 'title', 'class', 'id', 'target', 'rel',
  'width', 'height', 'loading', 'controls', 'poster', 'allow', 'allowfullscreen',
  'frameborder', 'colspan', 'rowspan', 'scope', 'type', 'start', 'reversed',
]);

const SAFE_URL = /^(https?:|mailto:|tel:|\/|#)/i;
const SAFE_DATA_IMG = /^data:image\/(png|jpe?g|gif|webp|svg\+xml);/i;

function isSafeUrl(value, tagName, attrName) {
  const url = String(value).trim();
  if (!url) return false;
  if (url.startsWith('//')) return true;
  if (SAFE_URL.test(url)) return true;
  if (attrName === 'src' && tagName === 'img' && SAFE_DATA_IMG.test(url)) return true;
  return false;
}

function cleanNode(node) {
  // Iterate over a static copy: we mutate the tree while walking it.
  const children = Array.from(node.childNodes);

  for (const child of children) {
    if (child.nodeType === 8) {
      // Comment: drop.
      child.remove();
      continue;
    }

    if (child.nodeType !== 1) continue; // text nodes are always safe

    const tag = child.tagName.toLowerCase();

    if (DROP_WITH_CONTENT.has(tag)) {
      child.remove();
      continue;
    }

    if (!ALLOWED_TAGS.has(tag)) {
      // Unwrap unknown-but-harmless tags, keeping their text.
      cleanNode(child);
      while (child.firstChild) node.insertBefore(child.firstChild, child);
      child.remove();
      continue;
    }

    // Strip disallowed attributes.
    for (const attr of Array.from(child.attributes)) {
      const name = attr.name.toLowerCase();

      if (name.startsWith('on') || !ALLOWED_ATTRS.has(name)) {
        child.removeAttribute(attr.name);
        continue;
      }

      if ((name === 'href' || name === 'src' || name === 'poster') &&
          !isSafeUrl(attr.value, tag, name)) {
        child.removeAttribute(attr.name);
      }
    }

    // Outbound links should not leak the opener or hijack the tab.
    if (tag === 'a' && child.getAttribute('target') === '_blank') {
      const rel = child.getAttribute('rel') || '';
      if (!/noopener/.test(rel)) {
        child.setAttribute('rel', (rel + ' noopener noreferrer').trim());
      }
    }

    cleanNode(child);
  }
}

export function sanitizeHtml(html) {
  if (!html) return '';

  if (typeof window === 'undefined' || typeof window.DOMParser === 'undefined') {
    // Last-resort fallback: escape everything so nothing can execute.
    return String(html)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  const doc = new window.DOMParser().parseFromString(String(html), 'text/html');
  cleanNode(doc.body);
  return doc.body.innerHTML;
}

export default sanitizeHtml;

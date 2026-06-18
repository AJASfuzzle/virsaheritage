import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useLanguage } from "@/i18n/LanguageProvider";

/**
 * Walks the DOM and translates visible text nodes into the active language.
 * - Caches per-node original text on a data attribute so we can restore / re-translate.
 * - Re-runs on language change, route change, and DOM mutations (debounced).
 */
const SKIP_TAGS = new Set([
  "SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "CODE", "PRE", "SVG", "PATH",
]);
const ORIG_ATTR = "data-i18n-orig";
const TRANSLATABLE_PLACEHOLDER_ATTRS = ["placeholder", "aria-label", "title", "alt"];

function shouldSkip(node: Node): boolean {
  let el: Node | null = node;
  while (el && el.nodeType !== Node.DOCUMENT_NODE) {
    if (el.nodeType === Node.ELEMENT_NODE) {
      const e = el as Element;
      if (SKIP_TAGS.has(e.tagName)) return true;
      if (e.hasAttribute("data-i18n-skip")) return true;
      if (e.getAttribute("contenteditable") === "true") return true;
    }
    el = el.parentNode;
  }
  return false;
}

function collectTexts(root: ParentNode, pending: Set<string>, nodes: Array<{ node: Text; original: string }>) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => {
      const text = n.nodeValue;
      if (!text) return NodeFilter.FILTER_REJECT;
      const trimmed = text.trim();
      if (trimmed.length < 2) return NodeFilter.FILTER_REJECT;
      // Skip pure numbers / symbols
      if (!/[a-zA-Z]/.test(trimmed)) return NodeFilter.FILTER_REJECT;
      if (shouldSkip(n)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  let n: Node | null;
  while ((n = walker.nextNode())) {
    const tn = n as Text;
    const parent = tn.parentElement;
    if (!parent) continue;
    // Use stored original if present (in case we already translated this node once)
    let original = parent.getAttribute(ORIG_ATTR);
    if (original == null) {
      original = tn.nodeValue ?? "";
      // Only stash if this parent has just this single text node (common case),
      // otherwise stash on the text node via a wrapper-free convention: skip.
    }
    const sourceText = (parent.getAttribute(ORIG_ATTR) ?? tn.nodeValue ?? "").trim();
    if (!sourceText || sourceText.length < 2) continue;
    nodes.push({ node: tn, original: sourceText });
    pending.add(sourceText);
  }
}

function collectAttrs(root: ParentNode, pending: Set<string>, items: Array<{ el: Element; attr: string; original: string }>) {
  const all = root.querySelectorAll("[placeholder], [aria-label], [title], [alt]");
  all.forEach((el) => {
    if (shouldSkip(el)) return;
    for (const attr of TRANSLATABLE_PLACEHOLDER_ATTRS) {
      const v = el.getAttribute(attr);
      if (!v) continue;
      const trimmed = v.trim();
      if (trimmed.length < 2 || !/[a-zA-Z]/.test(trimmed)) continue;
      const origKey = `${ORIG_ATTR}-${attr}`;
      const original = el.getAttribute(origKey) ?? trimmed;
      items.push({ el, attr, original });
      pending.add(original);
    }
  });
}

export function AutoTranslator() {
  const { lang, t, ensure, version } = useLanguage();
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const apply = () => {
    if (typeof document === "undefined") return;
    const body = document.body;
    if (!body) return;

    const pending = new Set<string>();
    const textNodes: Array<{ node: Text; original: string }> = [];
    const attrItems: Array<{ el: Element; attr: string; original: string }> = [];
    collectTexts(body, pending, textNodes);
    collectAttrs(body, pending, attrItems);

    console.log("[i18n] apply lang=", lang, "pending size=", pending.size, "first=", Array.from(pending).slice(0, 3));

    // Queue everything for translation
    ensure(Array.from(pending));


    // Apply current translations (cached hits replace immediately; misses keep original)
    for (const { node, original } of textNodes) {
      const parent = node.parentElement;
      if (parent && !parent.hasAttribute(ORIG_ATTR)) parent.setAttribute(ORIG_ATTR, original);
      const translated = lang === "en" ? original : t(original);
      if (node.nodeValue !== translated) node.nodeValue = translated;
    }
    for (const { el, attr, original } of attrItems) {
      const origKey = `${ORIG_ATTR}-${attr}`;
      if (!el.hasAttribute(origKey)) el.setAttribute(origKey, original);
      const translated = lang === "en" ? original : t(original);
      if (el.getAttribute(attr) !== translated) el.setAttribute(attr, translated);
    }
  };

  const scheduleApply = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(apply, 80);
  };

  // Re-run on lang / route / translations-version changes
  useEffect(() => {
    scheduleApply();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, pathname, version]);

  // Observe DOM mutations (new content loaded async)
  useEffect(() => {
    if (typeof document === "undefined") return;
    const obs = new MutationObserver((mutations) => {
      // Ignore mutations we caused (text node value changes) by checking if anything structural changed
      let structural = false;
      for (const m of mutations) {
        if (m.type === "childList" && (m.addedNodes.length || m.removedNodes.length)) {
          structural = true; break;
        }
        if (m.type === "attributes") { structural = true; break; }
      }
      if (structural) scheduleApply();
    });
    obs.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: TRANSLATABLE_PLACEHOLDER_ATTRS });
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

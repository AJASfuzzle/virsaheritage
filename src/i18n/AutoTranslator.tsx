import { useEffect, useRef } from 'react';
import { useRouterState } from '@tanstack/react-router';
import { useLanguage } from '@/i18n/LanguageProvider';
import { sourceFor, withSourceWhitespace, type SourceRecord } from './dom-translation';

const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'CODE', 'PRE', 'SVG', 'PATH']);
const ATTRS = ['placeholder', 'aria-label', 'title', 'alt'];
function shouldSkip(node: Node): boolean {
  const el = node.nodeType === Node.ELEMENT_NODE ? node as Element : node.parentElement;
  return !!el?.closest('[data-i18n-skip], [contenteditable="true"], [translate="no"]') ||
    !!el && (SKIP_TAGS.has(el.tagName) || !!el.closest('script, style, noscript, textarea, code, pre, svg'));
}

export function AutoTranslator() {
  const language = useLanguage();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const latest = useRef(language);
  latest.current = language;
  const sources = useRef(new WeakMap<Text, SourceRecord>());
  const attributes = useRef(new WeakMap<Element, Map<string, SourceRecord>>());
  const apply = useRef<() => void>(() => {});
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const observer = useRef<MutationObserver | null>(null);

  const observe = () => observer.current?.observe(document.body, {
    childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS,
  });
  apply.current = () => {
    observer.current?.disconnect();
    try {
      const { lang, t, ensure } = latest.current;
      const pending = new Set<string>();
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let node: Node | null;
      while ((node = walker.nextNode())) {
        if (shouldSkip(node)) continue;
        const text = node as Text;
        const current = text.nodeValue ?? '';
        const record = sourceFor(current, sources.current.get(text));
        sources.current.set(text, record);
        const original = record.original.trim();
        if (!original || !/[A-Za-z]/.test(original)) continue;
        pending.add(original);
        const output = withSourceWhitespace(record.original, lang === 'en' ? original : t(original));
        if (current !== output) text.nodeValue = output;
        record.applied = output;
      }
      document.body.querySelectorAll('[placeholder], [aria-label], [title], [alt]').forEach((el) => {
        if (shouldSkip(el)) return;
        let records = attributes.current.get(el);
        if (!records) { records = new Map(); attributes.current.set(el, records); }
        for (const attr of ATTRS) {
          const current = el.getAttribute(attr);
          if (!current) continue;
          const record = sourceFor(current, records.get(attr));
          records.set(attr, record);
          const original = record.original.trim();
          if (!/[A-Za-z]/.test(original)) continue;
          pending.add(original);
          const output = lang === 'en' ? original : t(original);
          if (current !== output) el.setAttribute(attr, output);
          record.applied = output;
        }
      });
      ensure([...pending], true);
    } finally { observe(); }
  };

  useEffect(() => {
    observer.current = new MutationObserver(() => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => apply.current(), 40);
    });
    observe();
    apply.current();
    return () => {
      observer.current?.disconnect();
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => { apply.current(); }, [language.lang, language.version, pathname]);
  return null;
}

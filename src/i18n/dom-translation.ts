/** A text node owns its source; siblings must never share a parent-level source. */
export type SourceRecord = { original: string; applied: string };
export function sourceFor(current: string, record?: SourceRecord): SourceRecord {
  return !record || current !== record.applied
    ? { original: current, applied: current }
    : record;
}

export function withSourceWhitespace(source: string, translation: string): string {
  return `${source.match(/^\s*/)?.[0] ?? ''}${translation}${source.match(/\s*$/)?.[0] ?? ''}`;
}

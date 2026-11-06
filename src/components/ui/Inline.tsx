import { inline } from '@/lib/inline';

/** A sentence of a content file, with the links and marks it was written with (src/lib/inline.tsx). */
export function Inline({ text, lang }: { text: string; lang: string }) {
  return <>{inline(text, lang)}</>;
}

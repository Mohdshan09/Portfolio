import { useEffect } from 'react';

const SITE = 'Mohammad Shan';

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} — ${SITE}` : `${SITE} — Portfolio`;
  }, [title]);
}

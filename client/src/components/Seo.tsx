import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { headTags, seoForPath, serializeJsonLd } from '../seo';

/**
 * Keeps <head> in sync with the current public page during client-side navigation.
 * (The first page load already has the right tags — they're prerendered at build time.)
 * Every tag it owns carries `data-seo`, so it can replace exactly its own tags.
 */
export function Seo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const seo = seoForPath(pathname);
    document.title = seo.title;
    document.head.querySelectorAll('[data-seo]').forEach((el) => el.remove());

    for (const { tag, attrs } of headTags(seo)) {
      const el = document.createElement(tag);
      for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value);
      el.setAttribute('data-seo', '');
      document.head.appendChild(el);
    }
    for (const data of seo.jsonLd ?? []) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = serializeJsonLd(data);
      script.setAttribute('data-seo', '');
      document.head.appendChild(script);
    }
  }, [pathname]);

  return null;
}

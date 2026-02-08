import type { APIRoute } from 'astro';
import { LANGS, type Lang } from '@/i18n';
import { etTodayISO } from '@/lib/panchangam';

// Static build: pre-render this dynamic endpoint for each supported language.
export const prerender = true;
export function getStaticPaths() {
  return LANGS.map((lang) => ({ params: { lang } }));
}

export const GET: APIRoute = ({ params, redirect }) => {
  const lang = params.lang as Lang;
  const safeLang: Lang = LANGS.includes(lang) ? lang : 'en';
  const date = etTodayISO();
  return redirect(`/${safeLang}/date/${date}`, 302);
};

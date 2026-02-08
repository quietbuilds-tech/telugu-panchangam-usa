import type { APIRoute } from "astro";
import { loadYearData, isoToYM } from "@/lib/panchangam";

// Static build: pre-render legacy redirect pages for each known month.
export const prerender = true;
export async function getStaticPaths() {
  const data = await loadYearData();
  const yms = new Set<string>();
  for (const date of Object.keys(data.daysByDate)) yms.add(isoToYM(date));
  return Array.from(yms)
    .sort()
    .map((ym) => ({ params: { ym } }));
}

export const GET: APIRoute = ({ params, redirect }) => {
  const ym = params.ym;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return redirect(`${base}/en/month/${ym}/`, 302);
};

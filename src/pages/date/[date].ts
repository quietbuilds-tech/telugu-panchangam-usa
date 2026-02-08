import type { APIRoute } from 'astro';
import { loadYearData } from '@/lib/panchangam';

// Static build: pre-render legacy redirect pages for each known date.
export const prerender = true;
export async function getStaticPaths() {
  const data = await loadYearData();
  return Object.keys(data.daysByDate).map((date) => ({ params: { date } }));
}

export const GET: APIRoute = ({ params, redirect }) => {
  const date = params.date;
  return redirect(`/en/date/${date}`, 302);
};

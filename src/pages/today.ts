import type { APIRoute } from "astro";

export const GET: APIRoute = ({ redirect }) => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return redirect(`${base}/en/today/`, 302);
};

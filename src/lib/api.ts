// src/lib/api.ts
const BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ||
  'https://vbox-backend.onrender.com'; // tu backend en Render

type Options = { method?: 'GET'|'POST'|'PUT'|'DELETE'; body?: any; headers?: Record<string,string> };

export async function apiFetch<T=any>(path: string, options: Options = {}): Promise<T> {
  const url = `${BASE}${path.startsWith('/') ? path : `/${path}`}`;
  const res = await fetch(url, {
    method: options.method ?? 'GET',
    headers: { 'Content-Type': 'application/json', ...(options.headers||{}) },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const text = await res.text();
  let data: any = null; try { data = text ? JSON.parse(text) : null; } catch {}
  if (!res.ok) throw new Error((data && (data.message||data.error)) || text || `HTTP ${res.status}`);
  return (data ?? {}) as T;
}
export default apiFetch;

// src/pages/client/login.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') || 'http://localhost:5000';

type LoginResponse = {
  message?: string;
  token?: string;
  user?: { name?: string; email?: string; role?: string };
};

async function postJSON<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let data: any = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text || 'Error' };
  }
  if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
  return data as T;
}

export default function ClientLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const data = await postJSON<LoginResponse>(
        `${API_BASE}/api/auth/login`,
        { email, password }
      );
      if (data?.token) localStorage.setItem('vbox_token', data.token);
      localStorage.setItem('vbox_user', JSON.stringify(data?.user ?? { email }));
      router.replace('/client-dashboard');
    } catch (e: any) {
      setErr(e?.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={screen}>
      <form onSubmit={onSubmit} style={card}>
        <h1 style={{ marginTop: 0, textAlign: 'center' }}>Iniciar Sesión</h1>
        {err && <div style={alert}>{err}</div>}
        <label style={label}>Correo</label>
        <input
          style={input}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tucorreo@dominio.com"
          required
        />
        <label style={label}>Contraseña</label>
        <input
          style={input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="********"
          required
        />
        <button style={btn} disabled={loading}>
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}

const screen: React.CSSProperties = {
  minHeight: '100vh',
  display: 'grid',
  placeItems: 'center',
  background:
    'radial-gradient(1200px 600px at 80% 90%, #ff9f5a20, transparent), radial-gradient(1200px 600px at 20% 10%, #4f9fff20, transparent), #0b1220',
};
const card: React.CSSProperties = {
  width: 'min(520px, 92vw)',
  background: '#111827',
  color: '#e5e7eb',
  padding: 28,
  borderRadius: 16,
  boxShadow: '0 10px 30px rgba(0,0,0,.35)',
  display: 'grid',
  gap: 12,
};
const label: React.CSSProperties = { fontSize: 14, color: '#a5b4fc' };
const input: React.CSSProperties = {
  background: '#0b1220',
  border: '1px solid #374151',
  color: '#e5e7eb',
  padding: '10px 12px',
  borderRadius: 10,
  outline: 'none',
};
const btn: React.CSSProperties = {
  marginTop: 8,
  background: 'linear-gradient(90deg, #3b82f6, #06b6d4)',
  border: 0,
  padding: '12px 14px',
  color: '#fff',
  borderRadius: 10,
  fontWeight: 700,
  cursor: 'pointer',
};
const alert: React.CSSProperties = {
  background: '#ef444433',
  color: '#fecaca',
  border: '1px solid #ef4444',
  padding: '10px 12px',
  borderRadius: 10,
};

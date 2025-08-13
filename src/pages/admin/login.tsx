// pages/admin/login.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';

type LoginResponse = {
  message?: string;
  token?: string;
  user?: {
    name?: string;
    email?: string;
    role?: string;
  };
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') || 'http://localhost:5000';

async function postJSON<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // Si tu backend permite credenciales (cookies), cambia a: credentials: 'include',
    credentials: 'same-origin',
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let data: any = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    // respuesta no-JSON
    data = { message: text || 'Error' };
  }
  if (!res.ok) {
    const msg = data?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data as T;
}

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);

    if (!email || !password) {
      setErr('Correo y contraseña son obligatorios');
      return;
    }

    try {
      setLoading(true);

      const data = await postJSON<LoginResponse>(
        `${API_BASE}/api/auth/login`,
        { email, password }
      );

      // Guardar sesión en el navegador
      if (data?.token) localStorage.setItem('vbox_token', data.token);
      const u = data?.user ?? { email };
      localStorage.setItem('vbox_user', JSON.stringify(u));

      // Redirigir al dashboard del cliente
      router.push('/client-dashboard');
    } catch (error: any) {
      setErr(error?.message || 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background:
          'radial-gradient(1200px 600px at 80% 90%, #ff9f5a20, transparent), radial-gradient(1200px 600px at 20% 10%, #4f9fff20, transparent), #0b1220',
      }}
    >
      <form
        onSubmit={onSubmit}
        style={{
          width: 'min(460px, 92vw)',
          background: '#111827',
          color: '#e5e7eb',
          padding: 28,
          borderRadius: 16,
          boxShadow: '0 10px 30px rgba(0,0,0,.35)',
        }}
      >
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700 }}>Iniciar Sesión</h1>

        {err && (
          <div
            style={{
              marginTop: 14,
              background: '#fecaca',
              color: '#7f1d1d',
              padding: '10px 12px',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {err}
          </div>
        )}

        <div style={{ marginTop: 18 }}>
          <label style={{ display: 'block', fontSize: 14, marginBottom: 6 }}>Correo</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@ejemplo.com"
            style={inputStyle}
          />
        </div>

        <div style={{ marginTop: 14 }}>
          <label style={{ display: 'block', fontSize: 14, marginBottom: 6 }}>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={inputStyle}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: 22,
            width: '100%',
            background: loading
              ? 'linear-gradient(90deg, #6b7280, #9ca3af)'
              : 'linear-gradient(90deg, #2563eb, #06b6d4)',
            border: 0,
            padding: '12px 16px',
            color: '#fff',
            borderRadius: 10,
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#0f172a',
  border: '1px solid #1f2937',
  color: '#e5e7eb',
  borderRadius: 10,
  padding: '12px 12px',
  outline: 'none',
};

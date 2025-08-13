import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

type VboxUser = { name?: string; email?: string; role?: string };

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try { return JSON.parse(raw) as T; } catch { return null; }
}

export default function ClientDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<VboxUser | null>(null);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('vbox_token') : null;
    const userObj = typeof window !== 'undefined' ? safeParse<VboxUser>(localStorage.getItem('vbox_user')) : null;
    if (!token || !userObj) { router.replace('/login'); return; }
    setUser(userObj);
    setLoading(false);
  }, [router]);

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('vbox_token');
      localStorage.removeItem('vbox_user');
    }
    router.replace('/login');
  };

  if (loading) {
    return (
      <div style={screen}><div style={card}>Cargando…</div></div>
    );
  }

  return (
    <div style={screen}>
      <div style={card}>
        <h1 style={{ marginTop: 0 }}>Panel del Cliente</h1>
        <p>Bienvenido{user?.name ? `, ${user.name}` : ''} {user?.email ? `(${user.email})` : ''}</p>
        <button onClick={logout} style={btn}>Cerrar sesión</button>
      </div>
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
  width: 'min(880px, 92vw)',
  background: '#111827',
  color: '#e5e7eb',
  padding: 28,
  borderRadius: 16,
  boxShadow: '0 10px 30px rgba(0,0,0,.35)',
};

const btn: React.CSSProperties = {
  marginTop: 18,
  background: 'linear-gradient(90deg, #3b82f6, #06b6d4)',
  border: 0,
  padding: '10px 14px',
  color: '#fff',
  borderRadius: 10,
  fontWeight: 700,
  cursor: 'pointer',
};

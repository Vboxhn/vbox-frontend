// FRONTEND/src/pages/admin/admin-dashboard.tsx
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

type Row = {
  _id: string;
  numero: string;
  clienteNombre: string;
  clienteTelefono?: string;
  estado: string;
  fotoUrl?: string;
  createdAt: string;
};

export default function AdminDashboard() {
  const [rows, setRows] = useState<Row[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<'Todos' | 'Pendiente' | 'Entregado'>('Todos');

  const cargar = async () => {
    setMsg(null);
    try {
      const qs = filtro === 'Todos' ? '' : `?estado=${encodeURIComponent(filtro)}`;
      const data = await api<Row[]>(`/api/admin/trackings${qs}`);
      setRows(data || []);
    } catch (e: any) {
      setMsg(e.message);
    }
  };

  const cambiarEstado = async (id: string, estado: string) => {
    try {
      await api(`/api/admin/trackings/${id}`, { method: 'PATCH', body: { estado } });
      cargar();
    } catch (e: any) {
      setMsg(e.message);
    }
  };

  const subirFoto = async (id: string, file: File) => {
    const form = new FormData();
    form.append('foto', file);
    try {
      await api(`/api/admin/trackings/${id}/photo`, { method: 'POST', body: form, isForm: true });
      cargar();
    } catch (e: any) {
      setMsg(e.message);
    }
  };

  useEffect(() => {
    cargar();
  }, [filtro]);

  return (
    <div>
      {/* ...tu UI... */}
      {msg && <p style={{ color: 'red' }}>{msg}</p>}
      {/* ejemplo de uso:
          <select onChange={(e)=>cambiarEstado(row._id, e.target.value)} />
          <input type="file" onChange={(e)=> e.target.files && subirFoto(row._id, e.target.files[0])} />
      */}
    </div>
  );
}

// frontend/src/components/TrackingList.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000';

type Row = {
  _id: string;
  trackingNumber: string;
  carrier?: string;
  description?: string;
  status: string;
  photoUrl?: string;
  createdAt: string;
};

export default function TrackingList() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const c = {
    headBg:'#e5e7eb',
    border: '#d1d5db',
    text: '#111827',
    sub: '#374151',
    red: '#dc2626'
  };

  const load = async () => {
    try {
      setLoading(true);
      setMsg(null);
      const token = localStorage.getItem('token') || '';
      const res = await axios.get(`${API}/api/trackings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRows(res.data || []);
    } catch (e) {
      setMsg('❌ Error al cargar trackings');
    } finally { setLoading(false); }
  };

  useEffect(() => {
    load();
    const handler = () => load();
    window.addEventListener('tracking:refresh', handler);
    return () => window.removeEventListener('tracking:refresh', handler);
  }, []);

  return (
    <div style={{
      background:'#fff', padding:16, borderRadius:12,
      boxShadow:'0 6px 20px rgba(0,0,0,0.08)', border:`1px solid ${c.border}`
    }}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h3 style={{marginTop:0, color:c.text}}>Mis Trackings</h3>
        <button onClick={load}
          style={{padding:'8px 12px', border:`1px solid ${c.border}`, borderRadius:8, background:'#fff', cursor:'pointer', color:c.text}}>
          Actualizar
        </button>
      </div>

      {msg && <p style={{color:c.red}}>{msg}</p>}
      {loading && <p style={{color:c.sub}}>Cargando…</p>}
      {!loading && rows.length === 0 && <p style={{color:c.sub}}>No tienes trackings aún. Registra uno arriba.</p>}

      {!loading && rows.length > 0 && (
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%', borderCollapse:'separate', borderSpacing:0}}>
            <thead>
              <tr style={{background:c.headBg}}>
                {['Foto','Tracking','Courier','Descripción','Estado','Fecha'].map(h => (
                  <th key={h} style={{textAlign:'left', padding:12, borderBottom:`1px solid ${c.border}`, color:c.text, fontSize:14, fontWeight:700}}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r._id} style={{background:'#fff'}}>
                  <td style={{padding:12, borderBottom:`1px solid ${c.border}`}}>
                    {r.photoUrl ? (
                      <img src={r.photoUrl} alt="paquete" style={{width:64, height:64, objectFit:'cover', borderRadius:8, border:`1px solid ${c.border}`}} />
                    ) : <span style={{color:'#6b7280', fontWeight:600}}>Sin foto</span>}
                  </td>
                  <td style={{padding:12, borderBottom:`1px solid ${c.border}`, color:c.text, fontWeight:600}}>{r.trackingNumber}</td>
                  <td style={{padding:12, borderBottom:`1px solid ${c.border}`, color:c.sub}}>{r.carrier || '-'}</td>
                  <td style={{padding:12, borderBottom:`1px solid ${c.border}`, color:c.sub}}>{r.description || '-'}</td>
                  <td style={{padding:12, borderBottom:`1px solid ${c.border}`, color:c.text}}>{r.status}</td>
                  <td style={{padding:12, borderBottom:`1px solid ${c.border}`, color:c.sub}}>{new Date(r.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

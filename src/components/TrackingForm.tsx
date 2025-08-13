// frontend/src/components/TrackingForm.tsx
import { useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000';

export default function TrackingForm() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('');
  const [description, setDescription] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const c = {
    panel: '#ffffff',
    head:  '#111827',
    label: '#374151',
    border:'#d1d5db',
    ok:    '#16a34a',
    bad:   '#dc2626',
    btn:   '#16a34a'
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || '';
      await axios.post(`${API}/api/trackings`,
        { trackingNumber, carrier, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg('✅ Tracking guardado');
      setTrackingNumber(''); setCarrier(''); setDescription('');
      window.dispatchEvent(new Event('tracking:refresh'));
    } catch (e: any) {
      const text = e?.response?.data?.message || 'Error al guardar tracking';
      setMsg(`❌ ${text}`);
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      background:c.panel, padding:18, borderRadius:12,
      boxShadow:'0 6px 20px rgba(0,0,0,.08)', border:`1px solid ${c.border}`, marginBottom:16
    }}>
      <h3 style={{margin:'0 0 8px', color:c.head}}>Registrar Tracking</h3>
      <form onSubmit={submit} style={{display:'grid', gap:10}}>
        <div>
          <label style={{display:'block', fontSize:12, color:c.label, marginBottom:6}}>Número de tracking *</label>
          <input
            placeholder="Ej: 1Z999AA10123456784"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            required
            style={{width:'100%', padding:12, border:`1px solid ${c.border}`, borderRadius:10}}
          />
        </div>
        <div>
          <label style={{display:'block', fontSize:12, color:c.label, marginBottom:6}}>Courier (opcional)</label>
          <input
            placeholder="UPS, USPS, DHL…"
            value={carrier}
            onChange={(e) => setCarrier(e.target.value)}
            style={{width:'100%', padding:12, border:`1px solid ${c.border}`, borderRadius:10}}
          />
        </div>
        <div>
          <label style={{display:'block', fontSize:12, color:c.label, marginBottom:6}}>Descripción (opcional)</label>
          <input
            placeholder="Ej: 2 pares de zapatos"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{width:'100%', padding:12, border:`1px solid ${c.border}`, borderRadius:10}}
          />
        </div>
        <button type="submit" disabled={loading}
          style={{padding:12, border:'none', borderRadius:10, background:c.btn, color:'#fff', fontWeight:700, cursor:'pointer', opacity:loading?0.7:1}}>
          {loading ? 'Guardando…' : 'Guardar tracking'}
        </button>
      </form>

      {msg && (
        <p style={{marginTop:10, color: msg.startsWith('✅') ? c.ok : c.bad, fontWeight:600}}>
          {msg}
        </p>
      )}
    </div>
  );
}

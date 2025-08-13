// src/pages/register.tsx
import { FormEvent, useState } from 'react';
import { registerUser } from '@/lib/api';

export default function RegisterPage() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setMsg(null);

    const payload = {
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      telefono: telefono.trim(),
      email: email.trim(),
      password: password.trim(),
    };

    // Validación simple en cliente (opcional, ayuda a no mandar vacíos)
    if (!payload.nombre || !payload.apellido || !payload.telefono || !payload.email || !payload.password) {
      setMsg('Todos los campos son obligatorios');
      return;
    }

    try {
      setLoading(true);
      const res = await registerUser(payload);
      setMsg(`✔ ${res.message}`);
      // Opcional: limpiar
      setNombre(''); setApellido(''); setTelefono(''); setEmail(''); setPassword('');
    } catch (err: any) {
      setMsg(err.message || 'Error al registrar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center',
      background: 'radial-gradient(1200px 500px at 85% 80%, #ff8a3d33, #0000), radial-gradient(900px 450px at 15% 15%, #2aa8ff33, #0000), #0b1620'
    }}>
      <form
        onSubmit={onSubmit}
        style={{
          width: 480,
          maxWidth: '90vw',
          background: '#0f1c2a',
          padding: 24,
          borderRadius: 16,
          boxShadow: '0 10px 30px rgba(0,0,0,.35)',
          color: '#eaf2fb'
        }}
      >
        <h2 style={{textAlign:'center', marginBottom: 18}}>Crear Casillero</h2>

        {msg && (
          <div style={{
            background: msg.startsWith('✔') ? '#073b1a' : '#3a0d0d',
            border: `1px solid ${msg.startsWith('✔') ? '#1bd96a' : '#ff7b7b'}`,
            color: msg.startsWith('✔') ? '#b7ffdb' : '#ffd5d5',
            padding: '10px 12px',
            borderRadius: 10,
            marginBottom: 14,
            fontSize: 14
          }}>
            {msg}
          </div>
        )}

        <label>Nombre</label>
        <input value={nombre} onChange={(e)=>setNombre(e.target.value)}
          placeholder="Delmy" style={inputStyle} />

        <label>Apellido</label>
        <input value={apellido} onChange={(e)=>setApellido(e.target.value)}
          placeholder="Gonzales" style={inputStyle} />

        <label>Teléfono</label>
        <input value={telefono} onChange={(e)=>setTelefono(e.target.value)}
          placeholder="99316427" style={inputStyle} />

        <label>Correo</label>
        <input value={email} onChange={(e)=>setEmail(e.target.value)}
          placeholder="correo@ejemplo.com" style={inputStyle} />

        <label>Contraseña</label>
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)}
          placeholder="********" style={inputStyle} />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            marginTop: 14,
            padding: '12px 14px',
            borderRadius: 12,
            border: 0,
            cursor: 'pointer',
            fontWeight: 700,
            color: 'white',
            background: 'linear-gradient(90deg, #1c7cff, #1db1ff)',
            opacity: loading ? .7 : 1
          }}
        >
          {loading ? 'Enviando…' : 'Registrarme'}
        </button>
      </form>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  margin: '6px 0 14px',
  padding: '12px 14px',
  borderRadius: 10,
  border: '1px solid #254158',
  outline: 'none',
  background: '#102739',
  color: '#eaf2fb'
};

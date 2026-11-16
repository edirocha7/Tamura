'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
export default function Login() {
  const r = useRouter(); const [p, setP] = useState(''), [m, setM] = useState('');
  async function go(e) {
    e.preventDefault();
    const res = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: p }) });
    res.ok ? r.refresh() : setM('Senha incorreta.');
  }
  return (<form className="panel" onSubmit={go}><h2>Acesso do administrador</h2>
    <input className="in" type="password" placeholder="Senha" value={p} onChange={(e) => setP(e.target.value)} autoFocus />
    <p><button className="btn p">Entrar</button></p><div className="msg e">{m}</div></form>);
}

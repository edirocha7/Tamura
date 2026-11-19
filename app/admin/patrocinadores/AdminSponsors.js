'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { upload } from '@vercel/blob/client';
const EXT = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/svg+xml': 'svg' };
const slug = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase().slice(0, 60) || 'marca';
export default function AdminSponsors({ items }) {
  const r = useRouter();
  const [n, setN] = useState(''), [l, setL] = useState(''), [file, setFile] = useState(null), [ed, setEd] = useState(null), [m, setM] = useState(''), [busy, setBusy] = useState(false), [fk, setFk] = useState(0);
  const reset = () => { setN(''); setL(''); setFile(null); setEd(null); setFk(fk + 1); };
  async function save(e) {
    e.preventDefault(); setBusy(true); setM('');
    try {
      if (!n.trim()) throw new Error('Informe o nome do patrocinador.');
      if (l.trim() && !/^https?:\/\//i.test(l.trim())) throw new Error('O link deve começar com http:// ou https://');
      let logo = items.find((x) => x.id === ed)?.logo;
      if (file) {
        const ext = EXT[file.type]; if (!ext) throw new Error('Use PNG, JPG, WEBP ou SVG.');
        setM('Enviando logo…'); logo = (await upload('patrocinador-' + slug(n) + '.' + ext, file, { access: 'public', handleUploadUrl: '/api/upload', contentType: file.type })).url;
      }
      if (!logo) throw new Error('Selecione a logo da marca.');
      const res = await fetch('/api/patrocinadores', { method: ed ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: ed, name: n, link: l, logo }) });
      if (!res.ok) throw new Error((await res.json()).error || 'Erro ao salvar.');
      reset(); setM('✅ Salvo!'); r.refresh();
    } catch (err) { setM('Erro: ' + err.message); }
    setBusy(false);
  }
  function edit(x) { setEd(x.id); setN(x.name); setL(x.link || ''); setFile(null); setFk(fk + 1); setM(''); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  async function del(id) { if (!confirm('Excluir este patrocinador?')) return; await fetch('/api/patrocinadores?id=' + id, { method: 'DELETE' }); if (ed === id) reset(); r.refresh(); }
  async function out() { await fetch('/api/login', { method: 'DELETE' }); r.refresh(); }
  return (<>
    <div className="hero"><h1>🤝 Patrocinadores – Painel</h1><p><a href="/admin">← Arquivos</a> · <a href="/admin/agenda">Agenda</a> · <a href="/">Ver site público</a> · <button className="lnk" onClick={out}>Sair</button></p></div>
    <form className="panel" onSubmit={save}><h2>{ed ? 'Editar patrocinador' : 'Novo patrocinador'}</h2>
      <div className="fr"><div><label>Nome da marca</label><input className="in" value={n} maxLength={80} onChange={(e) => setN(e.target.value)} /></div>
        <div><label>Link do site (opcional)</label><input className="in" value={l} maxLength={300} placeholder="https://" onChange={(e) => setL(e.target.value)} /></div></div>
      <label>Logo (PNG, JPG, WEBP ou SVG){ed ? ' – deixe em branco para manter a atual' : ''}</label><input key={fk} className="in" type="file" accept=".png,.jpg,.jpeg,.webp,.svg,image/png,image/jpeg,image/webp,image/svg+xml" onChange={(e) => setFile(e.target.files[0] || null)} />
      <p><button className="btn p" disabled={busy}>{busy ? 'Aguarde…' : ed ? 'Salvar alterações' : 'Adicionar'}</button>{ed && <> <button type="button" className="btn" onClick={reset}>Cancelar</button></>}</p><div className="msg">{m}</div>
    </form>
    <div className="panel"><h2>Patrocinadores ({items.length})</h2>
      {items.map((x) => <div className="ar" key={x.id}><span className="sp tn"><img src={x.logo} alt="" /></span><div><b>{x.name}</b><div className="meta">{x.link || 'sem link'}</div></div>
        <div className="bt"><button className="btn" onClick={() => edit(x)}>Editar</button><button className="btn d" onClick={() => del(x.id)}>Excluir</button></div></div>)}
      {!items.length && <p className="meta">Nenhum patrocinador cadastrado.</p>}</div>
  </>);
}

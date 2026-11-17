'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { upload } from '@vercel/blob/client';
const L = { pdf: 'PDF', jpg: 'JPG', html: 'HTML', link: 'Link' };
const ACC = { pdf: '.pdf,application/pdf', jpg: '.jpg,.jpeg,image/jpeg', html: '.html,.htm,text/html' };
const MIME = { pdf: 'application/pdf', jpg: 'image/jpeg', html: 'text/html' };
const slug = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase() || 'arquivo';
export default function Admin({ items }) {
  const r = useRouter();
  const [k, setK] = useState('pdf'), [t, setT] = useState(''), [u, setU] = useState(''), [f, setF] = useState(null), [m, setM] = useState(''), [busy, setBusy] = useState(false), [ed, setEd] = useState(null), [et, setEt] = useState(''), [cat, setCat] = useState(''), [ec, setEc] = useState('');
  const cats = [...new Set(items.map((i) => i.category || 'Geral'))];
  async function add(e) {
    e.preventDefault(); setBusy(true); setM('');
    try {
      if (!t.trim()) throw new Error('Informe o título do documento.');
      let url = u.trim();
      if (k === 'link') { if (!/^https?:\/\//i.test(url)) throw new Error('O link deve começar com http:// ou https://'); }
      else {
        if (!f) throw new Error('Selecione um arquivo.'); setM('Enviando arquivo…');
        url = (await upload(slug(t) + '.' + k, f, { access: 'public', handleUploadUrl: '/api/upload', contentType: MIME[k] })).url;
      }
      const res = await fetch('/api/items', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: t, kind: k, url, category: cat }) });
      if (!res.ok) throw new Error((await res.json()).error || 'Erro ao salvar.');
      setT(''); setU(''); setF(null); e.target.reset(); setM('✅ Publicado!'); r.refresh();
    } catch (err) { setM('Erro: ' + err.message); }
    setBusy(false);
  }
  async function del(id) { if (!confirm('Excluir este conteúdo?')) return; await fetch('/api/items?id=' + id, { method: 'DELETE' }); r.refresh(); }
  async function rename(id) {
    if (!et.trim()) return;
    const res = await fetch('/api/items', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, title: et, category: ec }) });
    if (!res.ok) { alert('Não foi possível renomear.'); return; }
    setEd(null); r.refresh();
  }
  async function out() { await fetch('/api/login', { method: 'DELETE' }); r.refresh(); }
  return (<>
    <div className="hero"><h1>⚙️ Painel do administrador</h1><p><a href="/">Ver site público</a> · <a href="/admin/agenda">Gerenciar agenda</a> · <button className="lnk" onClick={out}>Sair</button></p></div>
    <form className="panel" onSubmit={add}><h2>Novo conteúdo</h2>
      <div className="row"><div><label>Título do documento</label><input className="in" value={t} maxLength={120} onChange={(e) => setT(e.target.value)} /></div>
        <div><label>Formato</label><select className="in" value={k} onChange={(e) => { setK(e.target.value); setF(null); }}>{Object.keys(L).map((x) => <option key={x} value={x}>{L[x]}</option>)}</select></div></div>
      <label>Categoria</label><input className="in" list="cats" value={cat} maxLength={40} placeholder="Ex.: Contratos, Fotos, Editais" onChange={(e) => setCat(e.target.value)} /><datalist id="cats">{cats.map((c) => <option key={c} value={c} />)}</datalist>
      {k === 'link' ? <><label>Endereço do link</label><input className="in" placeholder="https://" value={u} onChange={(e) => setU(e.target.value)} /></>
        : <><label>Arquivo</label><input key={k} className="in" type="file" accept={ACC[k]} onChange={(e) => setF(e.target.files[0] || null)} /></>}
      <p><button className="btn p" disabled={busy}>{busy ? 'Aguarde…' : 'Publicar'}</button></p><div className="msg">{m}</div>
    </form>
    <div className="panel"><h2>Conteúdos publicados ({items.length})</h2>
      {items.map((i) => <div className="li" key={i.id}>{ed === i.id
        ? <><input className="in" value={et} maxLength={120} autoFocus onChange={(e) => setEt(e.target.value)} /><input className="in" list="cats" value={ec} maxLength={40} onChange={(e) => setEc(e.target.value)} /><div><button className="btn p" onClick={() => rename(i.id)}>Salvar</button><button className="btn" onClick={() => setEd(null)}>Cancelar</button></div></>
        : <><span>{i.title} · {L[i.kind]} · {i.category || 'Geral'}</span><div><button className="btn" onClick={() => { setEd(i.id); setEt(i.title); setEc(i.category || 'Geral'); }}>Editar</button><button className="btn d" onClick={() => del(i.id)}>Excluir</button></div></>}</div>)}
      {!items.length && <p className="meta">Nenhum conteúdo ainda.</p>}</div>
  </>);
}

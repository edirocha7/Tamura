'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { upload } from '@vercel/blob/client';
const slug = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase().slice(0, 60) || 'etapa';
const E = { event: '', stage: '', date: '', endDate: '', time: '', location: '' };
const br = (d) => d.split('-').reverse().join('/');
export default function AdminAgenda({ events }) {
  const r = useRouter();
  const [f, setF] = useState(E), [file, setFile] = useState(null), [ed, setEd] = useState(null), [m, setM] = useState(''), [busy, setBusy] = useState(false), [fk, setFk] = useState(0);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const reset = () => { setF(E); setFile(null); setEd(null); setFk(fk + 1); };
  async function save(e) {
    e.preventDefault(); setBusy(true); setM('');
    try {
      if (!f.event.trim() || !f.stage.trim() || !f.location.trim() || !f.date) throw new Error('Preencha evento, etapa, data e local.');
      if (f.endDate && f.endDate < f.date) throw new Error('A data de término não pode ser antes da data de início.');
      let banner = events.find((x) => x.id === ed)?.banner;
      if (file) { setM('Enviando banner…'); banner = (await upload('banner-' + slug(f.event + '-' + f.stage) + '.jpg', file, { access: 'public', handleUploadUrl: '/api/upload', contentType: 'image/jpeg' })).url; }
      if (!banner) throw new Error('Selecione o banner (JPG).');
      const res = await fetch('/api/agenda', { method: ed ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...f, id: ed, banner }) });
      if (!res.ok) throw new Error((await res.json()).error || 'Erro ao salvar.');
      reset(); setM('✅ Salvo!'); r.refresh();
    } catch (err) { setM('Erro: ' + err.message); }
    setBusy(false);
  }
  function edit(x) { setEd(x.id); setF({ event: x.event, stage: x.stage, date: x.date, endDate: x.endDate || x.date, time: x.time || '', location: x.location }); setFile(null); setFk(fk + 1); setM(''); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  async function del(id) { if (!confirm('Excluir esta etapa?')) return; await fetch('/api/agenda?id=' + id, { method: 'DELETE' }); if (ed === id) reset(); r.refresh(); }
  async function out() { await fetch('/api/login', { method: 'DELETE' }); r.refresh(); }
  return (<>
    <div className="hero"><h1>📅 Agenda – Painel</h1><p><a href="/admin">← Arquivos</a> · <a href="/agenda">Ver agenda pública</a> · <button className="lnk" onClick={out}>Sair</button></p></div>
    <form className="panel" onSubmit={save}><h2>{ed ? 'Editar etapa' : 'Nova etapa'}</h2>
      <div className="fr"><div><label>Nome do evento</label><input className="in" value={f.event} maxLength={100} onChange={set('event')} placeholder="Ex.: Circuito Tamura de Corrida" /></div>
        <div><label>Nome da etapa</label><input className="in" value={f.stage} maxLength={100} onChange={set('stage')} placeholder="Ex.: 3ª Etapa – Itapevi" /></div></div>
      <div className="fr"><div><label>Data de início</label><input className="in" type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value, endDate: !f.endDate || f.endDate < e.target.value ? e.target.value : f.endDate })} /></div>
        <div><label>Data de término</label><input className="in" type="date" value={f.endDate} min={f.date} onChange={set('endDate')} /></div></div>
      <label>Horário (opcional)</label><input className="in" type="time" value={f.time} onChange={set('time')} />
      <label>Localização</label><input className="in" value={f.location} maxLength={160} onChange={set('location')} placeholder="Ex.: Parque Municipal, Itapevi – SP" />
      <label>Banner (JPG){ed ? ' – deixe em branco para manter o atual' : ''}</label><input key={fk} className="in" type="file" accept=".jpg,.jpeg,image/jpeg" onChange={(e) => setFile(e.target.files[0] || null)} />
      <p><button className="btn p" disabled={busy}>{busy ? 'Aguarde…' : ed ? 'Salvar alterações' : 'Publicar etapa'}</button>{ed && <> <button type="button" className="btn" onClick={reset}>Cancelar</button></>}</p><div className="msg">{m}</div>
    </form>
    <div className="panel"><h2>Etapas cadastradas ({events.length})</h2>
      {events.map((x) => <div className="ar" key={x.id}><img className="thumb" src={x.banner} alt="" /><div><b>{x.stage}</b><div className="meta">{x.event} · {br(x.date)}{x.endDate && x.endDate !== x.date ? ' a ' + br(x.endDate) : ''}{x.time ? ' · ' + x.time : ''} · {x.location}</div></div>
        <div className="bt"><button className="btn" onClick={() => edit(x)}>Editar</button><button className="btn d" onClick={() => del(x.id)}>Excluir</button></div></div>)}
      {!events.length && <p className="meta">Nenhuma etapa cadastrada.</p>}</div>
  </>);
}

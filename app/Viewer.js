'use client';
import { useState, useEffect } from 'react';
const L = { pdf: 'PDF', jpg: 'Imagem JPG', html: 'Página HTML', link: 'Link' };
export default function Viewer({ items }) {
  const [q, setQ] = useState(''), [o, setO] = useState(null), [h, setH] = useState('');
  useEffect(() => { setH(''); if (o?.kind === 'html') fetch(o.url).then((r) => r.text()).then(setH).catch(() => setH('<p>Não foi possível carregar.</p>')); }, [o]);
  const f = items.filter((i) => i.title.toLowerCase().includes(q.toLowerCase()));
  return (<>
    <input className="in" type="search" placeholder="Buscar por título…" value={q} onChange={(e) => setQ(e.target.value)} />
    {f.length ? <div className="grid">{f.map((i) => (
      <div className="card" key={i.id}>
        <span className="tag">{L[i.kind]}</span><h3>{i.title}</h3>
        <div className="meta">Publicado em {new Date(i.createdAt).toLocaleDateString('pt-BR')}</div>
        <div className="acts">{i.kind === 'link'
          ? <a className="btn p" href={i.url} target="_blank" rel="noopener noreferrer">Abrir</a>
          : <><button className="btn p" onClick={() => setO(i)}>Visualizar</button><a className="btn" href={i.url + '?download=1'}>Baixar</a></>}</div>
      </div>))}</div>
      : <div className="empty">{items.length ? 'Nenhum documento encontrado.' : 'Ainda não há documentos publicados.'}</div>}
    {o && <div className="mod" onClick={() => setO(null)}><div className="mb" onClick={(e) => e.stopPropagation()}>
      <div className="mh"><b>{o.title}</b><a className="btn" href={o.url + '?download=1'}>Baixar</a><button className="btn" onClick={() => setO(null)}>Fechar</button></div>
      <div className="mc">{o.kind === 'jpg' ? <img src={o.url} alt={o.title} /> : o.kind === 'pdf' ? <iframe src={o.url} title={o.title} /> : <iframe sandbox="" srcDoc={h} title={o.title} />}</div>
    </div></div>}
  </>);
}

import { getSponsors } from '../lib/sponsors';
function Logo({ s }) {
  const img = <img src={s.logo} alt={s.name} loading="lazy" />;
  return <div className="sp" title={s.name}>{s.link ? <a href={s.link} target="_blank" rel="noopener noreferrer sponsored">{img}</a> : img}</div>;
}
export default async function Sponsors() {
  let list = []; try { list = await getSponsors(); } catch (e) {}
  if (!list.length) return null;
  return (<>
    <aside className="rail l" aria-label="Patrocinadores">{list.filter((_, i) => i % 2 === 0).map((s) => <Logo key={s.id} s={s} />)}</aside>
    <aside className="rail r" aria-label="Patrocinadores">{list.filter((_, i) => i % 2 === 1).map((s) => <Logo key={s.id} s={s} />)}</aside>
    <section className="sb"><h2>Patrocinadores</h2><div className="sl">{list.map((s) => <Logo key={s.id} s={s} />)}</div></section>
  </>);
}

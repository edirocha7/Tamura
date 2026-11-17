import { getEvents } from '../../lib/agenda';
import { brand } from '../../lib/brand';
import Nav from '../Nav';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Agenda – ' + brand.name, description: 'Datas das próximas etapas e eventos.' };
const TZ = 'America/Sao_Paulo';
const fm = (d, o) => new Date(d + 'T12:00:00Z').toLocaleDateString('pt-BR', { timeZone: TZ, ...o });
const longDate = (d) => fm(d, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const mon = (d) => fm(d, { month: 'short' }).replace('.', '').toUpperCase();
const endOf = (e) => e.endDate || e.date;
function range(s, e) {
  if (!e || e === s) return longDate(s);
  const a = s.slice(0, 7) === e.slice(0, 7) ? String(+s.slice(8)) : fm(s, { day: 'numeric', month: 'long', ...(s.slice(0, 4) !== e.slice(0, 4) && { year: 'numeric' }) });
  return a + ' a ' + fm(e, { day: 'numeric', month: 'long', year: 'numeric' });
}
const cd = (n) => (n === 0 ? 'Hoje!' : n === 1 ? 'Amanhã' : 'Faltam ' + n + ' dias');
function Card({ e, diff, past, now }) {
  return (
    <article className={'evt' + (past ? ' past' : '')}>
      <img className="banner" src={e.banner} alt={'Banner ' + e.event + ' – ' + e.stage} loading="lazy" />
      <div className="evb">
        <div className="dt"><b>{e.date.slice(8)}</b><span>{mon(e.date)}</span></div>
        <div className="evi">
          <div className="ev">{e.event}</div><h3>{e.stage}</h3>
          <div className="when">{range(e.date, endOf(e))}{e.time ? ' · ' + e.time : ''}</div>
          <a className="loc" href={'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(e.location)} target="_blank" rel="noopener noreferrer">📍 {e.location}</a>
          {!past && <span className="cd">{now ? 'Em andamento' : cd(diff)}</span>}
        </div>
      </div>
    </article>
  );
}
export default async function Agenda() {
  let events = []; try { events = await getEvents(); } catch (e) {}
  const today = new Date().toLocaleDateString('en-CA', { timeZone: TZ });
  const days = (d) => Math.round((Date.parse(d + 'T00:00:00Z') - Date.parse(today + 'T00:00:00Z')) / 864e5);
  const next = events.filter((e) => endOf(e) >= today);
  const past = events.filter((e) => endOf(e) < today).reverse();
  return (
    <main className="w"><Nav active="agenda" />
      <div className="hero">{brand.logo && <img className="logo" src={brand.logo} alt={brand.name} />}<h1>Agenda de Eventos</h1><p>Acompanhe as datas das próximas etapas.</p></div>
      {next.length ? <div className="evg">{next.map((e) => <Card key={e.id} e={e} diff={days(e.date)} now={e.date < today} />)}</div> : <div className="empty">Nenhuma etapa agendada no momento.</div>}
      {past.length > 0 && <><h2 className="sec">Eventos anteriores</h2><div className="evg">{past.map((e) => <Card key={e.id} e={e} past />)}</div></>}
    </main>
  );
}

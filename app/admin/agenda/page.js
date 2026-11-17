import { isAdmin } from '../../../lib/auth';
import { getEvents } from '../../../lib/agenda';
import Login from '../Login';
import AdminAgenda from './AdminAgenda';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Agenda – Painel do administrador', robots: { index: false } };
export default async function Page() {
  if (!isAdmin()) return <main className="w"><Login /></main>;
  let events = []; try { events = await getEvents(); } catch (e) {}
  return <main className="w"><AdminAgenda events={events} /></main>;
}

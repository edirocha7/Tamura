import { isAdmin } from '../../../lib/auth';
import { getSponsors } from '../../../lib/sponsors';
import Login from '../Login';
import AdminSponsors from './AdminSponsors';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Patrocinadores – Painel do administrador', robots: { index: false } };
export default async function Page() {
  if (!isAdmin()) return <main className="w"><Login /></main>;
  let items = []; try { items = await getSponsors(); } catch (e) {}
  return <main className="w"><AdminSponsors items={items} /></main>;
}

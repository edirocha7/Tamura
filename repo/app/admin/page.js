import { isAdmin } from '../../lib/auth';
import { getItems } from '../../lib/store';
import Admin from './Admin';
import Login from './Login';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Painel do administrador', robots: { index: false } };
export default async function Page() {
  if (!isAdmin()) return <main className="w"><Login /></main>;
  let items = []; try { items = await getItems(); } catch (e) {}
  return <main className="w"><Admin items={items} /></main>;
}

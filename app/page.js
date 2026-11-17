import { getItems } from '../lib/store';
import { brand } from '../lib/brand';
import Viewer from './Viewer';
import Nav from './Nav';
export const dynamic = 'force-dynamic';
export default async function Home() {
  let items = []; try { items = await getItems(); } catch (e) {}
  return (<main className="w"><Nav active="arquivos" /><div className="hero">{brand.logo && <img className="logo" src={brand.logo} alt={brand.name} />}<h1>{brand.name}</h1><p>{brand.tagline}</p></div><Viewer items={items} /><footer>Todos os arquivos são de acesso público.</footer></main>);
}

import { getItems } from '../lib/store';
import Viewer from './Viewer';
export const dynamic = 'force-dynamic';
export default async function Home() {
  let items = []; try { items = await getItems(); } catch (e) {}
  return (<main className="w"><div className="hero"><h1>📁 Repositório de Arquivos On-line</h1><p>Consulte, visualize e baixe documentos, imagens, páginas e links — sem cadastro e sem login.</p></div><Viewer items={items} /><footer>Todos os arquivos são de acesso público.</footer></main>);
}

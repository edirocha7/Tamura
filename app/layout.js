import './globals.css';
import { brand } from '../lib/brand';
export const metadata = { title: brand.name, description: brand.tagline };
export default function Layout({ children }) {
  return <html lang="pt-BR" style={{ '--ac': brand.color, '--ac2': brand.textOnColor }}><body>{children}</body></html>;
}

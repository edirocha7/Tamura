export default function Nav({ active }) {
  return <nav className="nav"><a href="/" className={active === 'arquivos' ? 'on' : ''}>Arquivos</a><a href="/agenda" className={active === 'agenda' ? 'on' : ''}>Agenda</a></nav>;
}

import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/search', label: 'Search' },
  { to: '/wishlist', label: 'Wishlist' },
  { to: '/map', label: 'Map' },
];

export function Navbar() {
  return (
    <header className="border-b border-cn-border bg-cn-bg">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-6">
        <NavLink
          to="/"
          className="text-cn-accent font-display text-xl tracking-wide uppercase"
        >
          Conan Wiki
        </NavLink>
        <nav className="flex items-center gap-4 text-sm">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                isActive
                  ? 'text-cn-accent-light'
                  : 'text-cn-text-dim hover:text-cn-text'
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

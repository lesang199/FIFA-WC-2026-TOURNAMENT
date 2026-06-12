import { NavLink, Outlet } from 'react-router-dom';
import wc26Logo from '../assets/wclogo.svg';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/groups', label: 'Groups' },
  { to: '/knockout', label: 'Knockout' },
  { to: '/statistics', label: 'Stats' },
  { to: '/search', label: 'Search', icon: Search },
];

export function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 glass-strong border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={wc26Logo}
                alt="FIFA World Cup 2026"
                width={160}
                height={40}
                className="h-10 md:h-12 w-auto hidden sm:block"
              />
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="text-3xl sm:hidden"
              >
                ⚽
              </motion.div>
              <div>
                <h1 className="font-bold text-lg leading-tight bg-gradient-to-r from-wc-gold to-white bg-clip-text text-transparent">
                  FIFA World Cup 2026
                </h1>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                      ? 'bg-wc-gold/20 text-wc-gold'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`
                  }
                >
                  {Icon && <Icon size={16} />}
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>

        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <Outlet />
      </main>

      <nav className="md:hidden sticky bottom-0 glass-strong border-t border-white/10">
        <div className="flex justify-around py-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-3 py-1 text-xs ${isActive ? 'text-wc-gold' : 'text-white/50'
                }`
              }
            >
              {Icon && <Icon size={20} />}
              {label}
            </NavLink>
          ))}
        </div>
      </nav>

      <footer className="text-center py-4 text-xs text-white/30 hidden md:block">
        USA · Mexico · Canada 2026 · 48 Teams · 104 Matches
      </footer>
    </div>
  );
}

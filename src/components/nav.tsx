import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About us' },
  { to: '/programs', label: 'Programs' },
  { to: '/newsletters', label: 'Newsletters' },
  { to: '/publications', label: 'Publications' },
  { to: '/contact', label: 'Contact' },
];

const Navbar: React.FC = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-orange-500' : 'text-gray-600 hover:text-orange-500 transition';
  };

  const closeMobile = () => setMobileOpen(false);
  const navigate = useNavigate();

  return (
    <nav className="flex flex-col px-6 md:px-12 py-4 bg-white shadow-sm sticky top-0 z-50">
      {/* Top row: Logo | Desktop links | Hamburger or Login */}
      <div className="flex items-center justify-between w-full">
        <Link to="/" className="flex items-center gap-3 shrink-0" onClick={closeMobile}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0">
            <img src="/logo.png" alt="logo" className="w-full h-full object-cover" />
          </div>
          <div className="leading-tight">
            <h1 className="text-orange-500 font-bold text-base md:text-lg">Somaliland Women's</h1>
            <p className="text-gray-800 font-bold text-xs md:text-sm">Resource Centre</p>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-8 text-sm font-medium">
          {navLinks.map(({ to, label }) => (
            <Link key={to} to={to} className={isActive(to)}>
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-orange-500 transition"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <button className="hidden lg:block bg-orange-500 text-white px-6 py-2 rounded-md text-sm font-bold hover:bg-orange-600 transition shadow-sm" onClick={() => navigate('/admin/login')}>
            Login
          </button>
        </div>
      </div>

      {/* Mobile dropdow */}
      {mobileOpen && (
        <div className="lg:hidden mt-4 py-4 border-t border-gray-100">
          <div className="flex flex-col gap-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`py-3 px-2 rounded-md text-sm font-medium ${isActive(to)}`}
                onClick={closeMobile}
              >
                {label}
              </Link>
            ))}
            <div className="pt-2 mt-2 border-t border-gray-100">
              <button className="w-full bg-orange-500 text-white px-6 py-3 rounded-md text-sm font-bold hover:bg-orange-600 transition shadow-sm">
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-orange-500' : 'text-gray-600 hover:text-orange-500 transition';
  };

  return (
    <nav className="flex items-center justify-between px-6 md:px-12 py-4 bg-white shadow-sm sticky top-0 z-50">
      {/* Logo Section */}
      <Link to="/" className="flex items-center gap-3">
        <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center shrink-0">
          <span className="text-white text-[8px] text-center font-bold leading-tight">SWRC</span>
        </div>
        <div className="leading-tight">
          <h1 className="text-orange-500 font-bold text-base md:text-lg">Somaliland Women's</h1>
          <p className="text-gray-800 font-bold text-xs md:text-sm">Resource Centre</p>
        </div>
      </Link>

      {/* Menu Links */}
      <div className="hidden lg:flex items-center gap-8 text-sm font-medium">
        <Link to="/" className={isActive('/')}>
          Home
        </Link>
        <Link to="/about" className={isActive('/about')}>
          About us
        </Link>
        <Link to="/programs" className={isActive('/programs')}>
          Programs
        </Link>
        <Link to="/report" className={isActive('/report')}>
          Publications
        </Link>
        <Link to="/research" className={isActive('/research')}>
          Research
        </Link>
         <Link to="/media" className={isActive('/media')}>
          Media
        </Link>
        <Link to="/stories" className={isActive('/stories')}>
          Stories
        </Link>
        <Link to="/contact" className={isActive('/contact')}>
          Contact
        </Link>
      </div>

      {/* Action Button */}
      <button className="bg-orange-500 text-white px-6 py-2 rounded-md text-sm font-bold hover:bg-orange-600 transition shadow-sm">
        Donate Us
      </button>
    </nav>
  );
};

export default Navbar;
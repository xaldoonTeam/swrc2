import React from 'react';
import { Link } from 'react-router-dom';

const StatCard = ({ number, label }: { number: string; label: string }) => (
  <div className="flex flex-col items-center p-4 md:p-6">
    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{number}</h2>
    <p className="text-gray-500 text-[10px] md:text-xs text-center uppercase tracking-wider font-medium leading-relaxed">
      {label}
    </p>
  </div>
);

const Hero: React.FC = () => {
  return (
    <section className="relative h-[550px] md:h-[650px] flex items-center justify-center text-center px-4 pb-32 md:pb-40">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/herro2.jpg" 
          alt="Women workplace background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl">
        <h1 className="text-white text-4xl md:text-6xl font-semibold mb-8 leading-[1.2]">
          Equipping women for <br className="hidden md:block" /> workplace success.
        </h1>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <Link to="/programs" className="bg-orange-500 text-white px-8 py-3 rounded-md font-bold hover:bg-orange-600 transition">
            View all Programs
          </Link>
          {/* <Link to="/programs" className="border-2 border-white/60 text-white px-8 py-3 rounded-md font-bold hover:bg-white hover:text-orange-600 transition">
            View all Programs
          </Link> */}
        </div>
      </div>

      {/* Floating Stats Bar */}
      <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-full max-w-6xl px-4">
        <div className="bg-white rounded-lg shadow-2xl grid grid-cols-2 md:grid-cols-4 py-6 px-2 md:px-6">
          <StatCard number="6k" label="participants served" />
          <StatCard number="1,321" label="volunteer hours" />
          <StatCard number="10+" label="lower recidivism for WRC participants" />
          <StatCard number="6+" label="years of experience" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
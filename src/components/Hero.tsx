import React from 'react';
import { Link } from 'react-router-dom';
import { useLanding } from '../content/LandingContext';
import { landingImage } from '../content/landing';

const StatCard = ({ number, label }: { number: string; label: string }) => (
  <div className="flex flex-col items-center p-4 md:p-6">
    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{number}</h2>
    <p className="text-gray-500 text-[10px] md:text-xs text-center uppercase tracking-wider font-medium leading-relaxed">
      {label}
    </p>
  </div>
);

const Hero: React.FC = () => {
  const { hero } = useLanding();

  return (
    <section className="relative h-[550px] md:h-[650px] flex items-center justify-center text-center px-4 pb-32 md:pb-40">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={landingImage(hero.backgroundImage)} 
          alt={hero.imageAlt}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl">
        <h1 className="text-white text-4xl md:text-5xl font-semibold mb-8 leading-[1.2]">
          {hero.headline}
        </h1>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <Link to={hero.ctaLink} className="bg-orange-500 text-white px-8 py-3 rounded-md font-bold hover:bg-orange-600 transition">
            {hero.ctaText}
          </Link>
          {/* <Link to="/programs" className="border-2 border-white/60 text-white px-8 py-3 rounded-md font-bold hover:bg-white hover:text-orange-600 transition">
            View all Programs
          </Link> */}
        </div>
      </div>

      {/* Floating Stats Bar */}
      {hero.stats.length > 0 && (
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-full max-w-6xl px-4">
          <div className="bg-white rounded-lg shadow-2xl grid grid-cols-2 md:grid-cols-3 py-6 px-2 md:px-6">
            {hero.stats.map((stat) => (
              <StatCard key={`${stat.number}-${stat.label}`} number={stat.number} label={stat.label} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;
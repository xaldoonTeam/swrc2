import React from "react";
import { motion } from "framer-motion";


const PARTNERS = [
  { name: "Government", logo: "/somaliland.png" },
  { name: "OXFAM", logo: "https://www.google.com/s2/favicons?domain=oxfam.org&sz=128" },
  { name: "ActionAid", logo: "https://www.google.com/s2/favicons?domain=actionaid.org&sz=128" },
  { name: "Plan International", logo: "https://www.google.com/s2/favicons?domain=plan-international.org&sz=128" },
  { name: "Hargeisa CC", logo: "/xarunta.jpeg" },
  { name: "HAVOYOCO", logo: "/hav.jpeg" },
  { name: "NAFIS Network", logo: "/nafis.jpeg" },
];

const PartnersSection: React.FC = () => {
  return (
    <section className="relative bg-white py-20 md:py-32 overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-bl from-orange-50/50 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-24"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">
            Our Partners
          </h2>
          <p className="text-slate-500 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            We collaborate with government institutions, NGOs, and international 
            organizations to expand opportunities for women.
          </p>
        </motion.div>

        {/* Logo Cloud Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center items-center gap-12 md:gap-20"
        >
          {PARTNERS.map((partner) => (
            <motion.div
              key={partner.name}
              whileHover={{ scale: 1.05 }}
              className="group relative flex items-center justify-center"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="h-10 md:h-12 w-auto object-contain transition-all duration-300 grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100"
              />
              {/* Tooltip on hover */}
              <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-all bg-slate-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap font-bold uppercase tracking-widest">
                {partner.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PartnersSection;
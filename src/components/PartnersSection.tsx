import React from "react";
import { motion } from "framer-motion";
import { Building2, Globe, Users, Network } from "lucide-react";

/** Box dimensions for institution logo */
const LOGO_BOX_SIZE = "w-16 h-16";

/** Partner logo or name display inside a box. Uses Clearbit where available, fallback to initials. */
const PartnerLogo = ({
  name,
  logoUrl,
}: {
  name: string;
  logoUrl?: string | null;
}) => {
  const initial = name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const fallback = (
    <span
      className={`flex items-center justify-center ${LOGO_BOX_SIZE} rounded bg-gray-100 text-gray-600 font-bold text-sm shrink-0`}
      title={name}
    >
      {initial}
    </span>
  );

  if (!logoUrl) return fallback;

  return (
    <span className={`relative inline-flex items-center justify-center ${LOGO_BOX_SIZE} rounded-lg bg-white border border-gray-100 shrink-0 overflow-hidden p-1.5`}>
      <img
        src={logoUrl}
        alt={name}
        className="w-full h-full object-contain"
        loading="lazy"
        onError={(e) => {
          const el = e.target as HTMLImageElement;
          el.style.display = "none";
          const wrap = el.parentElement;
          const fb = wrap?.querySelector(".partner-fallback");
          if (fb) (fb as HTMLElement).style.display = "flex";
        }}
      />
      <span className="partner-fallback hidden items-center justify-center absolute inset-0 rounded-lg bg-gray-100 text-gray-600 font-bold text-sm" title={name}>
        {initial}
      </span>
    </span>
  );
};

const PARTNERS = {
  government: {
    title: "Government of Somaliland",
    icon: Building2,
    items: [
      { name: "Ministry of Employment, Social Affairs and Family" },
      { name: "Ministry of Health and Development" },
      { name: "Ministry of Justice" },
    ],
  },
  international: {
    title: "International Agencies",
    icon: Globe,
    items: [
      { name: "OXFAM", logoUrl: "https://www.google.com/s2/favicons?domain=oxfam.org&sz=128" },
      { name: "WHO", logoUrl: "https://www.google.com/s2/favicons?domain=who.int&sz=128" },
      { name: "Plan International", logoUrl: "https://www.google.com/s2/favicons?domain=plan-international.org&sz=128" },
    ],
  },
  local: {
    title: "Local Partners",
    icon: Users,
    items: [
      { name: "Hargeisa Cultural Centre" },
      { name: "HAVOYOCO" },
      { name: "NAFIS Network" },
    ],
  },
  networks: {
    title: "Networks",
    icon: Network,
    items: [
      { name: "Shaqo-Carbis Coalition" },
      { name: "Civil Society Accountability Network" },
    ],
  },
};

const PartnersSection: React.FC = () => {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };
  const item = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="bg-gray-50 border-y border-gray-100 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Partners &amp; Recognition
          </h2>
          <p className="text-teal-600 font-medium text-sm md:text-base max-w-xl mx-auto">
            We work with government, international agencies, local partners, and networks to advance women&apos;s empowerment in Somaliland.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12"
        >
          {Object.entries(PARTNERS).map(([key, { title, icon: Icon, items }]) => (
            <motion.div
              key={key}
              variants={item}
              className="bg-white rounded p-6 md:p-8 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded bg-teal-500/10 flex items-center justify-center text-teal-600">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{title}</h3>
              </div>
              <ul className="space-y-3">
                {items.map((partner) => (
                  <li
                    key={partner.name}
                    className="flex items-center gap-4 p-3 rounded border border-gray-100 bg-gray-50/50"
                  >
                    <PartnerLogo
                      name={partner.name}
                      logoUrl={"logoUrl" in partner ? partner.logoUrl : undefined}
                    />
                    <span className="text-sm md:text-base text-gray-700 font-medium">
                      {partner.name}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PartnersSection;

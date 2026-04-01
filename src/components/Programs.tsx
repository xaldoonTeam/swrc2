import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { programs as programsApi, type Program } from "../Api/client";
import { getProgramIcon } from "../lib/programIcons";

// ✅ helper
const limitWords = (text: string = "", limit: number = 20) => {
  const words = text.split(" ");
  return words.slice(0, limit).join(" ") + (words.length > limit ? "..." : "");
};

type ProgramCardProps = {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  desc: string;
  slug?: string;
  index: number;
};

const ProgramCard = ({ icon: Icon, title, desc, slug, index }: ProgramCardProps) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
        ease: "easeOut" as const,
      },
    }),
  };

  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={cardVariants}
      whileHover={{ y: -10, scale: 1.05 }}
      className="bg-white p-8 rounded shadow-lg text-center flex flex-col items-center max-w-sm"
    >
      <div className="bg-orange-100 p-4 rounded-md mb-4 text-orange-600">
        <Icon size={32} />
      </div>

      <h3 className="text-xl font-bold mb-3 text-gray-800">
        {title}
      </h3>

      <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
        {limitWords(desc, 20)}
      </p>

      <Link
        to={`/programs/${slug}`}
        className="mt-4 text-orange-500 font-bold text-sm hover:underline"
      >
        Learn More →
      </Link>
    </motion.div>
  );
};

const Programs = () => {
  const [programs, setPrograms] = useState<ProgramCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    programsApi
      .list()
      .then((data: Program[]) => {
        const mapped = data.map((p) => ({
          icon: getProgramIcon(p.iconName),
          title: p.title,
          desc: p.description,
          slug: p.slug,
        }));
        // @ts-ignore
        setPrograms(mapped.slice(0, 3).map((p, index) => ({
          ...p,
          index,
        }))); // ✅ only 3
      })
      .catch(() => {
        setError("Failed to load programs");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-[#2D241E] py-20 px-6 text-center">
      <p className="text-orange-400 mb-2">Our Programs</p>
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">
        Equipping women for success
      </h2>

      {/* ✅ Loading */}
      {loading && (
        <p className="text-gray-300">Loading programs...</p>
      )}

      {/* ❌ Error */}
      {error && !loading && (
        <p className="text-red-400">{error}</p>
      )}

      {/* ✅ Data */}
      {!loading && !error && (
        <div className="flex flex-wrap justify-center gap-8 max-w-7xl mx-auto">
          {programs.map((program, index) => (
            <ProgramCard key={index} {...program} index={index} />
          ))}
        </div>
      )}
      <motion.div 
  className="mt-12"
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.4 }}
>
  <Link
    to="/programs"
    className="inline-block bg-orange-500 text-white px-8 py-3 rounded font-medium text-sm mt-4 hover:bg-orange-600 transition-all shadow-lg"
  >
    View All Programs
  </Link>
</motion.div>
    </section>
  );
};

export default Programs;
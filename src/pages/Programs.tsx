import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, GraduationCap, Lightbulb, Briefcase, HeartHandshake, Rocket } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { programs as programsApi, type Program } from '../Api/client';
import { getProgramIcon } from '../lib/programIcons';

const ProgramCard = ({ icon: Icon, title, desc, slug, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    viewport={{ once: true }}
    whileHover={{ y: -10 }}
    className="bg-white p-8 rounded-[4px] shadow-lg border border-gray-100 flex flex-col items-center text-center group"
  >
    <div className="bg-orange-100 p-3 rounded text-orange-600 mb-6 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
      <Icon size={25} />
    </div>
    <h3 className="text-xl font-bold mb-4 text-gray-900">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed mb-6">
      {desc}
    </p>
    <Link 
      to={slug ? `/programs/${slug}` : `/programs/${title.toLowerCase().replace(/\s+/g, "-")}`}
      className="text-orange-500 font-bold text-sm hover:underline flex items-center gap-2"
    >
      Learn More <span>→</span>
    </Link>
  </motion.div>
);

const FALLBACK_PROGRAMS: { icon: typeof Users; title: string; desc: string; slug?: string }[] = [
  { icon: Users, title: "Individualized Support", desc: "We work in collaboration with each woman to create a personalized plan of action to help her move forward in her professional and personal life." },
  { icon: GraduationCap, title: "Education", desc: "Specialized workshops focusing on career readiness, financial literacy, and essential life skills for modern workplace success." },
  { icon: Lightbulb, title: "Girls Talk", desc: "Offered to women who are currently looking to transition into the Somaliland staff career practice with mentorship support." },
  { icon: Briefcase, title: "Entrepreneurship Training", desc: "Comprehensive training for cohort groups to explore business ideas, plan startups, and practice key entrepreneurial skills." },
  { icon: HeartHandshake, title: "Mentorship & Coaching", desc: "Connecting women with vetted professionals to provide guidance, master interviews, and build strong professional networks." },
  { icon: Rocket, title: "Leadership Development", desc: "Preparing the next generation of women leaders to take charge in their communities and workplaces through specialized training." },
];

const ProgramsPage: React.FC = () => {
  const navigate = useNavigate();
  const [allPrograms, setAllPrograms] = useState<{ icon: React.ComponentType<{ size?: number; className?: string }>; title: string; desc: string; slug?: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    programsApi
      .list()
      .then((data: Program[]) =>
        setAllPrograms(
          data.map((p) => ({
            icon: getProgramIcon(p.iconName),
            title: p.title,
            desc: p.description,
            slug: p.slug,
          }))
        )
      )
      .catch(() => {
        setError("Could not load programs.");
        setAllPrograms(FALLBACK_PROGRAMS);
      })
      .finally(() => setLoading(false));
  }, []);

  const displayList = loading ? [] : allPrograms;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-[#2D241E] pt-20 pb-32 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl mx-auto space-y-4"
        >
          <p className="text-orange-400 font-bold tracking-widest uppercase text-sm">Our Programs</p>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
            Equipping Women for <span className="text-orange-500">Success</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Explore our range of specialized programs designed to empower women in Somaliland through skills, education, and opportunity.
          </p>
        </motion.div>
      </section>

      {/* Programs Grid */}
      <section className="max-w-7xl mx-auto px-6 -mt-16 pb-24">
        {loading && (
          <div className="flex items-center justify-center py-16 gap-2 text-gray-500">
            <span className="animate-pulse">Loading programs…</span>
          </div>
        )}
        {error && !loading && (
          <p className="text-amber-600 mb-4 text-center">Using sample data. Start the backend to load from the database.</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayList.map((program, index) => (
            <ProgramCard 
              key={program.title + index} 
              {...program} 
              delay={index * 0.1}
            />
          ))}
        </div>
      </section>

      {/* Impact Banner */}
      <section className="bg-orange-500 py-16 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-white space-y-2 text-center md:text-left">
            <h2 className="text-3xl font-bold">Ready to start your journey?</h2>
            <p className="opacity-90">Join over 298+ participants who have already transformed their careers.</p>
          </div>
          <button onClick={() => navigate('/serviceDetail')} className="bg-[#2D241E] text-white px-10 py-4 rounded-full font-bold shadow-xl hover:bg-black transition-all">
            Apply for a Program
          </button>
        </div>
      </section>

      {/* Stats Section (Quick View) */}
      <section className="max-w-7xl mx-auto py-24 px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center border-t border-gray-200 pt-16">
          <div>
            <h4 className="text-4xl font-bold text-gray-900">298</h4>
            <p className="text-gray-500 text-xs uppercase mt-2 tracking-widest">Participants Served</p>
          </div>
          <div>
            <h4 className="text-4xl font-bold text-gray-900">1,321</h4>
            <p className="text-gray-500 text-xs uppercase mt-2 tracking-widest">Volunteer Hours</p>
          </div>
          <div>
            <h4 className="text-4xl font-bold text-gray-900">10+</h4>
            <p className="text-gray-500 text-xs uppercase mt-2 tracking-widest">Years of Impact</p>
          </div>
          <div>
            <h4 className="text-4xl font-bold text-gray-900">6+</h4>
            <p className="text-gray-500 text-xs uppercase mt-2 tracking-widest">Experience Years</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProgramsPage;
import { Users, GraduationCap, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ProgramCard = ({ icon: Icon, title, desc, index }: any) => {
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
        ease: "easeOut" as const
      }
    })
  };

  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={cardVariants}
      whileHover={{ 
        y: -10,
        scale: 1.05,
        transition: { duration: 0.3 }
      }}
      className="relative bg-white p-8 rounded shadow-lg text-center flex flex-col items-center max-w-sm cursor-pointer group overflow-hidden"
    >
      <motion.div 
        className="bg-orange-100 p-4 rounded-md mb-4 text-orange-600 group-hover:bg-orange-500 transition-colors duration-300"
        whileHover={{ 
          rotate: [0, -10, 10, -10, 0],
          scale: 1.1,
          transition: { duration: 0.5 }
        }}
      >
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
        >
          <Icon size={32} className="group-hover:text-white transition-colors duration-300" />
        </motion.div>
      </motion.div>
      <motion.h3 
        className="text-xl font-bold mb-3 text-gray-800 group-hover:text-orange-500 transition-colors duration-300"
        whileHover={{ scale: 1.05 }}
      >
        {title}
      </motion.h3>
      <motion.p 
        className="text-gray-500 text-sm leading-relaxed"
        initial={{ opacity: 0.8 }}
        whileHover={{ opacity: 1 }}
      >
        {desc}
      </motion.p>
      
      {/* Hover effect overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={false}
      />
    </motion.div>
  );
};

const Programs = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section className="bg-[#2D241E] py-20 px-6 text-center overflow-hidden">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={titleVariants}
      >
        <motion.p 
          className="text-orange-400 font-medium mb-2"
          whileHover={{ scale: 1.05 }}
        >
          Our Services
        </motion.p>
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-white mb-12"
          whileHover={{ scale: 1.02 }}
        >
          Equipping women for success
        </motion.h2>
      </motion.div>
      
      <motion.div 
        className="flex flex-wrap justify-center gap-8 max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <Link to="/serviceDetail">
        <ProgramCard 
          icon={Users} 
          title="Programs" 
          desc="Individualized Support: We work in collaboration with each woman to create a personalized plan of action."
          index={0}
        />
        </Link>
        <ProgramCard 
          icon={GraduationCap} 
          title="Workshops" 
          desc="Information for success: Skills for Life. Specialized workshops focusing on career readiness."
          index={1}
        />
        <ProgramCard 
          icon={Lightbulb} 
          title="New Beginnings" 
          desc="New beginnings is offered to women who are currently housed in the Somaliland staff career practice."
          index={2}
        />
      </motion.div>
    </section>
  );
};

export default Programs;
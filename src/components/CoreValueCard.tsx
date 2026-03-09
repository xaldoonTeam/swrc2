import { motion } from 'framer-motion';
import { 
  Users, Rocket, Heart, 
  Linkedin, Twitter, Globe 
} from 'lucide-react';


export const CoreValueCard = ({ icon, title, desc, subDesc }: any) => (
    <motion.div 
      whileHover={{ y: -10 }}
      className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center space-y-4"
    >
      <div className="p-4 bg-orange-50 rounded-full text-orange-500">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
      {subDesc && <p className="text-xs text-gray-400 italic">{subDesc}</p>}
    </motion.div>
  );

  // Team Member Component
export const TeamMember = ({ name, role, image, img, desc }: any) => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="bg-[#F8F9FB] rounded-2xl overflow-hidden flex items-center p-4 gap-4 border border-transparent hover:border-orange-200 hover:bg-white transition-all shadow-sm"
    >
      <img src={image || img} alt={name} className="w-24 h-24 rounded-xl object-cover" />
      <div className="flex-1">
        <h4 className="font-bold text-gray-900">{name}</h4>
        <p className="text-orange-500 text-xs font-medium mb-2">{role}</p>
        {desc && (
          <p className="text-[10px] text-gray-500 leading-tight mb-3">
            {desc}
          </p>
        )}
        {!desc && (
          <p className="text-[10px] text-gray-500 leading-tight mb-3">
            Dedicated to driving innovation and community growth.
          </p>
        )}
        <div className="flex gap-2">
          <Linkedin size={14} className="text-gray-400 hover:text-orange-500 cursor-pointer" />
          <Twitter size={14} className="text-gray-400 hover:text-orange-500 cursor-pointer" />
          <Globe size={14} className="text-gray-400 hover:text-orange-500 cursor-pointer" />
        </div>
      </div>
    </motion.div>
  );
  
const AboutUsExtended = () => {
    const values = [
      {
        icon: Users,
        title: "Join Us in Fostering a Respectful Tech Community",
        desc: "At SWRC, we believe that collaboration is key to driving innovation.",
        subDesc: "Empowering through unity."
      },
      {
        icon: Rocket,
        title: "A Space for Growth: Learn and Develop Your Skills",
        desc: "We provide a nurturing environment for everyone to enhance their skills.",
        subDesc: "Growth without limits."
      },
      {
        icon: Heart,
        title: "Respect: Valuing Every Voice in Our Diverse Tech Community",
        desc: "We create a culture where all contributions are appreciated and respected.",
        subDesc: "Diversity is our strength."
      }
    ];
  
   

  return (
    <section className="py-20 max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 items-center">
      {values.map((value, index) => (
        <CoreValueCard key={index} {...value} />
      ))}
    </section>
  );
};

export default AboutUsExtended; 
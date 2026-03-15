import { motion } from 'framer-motion';
import { 
  Users, Rocket, Heart
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

  
export const TeamMember = ({ name, role, image, img }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4 }}
    className="bg-white rounded-3xl p-6 flex flex-col items-center text-center border border-gray-100 hover:shadow-lg transition-shadow"
  >
    {/* Image */}
    <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-white shadow-sm">
      <img 
        src={image || img} 
        alt={name} 
        className="w-full h-full object-cover"
      />
    </div>

    {/* Name and Role */}
    <h3 className="font-semibold text-gray-900 text-xl mb-1">{name}</h3>
    <p className="text-gray-400 text-sm">{role}</p>
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
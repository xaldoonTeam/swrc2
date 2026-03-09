import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const WelcomeSection: React.FC = () => {
  const features = [
    "Women-centered and inclusive programs", 
    "Community-driven solutions", 
    "Practical skills for real opportunities", 
    "Safe spaces for learning and growth",
    "Supportive mentorship and guidance",
    "Empowering women to thrive"
  ];

  // Animation variants
  const fadeInRight = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, delay: 0.2 } }
  };

  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.1 * i, duration: 0.5 }
    })
  };

  // Image box animation variants
  const mainImageVariant = {
    hidden: { 
      opacity: 0, 
      scale: 0.8, 
      rotate: -5,
      x: -30
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      rotate: 0,
      x: 0,
      transition: { 
        duration: 0.8, 
        ease: "easeOut" as const,
        delay: 0.2
      } 
    }
  };

  const smallImageVariant = {
    hidden: { 
      opacity: 0, 
      scale: 0.8, 
      rotate: 5,
      y: 50,
      x: 30
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      rotate: 0,
      y: 0,
      x: 0,
      transition: { 
        duration: 0.8, 
        ease: "easeOut" as const,
        delay: 0.5
      } 
    }
  };

  // Floating animation for continuous effect
  const floatingAnimation = {
    y: [0, -15, 0] as [number, number, number],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32 mt-20 md:mt-28 overflow-hidden">
      <div className="flex flex-col lg:flex-row items-center gap-12 md:gap-20 lg:gap-24">
        
        {/* Left Side: Images Overlay with Scroll Animation */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInRight}
          animate={floatingAnimation}
          className="relative w-full lg:w-1/2 h-[450px] md:h-[550px] lg:h-[600px]"
        >
          {/* Main Large Image */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={mainImageVariant}
            whileHover={{ 
              scale: 1.05, 
              rotate: 2,
              transition: { duration: 0.3 }
            }}
            className="absolute top-0 left-0 w-4/5 h-4/5 overflow-hidden rounded-[2rem] shadow-xl cursor-pointer"
          >
            <motion.img 
              src="../../public/welcome.jpg" 
              className="w-full h-full object-cover"
              alt="Women training group"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.4 }}
            />
          </motion.div>
          
          {/* Smaller Overlapping Image */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={smallImageVariant}
            whileHover={{ 
              scale: 1.08, 
              rotate: -2,
              zIndex: 20,
              transition: { duration: 0.3 }
            }}
            className="absolute bottom-0 right-0 w-3/5 h-3/5 overflow-hidden rounded-[2rem] border-[10px] border-white shadow-2xl z-10 cursor-pointer"
          >
            <motion.img 
              src="../../public/dumar.jpg" 
              className="w-full h-full object-cover"
              alt="Woman smiling"
              whileHover={{ scale: 1.15 }}
              transition={{ duration: 0.4 }}
            />
          </motion.div>
          
          {/* Decorative Orange Shape with Animation */}
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 0.6, scale: 1 }}
            viewport={{ once: true }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.6, 0.8, 0.6]
            }}
            transition={{
              delay: 0.8,
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut" as const
            }}
            className="absolute -z-10 -bottom-4 -left-4 w-24 h-24 bg-orange-100 rounded-full blur-2xl"
          ></motion.div>
        </motion.div>

        {/* Right Side: Content */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInLeft}
          className="w-full lg:w-1/2 space-y-10 md:space-y-12"
        >
          <div className="space-y-6 md:space-y-8">
            <motion.h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-[1.15]">
              Welcome To Somaliland <br className="hidden md:block" /> 
              <span className="text-orange-500">Women's Resource Centre !</span>
            </motion.h2>
            <motion.p className="text-gray-600 text-base md:text-lg leading-relaxed pr-4">
              Equipping women to achieve purpose, fulfillment, and financial stability through meaningful employment and skills training.
            </motion.p>
          </div>

          {/* Features Grid with Staggered Animation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={itemVariant}
                whileHover={{ scale: 1.03, backgroundColor: "#fff" }}
                className="flex items-center gap-3 bg-gray-50/80 p-4 md:p-5 rounded-xl border border-gray-100 shadow-sm transition-all duration-300 cursor-default"
              >
                <div className="bg-orange-500 rounded-full p-1.5 flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm md:text-base font-semibold text-gray-700">{feature}</span>
              </motion.div>
            ))}
          </div>

          {/* Action Button */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="pt-6 md:pt-8"
          >
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(249, 115, 22, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-orange-500 text-white px-10 py-4 md:px-12 md:py-5 rounded-lg font-bold text-lg shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all duration-300"
            >
              Read more
            </motion.button>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default WelcomeSection;
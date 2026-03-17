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
          Our Programs
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
        <Link to="/program-detail">
        <ProgramCard 
          icon={Users} 
          title="Women Mentoring Women Program" 
          desc="This program supports university graduate girls by enhancing their life skills, leadership capacity, and professional readiness as they transition into the workforce."
          index={0}
        />
        </Link>
        <ProgramCard 
          icon={GraduationCap} 
          title="Internships/Job Opportunities" 
          desc="SWRC offers internships designed to build skills, enhance resumes, and provide practical workplace experience."
          index={1}
        />
        <ProgramCard 
          icon={Lightbulb} 
          title="Climate Justice" 
          desc="SWRC’s Climate Justice programs focus on empowering women through leadership and active engagement in environmental action."
          index={2}
        />
      </motion.div>
    </section>
  );
};

export default Programs;


// Women Mentoring Women Program:
// This program supports university graduate girls by enhancing their life skills, leadership capacity, and professional readiness as they transition into the workforce. Through structured one-on-one mentoring, practical workshops, career guidance sessions, and extracurricular engagement, participants strengthen their communication, workplace competencies, and career direction.

// The program also facilitates job linkages and networking opportunities, connecting graduates to potential employers and internship placements. To date, the Centre has mentored over 400 graduates through our programs, with 205 securing jobs and internship opportunities.

// Girls Talk:
// By fostering peer-to-peer mentoring and leadership development among middle and high school girls, Girls Talk empowers participants to become confident leaders and advocates in their communities. Through practical experiences and leadership skills training, girls are inspired to take initiative, build self-confidence, and emerge as change makers.

// Women to Women Talk:
// This program showcases the stories of women who have overcome challenges to achieve success, particularly in their careers. Women who have secured jobs and advanced to higher positions share their journeys, providing practical insights and inspiration to younger generations. By hearing how these role models navigated their paths to employment and professional growth, participants are motivated to pursue their own goals, build confidence, and take active steps toward career success.

// Internships/Job Opportunities:
// SWRC offers internships designed to build skills, enhance resumes, and provide practical workplace experience. Partner companies also offer employment opportunities, enabling girls to gain hands-on experience, develop professional competencies, and prepare for successful careers.

// Scholarships:
// SWRC provides annual scholarships to support high school graduates in pursuing further education. Through information sessions, participants learn about the application process, eligibility criteria, and how to prepare strong applications. These scholarships aim to empower girls to pursue their educational goals and build skills for future leadership.

// Know Your Rights Program
// The Know Your Rights program empowers women by providing comprehensive legal education and advocacy training. Through interactive workshops, participants gain a clear understanding of their rights, learn how to navigate legal systems, and develop the confidence to advocate for themselves. This program equips women to stand against violence, protect their interests, and take control of their personal and social well-being.

// Gender-Based Violence (GBV) Awareness & Prevention
// SWRC implements comprehensive programs to address and prevent gender-based violence. These initiatives combine community awareness campaigns, legal support, and counseling for survivors of workplace harassment and domestic violence. The programs actively engage communities, including men in rural areas and IDP camps, to promote understanding and prevention of GBV and early marriage. Additionally, SWRC partners with other organizations to strengthen prevention efforts and organizes advocacy activities, such as campaigns during the 16 Days of Activism Against GBV, to mobilize women and youth as active participants in creating safer communities.

// Climate Justice
// SWRC’s Climate Justice programs focus on empowering women through leadership and active engagement in environmental action. Women leaders are supported to participate in climate policy advocacy, while young women receive training in sustainable practices, equipping them to drive positive change in their communities.


// MY NAME IS
// MAWAHIB
// After successfully graduating from the Employability Skills Training program organized by the Somaliland Women's Resource Center, Mawahib had this to say about her experience:
// In 2024, I embarked on a transformative journey that significantly shaped my personal and professional growth.
// Through the Employability Skills Training program, I gained invaluable knowledge and skills that have opened doors to numerous opportunities.
// I actively participated in various awareness activities, training sessions, and workshops, which not only broadened my understanding but also empowered me to contribute meaningfully to my community. These experiences enhanced my confidence, leadership, and decision-making skills, allowing me to navigate challenges with determination.
// I am incredibly thankful to the Somaliland Women's Resource Centre for organizing this life-changing program. The guidance and support provided through this initiative have enabled me to achieve my goals and prepare for a brighter future.
// Thanks to this program, I am now more equipped, optimistic, and ready to seize opportunities and make a positive impact



// MY NAME IS
// HANNA
// After successfully completing multiple training programs at the Somaliland Women's Resource Centre, I would like to share my experience:
// In 2024, I embarked on a transformative journey that significantly enhanced my professional and personal growth.
// Through various training sessions, including Lawyer Training, Employment Training, and KG Teacher Training, I gained invaluable knowledge and skills that have opened doors to new opportunities.
// I actively participated in these sessions, broadening my understanding and strengthening my ability to contribute meaningfully to my community. These experiences have improved my confidence, leadership, and decision-making skills, allowing me to navigate challenges with resilience and determination.
// I am incredibly grateful to the Somaliland Women's Resource Centre for organizing these impactful programs. The guidance and support provided through these initiatives have empowered me to pursue my goals and prepare for a brighter future.
// Thanks to these training programs, I am now more equipped, optimistic, and ready to seize new opportunities and make e positive impact in my field.


// MY NAME IS
// NASRA
// The Somaliland Women Resource Centre (SWRC) provided me with a mentorship course where I gained valuable skills, including how to write CVs and reports.
// Through this course, I was also offered an internship with the Ministry of Health and Development.
// Additionally, I was able to build connections that helped me secure a job. The first workshop SWRC sent me to was a significant opportunity that ultimately led to my first job. Currently, I work as an SGBV counselor WAAPO organisation at the Berbera Reception Center.


// MY NAME IS
// HODO HASSAN
// The Somaliland Women Resource Center has played a crucial role in advancing my legal career by providing me with consecutive training opportunities. These programs have enhanced my legal knowledge, skills, and professional development, empowering me to contribute effectively to the legal field. I am grateful for their support in strengthening my expertise and expanding my career prospects


// MY NAME IS
// FIHIIMA ABDIRAHMAN
// After successfully completing the Employability Skills Training program, here is what Fihiima had to say about the experience:
// I am Fihiima Abdirahman Ahmed,
// a resilient and ambitious individual who, in 2024, took significant steps toward personal and professional growth.
// During that year, I participated in various training sessions, workshops, and seminars that equipped me with invaluable skills and knowledge.
// I also focused on building my organic soap business, where I applied the lessons learned from the training to enhance my marketing strategies and customer satisfaction. These efforts led to remarkable improvements in my entrepreneurial journey and personal development.
// I am deeply grateful to the Somaliland Women's Resource Centre team for their exceptional support and the opportunities she created through the Employability Skills Training program. Their effort helped me achieve my goals and improve skills.
// Thanks to this program, I am now confident, skilled, and ready to face future challenges with determination and optimism.


// MY NAME IS
// MUNA
// I am honoured to have graduated from the employability training program by the Somaliland Women's Resource Centre. This experience equipped me with essential job-hunting skills, from crafting a strong CV to mastering interviews and networking.
// The focus on workplace ethics professionalism, punctuality, teamwork, and lifelong learning was especially valuable.
// I am grateful to SWRC for this transformative opportunity, which has boosted my confidence and prepared me to excel in my career. I look forward to applying these lessons to make meaningful contributions to my workplace and community.
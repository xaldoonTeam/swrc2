import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Award, TrendingUp, Users, Handshake } from 'lucide-react';
import { CoreValueCard, TeamMember} from '../components/CoreValueCard';

const DEFAULT_HERO = "Empowering Women Through Education, Skills, And Opportunity.";
const DEFAULT_ABOUT = "Founded in 2021, The Somaliland Women Resource Centre (SWRC) is a women-led initiative dedicated to bridging the gap between education and meaningful employment. We provide a safe, inclusive space for young women and girls to gain the practical skills, mentorship, and confidence needed to become leaders and change-makers in their communities.";
const DEFAULT_VISION = "A Somaliland where every woman and girl is empowered to reach her full potential in a safe, equitable society, with equal access to education, employment, and leadership.";
const DEFAULT_MISSION = "To empower young women and girls through education, mentorship, and skills development, providing pathways to dignified employment and leadership while fostering community resilience and gender equality.";

const AboutPage: React.FC = () => {
  const [hero, setHero] = useState(DEFAULT_HERO);
  const [aboutText, setAboutText] = useState(DEFAULT_ABOUT);
  const [vision, setVision] = useState(DEFAULT_VISION);
  const [mission, setMission] = useState(DEFAULT_MISSION);

  useEffect(() => {
    import('../Api/client').then(({ settings }) => {
      settings.get().then((s) => {
        if (s.about_hero) setHero(s.about_hero);
        if (s.about_swrc_text) setAboutText(s.about_swrc_text);
        if (s.about_vision) setVision(s.about_vision);
        if (s.about_mission) setMission(s.about_mission);
      }).catch(() => {});
    });
  }, []);

  const values = [
    {
      title: "Collaboration",
      desc: "We believe in working together to achieve our goals.",
      icon: <Handshake className="text-orange-500" size={24} />
    },
    {
      title: "Growth",
      desc: "We believe in growing together to achieve our goals.",
      icon: <TrendingUp className="text-orange-500" size={24} />
    },
    {
      title: "Respect",
      desc: "We believe in respecting each other to achieve our goals.",
      icon: <Users className="text-orange-500" size={24} />
    }
  ];

  const impactStats = [
    {
      title: "1,500+ Women Trained:",
      desc: "Empowered through both online and in-person programs across Somaliland.",
      icon: <Users className="text-orange-500" size={24} />
    },
    {
      title: "Holistic Growth:",
      desc: "Combining professional skill-building with rights awareness and leadership development.",
      icon: <TrendingUp className="text-orange-500" size={24} />
    },
    {
      title: "Proven Results:",
      desc: "Successfully transitioning graduates into jobs, internships, and entrepreneurship.",
      icon: <Award className="text-orange-500" size={24} />
    },
    {
      title: "Strategic Partners:",
      desc: "Collaborating with Government, Civil Society, and International Agencies.",
      icon: <Handshake className="text-orange-500" size={24} />
    }
  ];
  const team = [
    { name: "Lucky Kassim", role: "Founder", image: "/lac.jpg" },
    { name: "Farah Carab", role: "Admin & Finance Manager", image: "/farah.jpg" },
    { name: "nimco cali", role: "Communication officer", image: "https://i.pravatar.cc/150?u=nasteho" },
    { name: "Isra hassan", role: "Finance Officer", image: "https://i.pravatar.cc/150?u=isra" },
    { name: "Idil Abdirashid", role: "Logistics & procurement", image: "https://i.pravatar.cc/150?u=idil" },
    { name: "Samsam Abdi", role: "HR Officer", image: "https://i.pravatar.cc/150?u=jake" }
  ];

  return (
    <div className="w-full bg-white">
      {/* Breadcrumb Navigation */}
      <div className="px-6 md:px-12 py-4 text-sm text-gray-600 border-b">
        <span className="hover:text-orange-500 cursor-pointer">Home</span> 
        <span className="mx-2">›</span> 
        <span className="font-bold text-gray-900">About us</span>
      </div>

      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden">
        <img 
          src="/public/about.jpg" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Empowerment background"
        />
        <div className="absolute inset-0 bg-black/60"></div>
        <motion.h1 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative z-10 text-white text-3xl md:text-5xl lg:text-6xl font-bold text-center px-6 max-w-4xl leading-tight"
        >
          {hero}
        </motion.h1>
      </section>

      {/* About SWRC & Impact Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 grid lg:grid-cols-2 gap-16 items-start">
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div>
            <h2 className="text-3xl font-bold text-orange-500 mb-6">About SWRC</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              {aboutText}
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-orange-600 italic">Our Impact At A Glance</h3>
            <div className="space-y-6">
              {impactStats.map((stat, index) => (
                <div key={index} className="flex gap-4 items-start group">
                  <div className="mt-1 bg-orange-50 p-2 rounded-lg group-hover:bg-orange-500 group-hover:text-white transition-colors">
                    {stat.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{stat.title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{stat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
          <img 
            src="/hero.jpg" 
            className="w-full h-full rounded-2xl shadow-2xl object-cover min-h-[500px]"
            alt="SWRC Community"
          />
        </motion.div>
      </section>

      {/* Vision & Mission Cards */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-10">
        <div className="grid md:grid-cols-2 gap-8 border-2 border-orange-400 rounded-3xl p-8 md:p-12 shadow-lg bg-orange-50/30">
          
          {/* Vision */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="flex flex-col items-center text-center space-y-4"
          >
            <div className="bg-orange-100 p-4 rounded-2xl">
              <Eye className="text-orange-500" size={40} />
            </div>
            <h3 className="text-3xl font-bold text-orange-600">Our Vision</h3>
            <p className="text-gray-700 leading-relaxed max-w-sm">
              {vision}
            </p>
          </motion.div>

          {/* Mission */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="flex flex-col items-center text-center space-y-4"
          >
            <div className="bg-orange-100 p-4 rounded-2xl">
              <Target className="text-orange-500" size={40} />
            </div>
            <h3 className="text-3xl font-bold text-orange-600">Our Mission</h3>
            <p className="text-gray-700 leading-relaxed max-w-sm">
              {mission}
            </p>
          </motion.div>

        </div>
      </section>
      <div className="space-y-24">
      
      {/* 1. Core Values Section */}
      <section className="bg-[#FAF7F2] py-20 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 max-w-3xl mx-auto">
              Our Core Values: Empowering Innovation Through Collaboration, Growth, and Respect
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((v, i) => <CoreValueCard key={i} {...v} />)}
          </div>
        </div>
      </section>

      {/* 2. Team Section */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="text-center mb-16 space-y-4">
          <span className="bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded uppercase tracking-widest">
            Our Team
          </span>
          <h2 className="text-4xl font-bold text-gray-900">The People Behind the Work</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            We believe in collaboration, clear communication, and delivering results. Get to know the people who make it all happen.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((m, i) => <TeamMember key={i} {...m} />)}
        </div>
      </section>

      {/* 3. Bottom Campaign Bar */}
      <section className="bg-orange-500 py-12 px-6 text-center text-white">
        <h3 className="text-xl md:text-2xl font-medium max-w-4xl mx-auto leading-relaxed">
          every woman is the why — and when she rises, families and communities rise with her. 
          Be part of our bold $100K in 100 Days campaign.
        </h3>
      </section>
    </div>
    </div>
  );
};

export default AboutPage;
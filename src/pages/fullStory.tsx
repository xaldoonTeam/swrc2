import React, { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  ArrowLeft, Heart, Share2, Bookmark, Calendar, MapPin, 
  Award, Users, BookOpen, ChevronDown, Quote, Sparkles,
  GraduationCap, Target, ArrowRight
} from "lucide-react";

const FullStoryPage: React.FC = () => {
  const [isSaved, setIsSaved] = useState(false);
//   const [activeQuote, setActiveQuote] = useState(false);
  const { scrollYProgress } = useScroll();
  
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const story = {
    name: "Hanna",
    title: "SWRC Graduate & Program Alumna",
    location: "Somaliland",
    year: "2024",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&h=1000&fit=crop",
    heroImage: "hanna.jpg",
    
    programs: [
      "Lawyer Training",
      "Employment Training", 
      "KG Teacher Training"
    ],
    
    quote: "The support and guidance I received empowered me to pursue my goals and prepare for a brighter future.",
    
    story: [
      {
        type: "intro",
        content: "After successfully completing multiple training programs at the Somaliland Women's Resource Centre, I would like to share my experience."
      },
      {
        type: "journey",
        title: "A Transformative Journey",
        content: "In 2024, I embarked on a transformative journey that significantly enhanced both my professional and personal growth. Through programs such as Lawyer Training, Employment Training, and KG Teacher Training, I gained valuable knowledge and practical skills that opened new opportunities for me."
      },
      {
        type: "participation",
        title: "Active Engagement",
        content: "I actively participated in each session, expanding my understanding and strengthening my ability to contribute meaningfully to my community. These experiences improved my confidence, leadership, and decision-making skills, enabling me to face challenges with resilience."
      },
      {
        type: "gratitude",
        title: "Heartfelt Gratitude",
        content: "I am truly grateful to the Somaliland Women's Resource Centre for organizing these impactful programs. The support and guidance I received empowered me to pursue my goals and prepare for a brighter future."
      },
      {
        type: "today",
        title: "Today",
        content: "Today, I feel more confident, capable, and ready to make a positive impact."
      }
    ],
    
    impact: [
      { icon: <GraduationCap size={20} />, label: "3 Programs Completed", value: "Lawyer, Employment, KG Teacher" },
      { icon: <Target size={20} />, label: "Skills Gained", value: "Leadership, Decision-making, Resilience" },
      { icon: <Users size={20} />, label: "Community Impact", value: "Actively contributing" }
    ],
    
    memories: [
      "hanna.jpg",
      "dumar.jpg",
      "img4.jpg"
    ]
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 z-50"
        style={{ width: progressWidth }}
      />

      {/* Navigation */}
      <nav className="fixed top-4 left-4 right-4 z-40 flex items-center justify-between">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-amber-600 hover:text-white transition-colors"
          onClick={() => window.history.back()}
        >
          <ArrowLeft size={18} />
        </motion.button>

        <div className="flex items-center gap-2">
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            onClick={() => setIsSaved(!isSaved)}
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-amber-600 hover:text-white transition-colors"
          >
            <Bookmark size={16} className={isSaved ? "fill-current" : ""} />
          </motion.button>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-amber-600 hover:text-white transition-colors"
          >
            <Share2 size={16} />
          </motion.button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <motion.div 
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        >
          <img 
            src={story.heroImage}
            alt="Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </motion.div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 text-white p-8 md:p-16 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-2 bg-amber-500/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6"
            >
              <Sparkles size={14} className="text-amber-300" />
              <span className="text-xs font-medium text-amber-200 uppercase tracking-wider">
                Alumni Story
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-6xl md:text-8xl font-bold mb-4"
            >
              My name is <span className="text-amber-400">{story.name}</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl text-white/80 max-w-2xl mb-6"
            >
              A journey of growth, learning, and empowerment at the Somaliland Women's Resource Centre
            </motion.p>

            {/* Meta Info */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap items-center gap-6 text-sm text-white/60"
            >
              <span className="flex items-center gap-2">
                <MapPin size={16} />
                {story.location}
              </span>
              <span className="flex items-center gap-2">
                <Calendar size={16} />
                Class of {story.year}
              </span>
              <span className="flex items-center gap-2">
                <Award size={16} />
                3 Programs Completed
              </span>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div 
              className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <span className="text-xs uppercase tracking-wider text-white/40">Read her story</span>
              <ChevronDown size={16} className="text-white/40" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-20">
        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 md:p-12 mb-16"
        >
          <Quote size={48} className="text-amber-300/30 absolute top-6 right-6" />
          <p className="text-xl md:text-2xl text-amber-900 font-light italic leading-relaxed">
            "{story.quote}"
          </p>
          <div className="mt-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center">
              <span className="text-amber-700 font-semibold text-sm">H</span>
            </div>
            <span className="text-amber-700 font-medium">— Hanna</span>
          </div>
        </motion.div>

        {/* Story Sections */}
        <div className="space-y-16">
          {story.story.map((section, index) => (
            <motion.section
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="prose prose-lg max-w-none"
            >
              {section.title && (
                <h2 className="text-3xl font-light text-slate-800 mb-6">
                  {section.title}
                </h2>
              )}
              <p className="text-slate-600 leading-relaxed text-lg">
                {section.content}
              </p>
            </motion.section>
          ))}
        </div>

        {/* Programs Completed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-16 bg-slate-50 rounded-3xl p-8"
        >
          <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <BookOpen size={20} className="text-amber-500" />
            Programs Completed
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {story.programs.map((program, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -2 }}
                className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
              >
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mb-3">
                  <span className="text-amber-600 font-semibold text-sm">{index + 1}</span>
                </div>
                <h4 className="font-medium text-slate-800">{program}</h4>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Impact Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {story.impact.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -3 }}
              className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm"
            >
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mb-4 text-amber-600">
                {item.icon}
              </div>
              <div className="text-sm text-slate-500 mb-1">{item.label}</div>
              <div className="font-semibold text-slate-800">{item.value}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Memory Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-16"
        >
          <h3 className="text-xl font-semibold text-slate-800 mb-6">Moments from the journey</h3>
          <div className="grid grid-cols-3 gap-4">
            {story.memories.map((memory, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="aspect-square rounded-xl overflow-hidden cursor-pointer"
              >
                <img 
                  src={memory}
                  alt={`Memory ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Closing Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-16 text-center p-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl text-white"
        >
          <Sparkles size={32} className="mx-auto mb-4 text-amber-200" />
          <p className="text-2xl font-light italic mb-4">
            "Today, I feel more confident, capable, and ready to make a positive impact."
          </p>
          <p className="text-amber-100">— Hanna, Class of 2024</p>
        </motion.div>

        {/* Engagement */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-12 flex items-center justify-center gap-8 pt-6 border-t border-slate-100"
        >
          <button className="flex items-center gap-2 text-slate-400 hover:text-amber-600 transition-colors">
            <Heart size={18} />
            <span className="text-sm">128</span>
          </button>
          <button className="flex items-center gap-2 text-slate-400 hover:text-amber-600 transition-colors">
            <Share2 size={18} />
            <span className="text-sm">Share</span>
          </button>
        </motion.div>
      </main>

      {/* Related Stories */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-light text-slate-800 mb-12 text-center">
            More <span className="font-semibold">Inspiring Stories</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <motion.a
                key={i}
                href="#"
                whileHover={{ y: -5 }}
                className="group block"
              >
                <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                    <span className="text-amber-600 font-bold text-xl">S</span>
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2 group-hover:text-amber-600 transition-colors">
                    Another Alumna Story
                  </h3>
                  <p className="text-sm text-slate-400 mb-4">
                    Read more inspiring journeys from SWRC graduates
                  </p>
                  <div className="flex items-center gap-2 text-amber-600 text-sm font-medium">
                    Read story <ArrowRight size={14} />
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-light mb-6">
            Share <span className="font-semibold text-amber-400">Your Story</span>
          </h2>
          <p className="text-white/60 text-lg mb-8">
            Are you an SWRC graduate? We'd love to hear about your journey and feature your story.
          </p>
          <button className="inline-flex items-center gap-2 bg-amber-500 text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-amber-600 transition-colors">
            Get in touch
            <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
};

export default FullStoryPage;
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, ArrowUpRight, Play, Pause } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanding } from "../content/LandingContext";
import { landingImage } from "../content/landing";

const AlumniStories: React.FC = () => {
  const { alumni } = useLanding();
  const stories = alumni.stories;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [direction, setDirection] = useState(0);

  const nextStory = () => {
    if (stories.length === 0) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % stories.length);
  };

  const prevStory = () => {
    if (stories.length === 0) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  const currentStory = stories[currentIndex] ?? stories[0];

  React.useEffect(() => {
    if (currentIndex >= stories.length) setCurrentIndex(0);
  }, [currentIndex, stories.length]);

  // Auto-play
  React.useEffect(() => {
    if (!isPlaying || stories.length === 0) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % stories.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPlaying, currentIndex, stories.length]);

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full mb-6"
          >
            <span className="w-2 h-2 bg-orange-600 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-orange-600 uppercase tracking-wider">
              {alumni.badge}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-light text-slate-900 mb-4"
          >
            {alumni.headingPrefix} <span className="font-bold bg-gradient-to-r from-orange-600 to-purple-900 bg-clip-text text-transparent">{alumni.headingHighlight}</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-lg max-w-2xl mx-auto"
          >
            {alumni.description}
          </motion.p>
        </div>

        {/* Main Story Card */}
        {currentStory && <div className="relative max-w-6xl mx-auto">
          {/* Navigation Buttons */}
          <button
            onClick={prevStory}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all duration-300 group"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>
          
          <button
            onClick={nextStory}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all duration-300 group"
          >
            <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Auto-play toggle */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-orange-600 transition-colors"
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>

          {/* Story Card */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              initial={{ opacity: 0, x: direction * 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -300 }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              className="relative bg-white rounded-lg shadow-2xl overflow-hidden"
            >
              <div className="grid md:grid-cols-2 gap-0">
                {/* Image Side */}
                <div className="relative h-[400px] md:h-[600px] overflow-hidden">
                  <motion.img
                    src={landingImage(currentStory.image)}
                    alt={currentStory.name}
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6 }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${currentStory.color} opacity-60 mix-blend-multiply`} />
                  
                  {/* Decorative elements */}
                  <div className="absolute top-6 left-6">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Quote size={20} className="text-white" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Achievement badge */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-white/20 backdrop-blur-sm rounded p-4 border border-white/30">
                      <p className="text-black/80 text-xs font-semibold uppercase tracking-wider mb-1">
                        {alumni.roleLabel}
                      </p>
                      <p className="text-white font-semibold text-lg">
                        {currentStory.achievement}
                      </p>
                      <p className="text-white/60 text-sm">
                        {currentStory.location}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content Side */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  {/* Name and title */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span className="text-xs font-medium text-orange-600 uppercase tracking-wider mb-2 block">
                      {alumni.storyLabel}
                    </span>
                    <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
                      {currentStory.name}
                    </h3>
                    <p className="text-slate-500 text-lg mb-6">
                      {currentStory.title}
                    </p>
                  </motion.div>

                  {currentStory.quote && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-6"
                  >
                    <Quote size={24} className="text-orange-600 mb-2" />
                    <p className="text-slate-700 text-lg italic leading-relaxed">
                      "{currentStory.quote}"
                    </p>
                  </motion.div>
                  )}

                  {/* Story */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-slate-500 mb-8 leading-relaxed"
                  >
                    {currentStory.story}
                  </motion.p>

                  {/* CTA Button */}
                  <Link to={alumni.ctaLink}>
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="group inline-flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700 transition-colors w-fit"
                  >
                    {alumni.ctaText}
                    <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </motion.button>
                  </Link>

                  {/* Progress indicators */}
                  <div className="mt-12 flex items-center gap-3">
                    {stories.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setDirection(index > currentIndex ? 1 : -1);
                          setCurrentIndex(index);
                        }}
                        className={`h-1 rounded-full transition-all duration-300 ${
                          index === currentIndex 
                            ? `w-12 bg-gradient-to-r ${currentStory.color}` 
                            : 'w-4 bg-slate-200 hover:bg-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>}

        {/* Stats section */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-20">
          {alumni.stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AlumniStories;
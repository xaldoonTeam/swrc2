import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const ProgramDetailPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Breadcrumb Navigation */}
      <nav className="px-6 md:px-12 py-4 text-xs md:text-sm text-gray-600 border-b">
        <div className="flex items-center gap-2">
          <span className="hover:text-orange-500 cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span className="hover:text-orange-500 cursor-pointer">Programs</span>
          <ChevronRight size={14} />
          <span className="font-bold text-gray-900">Mentorship</span>
        </div>
      </nav>

      {/* Main Hero Image with Title Overlay */}
      <section className="relative h-[320px] sm:h-[400px] md:h-[520px] lg:h-[600px] overflow-hidden">
        <motion.img
          src="/img3.jpg"
          className="absolute inset-0 w-full h-full object-cover object-center"
          alt="Program Header"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
        <div className="absolute inset-0 bg-black/40 flex items-center px-6 md:px-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white text-3xl md:text-5xl lg:text-6xl font-bold max-w-3xl leading-tight"
          >
            Women For Climate Justice: Lessons From The Nairobi Climate Summer School
          </motion.h1>
        </div>
      </section>

      {/* Content Section */}
      <article className="max-w-7xl mx-auto px-6 md:px-12 py-16 space-y-12">
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Entrepreneurship Session
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed text-justify">
            The <span className="font-semibold text-orange-600 underline">Somaliland Women's Resource Centre</span> Recently Hosted An Entrepreneurship Session For Cohort 4 Of Our Mentorship And Coaching Program. Participants Explored Business Ideas, Learned How To Plan And Manage A Startup, And Practiced Key Entrepreneurial Skills — Building Confidence And Preparing To Become Future Leaders In Their Communities.
          </p>
        </div>

        {/* Dynamic Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[480px] md:min-h-[560px] lg:min-h-[640px]">
          {/* Left Side: Two Stacked Images */}
          <div className="flex flex-col gap-4 md:gap-6 min-h-[360px] md:h-full">
            <motion.div
              className="flex-1 min-h-[200px] md:min-h-0 overflow-hidden rounded-xl shadow-md"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <motion.img
                src="/img4.jpg"
                className="w-full h-full object-cover object-center"
                alt="Session Activity 1"
                whileHover={{ scale: 1.06 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              />
            </motion.div>
            <motion.div
              className="flex-1 min-h-[200px] md:min-h-0 overflow-hidden rounded-xl shadow-md"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.08 }}
            >
              <motion.img
                src="/img3.jpg"
                className="w-full h-full object-cover object-center"
                alt="Session Activity 2"
                whileHover={{ scale: 1.06 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              />
            </motion.div>
          </div>

          {/* Right Side: One Large Vertical Image */}
          <motion.div
            className="min-h-[280px] md:min-h-[560px] lg:min-h-[640px] overflow-hidden rounded-xl shadow-md"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.04 }}
          >
            <motion.img
              src="/img2.jpg"
              className="w-full h-full object-cover object-center"
              alt="Group Session Large"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            />
          </motion.div>
        </div>

        {/* Bottom Wide Image */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full h-[260px] sm:h-[340px] md:h-[440px] lg:h-[500px] overflow-hidden rounded-xl shadow-lg"
        >
          <motion.img
            src="/img7.jpg"
            className="w-full h-full object-cover object-center"
            alt="Graduation/Closing Ceremony"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </motion.div>
      </article>

      {/* Call to Action Bar */}
      <section className="bg-orange-500 py-10 px-6 mt-10">
        <div className="max-w-4xl mx-auto text-center text-white space-y-4">
          <h3 className="text-2xl font-bold italic">Want to join our next cohort?</h3>
          <button className="bg-white text-orange-500 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition shadow-lg">
            Register Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default ProgramDetailPage;

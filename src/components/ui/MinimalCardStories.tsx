// import React from "react";
// import { motion } from "framer-motion";
// import { ArrowRight } from "lucide-react";

// const STORIES = [
//   {
//     id: 1,
//     title: "Designing for scale",
//     description: "How we built a component library that 10x'd our team's velocity",
//     image: "https://images.unsplash.com/photo-1555421689-491a97ff2040?q=80&w=800&h=600&fit=crop",
//     link: "#"
//   },
//   {
//     id: 2,
//     title: "The remote culture playbook",
//     description: "Lessons from 5 years of distributed work",
//     image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=800&h=600&fit=crop",
//     link: "#"
//   },
//   {
//     id: 3,
//     title: "Accessibility beyond compliance",
//     description: "Why inclusive design is good for business",
//     image: "https://images.unsplash.com/photo-1573496358773-56f2f909d6dar?q=80&w=800&h=600&fit=crop",
//     link: "#"
//   }
// ];

// const StoriesMinimal: React.FC = () => {
//   return (
//     <section className="py-32 bg-white">
//       <div className="max-w-7xl mx-auto px-6">
//         {/* Simple header */}
//         <div className="mb-20">
//           <span className="text-xs uppercase tracking-[0.2em] text-slate-300 mb-3 block">
//             Read
//           </span>
//           <h2 className="text-5xl md:text-7xl font-light text-slate-900">
//             Stories
//           </h2>
//         </div>

//         {/* Stories list */}
//         <div className="space-y-8">
//           {STORIES.map((story, index) => (
//             <motion.a
//               key={story.id}
//               href={story.link}
//               initial={{ opacity: 0, y: 10 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ delay: index * 0.1 }}
//               className="group flex items-center gap-8 py-6 border-b border-slate-100 last:border-0 hover:border-indigo-200 transition-colors"
//             >
//               {/* Number */}
//               <span className="text-3xl font-light text-slate-200 w-12">
//                 {(index + 1).toString().padStart(2, '0')}
//               </span>
              
//               {/* Content */}
//               <div className="flex-1">
//                 <h3 className="text-2xl font-medium text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
//                   {story.title}
//                 </h3>
//                 <p className="text-slate-400 text-sm max-w-2xl">
//                   {story.description}
//                 </p>
//               </div>

//               {/* Arrow */}
//               <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
//             </motion.a>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default StoriesMinimal;

import React from "react";
import { motion } from "framer-motion";
import { Quote, ArrowRight } from "lucide-react";

const ALUMNI = [
  {
    name: "Muna",
    story: "SWRC graduate gained essential job-hunting skills, from building a strong CV to mastering interviews.",
    role: "Marketing Coordinator",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=200&h=200&fit=crop"
  },
  {
    name: "Ahmed",
    story: "From coding beginner to software engineer in 8 months through our tech scholarship program.",
    role: "Software Engineer",
    image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=200&h=200&fit=crop"
  },
  {
    name: "Priya",
    story: "Broke into data science with mentorship and support from our Women in Tech initiative.",
    role: "Data Analyst",
    image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?q=80&w=200&h=200&fit=crop"
  }
];

const AlumniMinimal: React.FC = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.2em] text-indigo-600 font-medium">
            Alumni Stories
          </span>
          <h2 className="text-4xl md:text-5xl font-light text-slate-900 mt-4 mb-6">
            Meet Our <span className="font-bold">Alumni</span>
          </h2>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {ALUMNI.map((alumni, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-white rounded-3xl p-8 border border-slate-100 hover:border-indigo-100 hover:shadow-xl transition-all duration-300"
            >
              {/* Quote icon */}
              <Quote size={32} className="text-indigo-600 mb-4" />
              
              {/* Story */}
              <p className="text-slate-600 mb-6 leading-relaxed">
                "{alumni.story}"
              </p>
              
              {/* Author */}
              <div className="flex items-center gap-4">
                <img 
                  src={alumni.image} 
                  alt={alumni.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-slate-900">{alumni.name}</h4>
                  <p className="text-xs text-indigo-600">{alumni.role}</p>
                </div>
              </div>

              {/* Hover arrow */}
              <ArrowRight className="absolute bottom-8 right-8 w-5 h-5 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
            </motion.div>
          ))}
        </div>

        {/* View all link */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-indigo-600 transition-colors">
            View all alumni stories
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default AlumniMinimal;
import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock, Calendar } from "lucide-react";

const STORIES = [
  {
    id: 1,
    title: "How we built our design system from scratch",
    excerpt: "A deep dive into the process of creating a scalable design system that powers our entire product ecosystem.",
    image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=800&h=600&fit=crop",
    author: "Emily Rodriguez",
    authorAvatar: "https://i.pravatar.cc/150?img=6",
    date: "Mar 15, 2024",
    readTime: "8 min read",
    category: "Design"
  },
  {
    id: 2,
    title: "The future of remote work: Lessons from 3 years distributed",
    excerpt: "What we've learned about building culture and maintaining productivity with a fully remote team.",
    image: "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?q=80&w=800&h=600&fit=crop",
    author: "David Kim",
    authorAvatar: "https://i.pravatar.cc/150?img=7",
    date: "Mar 12, 2024",
    readTime: "6 min read",
    category: "Culture"
  },
  {
    id: 3,
    title: "Accessibility first: Redesigning for everyone",
    excerpt: "How we prioritized accessibility and why it made our product better for all users.",
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=800&h=600&fit=crop",
    author: "Sophia Williams",
    authorAvatar: "https://i.pravatar.cc/150?img=8",
    date: "Mar 10, 2024",
    readTime: "5 min read",
    category: "Accessibility"
  },
  {
    id: 4,
    title: "From 0 to 1M users: Our growth strategy",
    excerpt: "The tactics and experiments that helped us reach our first million users.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&h=600&fit=crop",
    author: "Marcus Chen",
    authorAvatar: "https://i.pravatar.cc/150?img=9",
    date: "Mar 5, 2024",
    readTime: "10 min read",
    category: "Growth"
  },
  {
    id: 5,
    title: "Engineering best practices we swear by",
    excerpt: "A look at the development practices that keep our codebase clean and our team happy.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&h=600&fit=crop",
    author: "Alex Thompson",
    authorAvatar: "https://i.pravatar.cc/150?img=10",
    date: "Mar 1, 2024",
    readTime: "7 min read",
    category: "Engineering"
  },
  {
    id: 6,
    title: "Customer stories: How Acme Corp saved 40%",
    excerpt: "Real results from real customers using our platform to transform their business.",
    image: "https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=800&h=600&fit=crop",
    author: "Jessica Lee",
    authorAvatar: "https://i.pravatar.cc/150?img=11",
    date: "Feb 25, 2024",
    readTime: "4 min read",
    category: "Customers"
  }
];

const StoriesGrid: React.FC = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-sm font-medium text-indigo-600 uppercase tracking-wider mb-4 block"
          >
            Our stories
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-light text-slate-900 mb-6"
          >
            Insights from the <span className="font-medium">front lines</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg"
          >
            Dive into our latest thinking on design, engineering, and company culture.
          </motion.p>
        </div>

        {/* Stories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {STORIES.map((story, index) => (
            <motion.article
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group cursor-pointer"
            >
              {/* Image */}
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-4 bg-slate-100">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Category tag */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-slate-700">
                    {story.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {story.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {story.readTime}
                  </span>
                </div>

                <h3 className="font-semibold text-slate-900 text-xl group-hover:text-indigo-600 transition-colors line-clamp-2">
                  {story.title}
                </h3>
                
                <p className="text-slate-400 text-sm line-clamp-2">
                  {story.excerpt}
                </p>

                {/* Author */}
                <div className="flex items-center justify-between pt-3">
                  <div className="flex items-center gap-2">
                    <img 
                      src={story.authorAvatar} 
                      alt={story.author}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-xs text-slate-500">{story.author}</span>
                  </div>
                  
                  <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* View all link */}
        <div className="text-center mt-16">
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full text-sm font-medium hover:bg-indigo-600 transition-colors group">
            View all stories
            <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default StoriesGrid;
import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, Clock } from "lucide-react";

const POSTS = [
  {
    id: 1,
    category: "Insights",
    title: "Empowering Women in the Digital Economy",
    excerpt: "How local tech initiatives are reshaping the professional landscape for women in Somaliland.",
    date: "Oct 12, 2023",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1573163231162-717df3f80ce4?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    category: "Community",
    title: "The Role of Micro-Grants in Small Business",
    excerpt: "Exploring the ripple effect of small-scale financial support on community development.",
    date: "Oct 08, 2023",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb773b09?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    category: "Policy",
    title: "Building Resilient Partner Networks",
    excerpt: "Key strategies for NGOs and government bodies to coordinate effective social programs.",
    date: "Sep 28, 2023",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800",
  },
];

const BlogSection: React.FC = () => {
  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-sm font-bold tracking-widest text-indigo-600 uppercase mb-3">
              Journal
            </h2>
            <h3 className="text-4xl md:text-5xl font-semibold text-[#1a1a1a] tracking-tight">
              Latest stories & <br /> perspectives.
            </h3>
          </div>
          <button className="group flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-indigo-600 transition-colors">
            View all articles
            <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {POSTS.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-gray-100 mb-6">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider text-gray-900 rounded-full shadow-sm">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {post.readTime}
                  </span>
                </div>
                
                <h4 className="text-xl font-bold text-gray-900 leading-snug group-hover:text-indigo-600 transition-colors">
                  {post.title}
                </h4>
                
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
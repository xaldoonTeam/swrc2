import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Quote, ArrowRight, Loader2 } from 'lucide-react';
import { stories as storiesApi, assetUrl, type Story } from '../Api/client';

const StoryCard = ({ name, image, role, category, story }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
    className="bg-white rounded-2xl p-6 flex flex-col h-full shadow-sm hover:shadow-xl transition-all duration-300 border border-orange-100 group"
  >
    <div className="flex items-start gap-4 mb-4">
      <img 
        src={image || 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80'} 
        className="w-16 h-16 rounded-full object-cover border-2 border-orange-400" 
        alt={name} 
      />
      <div>
        <h3 className="text-xl font-bold text-gray-900">{name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-orange-600 text-sm font-medium">{role}</span>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{category}</span>
        </div>
      </div>
    </div>
    
    <div className="flex-grow">
      <Quote className="w-6 h-6 text-orange-300 mb-2" />
      <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
        "{story}"
      </p>
    </div>
    
    <Link 
      to={`/stories/${name.toLowerCase().replace(/\s+/g, '-')}`}
      className="mt-6 flex items-center gap-2 text-orange-500 font-semibold text-sm group-hover:gap-3 transition-all w-fit"
    >
      Read Full Story <ArrowRight size={16} />
    </Link>
  </motion.div>
);

const FALLBACK_STORIES = [
  { name: "Muna", role: "SWRC Graduate", category: "Education", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80", story: "Muna gained essential job-hunting skills, from building a strong CV to mastering interviews." },
  { name: "Fihiima Abdirahman", role: "Entrepreneur", category: "Entrepreneurship", image: "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?auto=format&fit=crop&q=80", story: "After completing the Employability Skills Training Program, she secured a role at Royal Mendi House Hotel and started her own small business." },
  { name: "Hodan Ali", role: "Tech Professional", category: "Technology", image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80", story: "Through the Mentorship program, Hodan transitioned into a tech career in Hargeisa's growing digital sector." },
  { name: "Ayan Ahmed", role: "Business Owner", category: "Entrepreneurship", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80", story: "Ayan's organic soap business flourished after attending the Entrepreneurship Session." },
];

const StoriesPage: React.FC = () => {
  const [stories, setStories] = useState<{ name: string; role: string; category: string; image: string | null; story: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    storiesApi
      .list()
      .then((data: Story[]) => setStories(data.map((s) => ({ name: s.name, role: s.role, category: s.category, image: s.imageUrl ? assetUrl(s.imageUrl) : null, story: s.story }))))
      .catch(() => {
        setError('Could not load stories.');
        setStories(FALLBACK_STORIES);
      })
      .finally(() => setLoading(false));
  }, []);

  const displayList = loading ? [] : stories;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <section className="relative bg-gradient-to-br from-orange-500 to-orange-600 pt-24 pb-32 px-6 text-center text-white overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-4xl mx-auto space-y-6"
        >
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Inspiring Stories of Transformation
          </h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            Discover the journeys of resilient women who have transformed their lives through SWRC programs.
          </p>
        </motion.div>
      </section>

      {/* Stats Section */}
      {/* <section className="max-w-7xl mx-auto px-6 -mt-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 text-center shadow-lg"
            >
              <stat.icon className="w-8 h-8 text-orange-500 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section> */}

      {/* Featured Stories */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Success Stories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real stories from women who have overcome challenges and achieved their dreams with SWRC support.
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16 gap-2 text-gray-500">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading stories…</span>
          </div>
        )}
        {error && !loading && (
          <p className="text-amber-600 mb-4 text-center">Using sample data. Start the backend to load from the database.</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayList.map((story, index) => (
            <StoryCard key={story.name + index} {...story} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link 
            to="/stories/all"
            className="inline-flex items-center gap-2 text-orange-500 font-semibold hover:text-orange-600"
          >
            View All Stories <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Resource Links */}
      <section className="bg-orange-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Explore More Resources
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link 
              to="/reports"
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group"
            >
              <div className="text-orange-500 mb-4">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600">
                Annual Reports
              </h3>
              <p className="text-gray-600">
                Access our annual reports, impact assessments, and financial transparency documents.
              </p>
            </Link>

            <Link 
              to="/research"
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group"
            >
              <div className="text-orange-500 mb-4">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600">
                Research Studies
              </h3>
              <p className="text-gray-600">
                Explore our research papers on women's empowerment, gender equality, and economic development.
              </p>
            </Link>

            <Link 
              to="/media"
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group"
            >
              <div className="text-orange-500 mb-4">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600">
                Media & Videos
              </h3>
              <p className="text-gray-600">
                Watch documentaries, interviews, and video stories from our community.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Share Your Story CTA */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-12 text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Share Your Story</h2>
          <p className="text-orange-100 mb-8 max-w-2xl mx-auto">
            Are you an SWRC alumni? Your story could inspire other women to transform their lives.
          </p>
          <Link 
            to="/stories/share"
            className="bg-white text-orange-600 px-8 py-3 rounded-full font-bold hover:bg-orange-50 transition-colors inline-block"
          >
            Submit Your Story
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default StoriesPage;
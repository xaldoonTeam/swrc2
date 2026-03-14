import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Calendar, ArrowRight, Loader2 } from "lucide-react";
import { newsletters as newslettersApi, assetUrl, type Newsletter } from "../Api/client";

function formatDate(s: string) {
  try {
    return new Date(s).toLocaleDateString(undefined, { dateStyle: "long" });
  } catch {
    return s;
  }
}

const NewsletterCard = ({ n, index }: { n: Newsletter; index: number }) => (
  <motion.article
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, delay: index * 0.05 }}
    viewport={{ once: true, margin: "-20px" }}
    className="bg-white rounded overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group h-full flex flex-col"
  >
    <Link to={`/newsletters/${n.slug}`} className="flex flex-col h-full">
      <div className="aspect-[16/10] bg-orange-50 overflow-hidden">
        {n.imageUrl ? (
          <img
            src={assetUrl(n.imageUrl)}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Mail className="w-14 h-14 text-orange-200" />
          </div>
        )}
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 text-xs font-medium py-3 text-gray-500 mb-2">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formatDate(n.createdAt)}</span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors mb-1 line-clamp-2">
          {n.title}
        </h3>
        {n.summary && (
          <p className="text-gray-600 text-xs leading-relaxed line-clamp-2 mb-4 flex-1">
            {n.summary}
          </p>
        )}
        <span className="inline-flex items-center gap-1.5 text-orange-500 my-3 font-semibold text-sm">
          Read more <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </Link>
  </motion.article>
);

const NewsletterPage: React.FC = () => {
  const [list, setList] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    newslettersApi
      .list()
      .then(setList)
      .catch(() => {
        setError("Could not load newsletters.");
        setList([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero - compact */}
      <section className="bg-gradient-to-br from-orange-500 to-orange-600 pt-20 pb-16 px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center text-white"
        >
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-3">
            Newsletters
          </h1>
          <p className="text-white/90 text-base max-w-xl mx-auto">
            Stay updated with SWRC news, program highlights, and stories from our community.
          </p>
        </motion.div>
      </section>

      {/* Grid */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
            <p className="text-gray-500">Loading newsletters…</p>
          </div>
        )}
        {error && !loading && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center text-amber-800">
            <p className="font-medium">{error}</p>
            <p className="text-sm mt-1">Start the backend to load newsletters from the database.</p>
          </div>
        )}
        {!loading && !error && list.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">No newsletters yet</h2>
            <p className="text-gray-500">Check back later for updates from SWRC.</p>
          </div>
        )}
        {!loading && list.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {list.map((n, index) => (
              <NewsletterCard key={n.id} n={n} index={index} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default NewsletterPage;

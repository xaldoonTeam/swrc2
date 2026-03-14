import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Calendar, Loader2, ChevronRight, ArrowLeft } from "lucide-react";
import { newsletters as newslettersApi, assetUrl, type Newsletter } from "../Api/client";

function formatDate(s: string) {
  try {
    return new Date(s).toLocaleDateString(undefined, { dateStyle: "long" });
  } catch {
    return s;
  }
}

const NewsletterDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [newsletter, setNewsletter] = useState<Newsletter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError("Invalid newsletter");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    newslettersApi
      .get(slug)
      .then(setNewsletter)
      .catch(() => setError("Newsletter not found"))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stone-50 to-orange-50/30 flex flex-col items-center justify-center gap-6 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center">
              <Loader2 className="w-7 h-7 text-orange-500 animate-spin" />
            </div>
          </div>
          <p className="text-stone-600 font-medium">Loading newsletter…</p>
          <div className="h-1 w-24 rounded-full bg-orange-100 overflow-hidden">
            <motion.div
              className="h-full bg-orange-400 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: ["0%", "60%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  if (error || !newsletter) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stone-50 to-orange-50/30 flex flex-col items-center justify-center gap-6 py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 rounded bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-amber-600" />
          </div>
          <p className="text-stone-700 text-lg font-medium mb-2">{error ?? "Newsletter not found"}</p>
          <p className="text-stone-500 text-sm mb-6">The newsletter you're looking for doesn't exist or may have been removed.</p>
          <Link
            to="/newsletters"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-all shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Newsletters
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-orange-50/20 pb-24">
      {/* Breadcrumb */}
      <nav className="sticky top-0 z-10 backdrop-blur-md bg-white/80 border-b border-stone-100">
        <div className="max-w-3xl mx-auto px-6 md:px-12 py-4">
          <div className="flex items-center gap-2 text-sm text-stone-600 flex-wrap">
            <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 text-stone-300 flex-shrink-0" />
            <Link to="/newsletters" className="hover:text-orange-500 transition-colors">Newsletters</Link>
            <ChevronRight className="w-4 h-4 text-stone-300 flex-shrink-0" />
            <span className="font-semibold text-stone-900 truncate max-w-[180px] sm:max-w-none">{newsletter.title}</span>
          </div>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 md:px-12 pt-8 md:pt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="bg-white rounded-lg   overflow-hidden shadow-lg shadow-stone-200/50 border border-stone-100"
        >
          {newsletter.imageUrl && (
            <div className="aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-orange-50 to-amber-50 relative group">
              <img
                src={assetUrl(newsletter.imageUrl)}
                alt=""
                className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>
          )}
          <div className="p-8 md:p-14">
            <div className="flex items-center gap-2.5 text-sm text-stone-500 mb-5">
              <div className="flex items-center justify-center w-8 h-8 rounded bg-orange-50">
                <Calendar className="w-4 h-4 text-orange-600" />
              </div>
              <span className="font-medium">{formatDate(newsletter.createdAt)}</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-stone-900 mb-6 leading-[1.2] tracking-tight">
              {newsletter.title}
            </h1>
            {newsletter.summary && (
              <p className="text-sm font-medium text-stone-400 mb-10 leading-relaxed border-l-4 border-orange-400 pl-6 py-1 bg-orange-50/50 rounded-r-lg">
                {newsletter.summary}
              </p>
            )}
            <div className="text-stone-700 text-lg leading-[1.8] whitespace-pre-wrap">
              {newsletter.content}
            </div>
            <div className="mt-14 pt-10 border-t border-stone-100">
              <Link
                to="/newsletters"
                className="inline-flex items-center gap-2.5 px-4 text-sm py-2 rounded text-orange-600 font-semibold bg-orange-50 hover:bg-orange-100 transition-all duration-200 group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                Back to all newsletters
              </Link>
            </div>
          </div>
        </motion.div>
      </article>
    </div>
  );
};

export default NewsletterDetail;

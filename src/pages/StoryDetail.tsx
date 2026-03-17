import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Quote,
  Loader2,
  ArrowLeft,
  Bookmark,
  Share2,
  Calendar,
  MapPin,
  Award,
  ChevronDown,
  Sparkles,
  Heart,
} from "lucide-react";
import { stories as storiesApi, assetUrl, type Story } from "../Api/client";

const FALLBACK_STORIES: Array<{ name: string; role: string; category: string; image: string; story: string }> = [
  { name: "Muna", role: "SWRC Graduate", category: "Education", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80", story: "Muna gained essential job-hunting skills, from building a strong CV to mastering interviews." },
  { name: "Fihiima Abdirahman", role: "Entrepreneur", category: "Entrepreneurship", image: "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?auto=format&fit=crop&q=80", story: "After completing the Employability Skills Training Program, she secured a role at Royal Mendi House Hotel and started her own small business." },
  { name: "Hodan Ali", role: "Tech Professional", category: "Technology", image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80", story: "Through the Mentorship program, Hodan transitioned into a tech career in Hargeisa's growing digital sector." },
  { name: "Ayan Ahmed", role: "Business Owner", category: "Entrepreneurship", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80", story: "Ayan's organic soap business flourished after attending the Entrepreneurship Session." },
];

function slugFromName(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-");
}

export default function StoryDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    if (!slug) {
      setError("Invalid story");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    storiesApi
      .list()
      .then((list) => {
        const match = list.find((s) => slugFromName(s.name) === slug);
        if (match) setStory(match);
        else setError("Story not found");
      })
      .catch(() => {
        const fallback = FALLBACK_STORIES.find((s) => slugFromName(s.name) === slug);
        if (fallback) {
          setStory({
            id: "",
            name: fallback.name,
            role: fallback.role,
            category: fallback.category,
            story: fallback.story,
            imageUrl: fallback.image,
            published: true,
            createdAt: "",
            updatedAt: "",
          });
        } else setError("Story not found");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 py-24">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
        <p className="text-gray-500">Loading story…</p>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 py-24 px-6">
        <p className="text-gray-600 text-lg">{error ?? "Story not found"}</p>
        <Link
          to="/stories"
          className="text-orange-500 font-semibold hover:underline"
        >
          ← Back to Stories
        </Link>
      </div>
    );
  }

  const heroImage =
    story.imageUrl
      ? assetUrl(story.imageUrl)
      : "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80";

  return (
    <div className="min-h-screen bg-white">
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 z-50"
        style={{ width: progressWidth }}
      />

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

      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        >
          <img
            src={heroImage}
            alt={story.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </motion.div>

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
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4"
            >
              My name is{" "}
              <span className="text-amber-400">{story.name}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-lg md:text-xl text-white/80 max-w-2xl mb-6"
            >
              {story.role || "A journey of growth, learning, and empowerment at the Somaliland Women's Resource Centre"}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap items-center gap-6 text-sm text-white/60"
            >
              <span className="flex items-center gap-2">
                <MapPin size={16} />
                Somaliland
              </span>
              <span className="flex items-center gap-2">
                <Calendar size={16} />
                SWRC Graduate
              </span>
              <span className="flex items-center gap-2">
                <Award size={16} />
                Inspiring Story
              </span>
            </motion.div>

            <motion.div
              className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <span className="text-xs uppercase tracking-wider text-white/40">
                Read the story
              </span>
              <ChevronDown size={16} className="text-white/40" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-8 md:p-12 mb-10"
        >
          <Quote
            size={48}
            className="text-amber-300/30 absolute top-6 right-6"
          />
          <p className="text-xl md:text-2xl text-amber-900 font-light italic leading-relaxed whitespace-pre-wrap">
            "{story.quote || story.story}"
          </p>
          <div className="mt-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center">
              <span className="text-amber-700 font-semibold text-sm">
                {story.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-amber-700 font-medium">
              — {story.name}
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <h2 className="text-2xl font-semibold text-slate-800 mb-3">
            Full story
          </h2>
          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
            {story.story}
          </p>
        </motion.div>

        {story.programsCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mt-6 bg-slate-50 rounded-3xl p-8"
          >
            <h3 className="text-xl font-semibold text-slate-800 mb-4">
              Programs completed at SWRC
            </h3>
            <ul className="list-disc list-inside text-slate-600 space-y-1">
              {story.programsCompleted
                .split(/[,;\n]/)
                .map((item) => item.trim())
                .filter(Boolean)
                .map((item) => (
                  <li key={item}>{item}</li>
                ))}
            </ul>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-12 flex items-center justify-between gap-4 flex-wrap"
        >
          <Link
            to="/stories"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-amber-600 transition-colors text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Back to all stories
          </Link>

          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 text-slate-400 hover:text-amber-600 transition-colors">
              <Heart size={18} />
              <span className="text-sm">Appreciate</span>
            </button>
            <button className="flex items-center gap-2 text-slate-400 hover:text-amber-600 transition-colors">
              <Share2 size={18} />
              <span className="text-sm">Share</span>
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

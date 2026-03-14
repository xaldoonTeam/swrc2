import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Quote, Loader2 } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Breadcrumb */}
      <nav className="px-6 md:px-12 py-4 text-xs md:text-sm text-gray-600 border-b bg-white">
        <div className="flex items-center gap-2 max-w-4xl mx-auto">
          <Link to="/" className="hover:text-orange-500 transition">
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <Link to="/stories" className="hover:text-orange-500 transition">
            Stories
          </Link>
          <span className="text-gray-400">/</span>
          <span className="font-semibold text-gray-900 truncate">{story.name}</span>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 md:px-12 py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-orange-100"
        >
          <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
            <img
              src={
                story.imageUrl
                  ? assetUrl(story.imageUrl)
                  : "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80"
              }
              alt={story.name}
              className="w-24 h-24 rounded-full object-cover border-2 border-orange-400 shrink-0"
            />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {story.name}
              </h1>
              <p className="text-orange-600 font-medium mb-2">{story.role}</p>
              <span className="inline-block text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {story.category}
              </span>
            </div>
          </div>

          <div className="border-l-4 border-orange-400 pl-6">
            <Quote className="w-8 h-8 text-orange-300 mb-2" />
            <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
              "{story.story}"
            </p>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-100">
            <Link
              to="/stories"
              className="inline-flex items-center gap-2 text-orange-500 font-semibold hover:text-orange-600 transition"
            >
              ← Back to all stories
            </Link>
          </div>
        </motion.div>
      </article>
    </div>
  );
}

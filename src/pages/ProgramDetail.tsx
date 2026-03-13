import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Loader2 } from "lucide-react";
import { programs as programsApi, assetUrl, type Program } from "../Api/client";
import { getProgramIcon } from "../lib/programIcons";

export default function ProgramDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError("Invalid program");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    programsApi
      .get(slug)
      .then(setProgram)
      .catch(() => setError("Program not found"))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 py-24">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
        <p className="text-gray-500">Loading program…</p>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 py-24 px-6">
        <p className="text-gray-600 text-lg">{error ?? "Program not found"}</p>
        <Link
          to="/programs"
          className="text-orange-500 font-semibold hover:underline"
        >
          ← Back to Programs
        </Link>
      </div>
    );
  }

  const IconComponent = getProgramIcon(program.iconName);
  const imageUrls = program.imageUrls ?? [];

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Breadcrumb */}
      <nav className="px-6 md:px-12 py-4 text-xs md:text-sm text-gray-600 border-b bg-gray-50">
        <div className="flex items-center gap-2 max-w-7xl mx-auto">
          <Link to="/" className="hover:text-orange-500 transition">
            Home
          </Link>
          <ChevronRight size={14} className="text-gray-400" />
          <Link to="/programs" className="hover:text-orange-500 transition">
            Programs
          </Link>
          <ChevronRight size={14} className="text-gray-400" />
          <span className="font-semibold text-gray-900 truncate">{program.title}</span>
        </div>
      </nav>

      {/* Hero: first image or gradient with icon + title */}
      <section className="relative h-[280px] sm:h-[360px] md:h-[420px] overflow-hidden bg-[#2D241E]">
        {imageUrls.length > 0 ? (
          <motion.img
            src={assetUrl(imageUrls[0])}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6 }}
          />
        ) : null}
        <div className={`absolute inset-0 flex items-center px-6 md:px-12 ${imageUrls.length > 0 ? "bg-black/50" : ""}`}>
          <div className="max-w-4xl flex items-center gap-6">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-orange-500 flex items-center justify-center text-white shrink-0 shadow-lg">
              <IconComponent className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-white text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
            >
              {program.title}
            </motion.h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-6 md:px-12 py-12 md:py-16">
        {program.description && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="prose prose-lg text-gray-700 leading-relaxed whitespace-pre-wrap"
          >
            {program.description}
          </motion.div>
        )}

        {/* Image gallery (remaining images if more than one) */}
        {imageUrls.length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
          >
            {imageUrls.slice(1).map((url, i) => (
              <motion.div
                key={url}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="overflow-hidden rounded-xl shadow-md"
              >
                <img
                  src={assetUrl(url)}
                  alt={`${program.title} ${i + 2}`}
                  className="w-full h-56 object-cover hover:scale-105 transition-transform duration-300"
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </article>

      {/* CTA */}
      <section className="bg-orange-500 py-12 px-6 mt-8">
        <div className="max-w-4xl mx-auto text-center text-white space-y-4">
          <h3 className="text-2xl font-bold">Want to join this program?</h3>
          <Link
            to="/contact"
            className="inline-block bg-white text-orange-500 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition shadow-lg"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </div>
  );
}

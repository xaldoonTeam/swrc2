import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Video, Film, Youtube, PlayCircle, Calendar, Eye, Clock, Share2, Download, Loader2 } from 'lucide-react';
import { media as mediaApi, assetUrl, extractYoutubeVideoId, type MediaItem } from '../Api/client';
import { Link } from 'react-router-dom';

const MediaCard = ({ title, type, duration, views, date, description, thumbnail, youtubeId, fileUrl }: any) => {
  const videoId = extractYoutubeVideoId(youtubeId);
  const watchUrl = videoId
    ? `https://www.youtube.com/watch?v=${videoId}`
    : fileUrl
      ? assetUrl(fileUrl)
      : null;

  return (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
    className="bg-white rounded overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
  >
    {/* Thumbnail */}
    <div className="relative h-48 bg-gray-900 overflow-hidden">
      {videoId ? (
        <img 
          src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : thumbnail ? (
        <img src={thumbnail} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center">
          <Film className="w-16 h-16 text-white opacity-80" />
        </div>
      )}
      
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
        {watchUrl ? (
          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/20 backdrop-blur-sm p-4 rounded-full hover:bg-white/30 transition-colors inline-flex items-center justify-center"
            aria-label="Watch video"
          >
            <PlayCircle className="w-12 h-12 text-white" />
          </a>
        ) : (
          <span className="bg-white/20 backdrop-blur-sm p-4 rounded-full inline-flex items-center justify-center">
            <PlayCircle className="w-12 h-12 text-white" />
          </span>
        )}
      </div>
      
      <div className="absolute top-4 right-4">
        <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
          type === 'Documentary' ? 'bg-purple-500 text-white' :
          type === 'Interview' ? 'bg-blue-500 text-white' :
          type === 'Success Story' ? 'bg-green-500 text-white' :
          'bg-orange-500 text-white'
        }`}>
          {type}
        </span>
      </div>
      
      <div className="absolute bottom-4 left-4 text-white">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye size={14} />
            <span>{views.toLocaleString()} views</span>
          </div>
        </div>
      </div>
    </div>
    
    {/* Content */}
    <div className="p-6">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors mb-1">
            {title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar size={14} />
            <span>{date}</span>
          </div>
        </div>
        <button className="text-gray-400 hover:text-orange-500 transition-colors">
          <Share2 size={18} />
        </button>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {description}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {watchUrl ? (
            <a
              href={watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors text-sm font-medium"
            >
              <Play size={16} />
              Watch Now
            </a>
          ) : (
            <span className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-500 rounded text-sm cursor-not-allowed">
              <Play size={16} />
              Watch Now
            </span>
          )}
          {watchUrl && (
            <a
              href={watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm"
            >
              <Download size={16} />
              Download
            </a>
          )}
        </div>
      </div>
    </div>
  </motion.div>
  );
};

type MediaContentItem = { title: string; type: string; duration: string | null; views: number; date: string | null; description: string | null; youtubeId: string | null; thumbnailUrl: string | null; fileUrl: string | null };
const FALLBACK_MEDIA: MediaContentItem[] = [
  { title: "Voices of Resilience: Women of Somaliland", type: "Documentary", duration: "25:30", views: 124567, date: "March 2024", description: "A powerful documentary following three women's journeys through SWRC programs.", youtubeId: "dQw4w9WgXcQ", thumbnailUrl: null, fileUrl: null },
  { title: "Breaking Barriers: Women in Technology", type: "Success Story", duration: "8:45", views: 89234, date: "February 2024", description: "Meet Hodan, who transformed her life by learning digital skills.", youtubeId: "dQw4w9WgXcQ", thumbnailUrl: null, fileUrl: null },
];

const MediaPage: React.FC = () => {
  const [selectedType, setSelectedType] = useState('all');
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [mediaContent, setMediaContent] = useState<MediaContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    mediaApi
      .list()
      .then((data: MediaItem[]) => setMediaContent(data.map((m) => ({
        title: m.title,
        type: m.type,
        duration: m.duration ?? null,
        views: m.views,
        date: m.date ?? null,
        description: m.description ?? null,
        youtubeId: m.youtubeId ?? null,
        thumbnailUrl: m.thumbnailUrl ? assetUrl(m.thumbnailUrl) : null,
        fileUrl: m.fileUrl ?? null,
      }))))
      .catch(() => {
        setError('Could not load media.');
        setMediaContent(FALLBACK_MEDIA);
      })
      .finally(() => setLoading(false));
  }, []);

  const types = ['all', 'Documentary', 'Interview', 'Success Story', 'Program Video', 'Event Coverage'];

  const filteredMedia = selectedType === 'all'
    ? mediaContent
    : mediaContent.filter(item => item.type === selectedType);

  const displayList = loading ? [] : filteredMedia;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <section className="relative bg-gradient-to-br from-pink-500 to-orange-500 pt-24 pb-32 px-6 text-center text-white overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-4xl mx-auto space-y-6"
        >
          <PlayCircle className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Media & Videos
          </h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            Watch documentaries, interviews, and success stories that capture the impact of our work.
          </p>
        </motion.div>
        
        {/* Background Video Placeholder */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>
      </section>

      {/* Featured Video */}
      <div className="max-w-6xl mx-auto px-6 -mt-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded shadow-2xl overflow-hidden"
        >
          <div className="md:flex">
            <div className="md:w-2/3 relative">
              <div className="h-64 md:h-96 bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center">
                {playingVideo ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${playingVideo}?autoplay=1`}
                    title="Featured Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0"
                  />
                ) : (
                  <div className="text-center">
                    <button 
                      onClick={() => setPlayingVideo('dQw4w9WgXcQ')}
                      className="bg-white/20 backdrop-blur-sm p-6 rounded-full hover:bg-white/30 transition-colors mb-4"
                    >
                      <PlayCircle className="w-20 h-20 text-white" />
                    </button>
                    <p className="text-white font-semibold">Click to play featured documentary</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="md:w-1/3 p-8">
              <div className="mb-4">
                <span className="inline-block bg-purple-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
                  Featured Documentary
                </span>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Voices of Resilience: Women of Somaliland
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  This award-winning documentary follows the transformative journeys of three resilient women who overcame immense challenges to build better futures for themselves and their communities.
                </p>
              </div>
              
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>Duration: 25 minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>Released: March 2024</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye size={16} />
                  <span>124,567 views</span>
                </div>
              </div>
              
              <div className="mt-6">
               <Link to="https://www.youtube.com/@somalilandwrc9794" target="_blank">
               <button className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white py-3 rounded font-semibold hover:bg-orange-600 transition-colors">
                  <Youtube size={20} />
                  Watch on YouTube
                </button>
               </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-7xl mx-auto px-6 mt-12">
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {types.map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-6 py-3 rounded-full font-medium transition-colors ${
                selectedType === type 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
              }`}
            >
              {type === 'all' ? 'All Media' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Explore Our Video Library</h2>
          <p className="text-gray-600">
            Watch inspiring stories, documentaries, and program highlights from our community.
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16 gap-2 text-gray-500">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading media…</span>
          </div>
        )}
        {error && !loading && (
          <p className="text-amber-600 mb-4">Using sample data. Start the backend to load from the database.</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayList.map((item, index) => (
            <MediaCard key={item.title + index} {...item} thumbnail={item.thumbnailUrl} fileUrl={item.fileUrl} />
          ))}
        </div>

        {/* YouTube Channel CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 bg-gradient-to-r from-[#FF0000] to-[#FF3333] rounded p-12 text-white"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-2/3">
              <Youtube className="w-16 h-16 mb-6" />
              <h3 className="text-2xl font-bold mb-4">Subscribe to Our YouTube Channel</h3>
              <p className="text-red-100 mb-6">
                Never miss an update! Subscribe to our YouTube channel for the latest documentaries, interviews, and success stories.
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="bg-white/20 px-4 py-2 rounded-lg">
                  <span className="font-bold">12.5K</span> Subscribers
                </div>
                <div className="bg-white/20 px-4 py-2 rounded-lg">
                  <span className="font-bold">125</span> Videos
                </div>
                <div className="bg-white/20 px-4 py-2 rounded-lg">
                  <span className="font-bold">1.2M</span> Total Views
                </div>
              </div>
            </div>
            
            <div className="md:w-1/3">
              <button className="w-full bg-white text-red-600 py-4 rounded-lg font-bold hover:bg-red-50 transition-colors flex items-center justify-center gap-3">
                <Youtube size={24} />
                Subscribe Now
              </button>
              <p className="text-center text-red-100 text-sm mt-4">
                Get notified when we publish new videos
              </p>
            </div>
          </div>
        </motion.div>

        {/* Playlist Section */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Video Playlists</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded p-8 text-white">
              <Film className="w-12 h-12 mb-4" />
              <h4 className="text-xl font-bold mb-2">Success Stories</h4>
              <p className="text-orange-100 mb-4">
                Watch inspiring journeys of women who transformed their lives
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm">15 videos</span>
                <PlayCircle size={20} />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-400 to-purple-500 rounded p-8 text-white">
              <Video className="w-12 h-12 mb-4" />
              <h4 className="text-xl font-bold mb-2">Documentaries</h4>
              <p className="text-purple-100 mb-4">
                In-depth documentaries about women's empowerment in Somaliland
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm">8 videos</span>
                <PlayCircle size={20} />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded p-8 text-white">
              <Play className="w-12 h-12 mb-4" />
              <h4 className="text-xl font-bold mb-2">Program Highlights</h4>
              <p className="text-blue-100 mb-4">
                See our programs in action and their impact on communities
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm">22 videos</span>
                <PlayCircle size={20} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MediaPage;
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Download, Users, Target, Calendar, FileText, Filter, Search, BookOpen, Loader2 } from 'lucide-react';
import { research as researchApi, assetUrl, type Research as ResearchType } from '../Api/client';
import { useNavigate } from 'react-router-dom';

const ResearchCard = ({ title, authors, year, abstract, keywords, methodology, downloads, category, pdfUrl }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
    className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group"
  >
    <div className="flex items-start justify-between mb-4">
      <div>
        <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 ${
          category === 'Gender Studies' ? 'bg-orange-100 text-orange-700' :
          category === 'Economic Research' ? 'bg-green-100 text-green-700' :
          category === 'Education Research' ? 'bg-blue-100 text-blue-700' :
          'bg-orange-100 text-orange-700'
        }`}>
          {category}
        </span>
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
          {title}
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <Users size={14} />
          <span>{authors}</span>
          <Calendar size={14} className="ml-2" />
          <span>{year}</span>
        </div>
      </div>
      <div className="text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <Download size={16} />
          <span>{downloads.toLocaleString()} downloads</span>
        </div>
      </div>
    </div>
    
    <div className="mb-6">
      <h4 className="text-sm font-semibold text-gray-900 mb-2">Abstract</h4>
      <p className="text-gray-600 text-sm leading-relaxed">
        {abstract}
      </p>
    </div>
    
    <div className="flex flex-wrap gap-2 mb-6">
      {keywords.map((keyword: string, index: number) => (
        <span key={index} className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
          {keyword}
        </span>
      ))}
    </div>
    
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <FileText size={16} />
        <span>Methodology: {methodology}</span>
      </div>
      
      <div className="flex gap-3">
        <button className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
          <BookOpen size={16} />
          Read Abstract
        </button>
        {pdfUrl ? (
          <a href={assetUrl(pdfUrl)} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors" download>
            <Download size={16} />
            Download PDF
          </a>
        ) : (
          <span className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed">
            <Download size={16} />
            Download PDF
          </span>
        )}
      </div>
    </div>
  </motion.div>
);

function toStudyCard(r: ResearchType) {
  return {
    title: r.title,
    authors: r.authors,
    year: r.year,
    abstract: r.abstract,
    keywords: r.keywords ?? [],
    methodology: r.methodology ?? '—',
    downloads: r.downloadCount,
    category: r.category,
    pdfUrl: r.pdfUrl,
  };
}

const FALLBACK_RESEARCH = [
  { title: "Gender Inequality and Economic Development in Somaliland", authors: "Dr. Amina Hassan, Dr. Sarah Johnson", year: 2023, abstract: "This study examines the correlation between gender inequality indicators and economic development metrics across Somaliland's regions.", keywords: ["Gender Equality", "Economic Development", "Somaliland"], methodology: "Mixed Methods", downloads: 2345, category: "Gender Studies", pdfUrl: null as string | null },
  { title: "Impact of Digital Literacy Programs on Women's Employment", authors: "Research Team, SWRC", year: 2023, abstract: "Longitudinal study tracking 200 women over 2 years to measure the impact of digital skills training.", keywords: ["Digital Literacy", "Employment", "Skills Training"], methodology: "Longitudinal Study", downloads: 1890, category: "Education Research", pdfUrl: null as string | null },
];

const ResearchPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [researchStudies, setResearchStudies] = useState<ReturnType<typeof toStudyCard>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    researchApi
      .list()
      .then((data) => setResearchStudies(data.map(toStudyCard)))
      .catch(() => {
        setError('Could not load research.');
        setResearchStudies(FALLBACK_RESEARCH);
      })
      .finally(() => setLoading(false));
  }, []);

  const categories = ['all', 'Gender Studies', 'Economic Research', 'Education Research', 'Health Research'];

  const filteredResearch = researchStudies.filter(study => {
    const matchesCategory = selectedCategory === 'all' || study.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      study.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      study.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (study.keywords ?? []).some((k: string) => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const displayList = loading ? [] : filteredResearch;
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <section className="bg-gradient-to-br from-slate-800 to-slate-900 pt-24 pb-32 px-6 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          <BarChart3 className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Research & Studies
          </h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            Evidence-based research on women's empowerment, gender equality, and economic development in Somaliland.
          </p>
        </motion.div>
      </section>

      {/* Search and Filter */}
      <div className="max-w-7xl mx-auto px-6 -mt-16">
        <div className="bg-white rounded shadow-lg p-6 mb-12">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            <div className="relative flex-grow max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search research papers, authors, or keywords..."
                className="w-full pl-12 pr-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <button className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors">
              <Filter size={16} />
              Filter Research
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
                  selectedCategory === category 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'All Categories' : category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Research Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="mb-12 flex items-center justify-between">
          <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Latest Research Studies</h2>
          <p className="text-gray-600">
            Access our evidence-based research contributing to knowledge on women's empowerment and development.
          </p>
          </div>
          <div>
            <button onClick={() => navigate('/report')} className="bg-orange-500 text-white px-4 py-2 rounded text-sm font-bold hover:bg-orange-600 transition shadow-sm">Publications</button>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16 gap-2 text-gray-500">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading research…</span>
          </div>
        )}
        {error && !loading && (
          <p className="text-amber-600 mb-4">Using sample data. Start the backend to load from the database.</p>
        )}
        <div className="space-y-8">
          {displayList.map((study, index) => (
            <ResearchCard key={study.title + index} {...study} />
          ))}
        </div>

        {/* Research Impact */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 bg-gradient-to-r from-orange-500 to-slate-800 rounded p-12 text-white"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">Research Impact</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Target className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>Informed policy recommendations for gender-inclusive development</span>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>Shaped program design for maximum community impact</span>
                </li>
                <li className="flex items-start gap-3">
                  <BarChart3 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>Contributed to academic knowledge on Somaliland development</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-6">Research Partnerships</h3>
              <p className="text-orange-100 mb-4">
                We collaborate with universities, research institutions, and development organizations to conduct rigorous, impactful research.
              </p>
              <button className="bg-white text-orange-600 px-6 py-2 rounded font-semibold hover:bg-orange-50 transition-colors">
                Partner With Us
              </button>
            </div>
          </div>
        </motion.div>

        {/* Methodology Section */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Our Research Methodology</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded shadow-sm">
              <div className="text-orange-500 mb-4">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Participant-Centered</h4>
              <p className="text-gray-600">
                Our research prioritizes the voices and experiences of women in Somaliland, ensuring authentic representation.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded shadow-sm">
              <div className="text-orange-500 mb-4">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Mixed Methods</h4>
              <p className="text-gray-600">
                We combine quantitative data with qualitative insights for comprehensive understanding of complex issues.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded shadow-sm">
              <div className="text-orange-500 mb-4">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.625 2.655A9 9 0 0119 11a1 1 0 11-2 0 7 7 0 00-9.625-6.492 1 1 0 11-.75-1.853zM4.662 4.959A1 1 0 014.75 6.37 6.97 6.97 0 003 11a1 1 0 11-2 0 8.97 8.97 0 012.25-5.953 1 1 0 011.412-.088z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Ethical Standards</h4>
              <p className="text-gray-600">
                All research follows strict ethical guidelines, with informed consent and participant confidentiality ensured.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResearchPage;
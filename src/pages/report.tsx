import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Calendar, Eye, Filter, Search, ChevronDown, Loader2 } from 'lucide-react';
import { publications, assetUrl, type Publication } from '../Api/client';

const ReportCard = ({ title, year, type, description, downloads, pages, fileSize, fileUrl }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
    className="bg-white rounded overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group"
  >
    <div className="md:flex">
      <div className="md:w-1/3 bg-orange-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-orange-400 mx-auto mb-4" />
          <div className="text-2xl font-bold text-orange-600">{year}</div>
          <div className="text-sm text-orange-500 font-medium mt-1">{type || 'Report'}</div>
        </div>
      </div>
      
      <div className="md:w-2/3 p-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="inline-block bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full mb-2">
              {type}
            </span>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
              {title}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Eye size={16} />
            <span>{(downloads ?? 0).toLocaleString()} views</span>
          </div>
        </div>
        
        <p className="text-gray-600 mb-6">
          {description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>Published: {year}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText size={16} />
              <span>{pages ?? '—'} pages</span>
            </div>
            <div className="text-gray-400">{fileSize ?? ''}</div>
          </div>
          
          <div className="flex gap-3">
            {fileUrl && (
              <a
                href={assetUrl(fileUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-orange-600 border border-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
              >
                <Eye size={16} />
                Preview
              </a>
            )}
            <a
              href={fileUrl ? assetUrl(fileUrl) : '#'}
              download
              className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${fileUrl ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
              <Download size={16} />
              Download PDF
            </a>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const FALLBACK_REPORTS = [
  { title: "Annual Impact Report 2023", year: 2023, type: "Annual Report", description: "Comprehensive overview of SWRC's achievements, program impacts, financial transparency, and future goals.", downloads: 1245, pages: 56, fileSize: "2.4 MB", fileUrl: null },
  { title: "Financial Transparency Report 2022", year: 2022, type: "Financial Report", description: "Detailed financial statements, audit reports, and budget allocation analysis.", downloads: 892, pages: 42, fileSize: "1.8 MB", fileUrl: null },
  { title: "Program Evaluation & Impact Assessment", year: 2023, type: "Evaluation Report", description: "In-depth analysis of SWRC's core programs including vocational training and digital literacy.", downloads: 1567, pages: 78, fileSize: "3.2 MB", fileUrl: null },
];

function toReportCard(p: Publication) {
  return {
    title: p.title,
    year: p.year,
    type: p.type,
    description: p.description,
    downloads: p.downloadCount,
    pages: p.pages ?? undefined,
    fileSize: p.fileSize ?? undefined,
    fileUrl: p.fileUrl ?? undefined,
  };
}

const ReportsPage: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [reports, setReports] = useState<Array<{ title: string; year: number; type: string; description: string; downloads: number; pages?: number; fileSize?: string; fileUrl?: string | null }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    publications
      .list()
      .then((data) => setReports(data.map(toReportCard)))
      .catch(() => {
        setError('Could not load publications.');
        setReports(FALLBACK_REPORTS);
      })
      .finally(() => setLoading(false));
  }, []);

  const years = ['all', '2023', '2022', '2021', '2020'];
  const types = ['all', 'Annual Report', 'Financial Report', 'Evaluation Report', 'Special Report', 'Donor Report'];

  const filteredReports = reports.filter(report => {
    const matchesYear = selectedYear === 'all' || report.year.toString() === selectedYear;
    const matchesSearch = !searchQuery ||
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesYear && matchesSearch;
  });

  const displayList = loading ? [] : filteredReports;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <section className="bg-gradient-to-br from-slate-900 to-orange-600 pt-24 pb-32 px-6 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Reports & Publications
          </h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            Access our annual reports, financial statements, and program evaluations documenting SWRC's impact and transparency.
          </p>
        </motion.div>
      </section>

      {/* Search and Filter */}
      <div className="max-w-7xl mx-auto px-6 -mt-16">
        <div className="bg-white rounded shadow-lg p-6 mb-12">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-grow max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search reports by title or keyword..."
                className="w-full pl-12 pr-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-4">
              <div className="relative">
                <select 
                  className="appearance-none bg-white border border-gray-300 rounded px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  {years.map(year => (
                    <option key={year} value={year}>
                      {year === 'all' ? 'All Years' : year}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
              
              <button className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded hover:bg-slate-600 transition-colors">
                <Filter size={16} />
                Filter
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            {types.map(type => (
              <button
                key={type}
                onClick={() => setSelectedYear('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  type === 'all' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type === 'all' ? 'All Types' : type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Latest Reports</h2>
          <p className="text-gray-600">
            Download our comprehensive reports to learn about our impact, finances, and programs.
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16 gap-2 text-gray-500">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading publications…</span>
          </div>
        )}
        {error && !loading && (
          <p className="text-amber-600 mb-4">Using sample data. Start the backend to load from the database.</p>
        )}
        <div className="space-y-8">
          {displayList.map((report, index) => (
            <ReportCard key={report.title + index} {...report} />
          ))}
        </div>

        {/* Statistics */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded p-12 text-white"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">{reports.length}+</div>
              <div className="text-blue-100">Reports Published</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-blue-100">Financial Transparency</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">{reports.reduce((acc, r) => acc + (r.downloads ?? 0), 0).toLocaleString()}+</div>
              <div className="text-blue-100">Total Downloads</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">6+</div>
              <div className="text-blue-100">Years of Reporting</div>
            </div>
          </div>
        </motion.div>

        {/* Newsletter CTA */}
        <div className="mt-20 text-center">
          <div className="bg-white rounded p-8 shadow-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Get Reports Delivered to Your Inbox
            </h3>
            <p className="text-gray-600 mb-6">
              Subscribe to receive our latest reports and publications directly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button className="bg-orange-500 text-white px-6 py-2 rounded font-semibold hover:bg-orange-500 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ReportsPage;
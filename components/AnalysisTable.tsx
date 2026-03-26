import React, { useState } from 'react';
import { AnalysisResult, Sentiment, Urgency } from '../types';
import { AlertTriangle, CheckCircle, HelpCircle, MapPin, X, Filter } from 'lucide-react';

interface Props {
  data: AnalysisResult[];
}

const SentimentIcon = ({ sentiment }: { sentiment: Sentiment }) => {
  switch (sentiment) {
    case Sentiment.Positive:
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case Sentiment.Negative:
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    default:
      return <HelpCircle className="w-4 h-4 text-gray-400" />;
  }
};

const UrgencyBadge = ({ urgency }: { urgency: Urgency }) => {
  const colors = {
    [Urgency.High]: 'bg-red-100 text-red-800 border-red-200',
    [Urgency.Medium]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    [Urgency.Low]: 'bg-blue-100 text-blue-800 border-blue-200',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${colors[urgency]}`}>
      {urgency}
    </span>
  );
};

const AnalysisTable: React.FC<Props> = ({ data }) => {
  const [selectedComplaint, setSelectedComplaint] = useState<AnalysisResult | null>(null);
  const [filterUrgency, setFilterUrgency] = useState<string>('All');

  // Filter the data based on the dropdown selection
  const filteredData = data.filter(item => {
    if (filterUrgency === 'All') return true;
    return item.urgency === filterUrgency;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full relative">
      
      {/* Detail Modal */}
      {selectedComplaint && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90%] flex flex-col border border-gray-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50 rounded-t-xl shrink-0">
               <h3 className="font-semibold text-gray-800">Complaint Details</h3>
               <button 
                 onClick={(e) => { e.stopPropagation(); setSelectedComplaint(null); }}
                 className="p-1 hover:bg-gray-200 rounded-full transition-colors"
               >
                 <X className="w-5 h-5 text-gray-500" />
               </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 overflow-y-auto custom-scrollbar space-y-5">
              
              {/* Meta Tags */}
              <div className="flex flex-wrap gap-2">
                 <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700 border border-gray-200">
                    <SentimentIcon sentiment={selectedComplaint.sentiment} />
                    {selectedComplaint.sentiment}
                 </div>
                 <UrgencyBadge urgency={selectedComplaint.urgency} />
                 <span className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-xs font-medium">
                    {selectedComplaint.category}
                 </span>
                 {selectedComplaint.location && selectedComplaint.location !== 'Unknown' && (
                    <span className="flex items-center gap-1 px-3 py-1 bg-gray-50 text-gray-600 border border-gray-200 rounded-full text-xs">
                        <MapPin className="w-3 h-3" />
                        {selectedComplaint.location}
                    </span>
                 )}
              </div>

              {/* Full Text */}
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Full Comment / Post</h4>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedComplaint.originalText}
                </div>
              </div>

              {/* AI Explanation */}
               <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">AI Analysis</h4>
                <div className="bg-indigo-50/50 p-4 rounded-lg border border-indigo-100 text-indigo-900 text-sm">
                   <p className="italic leading-relaxed">"{selectedComplaint.explanation}"</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-xs text-gray-400 pt-2 border-t border-gray-50">
                <span>ID: {selectedComplaint.id.split('-')[1]}</span>
                <span className="font-medium bg-gray-100 px-2 py-0.5 rounded">Source: {selectedComplaint.source}</span>
              </div>

            </div>
            
            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-end gap-3 shrink-0">
                <button 
                  onClick={(e) => { e.stopPropagation(); setSelectedComplaint(null); }}
                  className="w-full py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Table Header with Filter */}
      <div className="p-4 border-b border-gray-100 bg-gray-50 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h3 className="text-gray-700 font-semibold">Detailed Analysis Log</h3>
            <p className="text-xs text-gray-500 mt-0.5">Click on any row to view full details.</p>
        </div>

        {/* Priority Filter Dropdown */}
        <div className="relative inline-block text-left w-full sm:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-4 w-4 text-gray-500" />
            </div>
            <select
                value={filterUrgency}
                onChange={(e) => setFilterUrgency(e.target.value)}
                className="block w-full sm:w-48 pl-10 pr-10 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
            >
                <option value="All">All Priorities</option>
                <option value={Urgency.High}>High Priority</option>
                <option value={Urgency.Medium}>Medium Priority</option>
                <option value={Urgency.Low}>Low Priority</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
      </div>
      
      <div className="overflow-auto custom-scrollbar flex-1">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="px-4 py-3 font-medium">Sentiment</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Comment</th>
              <th className="px-4 py-3 font-medium">Analysis</th>
              <th className="px-4 py-3 font-medium">Urgency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr 
                  key={item.id} 
                  onClick={() => setSelectedComplaint(item)}
                  className="hover:bg-indigo-50/40 transition-colors cursor-pointer group"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <SentimentIcon sentiment={item.sentiment} />
                      <span className="text-gray-700">{item.sentiment}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 font-medium">{item.category}</td>
                  <td className="px-4 py-3">
                    <p className="text-gray-800 line-clamp-2 max-w-xs group-hover:text-indigo-700 transition-colors font-medium" title="Click to view full">
                      {item.originalText}
                    </p>
                    {item.location && item.location !== 'Unknown' && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                        <MapPin className="w-3 h-3" />
                        {item.location}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500 italic max-w-xs line-clamp-2">{item.explanation}</td>
                  <td className="px-4 py-3">
                    <UrgencyBadge urgency={item.urgency} />
                  </td>
                </tr>
              ))
            ) : (
                // Empty state for filter
                data.length > 0 ? (
                    <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                            No complaints found with <strong>{filterUrgency}</strong> priority.
                        </td>
                    </tr>
                ) : null
            )}
          </tbody>
        </table>
        {data.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            No data available. Start a search to see analysis.
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisTable;
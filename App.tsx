import React, { useMemo, useState, useEffect } from 'react';
import AlertsModal from './components/AlertsModal';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import { analyzeComments } from './services/localAnalysisService';
import { fetchMockComments } from './services/mockDataService';
import { fetchRedditData } from './services/redditService';
import { fetchYouTubeData } from './services/youtubeService';
import { AnalysisResult, Source, Urgency } from './types';

const App: React.FC = () => {
  const [data, setData] = useState<AnalysisResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTopic, setCurrentTopic] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);

  const alerts = useMemo(() => {
    return data.filter(item => item.urgency === Urgency.High);
  }, [data]);

  const handleSearch = async (query: string, source: Source) => {
    setIsLoading(true);
    setError(null);
    setCurrentTopic(query);
    setData([]);

    try {
      let rawData: { text: string; url: string }[] = [];

      switch (source) {
        case 'YouTube':
          rawData = await fetchYouTubeData(query);
          break;
        case 'Reddit':
          rawData = await fetchRedditData(query);
          break;
        case 'Twitter':
          rawData = await fetchMockComments(query, source);
          break;
        default:
          rawData = await fetchMockComments(query, source);
      }

      if (rawData.length === 0) {
        throw new Error(`No data found for "${query}" on ${source}.`);
      }
      
      const analyzedResults = await analyzeComments(rawData, source, query);
      setData(analyzedResults);

      const hasHighUrgency = analyzedResults.some(item => item.urgency === Urgency.High);
      if (hasHighUrgency) {
        setTimeout(() => setIsAlertsOpen(true), 1500);
      }

    } catch (err: any) {
      console.error("App Error:", err);
      setError(err.message || "An unexpected error occurred while analyzing.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Header 
        onSearch={handleSearch} 
        isLoading={isLoading} 
        alertsCount={alerts.length}
        onOpenAlerts={() => setIsAlertsOpen(true)}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
           <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
             <div className="flex-shrink-0">
               <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
               </svg>
             </div>
             <div>
               <h3 className="text-sm font-medium text-red-800">Analysis Failed</h3>
               <div className="mt-2 text-sm text-red-700">
                 <p>{error}</p>
               </div>
             </div>
           </div>
        )}

        <Dashboard 
          data={data} 
          isLoading={isLoading} 
          topic={currentTopic} 
        />
      </main>

      <AlertsModal 
        alerts={alerts} 
        isOpen={isAlertsOpen} 
        onClose={() => setIsAlertsOpen(false)} 
        topic={currentTopic}
      />

      <footer className="bg-white border-t border-gray-200 py-6 mt-12">
         <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
           <p></p>
         </div>
      </footer>
    </div>
  );
};

export default App;
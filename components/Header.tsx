import React, { useState } from 'react';
import { Search, MapPin, Youtube, Twitter, MessageCircle, Bell } from 'lucide-react';
import { Source } from '../types';

interface Props {
  onSearch: (query: string, source: Source) => void;
  isLoading: boolean;
  alertsCount: number;
  onOpenAlerts: () => void;
  onLogout?: () => void;
}

const Header: React.FC<Props> = ({ onSearch, isLoading, alertsCount, onOpenAlerts, onLogout }) => {
  const [query, setQuery] = useState('');
  const [source, setSource] = useState<Source>('YouTube');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query, source);
    }
  };

  const sources: { id: Source; icon: React.ReactNode; color: string }[] = [
    { id: 'YouTube', icon: <Youtube className="w-4 h-4" />, color: 'hover:text-red-600' },
    { id: 'Reddit', icon: <MessageCircle className="w-4 h-4" />, color: 'hover:text-orange-600' },
    { id: 'Twitter', icon: <Twitter className="w-4 h-4" />, color: 'hover:text-blue-400' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between h-auto md:h-20 py-4 md:py-0 gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">InsightStream</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Social Intelligence Dashboard</p>
            </div>
          </div>

          {/* Search Controls */}
          <form onSubmit={handleSubmit} className="flex-1 max-w-2xl w-full flex flex-col sm:flex-row gap-3">
            
            {/* Source Selector */}
            <div className="flex bg-gray-100 p-1 rounded-lg shrink-0">
              {sources.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSource(s.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    source === s.id
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {s.icon}
                  <span className="hidden sm:inline">{s.id}</span>
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm"
                placeholder="Search topic (e.g. 'SBI Bank', 'Potholes')..."
              />
            </div>
            
            {/* Submit & Alerts */}
            <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onOpenAlerts}
                  className={`relative inline-flex items-center px-3 py-2 border text-sm font-medium rounded-lg transition-all ${
                    alertsCount > 0 
                      ? 'bg-red-50 border-red-200 text-red-600 animate-pulse' 
                      : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-50'
                  }`}
                  title="View Priority Alerts"
                >
                  <Bell className="h-5 w-5" />
                  {alertsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                      {alertsCount}
                    </span>
                  )}
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !query.trim()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? 'Scanning...' : 'Analyze'}
                </button>
                {onLogout && (
                  <button
                    type="button"
                    onClick={onLogout}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                  >
                    Logout
                  </button>
                )}
            </div>
          </form>

        </div>
      </div>
    </header>
  );
};

export default Header;
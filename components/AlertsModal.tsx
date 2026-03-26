import React from 'react';
import { AnalysisResult, Urgency } from '../types';
import { X, AlertCircle, MapPin, Bell } from 'lucide-react';

interface Props {
  alerts: AnalysisResult[];
  isOpen: boolean;
  onClose: () => void;
  topic: string;
}

const AlertsModal: React.FC<Props> = ({ alerts, isOpen, onClose, topic }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col border border-red-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-red-600 p-6 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md animate-pulse">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Priority Alerts</h2>
              <p className="text-red-100 text-xs">Action Required: {alerts.length} Critical issues for "{topic}"</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-0 overflow-y-auto custom-scrollbar flex-1 bg-gray-50">
          {alerts.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {alerts.map((alert) => (
                <div key={alert.id} className="p-5 hover:bg-red-50/30 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="bg-red-100 p-2 rounded-full mt-1">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 bg-red-100 text-red-800 text-[10px] font-bold uppercase tracking-wider rounded border border-red-200">
                          {alert.category}
                        </span>
                        <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                          Source: {alert.source}
                        </span>
                      </div>
                      
                      <p className="text-gray-900 font-semibold leading-relaxed">
                        {alert.originalText}
                      </p>
                      
                      <div className="bg-white border border-red-100 p-3 rounded-lg">
                        <p className="text-xs text-red-900 font-medium italic">
                          " {alert.explanation} "
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <MapPin className="w-3.5 h-3.5" />
                          {alert.location || 'Unknown Location'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <div className="bg-gray-100 p-6 rounded-full mb-4">
                <Bell className="w-12 h-12 text-gray-300" />
              </div>
              <p className="font-medium">No critical alerts detected yet.</p>
              <p className="text-sm">High-urgency complaints will appear here.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-gray-100 flex justify-between items-center shrink-0">
          <p className="text-[10px] text-gray-400 italic">
            * These alerts are generated based on AI urgency detection.
          </p>
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-black transition-all shadow-lg shadow-gray-200"
          >
            Acknowledge All
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertsModal;
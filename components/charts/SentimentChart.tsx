import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AnalysisResult, Sentiment } from '../../types';

interface Props {
  data: AnalysisResult[];
}

const COLORS = {
  [Sentiment.Positive]: '#10b981', // Emerald 500
  [Sentiment.Neutral]: '#94a3b8',  // Slate 400
  [Sentiment.Negative]: '#ef4444', // Red 500
};

const SentimentChart: React.FC<Props> = ({ data }) => {
  const processedData = React.useMemo(() => {
    const counts = {
      [Sentiment.Positive]: 0,
      [Sentiment.Neutral]: 0,
      [Sentiment.Negative]: 0,
    };
    data.forEach(item => {
      if (counts[item.sentiment] !== undefined) {
        counts[item.sentiment]++;
      }
    });
    return [
      { name: 'Positive', value: counts[Sentiment.Positive] },
      { name: 'Neutral', value: counts[Sentiment.Neutral] },
      { name: 'Negative', value: counts[Sentiment.Negative] },
    ].filter(d => d.value > 0);
  }, [data]);

  return (
    <div className="h-full w-full p-2 flex flex-col relative">
      <div className="mb-4">
        <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider shrink-0">Sentiment Overview</h3>
      </div>

      <div className="flex-1 min-h-0 relative">
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <ResponsiveContainer width="99%" height="100%">
            <PieChart>
              <Pie
                data={processedData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {processedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name as Sentiment]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}/>
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SentimentChart;
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { AnalysisResult, Urgency } from '../../types';

interface Props {
  data: AnalysisResult[];
}

const COLORS = {
  [Urgency.High]: '#dc2626',   // Red 600
  [Urgency.Medium]: '#f59e0b', // Amber 500
  [Urgency.Low]: '#3b82f6',    // Blue 500
};

const UrgencyChart: React.FC<Props> = ({ data }) => {
  const processedData = React.useMemo(() => {
    const counts = {
      [Urgency.High]: 0,
      [Urgency.Medium]: 0,
      [Urgency.Low]: 0,
    };
    let total = 0;
    data.forEach(item => {
      if (counts[item.urgency] !== undefined) {
        counts[item.urgency]++;
        total++;
      }
    });
    return {
      chartData: [
        { name: 'High', value: counts[Urgency.High] },
        { name: 'Medium', value: counts[Urgency.Medium] },
        { name: 'Low', value: counts[Urgency.Low] },
      ].filter(d => d.value > 0),
      highCount: counts[Urgency.High],
      total
    };
  }, [data]);

  const highPercentage = processedData.total > 0 
    ? Math.round((processedData.highCount / processedData.total) * 100) 
    : 0;

  return (
    <div className="h-full w-full p-2 flex flex-col relative">
      <div className="mb-4">
         <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider shrink-0">Urgency Index</h3>
      </div>

      <div className="flex-1 min-h-0 relative">
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <ResponsiveContainer width="99%" height="100%">
            <PieChart>
              <Pie
                data={processedData.chartData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={90}
                startAngle={180}
                endAngle={0}
                paddingAngle={2}
                dataKey="value"
              >
                {processedData.chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name as Urgency]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}/>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
             <p className="text-3xl font-bold text-gray-800">{highPercentage}%</p>
             <p className="text-xs text-gray-500 font-medium">Critical Issues</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UrgencyChart;
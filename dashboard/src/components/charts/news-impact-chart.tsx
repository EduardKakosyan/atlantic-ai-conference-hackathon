'use client';

import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import mockData, { PersonaData, getAvailablePersonas } from '@/lib/mock-data';
import { NORMALIZED_THRESHOLD } from '@/lib/constants';

interface NewsImpactChartProps {
  className?: string;
}

type NewsFilter = 'fake' | 'real';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'];

export function NewsImpactChart({ className }: NewsImpactChartProps) {
  const availablePersonas = getAvailablePersonas();
  const [newsFilter, setNewsFilter] = useState<NewsFilter>('fake');
  
  // Transform data for the chart
  const prepareChartData = () => {
    // Filter data based on selected news type
    const filteredData = mockData.filter(item => {
      if (newsFilter === 'fake') return !item.is_real;
      if (newsFilter === 'real') return item.is_real;
      return true;
    });

    // Find the maximum iteration
    const maxIteration = Math.max(...filteredData.map(item => item.iteration));

    // Group by iteration and persona, separating fake and real news
    const chartData: Record<number, any> = {};
    
    // Initialize all iterations
    for (let i = 1; i <= maxIteration; i++) {
      chartData[i] = { iteration: i };
    }

    // Group data by persona and news type for extending lines
    const groupedData: Record<string, any> = {};
    filteredData.forEach(item => {
      const key = `${item.persona_name}_${item.is_real ? 'real' : 'fake'}`;
      if (!groupedData[key]) {
        groupedData[key] = [];
      }
      groupedData[key].push(item);
    });

    // For each persona/news type combination, sort by iteration and get the last point
    Object.entries(groupedData).forEach(([key, items]) => {
      const sortedItems = [...items].sort((a: any, b: any) => a.iteration - b.iteration);
      const lastItem = sortedItems[sortedItems.length - 1];
      
      // Add data points for all iterations
      for (let i = 1; i <= maxIteration; i++) {
        const itemForIteration = sortedItems.find((item: any) => item.iteration === i);
        
        if (itemForIteration) {
          // Use actual data
          chartData[i][key] = itemForIteration.normalized_current_rating;
          
          // Store additional data for tooltip
          chartData[i][`${key}_data`] = {
            reaction: itemForIteration.reaction,
            article: itemForIteration.article,
            reason: itemForIteration.reason
          };
        } else if (i > lastItem.iteration) {
          // For iterations after the last one, extend the final value as flat
          chartData[i][key] = lastItem.normalized_current_rating;
          
          // Store additional data for tooltip (using the last item's data)
          chartData[i][`${key}_data`] = {
            reaction: lastItem.reaction,
            article: lastItem.article,
            reason: lastItem.reason
          };
        }
      }
    });

    return Object.values(chartData).sort((a: any, b: any) => a.iteration - b.iteration);
  };

  const chartData = prepareChartData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-md rounded-md max-w-sm">
          <p className="font-bold text-sm">Iteration {label}</p>
          <div className="mt-2">
            {payload.map((entry: any, index: number) => {
              // Skip metadata entries (those ending with _data)
              if (entry.dataKey.endsWith('_data')) return null;
              
              const [persona, newsType] = entry.dataKey.split('_');
              const dataKey = `${entry.dataKey}_data`;
              const additionalData = payload.find((p: any) => p.dataKey === dataKey)?.payload[dataKey];
              
              return (
                <div key={`item-${index}`} className="mb-3">
                  <div className="flex items-center mb-1">
                    <div 
                      className="w-3 h-3 mr-2 rounded-full" 
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm font-medium">{persona}</span>
                    <span className="text-xs ml-2 px-1.5 py-0.5 rounded-full bg-gray-200">
                      {newsType === 'fake' ? 'Fake News' : 'Real News'}
                    </span>
                  </div>
                  <div className="text-sm ml-5">Rating: {Number(entry.value).toFixed(2)}</div>
                  
                  {additionalData && (
                    <div className="ml-5 mt-1 text-xs text-gray-600">
                      <div className={`font-medium ${additionalData.reaction === 'Positive' ? 'text-green-600' : 'text-red-600'}`}>
                        {additionalData.reaction} Reaction
                      </div>
                      {additionalData.article && (
                        <div className="mt-1 text-gray-700 line-clamp-2">{additionalData.article}</div>
                      )}
                    </div>
                  )}
                </div>
              );
            }).filter(Boolean)}
          </div>
        </div>
      );
    }
    return null;
  };

  // Function to get persona index for consistent colors
  const getPersonaColor = (personaName: string) => {
    const index = availablePersonas.indexOf(personaName);
    return COLORS[index % COLORS.length];
  };

  return (
    <div className={className}>
      <div className="flex flex-col gap-1 mb-6">
        <h2 className="text-xl font-bold">Impact of News Types on Persona Vaccine Attitudes</h2>
      </div>
      
      <div className="mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setNewsFilter('fake')}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              newsFilter === 'fake' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Fake News
          </button>
          <button
            onClick={() => setNewsFilter('real')}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              newsFilter === 'real' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Real News
          </button>
        </div>
      </div>

      <div className="h-[500px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 40, left: 30, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="5 5" opacity={0.3} />
            <XAxis 
              dataKey="iteration" 
              label={{ value: 'Iteration', position: 'insideBottomRight', offset: -5 }} 
              tick={{ fontSize: 12 }}
              axisLine={false}
            />
            <YAxis 
              domain={[0, 1]} 
              ticks={[0, 0.25, 0.5, 0.75, 1]}
              tickFormatter={(value) => value.toFixed(2)}
              label={{ value: 'Normalized Rating', angle: -90, position: 'insideBottomLeft' }}
              tick={{ fontSize: 12 }}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: 10 }}
              payload={availablePersonas.map(persona => ({
                value: persona,
                type: "circle",
                color: getPersonaColor(persona)
              }))}
            />
            <ReferenceLine 
              y={NORMALIZED_THRESHOLD} 
              stroke="red" 
              strokeDasharray="3 3" 
              label={{ 
                value: 'Threshold', 
                position: 'left', 
                fill: 'red',
                fontSize: 12
              }} 
            />
            
            {availablePersonas.map((persona) => {
              const color = getPersonaColor(persona);
              
              if (newsFilter === 'fake') {
                return (
                  <Line
                    key={`${persona}_fake`}
                    type="monotone"
                    dataKey={`${persona}_fake`}
                    stroke={color}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name={`${persona} (Fake News)`}
                    connectNulls={true}
                    dot={false}
                  />
                );
              }
              return null;
            })}
            
            {availablePersonas.map((persona) => {
              const color = getPersonaColor(persona);
              
              if (newsFilter === 'real') {
                return (
                  <Line
                    key={`${persona}_real`}
                    type="monotone"
                    dataKey={`${persona}_real`}
                    stroke={color}
                    strokeWidth={2}
                    name={`${persona} (Real News)`}
                    connectNulls={true}
                    dot={false}
                  />
                );
              }
              return null;
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>
          <span className="text-red-500">Red line</span> at 0.8 represents the threshold where personas would decide to take the vaccine.
        </p>
      </div>
    </div>
  );
}

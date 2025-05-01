'use client';

import { useState } from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import mockData, { getAvailablePersonas } from '@/lib/mock-data';
import { THRESHOLD, NORMALIZED_THRESHOLD } from '@/lib/constants';

interface PersonaTrajectoriesProps {
  className?: string;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'];

export function PersonaTrajectories({ className }: PersonaTrajectoriesProps) {
  const availablePersonas = getAvailablePersonas();
  const [selectedPersonas, setSelectedPersonas] = useState<string[]>(availablePersonas);

  // Transform data for the chart
  const prepareChartData = () => {
    // Create an array of objects with iteration number and persona ratings
    const iterationMap = new Map<number, any>();

    // First pass: collect all iterations and initialize objects
    mockData.forEach((item) => {
      if (!iterationMap.has(item.iteration)) {
        iterationMap.set(item.iteration, { iteration: item.iteration });
      }
    });

    // Second pass: add persona data to each iteration object
    mockData.forEach((item) => {
      if (selectedPersonas.includes(item.persona_name)) {
        const iterationObj = iterationMap.get(item.iteration);
        iterationObj[item.persona_name] = item.current_rating;
      }
    });

    // Convert map to array and sort by iteration
    return Array.from(iterationMap.values()).sort((a, b) => a.iteration - b.iteration);
  };

  const chartData = prepareChartData();

  const togglePersona = (persona: string) => {
    setSelectedPersonas(prev => 
      prev.includes(persona) 
        ? prev.filter(p => p !== persona) 
        : [...prev, persona]
    );
  };

  // Function to get persona index for consistent colors
  const getPersonaIndex = (personaName: string) => {
    return availablePersonas.indexOf(personaName);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-md rounded-md">
          <p className="font-bold text-sm">Iteration {label}</p>
          <div className="mt-2">
            {payload.map((entry: any, index: number) => (
              <div key={`item-${index}`} className="flex items-center mb-1">
                <div 
                  className="w-3 h-3 mr-2 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm font-medium">{entry.name}: </span>
                <span className="text-sm ml-1">{Number(entry.value).toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={className}>
      <h2 className="text-xl font-bold mb-4">Persuasion Trajectory</h2>
      <div className="mb-4 flex flex-wrap gap-2">
        {availablePersonas.map((persona) => {
          const index = getPersonaIndex(persona);
          const isSelected = selectedPersonas.includes(persona);
          return (
            <button
              key={persona}
              onClick={() => togglePersona(persona)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                isSelected ? 'text-white' : 'bg-gray-200 text-gray-700'
              }`}
              style={{
                backgroundColor: isSelected ? COLORS[index % COLORS.length] : undefined
              }}
            >
              {persona}
            </button>
          );
        })}
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart
            data={chartData}
            margin={{ top: 20, right: 40, left: 30, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="iteration" 
              label={{ value: 'Iteration', position: 'insideBottomRight', offset: -5 }} 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              domain={[1, 4]} 
              ticks={[1, 1.5, 2, 2.5, 3, 3.5, 4]}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: 10 }} />
            <ReferenceLine y={THRESHOLD} stroke="red" strokeDasharray="3 3" />
            
            {selectedPersonas.map((persona) => {
              const index = getPersonaIndex(persona);
              return (
                <Line
                  key={persona}
                  type="monotone"
                  dataKey={persona}
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                  name={persona}
                  dot={false}
                />
              );
            })}
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>The <span className="text-red-500">red line</span> at 3.4 represents the threshold where personas would decide to take the vaccine.</p>
      </div>
    </div>
  );
} 
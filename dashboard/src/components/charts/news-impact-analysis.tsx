'use client';

import { useMemo } from 'react';
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

// Utility function to reverse values (for fake news visualization)
const reverseImpact = (value: number) => -value;

interface NewsImpactAnalysisProps {
  className?: string;
}

export function NewsImpactAnalysis({ className }: NewsImpactAnalysisProps) {
  const availablePersonas = getAvailablePersonas();

  // Calculate impact data - average change in rating per iteration by news type
  const impactData = useMemo(() => {
    // Group data by persona and news type
    const personaProgress: Record<string, { fake: PersonaData[], real: PersonaData[] }> = {};

    // Initialize persona records
    availablePersonas.forEach(persona => {
      personaProgress[persona] = { fake: [], real: [] };
    });

    // Group data by persona and news type (fake/real)
    mockData.forEach(item => {
      if (item.is_real) {
        personaProgress[item.persona_name].fake.push(item);
      } else {
        personaProgress[item.persona_name].real.push(item);
      }
    });

    // Calculate average change per iteration
    const result = {
      averageChangePerIteration: { fake: 0, real: 0 },
      cumulativeRatingsByIteration: [] as any[],
      fakeNewsExposureCount: 0,
      realNewsExposureCount: 0,
    };

    // Count number of exposures to each type
    result.fakeNewsExposureCount = mockData.filter(item => !item.is_real).length;
    result.realNewsExposureCount = mockData.filter(item => item.is_real).length;

    // Calculate total change and average change per iteration for each news type
    let totalFakeChange = 0;
    let totalRealChange = 0;

    // Process each persona's progress
    Object.entries(personaProgress).forEach(([persona, data]) => {
      // Sort by iteration
      const fakeData = [...data.fake].sort((a, b) => a.iteration - b.iteration);
      const realData = [...data.real].sort((a, b) => a.iteration - b.iteration);

      // Calculate total change for fake news
      if (fakeData.length > 1) {
        const fakeChange = fakeData[fakeData.length - 1].normalized_current_rating - fakeData[0].normalized_current_rating;
        totalFakeChange += fakeChange;
      }

      // Calculate total change for real news
      if (realData.length > 1) {
        const realChange = realData[realData.length - 1].normalized_current_rating - realData[0].normalized_current_rating;
        totalRealChange += realChange;
      }
    });

    // Calculate average change per iteration per news type
    const fakePersonaCount = Object.values(personaProgress).filter(data => data.fake.length > 1).length;
    const realPersonaCount = Object.values(personaProgress).filter(data => data.real.length > 1).length;

    if (fakePersonaCount > 0) {
      result.averageChangePerIteration.fake = totalFakeChange / fakePersonaCount;
    }

    if (realPersonaCount > 0) {
      result.averageChangePerIteration.real = totalRealChange / realPersonaCount;
    }

    // Calculate cumulative ratings per iteration for each news type
    const maxIteration = Math.max(...mockData.map(item => item.iteration));
    for (let i = 1; i <= maxIteration; i++) {
      const iterationData = {
        iteration: i,
        avgFakeRating: 0,
        avgRealRating: 0,
        fakeCount: 0,
        realCount: 0,
        cumulativeFakeChange: 0,
        cumulativeRealChange: 0
      };

      // Calculate average rating for this iteration
      const fakeItems = mockData.filter(item => !item.is_real && item.iteration === i);
      const realItems = mockData.filter(item => item.is_real && item.iteration === i);

      if (fakeItems.length > 0) {
        iterationData.avgFakeRating = fakeItems.reduce((sum, item) => sum + item.normalized_current_rating, 0) / fakeItems.length;
        iterationData.fakeCount = fakeItems.length;
      }

      if (realItems.length > 0) {
        iterationData.avgRealRating = realItems.reduce((sum, item) => sum + item.normalized_current_rating, 0) / realItems.length;
        iterationData.realCount = realItems.length;
      }

      // Calculate cumulative change
      if (i === 1) {
        iterationData.cumulativeFakeChange = iterationData.avgFakeRating;
        iterationData.cumulativeRealChange = iterationData.avgRealRating;
      } else {
        const prevData = result.cumulativeRatingsByIteration[i - 2];
        iterationData.cumulativeFakeChange = prevData.cumulativeFakeChange +
          (fakeItems.length > 0 ? iterationData.avgFakeRating - prevData.avgFakeRating : 0);
        iterationData.cumulativeRealChange = prevData.cumulativeRealChange +
          (realItems.length > 0 ? iterationData.avgRealRating - prevData.avgRealRating : 0);
      }

      result.cumulativeRatingsByIteration.push(iterationData);
    }

    return result;
  }, [availablePersonas]);

  const ImpactTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-md rounded-md">
          <p className="font-bold text-sm">Iteration {label}</p>
          <div className="mt-2">
            {payload.map((entry: any, index: number) => {
              // Special case for fake news data
              if (entry.dataKey === 'reversedFakeRating') {
                return (
                  <div key={`item-${index}`} className="flex items-center mb-1">
                    <div
                      className="w-3 h-3 mr-2 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm font-medium">{entry.name}: </span>
                    <span className="text-sm ml-1">{Number(entry.value).toFixed(3)}</span>
                    <span className="text-xs ml-2 text-gray-500">(higher is better)</span>
                  </div>
                );
              }
              
              return (
                <div key={`item-${index}`} className="flex items-center mb-1">
                  <div
                    className="w-3 h-3 mr-2 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm font-medium">{entry.name}: </span>
                  <span className="text-sm ml-1">{Number(entry.value).toFixed(3)}</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={className}>
      <div className="flex flex-col gap-1 mb-6">
        <h2 className="text-xl font-bold">News Type Impact Analysis</h2>
      </div>

      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-bold text-sm mb-2">News Exposure Overview</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white rounded-md shadow-sm">
                <p className="text-xs text-gray-600">Real News Exposures</p>
                <p className="text-2xl font-bold">{impactData.realNewsExposureCount}</p>
              </div>
              <div className="p-3 bg-white rounded-md shadow-sm">
                <p className="text-xs text-gray-600">Fake News Exposures</p>
                <p className="text-2xl font-bold">{impactData.fakeNewsExposureCount}</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-bold text-sm mb-2">Average Attitude Change</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white rounded-md shadow-sm">
                <p className="text-xs text-gray-600">Real News Impact</p>
                <p className={`text-2xl font-bold ${impactData.averageChangePerIteration.real >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {impactData.averageChangePerIteration.real >= 0 ? '+' : ''}
                  {impactData.averageChangePerIteration.real.toFixed(3)}
                </p>
              </div>
              <div className="p-3 bg-white rounded-md shadow-sm">
                <p className="text-xs text-gray-600">Fake News Impact</p>
                <div className="flex items-center">
                  <p className={`text-2xl font-bold ${reverseImpact(impactData.averageChangePerIteration.fake) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {reverseImpact(impactData.averageChangePerIteration.fake) >= 0 ? '+' : ''}
                    {reverseImpact(impactData.averageChangePerIteration.fake).toFixed(3)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={impactData.cumulativeRatingsByIteration.map(item => ({
                ...item,
                // Create a reversed fake news rating metric for visualization
                reversedFakeRating: 1 - item.avgFakeRating
              }))}
              margin={{ top: 20, right: 40, left: 30, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
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
                label={{ value: 'Average Rating', angle: -90, position: 'insideBottomLeft' }}
                tick={{ fontSize: 12 }}
                axisLine={false}
              />
              <Tooltip content={<ImpactTooltip />} />
              <Legend 
                wrapperStyle={{ paddingTop: 10 }} 
                iconType="circle"
                iconSize={10}
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

              <Line
                type="monotone"
                dataKey="reversedFakeRating"
                name="Fake News"
                stroke="#ef4444"
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={false}
              />

              <Line
                type="monotone"
                dataKey="avgRealRating"
                name="Real News"
                stroke="#0088fe"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
} 
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
      if (item.is_fake) {
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
    result.fakeNewsExposureCount = mockData.filter(item => item.is_fake).length;
    result.realNewsExposureCount = mockData.filter(item => !item.is_fake).length;
    
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
      const fakeItems = mockData.filter(item => item.is_fake && item.iteration === i);
      const realItems = mockData.filter(item => !item.is_fake && item.iteration === i);
      
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
            {payload.map((entry: any, index: number) => (
              <div key={`item-${index}`} className="flex items-center mb-1">
                <div 
                  className="w-3 h-3 mr-2 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm font-medium">{entry.name}: </span>
                <span className="text-sm ml-1">{Number(entry.value).toFixed(3)}</span>
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
      <div className="flex flex-col gap-1 mb-6">
        <h2 className="text-xl font-bold">News Type Impact Analysis</h2>
        <p className="text-sm text-gray-600">Comparing the impact of real vs fake news on vaccine attitudes</p>
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
                <p className={`text-2xl font-bold ${impactData.averageChangePerIteration.fake >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {impactData.averageChangePerIteration.fake >= 0 ? '+' : ''}
                  {impactData.averageChangePerIteration.fake.toFixed(3)}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={impactData.cumulativeRatingsByIteration}
              margin={{ top: 20, right: 40, left: 30, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="iteration" 
                label={{ value: 'Iteration', position: 'insideBottomRight', offset: -5 }} 
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                domain={[0, 1]} 
                ticks={[0, 0.25, 0.5, 0.75, 1]}
                tickFormatter={(value) => value.toFixed(2)}
                label={{ value: 'Average Rating', angle: -90, position: 'insideLeft' }}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<ImpactTooltip />} />
              <Legend wrapperStyle={{ paddingTop: 10 }} />
              <ReferenceLine y={0.875} stroke="red" strokeDasharray="3 3" label="Threshold (3.5)" />
              
              <Line
                type="monotone"
                dataKey="avgFakeRating"
                name="Fake News Avg"
                stroke="#ff8042"
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={{ r: 5 }}
              />
              
              <Line
                type="monotone"
                dataKey="avgRealRating"
                name="Real News Avg"
                stroke="#0088fe"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-bold text-sm mb-2">Analysis Insights</h3>
          <p className="text-sm text-gray-800 mb-3">
            {impactData.averageChangePerIteration.real > impactData.averageChangePerIteration.fake ? (
              <span>Real news content shows <span className="font-bold">faster attitude change</span> compared to fake news, with an average increase of {impactData.averageChangePerIteration.real.toFixed(3)} points per iteration versus {impactData.averageChangePerIteration.fake.toFixed(3)} for fake news.</span>
            ) : (
              <span>Fake news content shows <span className="font-bold">faster attitude change</span> compared to real news, with an average increase of {impactData.averageChangePerIteration.fake.toFixed(3)} points per iteration versus {impactData.averageChangePerIteration.real.toFixed(3)} for real news.</span>
            )}
          </p>
          <p className="text-sm text-gray-800">
            The chart shows the average rating across all personas for each news type over iterations, illustrating the comparative impact of fake versus real news on vaccine attitudes.
          </p>
        </div>
      </div>
    </div>
  );
} 
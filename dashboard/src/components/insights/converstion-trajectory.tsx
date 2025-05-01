'use client';

import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
} from 'recharts';
import mockData, { getAvailablePersonas } from '@/lib/mock-data';

interface ConversionTrajectoryProps {
  className?: string;
}

// Define blue color scale
const BLUE_COLORS = [
  '#dbeafe', // blue-100
  '#bfdbfe', // blue-200
  '#93c5fd', // blue-300
  '#60a5fa', // blue-400
  '#3b82f6', // blue-500
  '#2563eb', // blue-600
  '#1d4ed8', // blue-700
  '#1e40af', // blue-800
  '#1e3a8a', // blue-900
];

export function ConversionTrajectory({ className }: ConversionTrajectoryProps) {
  const availablePersonas = getAvailablePersonas();

  const trajectoryData = useMemo(() => {
    const personaChanges = availablePersonas.map((personaName) => {
      // Filter data for this persona
      const personaData = mockData.filter(
        (item) => item.persona_name === personaName
      );

      // Sort by iteration to ensure correct order
      personaData.sort((a, b) => a.iteration - b.iteration);

      // Find first and last iterations
      const firstIteration = personaData[0];
      const lastIteration = personaData[personaData.length - 1];

      // Calculate the change in ratings
      const ratingChange = lastIteration.normalized_current_rating - firstIteration.normalized_current_rating;
      const absoluteRatingChange = Math.abs(ratingChange);
      
      // Get the final iteration number
      const finalIteration = lastIteration.iteration;

      // Calculate change per iteration
      const changePerIteration = ratingChange / finalIteration;

      return {
        name: personaName,
        startRating: firstIteration.normalized_current_rating,
        endRating: lastIteration.normalized_current_rating,
        ratingChange,
        absoluteRatingChange,
        finalIteration,
        changePerIteration,
        direction: ratingChange >= 0 ? 'positive' : 'negative',
      };
    });

    // Sort by absolute rating change in descending order to show most changed first
    return personaChanges.sort((a, b) => b.absoluteRatingChange - a.absoluteRatingChange);
  }, [availablePersonas]);

  // Function to determine color index based on absoluteRatingChange
  const getColorIndex = (value: number) => {
    // Find the max rating change to normalize the scale
    const maxChange = trajectoryData[0]?.absoluteRatingChange || 1;
    // Calculate the relative position in the color scale (0-1)
    const relativePosition = value / maxChange;
    // Map to the color array index (0-8)
    return Math.min(Math.floor(relativePosition * BLUE_COLORS.length), BLUE_COLORS.length - 1);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-md rounded-md">
          <p className="font-bold">{data.name}</p>
          <div className="mt-2 space-y-1 text-sm">
            <p>Initial Rating: {(data.startRating * 100).toFixed(1)}%</p>
            <p>Final Rating: {(data.endRating * 100).toFixed(1)}%</p>
            <p>Absolute Change: {(data.absoluteRatingChange * 100).toFixed(1)}%</p>
            <p>Direction: {data.direction === 'positive' ? 'Increased' : 'Decreased'}</p>
            <p>Iterations: {data.finalIteration}</p>
            <p>Change per Iteration: {(data.changePerIteration * 100).toFixed(1)}% per iteration</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={className}>
      <h2 className="text-xl font-bold mb-4">Conversion Trajectory</h2>
      <p className="text-sm text-gray-600 mb-4">
        This chart shows which personas experienced the greatest change in their likelihood to take the vaccine,
        measured by the absolute difference between their initial and final ratings.
      </p>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={trajectoryData}
            margin={{ top: 20, right: 30, left: 30, bottom: 50 }}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} horizontal={true} vertical={false} />
            <XAxis 
              type="number" 
              domain={[0, 1]}
              tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
              label={{ value: 'Absolute Rating Change', position: 'insideBottom', offset: -10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              width={80}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="absoluteRatingChange" 
              radius={[4, 4, 4, 4]}
            >
              {trajectoryData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={BLUE_COLORS[getColorIndex(entry.absoluteRatingChange)]} 
                />
              ))}
              <LabelList 
                dataKey="absoluteRatingChange" 
                position="right" 
                formatter={(value: number) => `${(value * 100).toFixed(1)}%`}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-6 space-y-2">
        <h3 className="text-lg font-semibold">Key Insights:</h3>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
          <li>
            <span className="font-medium">{trajectoryData[0].name}</span> showed the most significant change
            ({(trajectoryData[0].absoluteRatingChange * 100).toFixed(1)}%) in their vaccination stance.
          </li>
          <li>
            <span className="font-medium">{trajectoryData[trajectoryData.length - 1].name}</span> was the least affected
            by the simulation, changing only {(trajectoryData[trajectoryData.length - 1].absoluteRatingChange * 100).toFixed(1)}%.
          </li>
          {trajectoryData.filter(d => d.direction === 'negative').length > 0 && (
            <li>
              {trajectoryData.filter(d => d.direction === 'negative').length} persona(s) became less likely to take the vaccine
              during the simulation.
            </li>
          )}
        </ul>
      </div>

      <div className="mt-4 flex items-center">
        <span className="text-xs text-gray-500 mr-2">Color intensity indicates magnitude of change:</span>
        <div className="flex h-4">
          {BLUE_COLORS.map((color, i) => (
            <div 
              key={i} 
              style={{ backgroundColor: color }} 
              className="w-6" 
            />
          ))}
        </div>
        <span className="text-xs text-gray-500 ml-2">Lower → Higher impact</span>
      </div>
    </div>
  );
}

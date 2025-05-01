'use client';

import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import mockData from '@/lib/mock-data';

interface ReactionByIterationProps {
  className?: string;
}

const COLORS = {
  Positive: '#4ade80', // green
  Negative: '#f87171'  // red
};

export function ReactionByIteration({ className }: ReactionByIterationProps) {
  // Transform data for the chart
  const prepareChartData = () => {
    // Create an array of objects with iteration number and reaction counts
    const iterationMap = new Map<number, any>();

    // First pass: collect all iterations and initialize objects
    for (let i = 1; i <= 10; i++) {
      iterationMap.set(i, { 
        iteration: i, 
        Positive: 0, 
        Negative: 0,
        total: 0
      });
    }

    // Second pass: count reactions for each iteration
    mockData.forEach((item) => {
      const iterationObj = iterationMap.get(item.iteration);
      if (iterationObj) {
        iterationObj[item.reaction] += 1;
        iterationObj.total += 1;
      }
    });

    // Convert map to array and sort by iteration
    return Array.from(iterationMap.values())
      .sort((a, b) => a.iteration - b.iteration)
      // Calculate percentages
      .map(item => ({
        ...item,
        PositivePercentage: item.total > 0 ? (item.Positive / item.total) * 100 : 0,
        NegativePercentage: item.total > 0 ? (item.Negative / item.total) * 100 : 0,
      }));
  };

  const chartData = prepareChartData();

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
                <span className="text-sm ml-1">{Number(entry.value).toFixed(1)}%</span>
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
      <h2 className="text-xl font-bold mb-4">Reaction Distribution Over Time</h2>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 30, bottom: 30 }}
            stackOffset="expand"
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="iteration" 
              label={{ value: 'Iteration', position: 'insideBottomRight', offset: -5 }} 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
              domain={[0, 1]}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: 10 }} />
            
            <Area
              type="monotone"
              dataKey="PositivePercentage"
              stackId="1"
              stroke={COLORS.Positive}
              fill={COLORS.Positive}
              name="Positive"
            />
            <Area
              type="monotone"
              dataKey="NegativePercentage"
              stackId="1"
              stroke={COLORS.Negative}
              fill={COLORS.Negative}
              name="Negative"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>This chart shows how the proportion of positive vs. negative reactions changes across iterations.</p>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import mockData, { PersonaData } from '@/lib/mock-data';
import { TrendingUp, TrendingDown, BarChart4 } from 'lucide-react';

// Insight calculations
const calculateMostPersuadablePersona = (): { name: string, improvement: number } => {
  const personaImprovements: Record<string, number> = {};
  
  // Get all unique persona names
  const personaNames = [...new Set(mockData.map(item => item.persona_name))];
  
  // Calculate improvements for each persona
  personaNames.forEach(name => {
    const personaData = mockData.filter(item => item.persona_name === name);
    
    // Sort by iteration to get first and last entries
    const sortedData = [...personaData].sort((a, b) => a.iteration - b.iteration);
    const firstEntry = sortedData[0];
    const lastEntry = sortedData[sortedData.length - 1];
    
    if (firstEntry && lastEntry) {
      personaImprovements[name] = 
        lastEntry.normalized_current_rating - firstEntry.normalized_current_rating;
    }
  });
  
  // Find persona with highest improvement
  let highestImprovement = 0;
  let mostPersuadableName = '';
  
  Object.entries(personaImprovements).forEach(([name, improvement]) => {
    if (improvement > highestImprovement) {
      highestImprovement = improvement;
      mostPersuadableName = name;
    }
  });
  
  return { 
    name: mostPersuadableName, 
    improvement: parseFloat((highestImprovement * 100).toFixed(1)) 
  };
};

const calculateLeastPersuadablePersona = (): { name: string, improvement: number } => {
  const personaImprovements: Record<string, number> = {};
  
  // Get all unique persona names
  const personaNames = [...new Set(mockData.map(item => item.persona_name))];
  
  // Calculate improvements for each persona
  personaNames.forEach(name => {
    const personaData = mockData.filter(item => item.persona_name === name);
    
    // Sort by iteration to get first and last entries
    const sortedData = [...personaData].sort((a, b) => a.iteration - b.iteration);
    const firstEntry = sortedData[0];
    const lastEntry = sortedData[sortedData.length - 1];
    
    if (firstEntry && lastEntry) {
      personaImprovements[name] = 
        lastEntry.normalized_current_rating - firstEntry.normalized_current_rating;
    }
  });
  
  // Find persona with lowest improvement
  let lowestImprovement = Infinity;
  let leastPersuadableName = '';
  
  Object.entries(personaImprovements).forEach(([name, improvement]) => {
    if (improvement < lowestImprovement) {
      lowestImprovement = improvement;
      leastPersuadableName = name;
    }
  });
  
  return { 
    name: leastPersuadableName, 
    improvement: parseFloat((lowestImprovement * 100).toFixed(1)) 
  };
};

const calculateConversionRate = (): number => {
  const personaNames = [...new Set(mockData.map(item => item.persona_name))];
  const threshold = 0.8; // 80% normalized rating threshold
  let convertedCount = 0;
  
  personaNames.forEach(name => {
    const personaData = mockData.filter(item => item.persona_name === name);
    
    // Sort by iteration to get the last entry
    const sortedData = [...personaData].sort((a, b) => a.iteration - b.iteration);
    const lastEntry = sortedData[sortedData.length - 1];
    
    if (lastEntry && lastEntry.normalized_current_rating >= threshold) {
      convertedCount++;
    }
  });
  
  return parseFloat(((convertedCount / personaNames.length) * 100).toFixed(0));
};

export const QuickInsights: React.FC<{ className?: string }> = ({ className }) => {
  const mostPersuadable = calculateMostPersuadablePersona();
  const leastPersuadable = calculateLeastPersuadablePersona();
  const conversionRate = calculateConversionRate();
  
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 ${className}`}>
      <div className="bg-white rounded-lg p-4 border border-white/20 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400 mb-1">Most Improved Persona</p>
            <div className="flex items-center">
              <h3 className="text-2xl font-bold">{mostPersuadable.name}</h3>
              <span className="ml-2 text-sm text-emerald-400">+{mostPersuadable.improvement}%</span>
            </div>
          </div>
          <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-emerald-500" />
          </div>
        </div>
        <p className="text-sm text-gray-400 mt-2">
          Largest increase in willingness to get vaccinated
        </p>
      </div>
      
      <div className="bg-white rounded-lg p-4 border border-white/20 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400 mb-1">Most Resistant Persona</p>
            <div className="flex items-center">
              <h3 className="text-2xl font-bold">{leastPersuadable.name}</h3>
              <span className="ml-2 text-sm text-amber-400">+{leastPersuadable.improvement}%</span>
            </div>
          </div>
          <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center">
            <TrendingDown className="h-5 w-5 text-amber-500" />
          </div>
        </div>
        <p className="text-sm text-gray-400 mt-2">
          Smallest change in vaccination acceptance
        </p>
      </div>
      
      <div className="bg-white rounded-lg p-4 border border-white/20 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400 mb-1">Conversion Rate</p>
            <div className="flex items-center">
              <h3 className="text-2xl font-bold">{conversionRate}%</h3>
            </div>
          </div>
          <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
            <BarChart4 className="h-5 w-5 text-blue-500" />
          </div>
        </div>
        <p className="text-sm text-gray-400 mt-2">
          Personas reaching high acceptance threshold
        </p>
      </div>
    </div>
  );
};

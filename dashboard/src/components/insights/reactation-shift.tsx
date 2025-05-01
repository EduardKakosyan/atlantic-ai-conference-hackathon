'use client';

import { useMemo, useCallback } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Label,
} from 'recharts';
import { Check } from 'lucide-react';
import mockData, { getAvailablePersonas, PersonaData } from '@/lib/mock-data';

interface ReactionShiftProps {
  className?: string;
}

// Color palette for different personas
const PERSONA_COLORS = {
  Brian: '#3b82f6', // blue-500
  Sarah: '#10b981', // emerald-500
  Michael: '#f59e0b', // amber-500
  Emily: '#8b5cf6', // violet-500
  David: '#ef4444', // red-500
};

export function ReactionShift({ className }: ReactionShiftProps) {
  const availablePersonas = getAvailablePersonas();

  const reactionShiftData = useMemo(() => {
    return availablePersonas.map((personaName) => {
      // Filter data for this persona
      const personaData = mockData.filter(
        (item) => item.persona_name === personaName
      );

      // Sort by iteration to ensure correct order
      personaData.sort((a, b) => a.iteration - b.iteration);

      // Find where reaction shifted from Negative to Positive
      const shiftPoints: { iteration: number; data: PersonaData }[] = [];
      
      for (let i = 1; i < personaData.length; i++) {
        if (
          personaData[i - 1].reaction === 'Negative' &&
          personaData[i].reaction === 'Positive'
        ) {
          shiftPoints.push({ 
            iteration: personaData[i].iteration,
            data: personaData[i]
          });
        }
      }

      // Prepare data for visualization with standard ratings (1-4 scale)
      const chartData = personaData.map((data) => ({
        iteration: data.iteration,
        [personaName]: data.current_rating,
        reaction: data.reaction,
      }));

      return {
        name: personaName,
        chartData,
        shiftPoints,
        color: PERSONA_COLORS[personaName as keyof typeof PERSONA_COLORS] || '#94a3b8', // slate-400 as fallback
        hasShift: shiftPoints.length > 0,
        initialReaction: personaData[0].reaction,
        finalReaction: personaData[personaData.length - 1].reaction,
      };
    });
  }, [availablePersonas]);

  // Combine all chart data
  const combinedChartData = useMemo(() => {
    const iterationData: Record<number, any> = {};
    const maxIteration = Math.max(...reactionShiftData.flatMap(p => p.chartData.map(d => d.iteration)));
    
    // Initialize data for all iterations
    for (let i = 1; i <= maxIteration; i++) {
      iterationData[i] = { iteration: i };
    }
    
    reactionShiftData.forEach((persona) => {
      // Get the last data point for this persona
      const lastDataPoint = persona.chartData[persona.chartData.length - 1];
      
      // Fill in all iterations for this persona
      for (let i = 1; i <= maxIteration; i++) {
        // Find the actual data for this iteration if it exists
        const dataForIteration = persona.chartData.find(d => d.iteration === i);
        
        if (dataForIteration) {
          // Use actual data
          iterationData[i][persona.name] = dataForIteration[persona.name];
          iterationData[i][`${persona.name}Reaction`] = dataForIteration.reaction;
        } else if (i > lastDataPoint.iteration) {
          // For iterations after the last one, extend the final value as flat
          iterationData[i][persona.name] = lastDataPoint[persona.name];
          iterationData[i][`${persona.name}Reaction`] = lastDataPoint.reaction;
        }
      }
    });
    
    return Object.values(iterationData).sort((a, b) => a.iteration - b.iteration);
  }, [reactionShiftData]);

  // Generate annotations for shift points
  const shiftAnnotations = useMemo(() => {
    const annotations: Array<{
      x: number;
      y: number;
      personaName: string;
      color: string;
      iteration: number;
    }> = [];
    
    reactionShiftData.forEach(persona => {
      if (persona.hasShift) {
        persona.shiftPoints.forEach(point => {
          // Find the corresponding chart data point
          const dataPoint = combinedChartData.find(d => d.iteration === point.iteration);
          if (dataPoint) {
            annotations.push({
              x: point.iteration,
              y: dataPoint[persona.name],
              personaName: persona.name,
              color: persona.color,
              iteration: point.iteration
            });
          }
        });
      }
    });
    
    return annotations;
  }, [reactionShiftData, combinedChartData]);
  
  // Custom label component for shift annotations
  const ShiftLabel = ({ x, y, value }: any) => {
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={15}
          y={-15}
          dy={-4}
          fill={value.color}
          fontSize={11}
          textAnchor="start"
          fontWeight="bold"
        >
          {value.personaName} shifted at iteration {value.iteration}
        </text>
      </g>
    );
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium mb-2">Iteration {label}</p>
          <div className="space-y-1.5">
            {payload.map((entry: any, index: number) => {
              const personaName = entry.dataKey;
              const reaction = payload[0].payload[`${personaName}Reaction`];
              
              // Check if this point is a shift point
              const isShiftPoint = reactionShiftData.some(persona => 
                persona.name === personaName && 
                persona.shiftPoints.some(p => p.iteration === label)
              );
              
              return (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span>{personaName}: </span>
                  <span className="font-medium">{entry.value.toFixed(1)}</span>
                  <span 
                    className={`px-1.5 py-0.5 text-xs rounded ${
                      reaction === 'Positive' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {reaction}
                  </span>
                  {isShiftPoint && (
                    <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 font-medium rounded-full">
                      Sentiment Shift!
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  const renderShiftPointMarkers = useCallback(() => {
    let markers = [];
    
    // Add shift point markers
    for (const persona of reactionShiftData) {
      if (persona.hasShift) {
        for (const point of persona.shiftPoints) {
          const dataPoint = combinedChartData.find(d => d.iteration === point.iteration);
          if (dataPoint) {
            // Find coordinates from chart data
            const iterationIndex = combinedChartData.findIndex(d => d.iteration === point.iteration);
            // We'll add this as an overlay later
            markers.push({
              personaName: persona.name,
              color: persona.color,
              iteration: point.iteration,
              iterationIndex,
              value: dataPoint[persona.name]
            });
          }
        }
      }
    }
    
    return markers;
  }, [reactionShiftData, combinedChartData]);

  // Get all the shift points
  const shiftPointMarkers = useMemo(() => renderShiftPointMarkers(), [renderShiftPointMarkers]);

  // Custom legend that supports icons
  const CustomLegend = (props: any) => {
    const { payload } = props;

    return (
      <ul className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 mb-2 mt-1">
        {payload.map((entry: any, index: number) => {
          const personaName = entry.value;
          const color = entry.color;
          const persona = reactionShiftData.find(p => p.name === personaName);
          const hasShift = persona?.hasShift || false;

          return (
            <li key={`item-${index}`} className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: color }}
              />
              <span>{personaName}</span>
              {hasShift && <Check className="ml-1 h-4 w-4 text-green-600" />}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className={className}>
      <h2 className="text-xl font-bold mb-4">Reaction Sentiment Shift</h2>
      <p className="text-sm text-gray-600 mb-4">
        This chart tracks when personas shifted from a Negative to Positive reaction during the simulation.
        <span className="font-medium text-blue-600"> Large highlighted circles indicate the exact moment when sentiment shifted.</span>
      </p>

      <div className="h-[400px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={combinedChartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis 
              dataKey="iteration" 
              label={{ value: 'Iteration', position: 'insideBottom', offset: -10 }}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              domain={[1, 4]} 
              tickFormatter={(value) => `${value.toFixed(1)}`}
              label={{ value: 'Rating (1-4)', angle: -90, position: 'insideLeft' }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} verticalAlign="top" height={36} />
            
            {/* Reference line for the threshold (3.5) */}
            <ReferenceLine 
              y={3.5} 
              stroke="#94a3b8" 
              strokeDasharray="3 3" 
              label={{ value: 'Vaccine Acceptance Threshold', position: 'right', fill: '#94a3b8' }} 
            />
            
            {/* Render lines for each persona */}
            {reactionShiftData.map((persona) => (
              <Line
                key={persona.name}
                type="monotone"
                dataKey={persona.name}
                stroke={persona.color}
                strokeWidth={2}
                // Using the built-in dot pattern, but only showing dots at shift points
                dot={({ cx, cy, index }) => {
                  const iterationValue = combinedChartData[index].iteration;
                  const isShiftPoint = persona.shiftPoints.some(p => p.iteration === iterationValue);
                  
                  if (isShiftPoint) {
                    return (
                      <g>
                        <circle cx={cx} cy={cy} r={6} fill={persona.color} />
                      </g>
                    );
                  }
                  
                  return <circle cx={cx} cy={cy} r={0} />;
                }}
                activeDot={{ r: 6 }}
                name={persona.name}
                connectNulls
              />
            ))}
            
            {/* Add annotations for shift points */}
            {shiftAnnotations.map((annotation, index) => (
              <ReferenceLine
                key={`annotation-${index}`}
                x={annotation.x}
                stroke={annotation.color}
                strokeDasharray="3 3"
                opacity={0.5}
              >
                <Label
                  content={<ShiftLabel value={annotation} />}
                  position="insideTopRight"
                />
              </ReferenceLine>
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      
      <div className="mt-4 text-xs text-gray-500">
        <div className="flex items-center gap-2 mt-1">
          <svg width="24" height="24" className="inline-block">
            <circle cx="12" cy="12" r="6" fill="#3b82f6" />
          </svg>
          <span>Sentiment shift point - marks when reaction changed from Negative to Positive</span>
        </div>
        
      </div>
    </div>
  );
}

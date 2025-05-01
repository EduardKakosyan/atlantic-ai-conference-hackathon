"use client";

import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { mixedNewsPersonaData, fakeNewsPersonaData, realNewsPersonaData, PersonaData } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type RatingCategory = {
  name: string;
  value: number;
  color: string;
};

type VaccinePieChartProps = {
  dataSource?: "mixed" | "fake" | "real" | "all";
  className?: string;
};

export const VaccinePieChart = ({ dataSource = "all", className }: VaccinePieChartProps) => {
  const chartData = useMemo(() => {
    // Combine all data sources if "all" is selected, otherwise use the specified data source
    let allData: PersonaData[] = [];
    if (dataSource === "all" || dataSource === "mixed") {
      allData = [...allData, ...mixedNewsPersonaData];
    }
    if (dataSource === "all" || dataSource === "fake") {
      allData = [...allData, ...fakeNewsPersonaData];
    }
    if (dataSource === "all" || dataSource === "real") {
      allData = [...allData, ...realNewsPersonaData];
    }

    // Get unique persona IDs
    const personaIds = Array.from(new Set(allData.map(item => item.persona_id)));

    // Get initial data points (iteration 1) for each persona
    const initialDataPoints = personaIds.flatMap(personaId => {
      return allData
        .filter(item => item.persona_id === personaId && item.iteration === 1)
        .map(item => item.normalized_current_rating);
    });

    // Categorize ratings
    const noVaccine = initialDataPoints.filter(rating => rating < 0.5).length;
    const neutral = initialDataPoints.filter(rating => rating === 0.5).length;
    const yesVaccine = initialDataPoints.filter(rating => rating > 0.5).length;

    return [
      { name: "No Vaccine (0-0.5)", value: noVaccine, color: "#ef4444" },
      { name: "Neutral (0.5)", value: neutral, color: "#a3a3a3" },
      { name: "Yes Vaccine (0.5-1)", value: yesVaccine, color: "#22c55e" },
    ].filter(category => category.value > 0); // Only include categories with values
  }, [dataSource]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Initial Vaccine Sentiment Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value} personas`, 'Count']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default VaccinePieChart;

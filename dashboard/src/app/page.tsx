"use client";

import { FinalRatingsByPersona } from "@/components/charts/bar-chart";
import { RatingTable } from "@/components/charts/iteration-table";
import { NewsImpactAnalysis } from "@/components/charts/news-impact-analysis";
import { VaccinePieChart } from "@/components/charts/pie-chart";
import { ConversionTrajectory } from "@/components/insights/converstion-trajectory";
import { mixedNewsPersonaData, fakeNewsPersonaData, realNewsPersonaData, PersonaData } from "@/lib/data";
import { QuickInsights } from "@/components/insights/quick-insights";
import { SimpleRatingChart } from "@/components/charts/simple-rating-chart";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function RootPage() {
  const [personaData, setPersonaData] = useState<PersonaData[]>(mixedNewsPersonaData);
  const [selectedDataset, setSelectedDataset] = useState<string>("Mixed News");

  const handlePersonaChange = (personaName: string) => {
    if (personaName === "Mixed News") {
      setPersonaData(mixedNewsPersonaData);
    } else if (personaName === "Fake News") {
      setPersonaData(fakeNewsPersonaData);
    } else if (personaName === "Real News") {
      setPersonaData(realNewsPersonaData);
    }
  };

  const handleDatasetChange = (value: string) => {
    setSelectedDataset(value);
    handlePersonaChange(value);
  };

  // Map selected dataset to pie chart data source
  const getDataSource = (): "mixed" | "fake" | "real" | "all" => {
    switch (selectedDataset) {
      case "Mixed News": return "mixed";
      case "Fake News": return "fake";
      case "Real News": return "real";
      default: return "all";
    }
  };

  return (
    <main className="container mx-auto py-8 px-4">
      {/* Select news type UI logic here */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">HealthByte Data Dashboard</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Select Dataset:</span>
          <Select value={selectedDataset} onValueChange={handleDatasetChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select dataset" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Mixed News">Mixed News</SelectItem>
              <SelectItem value="Fake News">Fake News</SelectItem>
              <SelectItem value="Real News">Real News</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <QuickInsights className="mb-12" data={personaData} />
      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <SimpleRatingChart data={personaData} className="w-full" />
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md md:w-2/5 w-full">
            <ConversionTrajectory data={personaData} className="w-full" />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md md:w-3/5 w-full">
            <VaccinePieChart dataSource={getDataSource()} className="w-full" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <NewsImpactAnalysis data={personaData} className="w-full" />
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md md:w-1/2 w-full">
            <FinalRatingsByPersona data={personaData} className="w-full" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <RatingTable data={personaData} className="w-full" />
        </div>
      </div>
    </main>
  );
}

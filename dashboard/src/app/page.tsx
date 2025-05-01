import { FinalRatingsByPersona } from "@/components/charts/bar-chart";
import { RatingTable } from "@/components/charts/iteration-table";
import { NewsImpactChart } from "@/components/charts/news-impact-chart";
import { NewsImpactAnalysis } from "@/components/charts/news-impact-analysis";
import { ConversionTrajectory } from "@/components/insights/converstion-trajectory";
import { ReactionShift } from "@/components/insights/reactation-shift";
import { mixedNewsPersonaData, fakeNewsPersonaData, realNewsPersonaData } from "@/lib/data";
import { QuickInsights } from "@/components/insights/quick-insights";
import { SimpleRatingChart } from "@/components/charts/simple-rating-chart";

export default function RootPage() {
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">HealthByte Data Dashboard</h1>
      <QuickInsights className="mb-12" />
      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <SimpleRatingChart data={personaData} className="w-full" />
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md md:w-3/5 w-full">
            <NewsImpactChart className="w-full" />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md md:w-2/5 w-full">
            <ConversionTrajectory className="w-full" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <NewsImpactAnalysis className="w-full" />
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md md:w-1/2 w-full">
            <ReactionShift className="w-full" />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md md:w-1/2 w-full">
            <FinalRatingsByPersona data={personaData} className="w-full" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <RatingTable className="w-full" />
        </div>
      </div>
    </main>
  );
}

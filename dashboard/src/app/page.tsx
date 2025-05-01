import { FinalRatingsByPersona } from "@/components/charts/bar-chart";
import { RatingHeatMap } from "@/components/charts/iteration-table";
import { ConversionTrajectory } from "@/components/insights/converstion-trajectory";
import { ReactionShift } from "@/components/insights/reactation-shift";
import mockData from "@/lib/mock-data";
import { QuickInsights } from "@/components/insights/quick-insights";

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Vaccine Persuasion Dashboard</h1>
      <QuickInsights />
      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <ConversionTrajectory className="w-full" />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <ReactionShift className="w-full" />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <FinalRatingsByPersona data={mockData} className="w-full" />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <RatingHeatMap className="w-full" />
        </div>
      </div>
    </main>
  );
}

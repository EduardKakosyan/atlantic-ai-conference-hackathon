import PersonaResponsesTable from "@/components/PersonaResponsesTable";

export default function Home() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Persona Responses Dashboard</h1>
      <PersonaResponsesTable />
    </div>
  );
}

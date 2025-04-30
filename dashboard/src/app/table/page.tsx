import PersonaResponsesTable from '@/components/PersonaResponsesTable'

export default function TablePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Persona Responses Data</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <PersonaResponsesTable />
      </div>
    </div>
  )
} 
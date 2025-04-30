'use client'

import { useEffect, useState } from 'react'
import { getAllPersonaResponses } from '@/app/actions'

type PersonaResponse = {
  id: string
  persona_id: number
  answer_time: string
  response: string
  is_real: boolean
  is_fact: boolean
  took_covid_vaccine: boolean
  vaccine_recommendation_rating: number
  vaccine_attitude_score: number
}

export default function PersonaResponsesTable() {
  const [responses, setResponses] = useState<PersonaResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAllPersonaResponses()
        if (data) {
          setResponses(data)
        } else {
          setError('No data returned')
        }
      } catch (err) {
        setError('Error fetching data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-red-500">{error}</div>
  if (responses.length === 0) return <div>No persona responses found</div>

  return (
    <div className="container mx-auto py-6">
      <h2 className="text-2xl font-bold mb-4">Persona Responses</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Persona ID</th>
              <th className="px-4 py-2 border">Answer Time</th>
              <th className="px-4 py-2 border">Response</th>
              <th className="px-4 py-2 border">Is Real</th>
              <th className="px-4 py-2 border">Is Fact</th>
              <th className="px-4 py-2 border">Took Vaccine</th>
              <th className="px-4 py-2 border">Recommendation Rating</th>
              <th className="px-4 py-2 border">Attitude Score</th>
            </tr>
          </thead>
          <tbody>
            {responses.map((response) => (
              <tr key={response.id}>
                <td className="px-4 py-2 border">{response.id}</td>
                <td className="px-4 py-2 border">{response.persona_id}</td>
                <td className="px-4 py-2 border">{new Date(response.answer_time).toLocaleString()}</td>
                <td className="px-4 py-2 border">{response.response}</td>
                <td className="px-4 py-2 border">{response.is_real ? 'Yes' : 'No'}</td>
                <td className="px-4 py-2 border">{response.is_fact ? 'Yes' : 'No'}</td>
                <td className="px-4 py-2 border">{response.took_covid_vaccine === null ? 'N/A' : response.took_covid_vaccine ? 'Yes' : 'No'}</td>
                <td className="px-4 py-2 border">{response.vaccine_recommendation_rating || 'N/A'}</td>
                <td className="px-4 py-2 border">{response.vaccine_attitude_score !== null ? response.vaccine_attitude_score.toFixed(2) : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 
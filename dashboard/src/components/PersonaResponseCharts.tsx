'use client'

import { useEffect, useState } from 'react'
import { getAllPersonaResponses } from '@/app/actions'
import {
  BarChart, Bar,
  PieChart, Pie, Cell,
  ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts'

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

export default function PersonaResponseCharts() {
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

  // Prepare data for charts
  const attitudeByPersonaData = responses.reduce((acc, response) => {
    const existingPersona = acc.find(p => p.persona_id === response.persona_id)
    if (existingPersona) {
      existingPersona.count += 1
      existingPersona.totalAttitude += response.vaccine_attitude_score || 0
      existingPersona.avgAttitude = existingPersona.totalAttitude / existingPersona.count
    } else {
      acc.push({
        persona_id: response.persona_id,
        count: 1,
        totalAttitude: response.vaccine_attitude_score || 0,
        avgAttitude: response.vaccine_attitude_score || 0
      })
    }
    return acc
  }, [] as { persona_id: number; count: number; totalAttitude: number; avgAttitude: number }[])

  // Simple scatter plot data
  const scatterData = responses.map(r => ({
    recommendation: r.vaccine_recommendation_rating || 0,
    attitude: r.vaccine_attitude_score || 0,
    isReal: r.is_real
  }))

  // Pie chart data for reality vs factuality
  const getRealityFactGroups = () => {
    const groups = responses.reduce((acc, r) => {
      const key = `${r.is_real ? 'Real' : 'Not Real'}-${r.is_fact ? 'Fact' : 'Not Fact'}`
      if (!acc[key]) acc[key] = 0
      acc[key] += 1
      return acc
    }, {} as Record<string, number>)
    
    return Object.entries(groups).map(([name, value]) => ({ name, value }))
  }

  const pieData = getRealityFactGroups()
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

  // Vaccine data
  const vaccineData = responses.reduce((acc, r) => {
    const key = r.took_covid_vaccine ? 'Vaccinated' : 'Not Vaccinated'
    if (!acc[key]) acc[key] = 0
    acc[key] += 1
    return acc
  }, {} as Record<string, number>)

  const vaccineChartData = Object.entries(vaccineData).map(([name, value]) => ({ name, value }))
  const VACCINE_COLORS = ['#4CAF50', '#F44336']

  return (
    <div className="container mx-auto py-6 space-y-12">
      <h2 className="text-2xl font-bold mb-4">Persona Response Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Attitude Score by Persona ID */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Average Attitude Score by Persona</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attitudeByPersonaData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="persona_id" label={{ value: 'Persona ID', position: 'bottom' }} />
              <YAxis label={{ value: 'Average Attitude Score', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value: number) => value.toFixed(2)} />
              <Legend />
              <Bar dataKey="avgAttitude" fill="#8884d8" name="Avg Attitude Score" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Scatter Plot: Recommendation vs Attitude */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Recommendation Rating vs Attitude Score</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                dataKey="recommendation" 
                name="Recommendation Rating" 
                domain={[0, 5]} 
                label={{ value: 'Recommendation Rating', position: 'bottom' }}
              />
              <YAxis 
                type="number" 
                dataKey="attitude" 
                name="Attitude Score" 
                domain={[0, 5]} 
                label={{ value: 'Attitude Score', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Legend />
              <Scatter 
                name="Responses" 
                data={scatterData} 
                fill="#8884d8"
                shape={(props: any) => {
                  const { cx, cy, fill } = props
                  return (
                    <circle 
                      cx={cx} 
                      cy={cy} 
                      r={8} 
                      fill={props.payload.isReal ? "#0088FE" : "#FF8042"} 
                      stroke="none" 
                    />
                  )
                }}
              />
            </ScatterChart>
          </ResponsiveContainer>
          <div className="flex justify-center mt-2 text-sm">
            <span className="flex items-center mr-4"><span className="inline-block w-3 h-3 bg-[#0088FE] mr-1"></span> Real</span>
            <span className="flex items-center"><span className="inline-block w-3 h-3 bg-[#FF8042] mr-1"></span> Not Real</span>
          </div>
        </div>

        {/* Pie Chart: Reality vs Factuality */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Distribution by Reality & Factuality</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => value} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart: Vaccination Status */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Vaccination Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={vaccineChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {vaccineChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={VACCINE_COLORS[index % VACCINE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => value} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
} 
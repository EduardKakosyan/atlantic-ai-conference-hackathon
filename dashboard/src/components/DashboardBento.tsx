'use client'

import { useEffect, useState } from 'react'
import { getAllPersonaResponses } from '@/app/actions'
import {
  BarChart, Bar,
  PieChart, Pie, Cell,
  ScatterChart, Scatter,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts'
import { BellIcon, PieChartIcon, BarChartIcon, ScatterChartIcon, CheckCircleIcon, TableIcon, LineChartIcon } from 'lucide-react'
import { BentoCard, BentoGrid } from '@/components/ui/bento-grid'
import { formatDate, truncateText } from '@/lib/utils'
import Link from 'next/link'

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

export default function DashboardBento() {
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

  if (loading) return <div className="flex items-center justify-center h-[60vh] text-xl">Loading dashboard data...</div>
  if (error) return <div className="text-red-500 flex items-center justify-center h-[60vh] text-xl">{error}</div>
  if (responses.length === 0) return <div className="flex items-center justify-center h-[60vh] text-xl">No persona responses found</div>

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

  // Get most recent responses for a quick summary
  const recentResponses = [...responses]
    .sort((a, b) => new Date(b.answer_time).getTime() - new Date(a.answer_time).getTime())
    .slice(0, 3)

  // Prepare time series data for line chart
  const timeSeriesData = responses.reduce((acc, response) => {
    // Extract the date part only from answer_time (YYYY-MM-DD)
    const date = new Date(response.answer_time).toISOString().split('T')[0]
    
    if (!acc[date]) {
      acc[date] = {
        date,
        attitudeScore: 0,
        recommendationRating: 0,
        count: 0
      }
    }
    
    acc[date].attitudeScore += response.vaccine_attitude_score || 0
    acc[date].recommendationRating += response.vaccine_recommendation_rating || 0
    acc[date].count += 1
    
    return acc
  }, {} as Record<string, { date: string, attitudeScore: number, recommendationRating: number, count: number }>)
  
  // Calculate averages and sort by date
  const lineChartData = Object.values(timeSeriesData)
    .map(item => ({
      date: item.date,
      attitudeScore: item.attitudeScore / item.count,
      recommendationRating: item.recommendationRating / item.count
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const bentoFeatures = [
    {
      Icon: BarChartIcon,
      name: "Attitude Score by Persona",
      description: "Average attitude scores for each persona.",
      href: "/analytics",
      cta: "View Details",
      className: "col-span-3 lg:col-span-2",
      background: (
        <div className="absolute inset-0 flex items-center justify-center p-2">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={attitudeByPersonaData} margin={{ top: 30, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="persona_id" label={{ value: 'Persona ID', position: 'bottom' }} />
              <YAxis label={{ value: 'Average Attitude Score', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value: number) => value.toFixed(2)} />
              <Bar dataKey="avgAttitude" fill="#8884d8" name="Avg Attitude Score" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ),
    },
    {
      Icon: ScatterChartIcon,
      name: "Recommendation vs Attitude",
      description: "Relationship between recommendation ratings and attitude scores.",
      href: "/analytics",
      cta: "Explore Data",
      className: "col-span-3 lg:col-span-1",
      background: (
        <div className="absolute inset-0 flex items-center justify-center p-2">
          <ResponsiveContainer width="100%" height={220}>
            <ScatterChart margin={{ top: 30, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                dataKey="recommendation" 
                name="Recommendation Rating" 
                domain={[0, 5]} 
              />
              <YAxis 
                type="number" 
                dataKey="attitude" 
                name="Attitude Score" 
                domain={[0, 5]} 
              />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter 
                name="Responses" 
                data={scatterData} 
                fill="#8884d8"
                shape={(props: any) => {
                  const { cx, cy } = props
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
          <div className="absolute bottom-2 left-0 right-0 flex justify-center text-sm">
            <span className="flex items-center mr-4"><span className="inline-block w-3 h-3 bg-[#0088FE] mr-1"></span> Real</span>
            <span className="flex items-center"><span className="inline-block w-3 h-3 bg-[#FF8042] mr-1"></span> Not Real</span>
          </div>
        </div>
      ),
    },
    {
      Icon: PieChartIcon,
      name: "Reality vs Factuality",
      description: "Distribution of responses by reality and factuality.",
      href: "/analytics",
      cta: "View Breakdown",
      className: "col-span-3 lg:col-span-1",
      background: (
        <div className="absolute inset-0 flex items-center justify-center p-2">
          <ResponsiveContainer width="100%" height={220}>
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
            </PieChart>
          </ResponsiveContainer>
        </div>
      ),
    },
    {
      Icon: CheckCircleIcon,
      name: "Vaccination Status",
      description: "Distribution of vaccination status among respondents.",
      href: "/analytics",
      cta: "View Details",
      className: "col-span-3 lg:col-span-1",
      background: (
        <div className="absolute inset-0 flex items-center justify-center p-2">
          <ResponsiveContainer width="100%" height={220}>
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
            </PieChart>
          </ResponsiveContainer>
        </div>
      ),
    },
    {
      Icon: BellIcon,
      name: "Key Insights",
      description: "Important metrics and findings from the persona responses data.",
      href: "/analytics",
      cta: "See All",
      className: "col-span-3 lg:col-span-1",
      background: (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
          <div className="grid grid-cols-2 gap-4 w-full h-full">
            <div className="flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
              <div className="text-3xl font-bold">{responses.length}</div>
              <div className="text-sm text-muted-foreground">Total Responses</div>
            </div>
            <div className="flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
              <div className="text-3xl font-bold">
                {responses.filter(r => r.is_real).length}
              </div>
              <div className="text-sm text-muted-foreground">Real Responses</div>
            </div>
            <div className="flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
              <div className="text-3xl font-bold">
                {responses.filter(r => r.is_fact).length}
              </div>
              <div className="text-sm text-muted-foreground">Factual Responses</div>
            </div>
            <div className="flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
              <div className="text-3xl font-bold">
                {(responses.reduce((sum, r) => sum + (r.vaccine_attitude_score || 0), 0) / responses.length).toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">Avg Attitude Score</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      Icon: TableIcon,
      name: "Latest Persona Responses",
      description: "Most recent responses from different personas.",
      href: "/",
      cta: "View All",
      className: "col-span-3 lg:col-span-1",
      background: (
        <div className="absolute inset-0 flex flex-col p-6 overflow-auto">
          <div className="space-y-4">
            {recentResponses.map((response) => (
              <div key={response.id} className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Persona #{response.persona_id}</span>
                  <span className="text-xs text-muted-foreground">{formatDate(response.answer_time)}</span>
                </div>
                <p className="text-sm mt-2">{truncateText(response.response, 80)}</p>
                <div className="flex gap-2 mt-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${response.is_real ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'}`}>
                    {response.is_real ? 'Real' : 'Not Real'}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${response.is_fact ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                    {response.is_fact ? 'Fact' : 'Not Fact'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      Icon: LineChartIcon,
      name: "Attitude Score Trends",
      description: "Vaccine attitude scores and recommendation ratings over time.",
      href: "/analytics",
      cta: "View Details",
      className: "col-span-3 lg:col-span-2",
      background: (
        <div className="absolute inset-0 flex items-center justify-center p-2">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={lineChartData} margin={{ top: 30, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 5]} />
              <Tooltip formatter={(value: number) => value.toFixed(2)} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="attitudeScore" 
                stroke="#8884d8" 
                name="Attitude Score"
                strokeWidth={2}
                dot={{ strokeWidth: 2 }}
                activeDot={{ r: 8 }}
              />
              <Line 
                type="monotone" 
                dataKey="recommendationRating" 
                stroke="#82ca9d" 
                name="Recommendation Rating"
                strokeWidth={2}
                dot={{ strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Persona Response Analytics</h1>
        <Link 
          href="/analytics" 
          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          View Full Analytics
        </Link>
      </div>
      <BentoGrid>
        {bentoFeatures.map((feature, idx) => (
          <BentoCard key={idx} {...feature} />
        ))}
      </BentoGrid>
    </div>
  )
} 
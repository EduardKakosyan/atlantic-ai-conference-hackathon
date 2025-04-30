'use client'

import { useState, useEffect } from 'react'
import { getAllPersonaResponses } from '@/app/actions'
import { BarChartIcon, PieChartIcon, TableIcon, ArrowRightIcon } from 'lucide-react'
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

export default function HomePage() {
  const [responses, setResponses] = useState<PersonaResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const data = await getAllPersonaResponses()
        setResponses(data || [])
      } catch (err) {
        setError('Failed to fetch data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Calculate key metrics
  const totalResponses = responses.length
  const vaccineAcceptanceRate = totalResponses > 0
    ? (responses.filter(r => r.took_covid_vaccine).length / totalResponses * 100).toFixed(1)
    : '0'
  const avgAttitudeScore = totalResponses > 0
    ? (responses.reduce((sum, r) => sum + r.vaccine_attitude_score, 0) / totalResponses).toFixed(2)
    : '0'
  const factualResponses = totalResponses > 0
    ? (responses.filter(r => r.is_fact).length / totalResponses * 100).toFixed(1)
    : '0'

  if (loading) return <div className="container mx-auto py-8">Loading...</div>
  if (error) return <div className="container mx-auto py-8">Error: {error}</div>

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">COVID-19 Persona Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Analyze responses from different personas regarding COVID-19 vaccination attitudes
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-500 dark:text-gray-400 mb-2">Total Responses</h3>
          <p className="text-3xl font-bold">{totalResponses}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-500 dark:text-gray-400 mb-2">Vaccine Acceptance</h3>
          <p className="text-3xl font-bold">{vaccineAcceptanceRate}%</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-500 dark:text-gray-400 mb-2">Avg Attitude Score</h3>
          <p className="text-3xl font-bold">{avgAttitudeScore}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-500 dark:text-gray-400 mb-2">Factual Responses</h3>
          <p className="text-3xl font-bold">{factualResponses}%</p>
        </div>
      </div>

      {/* Navigation Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/dashboard" className="block bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-3 mr-4">
              <BarChartIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-bold">Dashboard</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            View interactive charts and visualizations in a PowerBI-style layout
          </p>
          <div className="flex items-center text-blue-600 dark:text-blue-400">
            <span className="mr-2">View Dashboard</span>
            <ArrowRightIcon className="h-4 w-4" />
          </div>
        </Link>
        
        <Link href="/analytics" className="block bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-3 mr-4">
              <PieChartIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-xl font-bold">Analytics</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Explore detailed analytics and trends from the persona responses
          </p>
          <div className="flex items-center text-purple-600 dark:text-purple-400">
            <span className="mr-2">View Analytics</span>
            <ArrowRightIcon className="h-4 w-4" />
          </div>
        </Link>
        
        <Link href="/table" className="block bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <div className="rounded-full bg-green-100 dark:bg-green-900 p-3 mr-4">
              <TableIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-bold">Data Table</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            View and filter the raw data from all persona responses
          </p>
          <div className="flex items-center text-green-600 dark:text-green-400">
            <span className="mr-2">View Data</span>
            <ArrowRightIcon className="h-4 w-4" />
          </div>
        </Link>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import DashboardBento from '@/components/DashboardBento'
import { Button } from '@/components/ui/button'
import { CalendarIcon, FilterIcon, DownloadIcon, RefreshCcwIcon } from 'lucide-react'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Persona Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Interactive visualizations of persona response data
          </p>
        </div>
        <div className="flex mt-4 md:mt-0 space-x-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <CalendarIcon className="h-4 w-4" />
            <span>Last 30 days</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <FilterIcon className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <DownloadIcon className="h-4 w-4" />
            <span>Export</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <RefreshCcwIcon className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('personas')}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'personas'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Personas
            </button>
            <button
              onClick={() => setActiveTab('vaccines')}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'vaccines'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Vaccine Attitudes
            </button>
            <button
              onClick={() => setActiveTab('facts')}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'facts'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Factuality
            </button>
          </nav>
        </div>
      </div>

      <DashboardBento />
    </div>
  )
} 
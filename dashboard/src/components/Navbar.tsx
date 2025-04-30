'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { HomeIcon, BarChartIcon, PieChartIcon, TableIcon } from 'lucide-react'

const navItems = [
  { href: '/', label: 'Home', icon: HomeIcon },
  { href: '/dashboard', label: 'Dashboard', icon: BarChartIcon },
  { href: '/analytics', label: 'Analytics', icon: PieChartIcon },
  { href: '/table', label: 'Data Table', icon: TableIcon }
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/" className="flex items-center space-x-3">
          <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
            COVID-19 Analytics
          </span>
        </Link>
        <div className="flex md:order-2">
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-4 py-2"
          >
            Export Data
          </button>
        </div>
        <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1">
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "block py-2 pl-3 pr-4 rounded md:p-0 flex items-center gap-2",
                      isActive 
                        ? "text-white bg-blue-700 md:bg-transparent md:text-blue-700 md:dark:text-blue-500" 
                        : "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                    )}
                  >
                    <Icon className="h-4 w-4" /> {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </nav>
  )
} 
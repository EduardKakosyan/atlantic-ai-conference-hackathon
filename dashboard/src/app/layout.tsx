import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Persona Analytics Dashboard',
  description: 'Analytics dashboard for COVID-19 persona responses',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <Navbar /> */}
        <main className="bg-gray-50 dark:bg-gray-900 scroll-smooth">
          {children}
        </main>
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Sidebar } from '@/components/Sidebar'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'TastyBites Admin Portal',
  description: 'Restaurant management dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <div className="flex">
          <Sidebar />
          <main className="flex-1 min-h-screen bg-gray-50">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}

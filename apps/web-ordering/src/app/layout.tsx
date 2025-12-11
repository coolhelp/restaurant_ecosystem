import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/components/ToastProvider'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'TastyBites - Order Delicious Food Online | Fast Delivery',
  description: 'Order your favorite meals from the best restaurants in town. Fresh ingredients, expert chefs, and lightning-fast delivery. Get your food in 30 minutes or less!',
  keywords: ['food delivery', 'restaurant', 'order online', 'fast delivery', 'food ordering', 'takeout', 'delivery app'],
  authors: [{ name: 'TastyBites' }],
  openGraph: {
    title: 'TastyBites - Order Delicious Food Online',
    description: 'Order your favorite meals with fast delivery. Fresh, hot, and delicious!',
    type: 'website',
    siteName: 'TastyBites',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TastyBites - Order Delicious Food Online',
    description: 'Order your favorite meals with fast delivery. Fresh, hot, and delicious!',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        {children}
        <ToastProvider />
      </body>
    </html>
  )
}


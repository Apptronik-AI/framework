import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Apptronik AI Framework',
  description: 'Smarter Crypto Wealth with Autopilot AI',
  generator: '',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

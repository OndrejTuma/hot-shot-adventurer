import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Drsňák dobyvatel',
  description: 'Hra o poklady',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}


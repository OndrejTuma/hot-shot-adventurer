import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hot Shot Adventurer',
  description: 'An Indiana Jones-style treasure hunting game',
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


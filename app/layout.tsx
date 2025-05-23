import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'insly.ai MCP Server',
  description: 'AI-powered Model Context Protocol server for insly.com insurance platform',
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
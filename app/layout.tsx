import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'insly.ai MCP Server - AI-Powered Insurance Platform',
  description: 'Advanced Model Context Protocol server providing intelligent automation and AI-driven tools for insurance operations, document processing, and workflow optimization.',
  keywords: 'insurance, AI, MCP, FormFlow, document processing, automation, insly',
  authors: [{ name: 'insly.ai' }],
  creator: 'insly.ai',
  publisher: 'insly.ai',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'insly.ai MCP Server - AI-Powered Insurance Platform',
    description: 'Advanced Model Context Protocol server for insurance operations with AI-powered tools and FormFlow integration.',
    url: 'https://ai.insly.com',
    siteName: 'insly.ai',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'insly.ai MCP Server',
    description: 'AI-Powered Insurance Platform with advanced MCP tools',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  )
}
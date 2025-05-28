"use client";

import Header from './components/Header';
import Footer from './components/Footer';
import MCPEndpoints from './components/MCPEndpoints';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <MCPEndpoints />

      <Footer />
    </div>
  );
}
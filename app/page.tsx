"use client";

import Header from './components/Header';
import Footer from './components/Footer';
import MCPEndpoints from './components/MCPEndpoints';
import FormFlowTools from './components/FormFlowTools';
import IdentifierTools from './components/IdentifierTools';
import LedgerTools from './components/LedgerTools';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <MCPEndpoints />

      {/* MCP Tools Section */}
      <section id="tools" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Available MCP Tools (190 Total)
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive suite of 190 specialized tools across FormFlow (25),
              Identifier (3), and Ledger (162) services
            </p>
          </div>

          {/* FormFlow Service Tools */}
          <FormFlowTools />

          {/* Identifier Service Tools */}
          <IdentifierTools />

          {/* Ledger Service Tools */}
          <LedgerTools />
        </div>
      </section>

      <Footer />
    </div>
  );
}
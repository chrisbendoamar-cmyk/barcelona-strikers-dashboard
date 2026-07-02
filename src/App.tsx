import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  LayoutDashboard, User, ArrowRightLeft, History, FileText, Trophy, ShieldAlert 
} from "lucide-react";

// Sub-components
import DashboardView from "./components/DashboardView";
import ProfileView from "./components/ProfileView";
import ComparisonView from "./components/ComparisonView";
import TimelineRecordsView from "./components/TimelineRecordsView";
import SummaryDocsView from "./components/SummaryDocsView";

type ActiveTab = "dashboard" | "profiles" | "comparison" | "timeline" | "summary";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [selectedProfileId, setSelectedProfileId] = useState<string>("messi");

  // Navigates directly to profiles with a pre-selected player ID
  const navigateToProfile = (playerId: string) => {
    setSelectedProfileId(playerId);
    setActiveTab("profiles");
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans flex flex-col antialiased border-t-4 border-[#A50044]">
      
      {/* 1. Header & Club Branding Banner */}
      <header className="bg-[#0a0f1e] border-b border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Subtle Decorative Gold Accent Strip */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#EDBB00]" />
        
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Brand Title & Shield emblem placeholder styling */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#004D98] flex items-center justify-center border-2 border-[#A50044] font-black text-lg text-[#EDBB00] italic shadow-inner tracking-wider">
              FCB
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tighter uppercase flex flex-wrap items-center gap-x-2">
                <span className="text-[#004D98]">Blaugrana</span>
                <span className="text-[#A50044]">Striker</span>
                <span className="text-slate-400">Analytics</span>
                <span className="text-xs font-bold bg-[#A50044] text-white border border-[#A50044] px-2.5 py-0.5 rounded-full tracking-wide uppercase font-sans">
                  First Team No. 9s
                </span>
              </h1>
              <p className="text-xs text-slate-400 font-semibold tracking-wide uppercase mt-0.5">
                Historical Performance, Advanced Scouting & Head-to-Head Comparison Dossier
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-[#EDBB00] bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 self-start md:self-auto shadow-md">
            <Trophy className="w-3.5 h-3.5 text-[#EDBB00]" />
            <span>FC Barcelona Official Archives Synced</span>
          </div>
        </div>
      </header>

      {/* 2. Top-level Navigation Menu */}
      <nav className="bg-[#0a0f1e] border-b border-slate-800 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex overflow-x-auto gap-4 py-3 text-sm no-scrollbar">
            
            {/* Nav: Dashboard */}
            <button
              id="tab-btn-dashboard"
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-[#A50044] text-white shadow-md border border-[#A50044]"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Performance Dashboard</span>
            </button>

            {/* Nav: Profiles */}
            <button
              id="tab-btn-profiles"
              onClick={() => navigateToProfile("messi")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "profiles"
                  ? "bg-[#A50044] text-white shadow-md border border-[#A50044]"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <User className="w-4 h-4" />
              <span>Player Profiles & Scout Reports</span>
            </button>

            {/* Nav: Comparison */}
            <button
              id="tab-btn-comparison"
              onClick={() => setActiveTab("comparison")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "comparison"
                  ? "bg-[#A50044] text-white shadow-md border border-[#A50044]"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>Head-to-Head Comparison</span>
            </button>

            {/* Nav: Timeline & Records */}
            <button
              id="tab-btn-timeline"
              onClick={() => setActiveTab("timeline")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "timeline"
                  ? "bg-[#A50044] text-white shadow-md border border-[#A50044]"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <History className="w-4 h-4" />
              <span>Timeline & Records</span>
            </button>

            {/* Nav: Summary & Docs */}
            <button
              id="tab-btn-summary"
              onClick={() => setActiveTab("summary")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "summary"
                  ? "bg-[#A50044] text-white shadow-md border border-[#A50044]"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Executive Summary & Docs</span>
            </button>

          </div>
        </div>
      </nav>

      {/* 3. Main Content Container */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full">
        
        {/* Animated Views switching based on Active Tab */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {activeTab === "dashboard" && (
              <DashboardView />
            )}
            {activeTab === "profiles" && (
              <ProfileView initialPlayerId={selectedProfileId} />
            )}
            {activeTab === "comparison" && (
              <ComparisonView />
            )}
            {activeTab === "timeline" && (
              <TimelineRecordsView />
            )}
            {activeTab === "summary" && (
              <SummaryDocsView />
            )}
          </motion.div>
        </AnimatePresence>
        
      </main>

      {/* 4. Footer */}
      <footer className="bg-[#0a0f1e] border-t border-slate-800 py-6 mt-12 text-xs text-slate-400 font-medium">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <p className="font-bold tracking-wider text-[10px] text-slate-400 uppercase">DATABASE CONNECTED: OPTA / FBREF LIVE REPLICAS</p>
            </div>
            <p className="text-slate-500">© 2026 FC Barcelona Sports Analytics Group. All rights reserved.</p>
            <p className="text-[10px] text-slate-600 mt-0.5">
              Compiled using standard historical soccer metric methodologies. Data includes competitive first-team fixtures only.
            </p>
          </div>
          <div className="flex gap-4 text-[11px] font-bold">
            <a href="https://www.fcbarcelona.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-[#A50044] transition-colors">FC Barcelona Official</a>
            <a href="https://fbref.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-[#004D98] transition-colors">FBref Source</a>
            <a href="https://optaanalyst.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-[#EDBB00] transition-colors font-semibold">Opta Analyst</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

import React, { useState, useMemo } from "react";
import { 
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar, XAxis, YAxis, Tooltip
} from "recharts";
import { Striker, strikersData } from "../data/strikers";
import { Trophy, Calendar, Sparkles, Award, Star, BarChart3, TrendingUp, Info, HelpCircle } from "lucide-react";

interface ProfileViewProps {
  initialPlayerId?: string;
}

export default function ProfileView({ initialPlayerId = "messi" }: ProfileViewProps) {
  const [selectedId, setSelectedId] = useState<string>(initialPlayerId);
  const [loadingReport, setLoadingReport] = useState<boolean>(false);
  const [scoutReport, setScoutReport] = useState<string>("");
  const [reportError, setReportError] = useState<string>("");

  // Get selected striker
  const striker = useMemo(() => {
    return strikersData.find(s => s.id === selectedId) || strikersData[0];
  }, [selectedId]);

  // Clear report when player changes
  React.useEffect(() => {
    setScoutReport("");
    setReportError("");
  }, [selectedId]);

  // Compute club averages for comparison
  const clubAverages = useMemo(() => {
    const total = strikersData.length;
    let apps = 0, goals = 0, assists = 0, gpm = 0, trophies = 0;
    strikersData.forEach(s => {
      apps += s.stats.appearances;
      goals += s.stats.goals;
      assists += s.stats.assists;
      gpm += s.stats.goalsPerMatch;
      trophies += s.stats.trophiesWon;
    });
    return {
      appearances: Math.round(apps / total),
      goals: Math.round(goals / total),
      assists: Math.round(assists / total),
      goalsPerMatch: gpm / total,
      trophies: Math.round(trophies / total)
    };
  }, []);

  // Compute percentile rankings for the selected striker
  const percentiles = useMemo(() => {
    const total = strikersData.length;
    
    const calculatePercentile = (key: "goals" | "appearances" | "goalsPerMatch" | "assists" | "trophiesWon") => {
      let values: number[] = [];
      strikersData.forEach(s => {
        if (key === "goalsPerMatch") {
          values.push(s.stats.goalsPerMatch);
        } else if (key === "trophiesWon") {
          values.push(s.stats.trophiesWon);
        } else {
          values.push(s.stats[key]);
        }
      });
      values.sort((a, b) => a - b);
      const currentValue = key === "goalsPerMatch" 
        ? striker.stats.goalsPerMatch 
        : key === "trophiesWon" 
          ? striker.stats.trophiesWon 
          : striker.stats[key];
      
      const index = values.indexOf(currentValue);
      return Math.round((index / (total - 1)) * 100);
    };

    return {
      goals: calculatePercentile("goals"),
      appearances: calculatePercentile("appearances"),
      goalsPerMatch: calculatePercentile("goalsPerMatch"),
      assists: calculatePercentile("assists"),
      trophies: calculatePercentile("trophiesWon")
    };
  }, [striker]);

  // Data for Radar Chart (Standardized 1-10 scores, modern attributes)
  const radarData = useMemo(() => {
    // If player has advanced stats, use them. Otherwise, map historical profiles realistically based on their reputation.
    if (striker.advanced.conversionRate !== null) {
      const conv = striker.advanced.conversionRate || 10;
      const drib = (striker.advanced.dribblesCompleted || 10) > 500 ? 100 : ((striker.advanced.dribblesCompleted || 10) / 5);
      const shotAcc = striker.advanced.shotAccuracy || 50;
      const keyP = (striker.advanced.keyPasses || 10) > 300 ? 100 : ((striker.advanced.keyPasses || 10) / 3);
      
      return [
        { subject: "Finishing / Conversion", value: Math.round(conv * 3.5 + 20) },
        { subject: "Dribbling / Carries", value: Math.round(Math.min(100, Math.max(30, drib))) },
        { subject: "Shot Accuracy", value: Math.round(shotAcc) },
        { subject: "Playmaking (Key Passes)", value: Math.round(Math.min(100, Math.max(30, keyP))) },
        { subject: "Box Presence", value: striker.position === "False 9" ? 75 : 92 },
        { subject: "Aerial Dominance", value: striker.height > 182 ? 88 : 45 }
      ];
    } else {
      // Historical profiles mapped carefully to reflect documented playing styles
      const isAlcantara = striker.id === "alcantara";
      const isKubala = striker.id === "kubala";
      const isCesar = striker.id === "cesar";
      const isKocsis = striker.id === "kocsis";
      const isRomario = striker.id === "romario";
      const isRonaldo = striker.id === "ronaldo";

      return [
        { subject: "Finishing / Conversion", value: isAlcantara ? 98 : isRomario ? 97 : isRonaldo ? 96 : isKocsis ? 92 : 88 },
        { subject: "Dribbling / Carries", value: isRonaldo ? 98 : isKubala ? 95 : isRomario ? 94 : 65 },
        { subject: "Shot Accuracy", value: isRomario ? 96 : isAlcantara ? 95 : 85 },
        { subject: "Playmaking (Key Passes)", value: isKubala ? 90 : isRomario ? 75 : 60 },
        { subject: "Box Presence", value: isCesar ? 96 : isKocsis ? 95 : isRomario ? 94 : 85 },
        { subject: "Aerial Dominance", value: isKocsis ? 99 : isCesar ? 92 : isKubala ? 82 : 45 }
      ];
    }
  }, [striker]);

  // Data for Club Average Comparison Chart
  const comparisonChartData = useMemo(() => {
    return [
      { name: "Matches", Player: striker.stats.appearances, Average: clubAverages.appearances },
      { name: "Goals", Player: striker.stats.goals, Average: clubAverages.goals },
      { name: "Assists", Player: striker.stats.assists, Average: clubAverages.assists },
      { name: "Trophies", Player: striker.stats.trophiesWon, Average: clubAverages.trophies }
    ];
  }, [striker, clubAverages]);

  // Handle Dynamic AI Scout Report Generation via server route
  const generateAIScoutReport = async () => {
    setLoadingReport(true);
    setReportError("");
    setScoutReport("");
    try {
      const response = await fetch("/api/gemini/scout-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          strikerName: striker.fullName,
          position: striker.position,
          nationality: striker.nationality,
          stats: striker.stats,
          biography: striker.biography,
          peakSeason: striker.peakScoringSeason
        })
      });

      const data = await response.json();
      if (response.ok) {
        setScoutReport(data.report);
      } else {
        setReportError(data.error || "Failed to generate scout report. Make sure GEMINI_API_KEY is configured.");
      }
    } catch (err: any) {
      setReportError(err?.message || "Server connection failed. Could not generate report.");
    } finally {
      setLoadingReport(false);
    }
  };

  return (
    <div id="profile-view" className="space-y-6">
      
      {/* Selector and Header Card */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase block tracking-wider mb-1">Select Striker to Analyze</label>
          <select
            id="striker-profile-select"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="text-lg font-bold bg-slate-900 border border-slate-850 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#004D98] cursor-pointer"
          >
            {strikersData.map(s => (
              <option key={s.id} value={s.id}>{s.fullName} ({s.stats.goals} Goals)</option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="bg-slate-900 text-blue-400 border border-slate-800 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Debut Age: {striker.ageAtDebut}
          </span>
          <span className="bg-slate-900 text-rose-400 border border-slate-800 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            Peak: {striker.peakScoringSeason}
          </span>
          <span className="bg-slate-900 text-[#EDBB00] border border-slate-800 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-[#EDBB00]" />
            {striker.stats.trophiesWon} Trophies
          </span>
        </div>
      </div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Hand: Bio & Percentiles */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Biography Card */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-850">
              <Info className="w-4.5 h-4.5 text-[#004D98]" />
              <h3 className="font-bold text-slate-100 text-sm uppercase tracking-wide">Player Biography</h3>
            </div>
            <div className="space-y-3">
              <h2 className="text-xl font-black text-white leading-tight">{striker.fullName}</h2>
              <div className="grid grid-cols-2 gap-3 text-xs text-slate-400 font-medium">
                <div>
                  <span className="block text-slate-500 text-[10px] uppercase">Nationality</span>
                  <span className="text-slate-200 font-semibold">{striker.nationality}</span>
                </div>
                <div>
                  <span className="block text-slate-500 text-[10px] uppercase">Tactical Position</span>
                  <span className="text-slate-200 font-semibold">{striker.position}</span>
                </div>
                <div>
                  <span className="block text-slate-500 text-[10px] uppercase">Preferred Foot</span>
                  <span className="text-slate-200 font-semibold">{striker.preferredFoot}</span>
                </div>
                <div>
                  <span className="block text-slate-500 text-[10px] uppercase">Height</span>
                  <span className="text-slate-200 font-semibold">{striker.height} cm</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-slate-850">
                {striker.biography}
              </p>
            </div>
          </div>

          {/* Percentile Ranking Card */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-850">
              <Award className="w-4.5 h-4.5 text-[#A50044]" />
              <h3 className="font-bold text-slate-100 text-sm uppercase tracking-wide">Dynamic Club Percentiles</h3>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Ranks this player's metrics against all other listed Barcelona strikers in our database (100 is best).
            </p>
            <div className="space-y-3.5">
              
              {/* Goals Percentile */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-slate-300">Goals Percentile</span>
                  <span className="text-[#A50044] font-mono font-bold">{percentiles.goals}th</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-850">
                  <div className="bg-[#A50044] h-full rounded-full transition-all duration-500" style={{ width: `${percentiles.goals}%` }} />
                </div>
              </div>

              {/* Goals per Match Percentile */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-slate-300">Goals/Match Ratio</span>
                  <span className="text-[#004D98] font-mono font-bold">{percentiles.goalsPerMatch}th</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-850">
                  <div className="bg-[#004D98] h-full rounded-full transition-all duration-500" style={{ width: `${percentiles.goalsPerMatch}%` }} />
                </div>
              </div>

              {/* Appearances Percentile */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-slate-300">Appearances (Longevity)</span>
                  <span className="text-emerald-400 font-mono font-bold">{percentiles.appearances}th</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-850">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${percentiles.appearances}%` }} />
                </div>
              </div>

              {/* Trophies Percentile */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-slate-300">Trophies Won</span>
                  <span className="text-[#EDBB00] font-mono font-bold">{percentiles.trophies}th</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-850">
                  <div className="bg-[#EDBB00] h-full rounded-full transition-all duration-500" style={{ width: `${percentiles.trophies}%` }} />
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Center: Tactical Radar and Stats */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Radar Chart & Career Highlights Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Radar Chart */}
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col justify-between space-y-4">
              <div>
                <span className="font-bold text-slate-100 text-sm uppercase tracking-wide block">Tactical Profile Radar</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Attribute performance indexed out of 100</span>
              </div>
              <div className="h-56 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="#1e293b" />
                    <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={9} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#1e293b" fontSize={8} />
                    <Radar name={striker.fullName} dataKey="value" stroke="#A50044" fill="#A50044" fillOpacity={0.25} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="text-[9px] text-slate-500 leading-snug">
                {striker.advanced.conversionRate === null ? (
                  <span className="font-semibold text-[#EDBB00] block">ℹ️ Note: Historical player style estimated based on archives.</span>
                ) : (
                  <span>📊 Based on modern Opta and StatsBomb tracking profiles.</span>
                )}
              </div>
            </div>

            {/* Career Highlights */}
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col justify-between space-y-4">
              <div className="flex items-center gap-1.5 border-b border-slate-850 pb-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="font-bold text-slate-100 text-sm uppercase tracking-wide">Career Highlights</span>
              </div>
              <ul className="space-y-3 flex-1 pt-1">
                {striker.highlights.map((highlight, index) => (
                  <li key={index} className="flex gap-2 text-xs text-slate-300 font-medium">
                    <span className="text-[#A50044] font-bold">✓</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
              <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-[11px] text-slate-400 font-medium flex justify-between items-center">
                <span>Peak Season:</span>
                <span className="font-bold text-slate-100">{striker.peakScoringSeason}</span>
              </div>
            </div>

          </div>

          {/* Stats Summary Table & Average Comparison Chart */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4.5 h-4.5 text-[#004D98]" />
                <h3 className="font-bold text-slate-100 text-sm uppercase tracking-wide">Performance vs Club Average</h3>
              </div>
              <span className="text-[11px] font-bold text-slate-500">Club Average benchmark = {clubAverages.goals} Goals</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Statistical List comparison */}
              <div className="space-y-3 text-xs font-semibold">
                <div className="flex justify-between items-center py-2 border-b border-slate-850">
                  <span className="text-slate-400">Appearances</span>
                  <div className="flex gap-4 font-mono">
                    <span className="text-slate-100 font-bold">{striker.stats.appearances}</span>
                    <span className="text-slate-500">vs Avg: {clubAverages.appearances}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-850">
                  <span className="text-slate-400">Goals Scored</span>
                  <div className="flex gap-4 font-mono">
                    <span className="text-[#A50044] font-bold">{striker.stats.goals}</span>
                    <span className="text-slate-500">vs Avg: {clubAverages.goals}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-850">
                  <span className="text-slate-400">Assists Delivered</span>
                  <div className="flex gap-4 font-mono">
                    <span className="text-blue-400 font-bold">{striker.stats.assists}</span>
                    <span className="text-slate-500">vs Avg: {clubAverages.assists}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-850">
                  <span className="text-slate-400">Goals per Match</span>
                  <div className="flex gap-4 font-mono">
                    <span className="text-slate-100 font-bold">{striker.stats.goalsPerMatch.toFixed(2)}</span>
                    <span className="text-slate-500">vs Avg: {clubAverages.goalsPerMatch.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-400">Trophies Won</span>
                  <div className="flex gap-4 font-mono">
                    <span className="text-[#EDBB00] font-bold">{striker.stats.trophiesWon}</span>
                    <span className="text-slate-500">vs Avg: {clubAverages.trophies}</span>
                  </div>
                </div>
              </div>

              {/* Side-by-side Visual Comparison Bar Chart */}
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonChartData} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#090d16", borderRadius: "12px", border: "1px solid #1e293b" }}
                      itemStyle={{ color: "#cbd5e1" }}
                    />
                    <Bar dataKey="Player" fill="#A50044" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="Average" fill="#334155" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

            </div>
          </div>

          {/* AI Tactical Report Card */}
          <div className="bg-[#0c1524] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#EDBB00]" />
                <h3 className="font-bold text-slate-100 text-sm uppercase tracking-wide">Dynamic AI Tactical Scout Report</h3>
              </div>
              <button
                id="generate-scout-report-btn"
                onClick={generateAIScoutReport}
                disabled={loadingReport}
                className="bg-[#004D98] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-opacity-90 disabled:opacity-50 transition-all flex items-center gap-1 shadow-md cursor-pointer"
              >
                {loadingReport ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate AI Analysis</span>
                  </>
                )}
              </button>
            </div>

            {loadingReport && (
              <div className="py-8 text-center space-y-2">
                <div className="animate-pulse flex space-x-3 items-center justify-center text-xs text-amber-500 font-semibold">
                  <span>⚽ Reviewing tactical match tapes...</span>
                  <span>📊 Checking expected goals models...</span>
                </div>
                <p className="text-[11px] text-slate-500">Gemini is compiling stats and writing scouting dossier</p>
              </div>
            )}

            {scoutReport && (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs leading-relaxed text-slate-300 space-y-3 shadow-2xl max-h-[400px] overflow-y-auto">
                <div className="prose prose-sm font-medium">
                  {scoutReport.split("\n\n").map((paragraph, idx) => {
                    if (paragraph.startsWith("1.") || paragraph.startsWith("2.") || paragraph.startsWith("3.") || paragraph.startsWith("4.") || paragraph.startsWith("**")) {
                      return <p key={idx} className="font-bold text-white border-l-2 border-[#A50044] pl-2 my-2">{paragraph.replace(/\*\*/g, "")}</p>;
                    }
                    return <p key={idx} className="mb-2.5 text-slate-300">{paragraph}</p>;
                  })}
                </div>
              </div>
            )}

            {reportError && (
              <div className="p-3 bg-slate-950 text-red-400 text-xs font-semibold rounded-xl border border-slate-800">
                {reportError}
              </div>
            )}

            {!scoutReport && !loadingReport && !reportError && (
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Click the generate button to invoke Gemini server-side. The model will ingest this striker's historic and modern data points to draft a custom tactical analysis outlining their role, efficiency metrics, and significance in Barcelona lore.
              </p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}

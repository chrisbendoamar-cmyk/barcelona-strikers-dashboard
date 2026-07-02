import React, { useState, useMemo } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, ScatterChart, Scatter, LabelList
} from "recharts";
import { Striker, strikersData } from "../data/strikers";
import { Filter, RotateCcw, Trophy, Target, Award, Play, Users, Clock } from "lucide-react";

export default function DashboardView() {
  // Filters state
  const [selectedEra, setSelectedEra] = useState<string>("All");
  const [selectedNationality, setSelectedNationality] = useState<string>("All");
  const [selectedPosition, setSelectedPosition] = useState<string>("All");
  const [selectedFoot, setSelectedFoot] = useState<string>("All");
  const [minMatches, setMinMatches] = useState<number>(0);
  const [minGoals, setMinGoals] = useState<number>(0);
  const [trophyWinner, setTrophyWinner] = useState<string>("All");
  const [uclWinner, setUclWinner] = useState<string>("All");
  const [laligaWinner, setLaligaWinner] = useState<string>("All");

  // Reset Filters
  const resetFilters = () => {
    setSelectedEra("All");
    setSelectedNationality("All");
    setSelectedPosition("All");
    setSelectedFoot("All");
    setMinMatches(0);
    setMinGoals(0);
    setTrophyWinner("All");
    setUclWinner("All");
    setLaligaWinner("All");
  };

  // Helper to match Era
  const getPlayerEra = (striker: Striker): string => {
    const startYear = parseInt(striker.seasons[0].split("-")[0]);
    if (startYear < 1940) return "Historical (Pre-1940)";
    if (startYear < 1990) return "Classic & Post-War (1940-1990)";
    if (startYear < 2008) return "Early Modern (1990-2008)";
    if (startYear < 2021) return "Golden Era (2008-2021)";
    return "Modern Rebuild (Post-2021)";
  };

  // Get list of unique nationalities
  const nationalities = useMemo(() => {
    const list = strikersData.map(s => s.nationality);
    return ["All", ...Array.from(new Set(list))].sort();
  }, []);

  // Filter strikers
  const filteredStrikers = useMemo(() => {
    return strikersData.filter(striker => {
      // Era filter
      if (selectedEra !== "All" && getPlayerEra(striker) !== selectedEra) return false;
      
      // Nationality filter
      if (selectedNationality !== "All" && striker.nationality !== selectedNationality) return false;
      
      // Position filter
      if (selectedPosition !== "All" && striker.position !== selectedPosition) return false;
      
      // Foot filter
      if (selectedFoot !== "All" && striker.preferredFoot !== selectedFoot) return false;
      
      // Min Matches filter
      if (striker.stats.appearances < minMatches) return false;
      
      // Min Goals filter
      if (striker.stats.goals < minGoals) return false;
      
      // Trophy filter
      if (trophyWinner === "Yes" && striker.stats.trophiesWon === 0) return false;
      
      // UCL filter
      if (uclWinner === "Yes" && striker.honors.championsLeague === 0) return false;
      if (uclWinner === "No" && striker.honors.championsLeague > 0) return false;
      
      // La Liga filter
      if (laligaWinner === "Yes" && striker.honors.laLiga === 0) return false;
      if (laligaWinner === "No" && striker.honors.laLiga > 0) return false;

      return true;
    });
  }, [
    selectedEra, selectedNationality, selectedPosition, selectedFoot, 
    minMatches, minGoals, trophyWinner, uclWinner, laligaWinner
  ]);

  // Compute dynamic KPI Stats
  const kpiStats = useMemo(() => {
    const count = filteredStrikers.length;
    let totalGoals = 0;
    let totalAssists = 0;
    let totalMatches = 0;
    let totalTrophies = 0;
    let totalMinutes = 0;
    let strikersWithMinutes = 0;

    filteredStrikers.forEach(s => {
      totalGoals += s.stats.goals;
      totalAssists += s.stats.assists;
      totalMatches += s.stats.appearances;
      totalTrophies += s.stats.trophiesWon;
      if (s.stats.minutesPlayed) {
        totalMinutes += s.stats.minutesPlayed;
        strikersWithMinutes++;
      }
    });

    const avgGoalsPerMatch = totalMatches > 0 ? (totalGoals / totalMatches) : 0;
    const avgMinutesPerGoal = totalGoals > 0 && totalMinutes > 0 ? Math.round(totalMinutes / totalGoals) : null;

    return {
      count,
      totalGoals,
      totalAssists,
      totalContributions: totalGoals + totalAssists,
      totalMatches,
      totalTrophies,
      avgGoalsPerMatch,
      avgMinutesPerGoal
    };
  }, [filteredStrikers]);

  // Chart Data: Top Scorers (Sorted by Goals)
  const topScorersChartData = useMemo(() => {
    return [...filteredStrikers]
      .sort((a, b) => b.stats.goals - a.stats.goals)
      .slice(0, 15)
      .map(s => ({
        name: s.fullName.split(" ").slice(-1)[0], // last name
        fullName: s.fullName,
        Goals: s.stats.goals,
        Assists: s.stats.assists,
        Contributions: s.stats.goals + s.stats.assists
      }));
  }, [filteredStrikers]);

  // Chart Data: Minutes per Goal (lower is better, only show strikers with recorded minutes)
  const minutesPerGoalChartData = useMemo(() => {
    return filteredStrikers
      .filter(s => s.stats.minutesPerGoal !== null)
      .sort((a, b) => (a.stats.minutesPerGoal || 999) - (b.stats.minutesPerGoal || 999))
      .slice(0, 15)
      .map(s => ({
        name: s.fullName.split(" ").slice(-1)[0],
        "Mins Per Goal": s.stats.minutesPerGoal
      }));
  }, [filteredStrikers]);

  // Chart Data: Nationality Distribution
  const nationalityChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredStrikers.forEach(s => {
      counts[s.nationality] = (counts[s.nationality] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredStrikers]);

  // Chart Data: Preferred Foot
  const footChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredStrikers.forEach(s => {
      counts[s.preferredFoot] = (counts[s.preferredFoot] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredStrikers]);

  // Chart Data: Age at Debut vs Goals
  const ageDebutChartData = useMemo(() => {
    return filteredStrikers.map(s => ({
      name: s.fullName.split(" ").slice(-1)[0],
      age: s.ageAtDebut,
      goals: s.stats.goals,
      appearances: s.stats.appearances
    })).sort((a, b) => a.age - b.age);
  }, [filteredStrikers]);

  // Colors for Barcelona Theme
  const COLORS = ["#004D98", "#A50044", "#EDBB00", "#1D4ED8", "#BE185D", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6", "#EC4899"];

  return (
    <div id="dashboard-view" className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      
      {/* 1. Left Filters Sidebar */}
      <div id="filters-sidebar" className="lg:col-span-1 bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 font-bold text-slate-100">
            <Filter className="w-4 h-4 text-[#A50044]" />
            <span className="tracking-wide uppercase text-xs">Interactive Filters</span>
          </div>
          <button 
            id="reset-filters-btn"
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-[#A50044] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>

        {/* Era Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Player Era</label>
          <select 
            id="era-select"
            value={selectedEra}
            onChange={(e) => setSelectedEra(e.target.value)}
            className="w-full text-sm bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#004D98] cursor-pointer"
          >
            <option value="All">All Eras</option>
            <option value="Historical (Pre-1940)">Historical (Pre-1940)</option>
            <option value="Classic & Post-War (1940-1990)">Classic & Post-War (1940-1990)</option>
            <option value="Early Modern (1990-2008)">Early Modern (1990-2008)</option>
            <option value="Golden Era (2008-2021)">Golden Era (2008-2021)</option>
            <option value="Modern Rebuild (Post-2021)">Modern Rebuild (Post-2021)</option>
          </select>
        </div>

        {/* Nationality Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Nationality</label>
          <select 
            id="nationality-select"
            value={selectedNationality}
            onChange={(e) => setSelectedNationality(e.target.value)}
            className="w-full text-sm bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#004D98] cursor-pointer"
          >
            {nationalities.map(nat => (
              <option key={nat} value={nat}>{nat === "All" ? "All Nationalities" : nat}</option>
            ))}
          </select>
        </div>

        {/* Position Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Tactical Position</label>
          <select 
            id="position-select"
            value={selectedPosition}
            onChange={(e) => setSelectedPosition(e.target.value)}
            className="w-full text-sm bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#004D98] cursor-pointer"
          >
            <option value="All">All Positions</option>
            <option value="Centre Forward">Centre Forward (No. 9)</option>
            <option value="Second Striker">Second Striker</option>
            <option value="False 9">False 9</option>
          </select>
        </div>

        {/* Preferred Foot Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Preferred Foot</label>
          <select 
            id="foot-select"
            value={selectedFoot}
            onChange={(e) => setSelectedFoot(e.target.value)}
            className="w-full text-sm bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#004D98] cursor-pointer"
          >
            <option value="All">All Feet</option>
            <option value="Right">Right Foot</option>
            <option value="Left">Left Foot</option>
            <option value="Both">Both / Ambidextrous</option>
          </select>
        </div>

        {/* Minimum Appearances Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider">Min Appearances</span>
            <span className="font-mono text-slate-200 bg-slate-850 px-1.5 py-0.5 rounded border border-slate-800">{minMatches} matches</span>
          </div>
          <input 
            id="min-matches-slider"
            type="range"
            min="0"
            max="300"
            step="10"
            value={minMatches}
            onChange={(e) => setMinMatches(parseInt(e.target.value))}
            className="w-full accent-[#004D98] cursor-pointer"
          />
        </div>

        {/* Minimum Goals Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider">Min Goals</span>
            <span className="font-mono text-slate-200 bg-slate-850 px-1.5 py-0.5 rounded border border-slate-800">{minGoals} goals</span>
          </div>
          <input 
            id="min-goals-slider"
            type="range"
            min="0"
            max="250"
            step="10"
            value={minGoals}
            onChange={(e) => setMinGoals(parseInt(e.target.value))}
            className="w-full accent-[#A50044] cursor-pointer"
          />
        </div>

        {/* Trophy Toggles */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Honors & Accolades</span>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-300">CL Winner</span>
            <div className="flex bg-slate-900 p-0.5 rounded-lg text-xs font-medium border border-slate-800">
              <button 
                onClick={() => setUclWinner("All")}
                className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${uclWinner === "All" ? "bg-slate-800 text-slate-100 shadow-sm font-semibold" : "text-slate-500 hover:text-slate-300"}`}
              >All</button>
              <button 
                onClick={() => setUclWinner("Yes")}
                className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${uclWinner === "Yes" ? "bg-[#004D98] text-white shadow-sm font-semibold" : "text-slate-500 hover:text-slate-300"}`}
              >Yes</button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-300">La Liga Winner</span>
            <div className="flex bg-slate-900 p-0.5 rounded-lg text-xs font-medium border border-slate-800">
              <button 
                onClick={() => setLaligaWinner("All")}
                className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${laligaWinner === "All" ? "bg-slate-800 text-slate-100 shadow-sm font-semibold" : "text-slate-500 hover:text-slate-300"}`}
              >All</button>
              <button 
                onClick={() => setLaligaWinner("Yes")}
                className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${laligaWinner === "Yes" ? "bg-[#A50044] text-white shadow-sm font-semibold" : "text-slate-500 hover:text-slate-300"}`}
              >Yes</button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Analytics Dashboard Area */}
      <div id="main-dashboard-area" className="lg:col-span-3 space-y-6">
        
        {/* KPI Cards Grid */}
        <div id="kpi-cards" className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          {/* Card: Total Strikers */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 shadow-xl flex items-center gap-3">
            <div className="p-3 bg-slate-900 border border-slate-800 text-[#004D98] rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Filtered Strikers</p>
              <p className="text-2xl font-black text-slate-100">{kpiStats.count}</p>
            </div>
          </div>

          {/* Card: Total Goals */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 shadow-xl flex items-center gap-3">
            <div className="p-3 bg-slate-900 border border-slate-800 text-[#A50044] rounded-xl">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Goals</p>
              <p className="text-2xl font-black text-slate-100">{kpiStats.totalGoals}</p>
            </div>
          </div>

          {/* Card: Goals Per Match */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 shadow-xl flex items-center gap-3">
            <div className="p-3 bg-slate-900 border border-slate-800 text-amber-500 rounded-xl">
              <Play className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Goals/Match</p>
              <p className="text-2xl font-black text-slate-100">
                {kpiStats.avgGoalsPerMatch.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Card: Total Trophies */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 shadow-xl flex items-center gap-3">
            <div className="p-3 bg-slate-900 border border-slate-800 text-[#EDBB00] rounded-xl">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Trophies Won</p>
              <p className="text-2xl font-black text-slate-100">{kpiStats.totalTrophies}</p>
            </div>
          </div>
        </div>

        {filteredStrikers.length === 0 ? (
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-12 text-center space-y-3 shadow-2xl">
            <Filter className="w-8 h-8 text-slate-500 mx-auto animate-pulse" />
            <p className="text-base font-semibold text-slate-200">No Strikers Match These Filters</p>
            <p className="text-sm text-slate-400">Try adjusting your sliders or resetting the filters sidebar to show players.</p>
            <button 
              onClick={resetFilters}
              className="bg-[#A50044] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-opacity-90 transition-opacity cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Primary Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Chart: Goals & Assists by Player */}
              <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-100 text-sm uppercase tracking-wide">Goals & Assists (Top 15)</span>
                  <span className="text-xs font-bold text-[#004D98] uppercase">Barca Career</span>
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topScorersChartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#090d16", borderRadius: "12px", border: "1px solid #1e293b" }}
                        labelStyle={{ color: "#ffffff", fontWeight: "bold", fontSize: "12px" }}
                        itemStyle={{ color: "#cbd5e1", fontSize: "12px" }}
                      />
                      <Legend iconType="circle" fontSize={11} wrapperStyle={{ paddingTop: 10 }} />
                      <Bar dataKey="Goals" stackId="a" fill="#A50044" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="Assists" stackId="a" fill="#004D98" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart: Minutes per Goal */}
              <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-100 text-sm uppercase tracking-wide">Minutes Per Goal (Top 15)</span>
                  <span className="text-xs font-bold text-[#EDBB00] font-mono">LOWER IS BETTER</span>
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={minutesPerGoalChartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#090d16", borderRadius: "12px", border: "1px solid #1e293b" }}
                        labelStyle={{ color: "#ffffff", fontWeight: "bold", fontSize: "12px" }}
                        itemStyle={{ color: "#cbd5e1", fontSize: "12px" }}
                      />
                      <Bar dataKey="Mins Per Goal" fill="#EDBB00" radius={[4, 4, 0, 0]}>
                        <LabelList dataKey="Mins Per Goal" position="top" fill="#94a3b8" fontSize={10} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* Secondary Distribution Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Pie Chart: Nationality Distribution */}
              <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 md:col-span-1">
                <span className="font-bold text-slate-100 text-sm uppercase tracking-wide block">Nationality Split</span>
                <div className="h-56 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={nationalityChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {nationalityChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#090d16", borderRadius: "12px", border: "1px solid #1e293b" }}
                        itemStyle={{ color: "#cbd5e1" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[10px] justify-center text-slate-400 font-medium">
                  {nationalityChartData.slice(0, 5).map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-1">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span>{entry.name}: {entry.value}</span>
                    </div>
                  ))}
                  {nationalityChartData.length > 5 && (
                    <div className="text-slate-500">+{nationalityChartData.length - 5} more</div>
                  )}
                </div>
              </div>

              {/* Pie Chart: Preferred Foot */}
              <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 md:col-span-1">
                <span className="font-bold text-slate-100 text-sm uppercase tracking-wide block">Foot Dominance</span>
                <div className="h-56 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={footChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {footChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? "#A50044" : index === 1 ? "#004D98" : "#EDBB00"} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#090d16", borderRadius: "12px", border: "1px solid #1e293b" }}
                        itemStyle={{ color: "#cbd5e1" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex gap-4 text-xs justify-center text-slate-400 font-medium">
                  {footChartData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-1">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: index === 0 ? "#A50044" : index === 1 ? "#004D98" : "#EDBB00" }} />
                      <span>{entry.name}: {entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scatter Chart: Age at Debut vs Goals Scored */}
              <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 md:col-span-1">
                <span className="font-bold text-slate-100 text-sm uppercase tracking-wide block">Debut Age vs. Career Goals</span>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 10, right: 10, bottom: -10, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis type="number" dataKey="age" name="Debut Age" stroke="#64748b" fontSize={10} domain={[14, 36]} />
                      <YAxis type="number" dataKey="goals" name="Goals" stroke="#64748b" fontSize={10} />
                      <Tooltip 
                        cursor={{ strokeDasharray: '3 3' }}
                        contentStyle={{ backgroundColor: "#090d16", borderRadius: "12px", border: "1px solid #1e293b" }}
                        itemStyle={{ color: "#cbd5e1" }}
                      />
                      <Scatter name="Strikers" data={ageDebutChartData} fill="#004D98">
                        {ageDebutChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.goals > 150 ? "#A50044" : "#004D98"} />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-[10px] text-center text-slate-500 font-medium">
                  Matches debut age against career club goals. Burgundy indicates elite category (&gt;150 goals).
                </div>
              </div>

            </div>

            {/* List Table View inside Dashboard */}
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-100 text-base uppercase tracking-wider">Filtered Striker Performance Index</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Click any header in other views to compare. Standard metrics sourced from club records.</p>
                </div>
                <span className="text-xs bg-slate-900 text-slate-300 border border-slate-800 font-mono px-2 py-1 rounded">
                  {filteredStrikers.length} players found
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-900/50 border-b border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider">
                      <th className="px-6 py-3">Player Name</th>
                      <th className="px-6 py-3">Nationality</th>
                      <th className="px-6 py-3">Matches</th>
                      <th className="px-6 py-3">Goals</th>
                      <th className="px-6 py-3">Assists</th>
                      <th className="px-6 py-3 text-right">Goals / Match</th>
                      <th className="px-6 py-3 text-right">Trophies</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300 font-medium">
                    {filteredStrikers.map((striker) => (
                      <tr key={striker.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="px-6 py-3.5">
                          <div className="flex flex-col">
                            <span className="text-white font-bold">{striker.fullName}</span>
                            <span className="text-[11px] text-rose-400 font-semibold">{striker.position} ({striker.preferredFoot} Foot)</span>
                          </div>
                        </td>
                        <td className="px-6 py-3.5 text-slate-400">{striker.nationality}</td>
                        <td className="px-6 py-3.5 font-mono text-slate-300">{striker.stats.appearances}</td>
                        <td className="px-6 py-3.5 font-mono text-rose-400 font-bold">{striker.stats.goals}</td>
                        <td className="px-6 py-3.5 font-mono text-blue-400">{striker.stats.assists}</td>
                        <td className="px-6 py-3.5 text-right font-mono font-bold text-slate-200">
                          {striker.stats.goalsPerMatch.toFixed(2)}
                        </td>
                        <td className="px-6 py-3.5 text-right font-mono">
                          <span className="bg-slate-900 text-[#EDBB00] border border-slate-800 px-2.5 py-0.5 rounded-full text-xs font-bold inline-flex items-center gap-1">
                            <Trophy className="w-3 h-3 text-[#EDBB00]" />
                            {striker.stats.trophiesWon}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}
        
      </div>

    </div>
  );
}

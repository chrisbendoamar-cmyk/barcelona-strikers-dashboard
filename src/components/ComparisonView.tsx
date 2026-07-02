import React, { useState, useMemo } from "react";
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from "recharts";
import { Striker, strikersData } from "../data/strikers";
import { Plus, X, Users, ArrowRightLeft, Trophy, Target, Award, Calendar } from "lucide-react";

export default function ComparisonView() {
  // Pre-select Messi and Suarez for immediate utility
  const [comparedIds, setComparedIds] = useState<string[]>(["messi", "suarez"]);

  // Available strikers to add (not already selected)
  const availableStrikers = useMemo(() => {
    return strikersData.filter(s => !comparedIds.includes(s.id));
  }, [comparedIds]);

  // Selected strikers data
  const selectedStrikers = useMemo(() => {
    return comparedIds.map(id => strikersData.find(s => s.id === id)).filter(Boolean) as Striker[];
  }, [comparedIds]);

  // Add a striker to comparison
  const addStriker = (id: string) => {
    if (comparedIds.length >= 5) {
      alert("You can compare a maximum of 5 strikers side-by-side.");
      return;
    }
    setComparedIds([...comparedIds, id]);
  };

  // Remove a striker from comparison
  const removeStriker = (id: string) => {
    if (comparedIds.length <= 2) {
      alert("Please keep at least 2 strikers for comparison.");
      return;
    }
    setComparedIds(comparedIds.filter(cid => cid !== id));
  };

  // Chart Data: General Stats comparison
  const statsChartData = useMemo(() => {
    return selectedStrikers.map(s => ({
      name: s.fullName.split(" ").slice(-1)[0],
      Goals: s.stats.goals,
      Assists: s.stats.assists,
      Trophies: s.stats.trophiesWon
    }));
  }, [selectedStrikers]);

  // Chart Data: Normalised ratios
  const ratioChartData = useMemo(() => {
    return selectedStrikers.map(s => {
      // Calculate goals per 90 if minutes exist, otherwise goals per match
      const g90 = s.stats.minutesPlayed && s.stats.minutesPlayed > 0 
        ? parseFloat(((s.stats.goals / s.stats.minutesPlayed) * 90).toFixed(2))
        : parseFloat(s.stats.goalsPerMatch.toFixed(2));
      
      const a90 = s.stats.minutesPlayed && s.stats.minutesPlayed > 0 && s.stats.assists
        ? parseFloat(((s.stats.assists / s.stats.minutesPlayed) * 90).toFixed(2))
        : s.stats.appearances > 0 ? parseFloat((s.stats.assists / s.stats.appearances).toFixed(2)) : 0;

      return {
        name: s.fullName.split(" ").slice(-1)[0],
        "Goals Ratio": g90,
        "Assists Ratio": a90
      };
    });
  }, [selectedStrikers]);

  // Table rows structure
  const tableRows = [
    { label: "Full Name", value: (s: Striker) => s.fullName, isHeader: true },
    { label: "Nationality", value: (s: Striker) => s.nationality },
    { label: "Tactical Position", value: (s: Striker) => s.position },
    { label: "Preferred Foot", value: (s: Striker) => s.preferredFoot },
    { label: "Height (cm)", value: (s: Striker) => `${s.height} cm` },
    { label: "Debut Age", value: (s: Striker) => s.ageAtDebut },
    { label: "Years Active", value: (s: Striker) => `${s.seasons[0].split("-")[0]} - ${s.barcelonaExit === "Present" ? "Present" : s.barcelonaExit.split("-")[0]}` },
    
    // Core stats
    { label: "Appearances", value: (s: Striker) => s.stats.appearances.toLocaleString(), isCore: true },
    { label: "Goals Scored", value: (s: Striker) => s.stats.goals.toLocaleString(), isCore: true },
    { label: "Assists", value: (s: Striker) => s.stats.assists.toLocaleString(), isCore: true },
    { label: "Goal Contributions", value: (s: Striker) => s.stats.goalContributions.toLocaleString(), isCore: true },
    { label: "Goals per Match", value: (s: Striker) => s.stats.goalsPerMatch.toFixed(2), isCore: true },
    { label: "Minutes per Goal", value: (s: Striker) => s.stats.minutesPerGoal ? `${s.stats.minutesPerGoal} min` : "N/A" },
    { label: "Hat-tricks", value: (s: Striker) => s.stats.hatTricks },
    { label: "Penalties Scored", value: (s: Striker) => s.stats.penaltyGoals },
    { label: "Free Kick Goals", value: (s: Striker) => s.stats.freeKickGoals },
    { label: "Trophies Won", value: (s: Striker) => s.stats.trophiesWon, isCore: true },

    // Honors
    { label: "Ballon d'Ors / World Player", value: (s: Striker) => s.honors.ballonDorPlacements },
    { label: "European Golden Boots", value: (s: Striker) => s.honors.goldenBoot },
    { label: "Pichichi Trophies", value: (s: Striker) => s.honors.pichichi },
    { label: "Champions Leagues", value: (s: Striker) => s.honors.championsLeague },
    { label: "La Liga Titles", value: (s: Striker) => s.honors.laLiga },

    // Advanced Stats
    { label: "Expected Goals (xG)", value: (s: Striker) => s.advanced.xG ? s.advanced.xG : "N/A (Historical)", isAdvanced: true },
    { label: "Expected Assists (xA)", value: (s: Striker) => s.advanced.xA ? s.advanced.xA : "N/A (Historical)", isAdvanced: true },
    { label: "Shot Accuracy (%)", value: (s: Striker) => s.advanced.shotAccuracy ? `${s.advanced.shotAccuracy}%` : "N/A (Historical)", isAdvanced: true },
    { label: "Shot Conversion (%)", value: (s: Striker) => s.advanced.conversionRate ? `${s.advanced.conversionRate}%` : "N/A (Historical)", isAdvanced: true },
    { label: "Dribbles Completed", value: (s: Striker) => s.advanced.dribblesCompleted !== null ? s.advanced.dribblesCompleted : "N/A (Historical)", isAdvanced: true },
    { label: "Touches in Opponent Box", value: (s: Striker) => s.advanced.touchesInOppBox !== null ? s.advanced.touchesInOppBox : "N/A (Historical)", isAdvanced: true },
    { label: "Key Passes", value: (s: Striker) => s.advanced.keyPasses !== null ? s.advanced.keyPasses : "N/A (Historical)", isAdvanced: true },
    { label: "Aerial Duels Won", value: (s: Striker) => s.advanced.aerialDuelsWon !== null ? s.advanced.aerialDuelsWon : "N/A (Historical)", isAdvanced: true },
    { label: "Avg Match Rating", value: (s: Striker) => s.advanced.averageRating !== null ? s.advanced.averageRating.toFixed(2) : "N/A (Historical)", isAdvanced: true }
  ];

  return (
    <div id="comparison-view" className="space-y-6">
      
      {/* Selector Area */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-850 pb-3">
          <div className="flex items-center gap-2 font-semibold text-slate-100 uppercase tracking-wide text-sm">
            <ArrowRightLeft className="w-5 h-5 text-[#A50044]" />
            <span>Select Strikers to Compare</span>
          </div>
          <span className="text-xs text-slate-400 font-medium">Compare 2 to 5 players side-by-side</span>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {/* Currently Selected Players pills */}
          {selectedStrikers.map(s => (
            <div key={s.id} className="bg-slate-900 border border-slate-800 pl-3 pr-2 py-1.5 rounded-xl flex items-center gap-2 text-xs font-bold text-slate-200">
              <span>{s.fullName}</span>
              <button 
                id={`remove-comparison-${s.id}`}
                onClick={() => removeStriker(s.id)}
                className="p-0.5 rounded-full hover:bg-slate-800 text-slate-500 hover:text-rose-500 transition-colors cursor-pointer"
                title="Remove player"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {/* Add Player Dropdown/Pills if under limit */}
          {comparedIds.length < 5 && availableStrikers.length > 0 && (
            <div className="relative inline-block">
              <select
                id="add-comparison-select"
                onChange={(e) => {
                  if (e.target.value) {
                    addStriker(e.target.value);
                    e.target.value = "";
                  }
                }}
                className="bg-[#004D98] text-white border-none rounded-xl pl-3 pr-8 py-2 text-xs font-bold focus:outline-none cursor-pointer hover:bg-opacity-90 appearance-none inline-flex items-center gap-1 shadow-md"
              >
                <option value="">+ Add Striker for Comparison</option>
                {availableStrikers.map(s => (
                  <option key={s.id} value={s.id}>{s.fullName}</option>
                ))}
              </select>
              <div className="absolute top-2.5 right-2.5 pointer-events-none text-white font-bold text-[10px]">▼</div>
            </div>
          )}
        </div>
      </div>

      {/* Comparison Visual Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Chart: Career Totals */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
          <span className="font-bold text-slate-100 text-sm uppercase tracking-wide block">Career Totals Comparison</span>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statsChartData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#090d16", borderRadius: "12px", border: "1px solid #1e293b" }}
                  itemStyle={{ color: "#cbd5e1" }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "11px", paddingTop: 10, color: "#94a3b8" }} />
                <Bar dataKey="Goals" fill="#A50044" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Assists" fill="#004D98" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Trophies" fill="#EDBB00" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart: Efficiency Ratios */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
          <span className="font-bold text-slate-100 text-sm uppercase tracking-wide block">Efficiency Ratios (Goals & Assists per 90 / Match)</span>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratioChartData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#090d16", borderRadius: "12px", border: "1px solid #1e293b" }}
                  itemStyle={{ color: "#cbd5e1" }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "11px", paddingTop: 10, color: "#94a3b8" }} />
                <Bar dataKey="Goals Ratio" fill="#A50044" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Assists Ratio" fill="#004D98" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Main Side-by-Side Comparison Table */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-850">
          <h3 className="font-black text-slate-100 text-base uppercase tracking-wide">Analytical Comparison Matrix</h3>
          <p className="text-xs text-slate-400 mt-0.5">Comprehensive grid displaying physical profile, honors, core career metrics, and advanced metrics side-by-side.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800 text-slate-300 font-bold">
                <th className="px-6 py-4 font-bold border-r border-slate-800 text-xs uppercase tracking-wider text-slate-400 w-64">Metrics</th>
                {selectedStrikers.map(s => (
                  <th key={s.id} className="px-6 py-4 font-bold text-center border-r border-slate-800 min-w-56 last:border-r-0">
                    <div className="flex flex-col items-center">
                      <span className="text-white font-black text-sm">{s.fullName}</span>
                      <span className="text-[10px] text-rose-400 font-bold tracking-wider uppercase mt-0.5">{s.position}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {tableRows.map((row, idx) => {
                let rowBgClass = "";
                if (row.isHeader) {
                  rowBgClass = "bg-slate-900/50 font-bold text-slate-100";
                } else if (row.isCore) {
                  rowBgClass = "bg-[#A50044]/5 font-semibold text-slate-200";
                } else if (row.isAdvanced) {
                  rowBgClass = "bg-[#004D98]/5 text-slate-200";
                }

                return (
                  <tr key={idx} className={`hover:bg-slate-800/30 transition-colors ${rowBgClass}`}>
                    <td className="px-6 py-3 font-semibold text-slate-400 border-r border-slate-800 w-64 text-xs">
                      {row.label}
                    </td>
                    {selectedStrikers.map(s => {
                      const displayVal = row.value(s);
                      let styleClass = "text-center px-6 py-3 border-r border-slate-800 last:border-r-0 text-xs";
                      
                      if (row.isHeader) {
                        styleClass += " text-white font-black text-sm";
                      } else if (row.isCore) {
                        styleClass += " text-white font-bold";
                      } else if (displayVal === "N/A (Historical)") {
                        styleClass += " text-slate-600 italic font-normal";
                      } else {
                        styleClass += " text-slate-300 font-semibold";
                      }

                      return (
                        <td key={s.id} className={styleClass}>
                          {displayVal}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

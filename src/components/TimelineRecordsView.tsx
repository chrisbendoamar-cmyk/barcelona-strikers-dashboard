import React, { useMemo } from "react";
import { Striker, strikersData } from "../data/strikers";
import { Award, Trophy, Users, Clock, History, Calendar, Medal, HelpCircle } from "lucide-react";

export default function TimelineRecordsView() {
  
  // 1. Dynamic records calculation
  const records = useMemo(() => {
    // Helper to find max player
    const findMax = (cb: (s: Striker) => number) => {
      let maxVal = -1;
      let maxPlayer: Striker | null = null;
      strikersData.forEach(s => {
        const val = cb(s);
        if (val > maxVal) {
          maxVal = val;
          maxPlayer = s;
        }
      });
      return { player: maxPlayer, value: maxVal };
    };

    // Helper to find min player
    const findMin = (cb: (s: Striker) => number) => {
      let minVal = 999;
      let minPlayer: Striker | null = null;
      strikersData.forEach(s => {
        const val = cb(s);
        if (val < minVal) {
          minVal = val;
          minPlayer = s;
        }
      });
      return { player: minPlayer, value: minVal };
    };

    const mostGoals = findMax(s => s.stats.goals);
    const mostAssists = findMax(s => s.stats.assists);
    const mostHatTricks = findMax(s => s.stats.hatTricks);
    const highestGPM = findMax(s => s.stats.goalsPerMatch);
    const mostTrophies = findMax(s => s.stats.trophiesWon);
    const mostAppearances = findMax(s => s.stats.appearances);
    const youngestDebut = findMin(s => s.ageAtDebut);
    const oldestSigning = findMax(s => s.ageAtDebut);
    const mostPenalties = findMax(s => s.stats.penaltyGoals);
    const mostFreeKicks = findMax(s => s.stats.freeKickGoals);

    // Highest Goals per 90 (among players with minutes recorded)
    let highestG90Val = -1;
    let highestG90Player: Striker | null = null;
    strikersData.forEach(s => {
      if (s.stats.minutesPlayed && s.stats.minutesPlayed > 0) {
        const g90 = (s.stats.goals / s.stats.minutesPlayed) * 90;
        if (g90 > highestG90Val) {
          highestG90Val = g90;
          highestG90Player = s;
        }
      }
    });

    // Best Conversion Rate (among players with advanced stats)
    let bestConvVal = -1;
    let bestConvPlayer: Striker | null = null;
    strikersData.forEach(s => {
      if (s.advanced.conversionRate !== null) {
        if (s.advanced.conversionRate > bestConvVal) {
          bestConvVal = s.advanced.conversionRate;
          bestConvPlayer = s;
        }
      }
    });

    return {
      mostGoals,
      mostAssists,
      mostHatTricks,
      highestGPM,
      highestG90: { player: highestG90Player, value: highestG90Val },
      bestConversion: { player: bestConvPlayer, value: bestConvVal },
      mostTrophies,
      mostAppearances,
      youngestDebut,
      oldestSigning,
      mostPenalties,
      mostFreeKicks
    };
  }, []);

  // 2. Chronological sorting of strikers by their arrival year
  const timelineStrikers = useMemo(() => {
    return [...strikersData].sort((a, b) => {
      const yearA = parseInt(a.seasons[0].split("-")[0]);
      const yearB = parseInt(b.seasons[0].split("-")[0]);
      return yearA - yearB;
    });
  }, []);

  return (
    <div id="timeline-records-view" className="space-y-8">
      
      {/* Dynamic Records Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-850 pb-3">
          <Award className="w-5 h-5 text-[#A50044]" />
          <div>
            <h2 className="font-black text-slate-100 text-lg uppercase tracking-wide">FC Barcelona Strikers All-Time Records</h2>
            <p className="text-xs text-slate-400 mt-0.5">Dynamically calculated across all legendary forwards in the master dataset.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Record: Most Goals */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 shadow-2xl flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
              <span>All-Time Top Scorer</span>
              <Trophy className="w-4 h-4 text-[#EDBB00]" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-100 leading-tight">
                {records.mostGoals.player?.fullName.split(" ").slice(-1)[0]}
              </p>
              <p className="text-2xl font-black text-rose-400 mt-1">
                {records.mostGoals.value} <span className="text-xs font-semibold text-slate-400">Goals</span>
              </p>
            </div>
            <p className="text-[10px] text-slate-400 font-medium leading-normal">
              Accumulated in {records.mostGoals.player?.stats.appearances} appearances ({records.mostGoals.player?.stats.goalsPerMatch.toFixed(2)} ratio).
            </p>
          </div>

          {/* Record: Most Assists */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 shadow-2xl flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
              <span>All-Time Playmaker</span>
              <Medal className="w-4 h-4 text-[#004D98]" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-100 leading-tight">
                {records.mostAssists.player?.fullName.split(" ").slice(-1)[0]}
              </p>
              <p className="text-2xl font-black text-blue-400 mt-1">
                {records.mostAssists.value} <span className="text-xs font-semibold text-slate-400">Assists</span>
              </p>
            </div>
            <p className="text-[10px] text-slate-400 font-medium leading-normal">
              Most goals generated for teammates in modern club history.
            </p>
          </div>

          {/* Record: Highest Goals per Match */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 shadow-2xl flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
              <span>Best Scoring Ratio</span>
              <Clock className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-100 leading-tight">
                {records.highestGPM.player?.fullName.split(" ").slice(-1)[0]}
              </p>
              <p className="text-2xl font-black text-emerald-400 mt-1">
                {records.highestGPM.value.toFixed(2)} <span className="text-xs font-semibold text-slate-400">Goals/Match</span>
              </p>
            </div>
            <p className="text-[10px] text-slate-400 font-medium leading-normal">
              Held by early net-breaker {records.highestGPM.player?.fullName} who averaged 1.00 goals per game.
            </p>
          </div>

          {/* Record: Most Hat-Tricks */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 shadow-2xl flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
              <span>Most Hat-Tricks</span>
              <Award className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-100 leading-tight">
                {records.mostHatTricks.player?.fullName.split(" ").slice(-1)[0]}
              </p>
              <p className="text-2xl font-black text-purple-400 mt-1">
                {records.mostHatTricks.value} <span className="text-xs font-semibold text-slate-400">Hat-Tricks</span>
              </p>
            </div>
            <p className="text-[10px] text-slate-400 font-medium leading-normal">
              Unbelievable match ball hauls in domestic and European fixtures.
            </p>
          </div>

          {/* Row 2 Records */}
          {/* Record: Most Trophies */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 shadow-2xl flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
              <span>Trophy King</span>
              <Trophy className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-100 leading-tight">
                {records.mostTrophies.player?.fullName.split(" ").slice(-1)[0]}
              </p>
              <p className="text-2xl font-black text-[#EDBB00] mt-1">
                {records.mostTrophies.value} <span className="text-xs font-semibold text-slate-400">Trophies</span>
              </p>
            </div>
            <p className="text-[10px] text-slate-400 font-medium leading-normal">
              Including La Liga titles, Copa del Rey titles, and Champions League trophies.
            </p>
          </div>

          {/* Record: Most Appearances */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 shadow-2xl flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
              <span>Club Longevity</span>
              <History className="w-4 h-4 text-[#004D98]" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-100 leading-tight">
                {records.mostAppearances.player?.fullName.split(" ").slice(-1)[0]}
              </p>
              <p className="text-2xl font-black text-blue-400 mt-1">
                {records.mostAppearances.value} <span className="text-xs font-semibold text-slate-400">Matches</span>
              </p>
            </div>
            <p className="text-[10px] text-slate-400 font-medium leading-normal">
              Staggering years spent at the very highest level of competitive play.
            </p>
          </div>

          {/* Record: Youngest Debut */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 shadow-2xl flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
              <span>Youngest Debutant</span>
              <Calendar className="w-4 h-4 text-red-500" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-100 leading-tight">
                {records.youngestDebut.player?.fullName.split(" ").slice(-1)[0]}
              </p>
              <p className="text-2xl font-black text-rose-400 mt-1">
                {records.youngestDebut.value} <span className="text-xs font-semibold text-slate-400">Years Old</span>
              </p>
            </div>
            <p className="text-[10px] text-slate-400 font-medium leading-normal">
              {records.youngestDebut.player?.fullName} debuted in 1912 at exactly 15 years, 3 months, 26 days.
            </p>
          </div>

          {/* Record: Most Free Kick Goals */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 shadow-2xl flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
              <span>Free-Kick Maestro</span>
              <Award className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-100 leading-tight">
                {records.mostFreeKicks.player?.fullName.split(" ").slice(-1)[0]}
              </p>
              <p className="text-2xl font-black text-[#EDBB00] mt-1">
                {records.mostFreeKicks.value} <span className="text-xs font-semibold text-slate-400">Deadballs</span>
              </p>
            </div>
            <p className="text-[10px] text-slate-400 font-medium leading-normal">
              Spectacular direct free kicks converted into crucial goals.
            </p>
          </div>

        </div>
      </div>

      {/* Chronological Striker Timeline */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-850 pb-3">
          <History className="w-5 h-5 text-[#004D98]" />
          <div>
            <h2 className="font-black text-slate-100 text-lg uppercase tracking-wide">Chronological Striker Timeline</h2>
            <p className="text-xs text-slate-400 mt-0.5">Chronicle of FC Barcelona's elite strikers ordered by their debut year.</p>
          </div>
        </div>

        <div className="relative border-l-2 border-slate-800 ml-4 pl-6 space-y-6">
          {timelineStrikers.map((s, index) => {
            const startYear = s.seasons[0].split("-")[0];
            const endYear = s.barcelonaExit === "Present" ? "Present" : s.barcelonaExit.split("-")[0];
            
            return (
              <div key={s.id} className="relative group">
                {/* Visual Circle Marker */}
                <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-slate-950 border-2 border-[#A50044] group-hover:bg-[#A50044] transition-colors" />
                
                {/* Card Container */}
                <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-3 hover:border-slate-700 transition-all">
                  
                  {/* Top line with Year & Player name */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-white bg-[#004D98] px-2 py-0.5 rounded-md font-bold">
                        {startYear} - {endYear}
                      </span>
                      <h3 className="font-black text-white text-base">{s.fullName}</h3>
                    </div>
                    <span className="text-xs font-bold text-rose-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full inline-block self-start">
                      {s.position}
                    </span>
                  </div>

                  {/* Highlights/Biography snippet */}
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    {s.biography.split(".")[0]}. {s.biography.split(".")[1]}.
                  </p>

                  {/* Metas: Managers, Trophies, Goals */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2.5 border-t border-slate-850 text-[11px] text-slate-400 font-medium">
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase tracking-wider">Managers Played Under</span>
                      <span className="text-slate-200 font-bold leading-tight line-clamp-1" title={s.managers.join(", ")}>
                        {s.managers.slice(0, 3).join(", ")}
                        {s.managers.length > 3 && "..."}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase tracking-wider">Major Honors</span>
                      <span className="text-[#EDBB00] font-bold flex items-center gap-0.5">
                        <Trophy className="w-3 h-3 inline" />
                        {s.stats.trophiesWon} Trophies ({s.honors.laLiga} La Ligas, {s.honors.championsLeague} UCLs)
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase tracking-wider">Goal Output</span>
                      <span className="text-slate-200 font-bold">
                        {s.stats.goals} goals in {s.stats.appearances} apps ({s.stats.goalsPerMatch.toFixed(2)} GPM)
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

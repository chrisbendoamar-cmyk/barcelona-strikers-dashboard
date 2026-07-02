import React from "react";
import { dataSources } from "../data/strikers";
import { BookOpen, Newspaper, Award, FileText, CheckCircle, Database } from "lucide-react";

export default function SummaryDocsView() {
  return (
    <div id="summary-docs-view" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Executive Summary Section (Left & Center) */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Executive summary of strikers */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-850 pb-3">
            <Newspaper className="w-5 h-5 text-[#A50044]" />
            <h2 className="font-black text-slate-100 text-lg uppercase tracking-wide">Executive Analyst Summary: Barcelona's Greatest No. 9s</h2>
          </div>

          <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-medium">
            <p>
              An analytical review of FC Barcelona's forward line across its 120-year history reveals that the club's greatest periods of dominance have coincided with revolutionary central attackers. Unlike traditional target-men, Barcelona's strikers have historically been required to possess elite link-up play, tactical intelligence, and spatial awareness—traits that define the club's core possession philosophy.
            </p>

            {/* Categorized Legends analysis */}
            <div className="space-y-4 pt-2">
              
              <div className="border-l-4 border-[#A50044] pl-3 space-y-1">
                <h4 className="font-extrabold text-slate-100">1. The Absolute Pinnacle: Lionel Messi (False 9 Era)</h4>
                <p className="text-xs text-slate-400">
                  While Messi began his career on the wing, Pep Guardiola's decision to deploy him centrally as a "False 9" in 2009 redefined modern tactical theory. Messi's statistics during his central years (notably his 73 goals in 2011-12) are statistically anomalous. Operating in deep half-spaces, he registered elite goal-scoring ratios (0.86 GPM) while simultaneously acting as the club's primary playmaker (305 total assists).
                </p>
              </div>

              <div className="border-l-4 border-[#004D98] pl-3 space-y-1">
                <h4 className="font-extrabold text-slate-100">2. The Complete Modern No. 9: Luis Suárez</h4>
                <p className="text-xs text-slate-400">
                  Signed in 2014, Luis Suárez represents the apex of traditional yet dynamic center-forward play. In the 2015-16 season, Suárez broke the Messi-Ronaldo monopoly by scoring 40 league goals (59 total) to secure the Pichichi and European Golden Shoe. With 198 goals and 113 assists in just 283 matches, Suárez was a relentless pressing engine, holding the best assists-per-appearance ratio among all Barca central forwards.
                </p>
              </div>

              <div className="border-l-4 border-[#EDBB00] pl-3 space-y-1">
                <h4 className="font-extrabold text-slate-100">3. The Dream Team Spearhead: Romário</h4>
                <p className="text-xs text-slate-400">
                  Under Johan Cruyff, Romário played with an icy composure that terrorized Spanish defenses. Scoring 30 goals in just 33 league appearances in his debut 1993-94 season, his trademark toe-poking technique, short acceleration, and spatial orientation inside the box established him as one of the most efficient finishers to ever wear the Blaugrana.
                </p>
              </div>

              <div className="border-l-4 border-emerald-500 pl-3 space-y-1">
                <h4 className="font-extrabold text-slate-100">4. Historical Pioneers: Paulino Alcántara & César Rodríguez</h4>
                <p className="text-xs text-slate-400">
                  Alcántara was a legend of the pre-league era, famous for literally tearing the net with his shot, scoring 143 official goals at a ratio of 1.00 per game. Decades later, César Rodríguez became the post-war giant, scoring 232 official goals (second all-time) and anchoring the famous "Five Cups" team of Ferdinand Daučík.
                </p>
              </div>

              <div className="border-l-4 border-purple-500 pl-3 space-y-1">
                <h4 className="font-extrabold text-slate-100">5. Modern Rebuild Anchor: Robert Lewandowski</h4>
                <p className="text-xs text-slate-400">
                  Signed at age 33 to provide veteran guidance and lethal clinical output during the post-Messi reconstruction, Robert Lewandowski immediately delivered. His Pichichi-winning debut season (23 league goals, 33 total) led Barcelona back to league glory in 2023, showcasing the enduring value of world-class positioning and finishing efficiency.
                </p>
              </div>

            </div>

            <p className="pt-2">
              In conclusion, the data demonstrates that FC Barcelona has benefited from a diverse array of strike profiles. Whether through the direct, explosive speed of Ronaldo (1996-97), the clinical big-match heroics of Samuel Eto'o, or the majestic playmaking of László Kubala, the club's No. 9 jersey has consistently been home to world-class innovators who shaped the history of the sport.
            </p>
          </div>
        </div>

        {/* Dashboard Structure Documentation */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-850 pb-3">
            <BookOpen className="w-5 h-5 text-[#004D98]" />
            <h2 className="font-black text-slate-100 text-lg uppercase tracking-wide">Dashboard Structure & Design</h2>
          </div>
          <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-medium">
            <p>
              This analytics dashboard was designed to replicate high-end professional platforms like Wyscout, Opta Analyst, and StatsBomb, combining ease-of-use with advanced statistical queries:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 pt-1">
              <li><strong>Interactive Filters:</strong> Allows scouts and historians to isolate performance curves across specific club eras, nationality nodes, and tactical roles.</li>
              <li><strong>KPI Calculations:</strong> Computes dynamic weighted statistical outputs of the selected group, removing sample sizes that would bias average calculations.</li>
              <li><strong>Percentile Rankings:</strong> Relativizes player accomplishments against all other listed Barcelona strikers, illustrating whether they were elite in longevity, clinical finishing, or creative playmaking.</li>
              <li><strong>Head-to-Head Comparison:</strong> Implements a side-by-side analytical matrix that displays physical profiles, trophy counts, and advanced Opta stats side-by-side.</li>
              <li><strong>Historical Timeline:</strong> Orders strikers chronologically to analyze tactical evolutions and manager-tenure patterns.</li>
            </ul>
          </div>
        </div>

      </div>

      {/* Metrics Glossary and Sources (Right Hand Column) */}
      <div className="lg:col-span-1 space-y-6">
        
        {/* Metrics Glossary */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-850 pb-2">
            <FileText className="w-4.5 h-4.5 text-[#004D98]" />
            <h3 className="font-bold text-slate-100 text-sm uppercase tracking-wide">Analytical Metrics Glossary</h3>
          </div>
          <div className="space-y-3 text-xs">
            
            <div className="space-y-0.5">
              <span className="font-bold text-slate-200 block">Goals per Match (GPM)</span>
              <p className="text-slate-400 font-medium">Calculated as total goals divided by appearances. Ratios above 0.50 are considered elite, while &gt;0.80 represents world-class historically.</p>
            </div>

            <div className="space-y-0.5">
              <span className="font-bold text-slate-200 block">Expected Goals (xG)</span>
              <p className="text-slate-400 font-medium">Measures the quality of a shot based on variables like shot angle, distance, and defender pressure. This is only available for modern players (post-2010).</p>
            </div>

            <div className="space-y-0.5">
              <span className="font-bold text-slate-200 block">Conversion Rate (%)</span>
              <p className="text-slate-400 font-medium">Percentage of total shots that result in a goal. Traditional elite No. 9s usually average around 18-24%, while peak Messi and Suarez seasons exceed 26%.</p>
            </div>

            <div className="space-y-0.5">
              <span className="font-bold text-slate-200 block">Shot Accuracy (%)</span>
              <p className="text-slate-400 font-medium">Percentage of shots taken that hit the target (on-frame). Normal distributions fall between 45-55%.</p>
            </div>

            <div className="space-y-0.5">
              <span className="font-bold text-slate-200 block">Minutes per Goal Contribution</span>
              <p className="text-slate-400 font-medium">How many minutes of active play on the pitch are required for the player to score OR assist. Lower numbers signify superior playmaking/finishing efficiency.</p>
            </div>

          </div>
        </div>

        {/* Citations and Data Sources */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-850 pb-2">
            <Database className="w-4.5 h-4.5 text-[#A50044]" />
            <h3 className="font-bold text-slate-100 text-sm uppercase tracking-wide">Citations & Data Sources</h3>
          </div>
          <p className="text-xs text-slate-400 leading-normal font-medium">
            To ensure complete integrity of the master dataset, historical data and advanced scouting parameters have been cross-referenced with the following databases:
          </p>
          <div className="space-y-3 pt-1">
            {dataSources.map((src, index) => (
              <div key={index} className="space-y-0.5 text-xs">
                <span className="font-bold text-slate-200 block flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  {src.name}
                </span>
                <a 
                  href={src.url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-blue-400 hover:underline hover:text-blue-300 font-mono text-[10px] break-all"
                >
                  {src.url}
                </a>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

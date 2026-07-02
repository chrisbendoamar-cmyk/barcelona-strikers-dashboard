import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn("WARNING: GEMINI_API_KEY environment variable is not set. AI Scout Reports will be simulated or prompt to configure.");
}

// API endpoint to generate Scout Report
app.post("/api/gemini/scout-report", async (req, res) => {
  try {
    const { strikerName, position, nationality, stats, biography, peakSeason } = req.body;

    if (!strikerName) {
      return res.status(400).json({ error: "Missing striker name." });
    }

    if (!ai) {
      return res.status(503).json({ 
        error: "Gemini API is not configured on the server. Please configure GEMINI_API_KEY in Settings > Secrets." 
      });
    }

    const prompt = `
      You are an elite football scout, tactical analyst, and director of football who worked at FC Barcelona.
      Generate a professional, highly detailed, and engaging "Scout Report & Tactical Analysis" for the legendary striker: ${strikerName}.

      Player details:
      - Nationality: ${nationality}
      - Position: ${position}
      - Peak Season at Barca: ${peakSeason}
      - Biography: ${biography}
      - Barcelona Stats: ${JSON.stringify(stats)}

      Write the report in a highly professional sports journalism and analytics style (like Opta Analyst, StatsBomb, or The Athletic).
      Structure the scout report into exactly these sections:
      
      1. **TACTICAL PROFILE & STYLE OF PLAY**: Detail how they fit into Barcelona's system (e.g., Cruyff's Dream Team, Guardiola's False 9, Luis Enrique's direct MSN, post-Messi rebuild). Explain their movement, space creation, pressing workrate, and technical strengths.
      2. **STATISTICAL EFFICIENCY ANALYSIS**: Evaluate their goals, assists, and contribution ratios based on the provided stats. Mention their efficiency (e.g., goals-per-match ratio) and how it compares to standard modern strikers.
      3. **HISTORICAL SIGNIFICANCE**: Explain their legacy at FC Barcelona, their connection with fans, and their impact on the club's trophy-laden history.
      4. **THE TACTICAL VERDICT**: A concise executive summary of what made them unique as a Barcelona attacker.

      Use rich footballing vocabulary (e.g., 'half-spaces', 'compact lines', 'vertical progression', 'counter-pressing', 'possession-based automaton'). Keep it professional, objective, yet deeply appreciative of their genius. Format with elegant markdown.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    const report = response.text;
    res.json({ report });
  } catch (error: any) {
    console.error("Error generating scout report:", error);
    res.status(500).json({ error: error?.message || "Internal server error during analysis." });
  }
});

// Setup Vite middleware or static serving
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite HMR middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode serving static assets...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FC Barcelona Striker Analytics Server is running on http://0.0.0.0:${PORT}`);
  });
}

setupServer();

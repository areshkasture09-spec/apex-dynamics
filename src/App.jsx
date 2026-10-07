import React, { useState, useMemo } from 'react';
import { Search, Zap, Settings2, Cpu, Clock, ChevronRight, X, Info, Activity, Maximize2, Settings, AlertCircle, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { motion, AnimatePresence } from 'framer-motion';

const ARTICLES = [
  {
    id: 1,
    title: "Weight Distribution vs. Raw Horsepower: Why Polar Moment of Inertia Wins Track Days",
    category: "Chassis & Aero",
    excerpt: "Modern tuning often obsesses over peak dyno numbers, but mass distribution dictates rotation at the limit.",
    readTime: "6 min",
    date: "OCT 07, 2024",
    content: "Engineers often talk about balance, but Polar Moment of Inertia (PMI) is what separates a nimble sports car from a high-horsepower drag machine. Concentrating heavy components between the axles requires less torque to rotate the chassis, allowing mid-engine cars to dominate tight apexes.",
    specs: { "Ideal Ratio": "50:50", "Yaw Rate": "High", "Key Factor": "Mass Centralization" },
    featured: true
  },
  {
    id: 2,
    title: "Twin-Turbo Inline-6 vs. High-Revving V8: Boost vs. Linear Response",
    category: "Powertrains",
    excerpt: "Comparing throttle modulation and exit velocity between high-boost turbo units and atmospheric high-revvers.",
    readTime: "8 min",
    date: "OCT 05, 2024",
    content: "Modern twin-scroll turbocharging provides broad torque plateaus, yet high-revving naturally aspirated platforms retain unmatched millimeter-precision throttle control during apex modulation.",
    specs: { "Induction": "Twin-Turbo / NA", "Redline": "7,200 - 9,000 RPM", "Torque": "Plateau vs Linear" }
  },
  {
    id: 3,
    title: "Underfloor Aerodynamics: Ground Effect & Venturi Diffusers",
    category: "Chassis & Aero",
    excerpt: "Generating substantial downforce with minimal drag penalties using underfloor low-pressure tunnels.",
    readTime: "10 min",
    date: "SEP 28, 2024",
    content: "Underfloor airflow creates a suction zone via Bernoulli's principle, planting the chassis into high-speed sweepers without massive rear-wing parasitic drag.",
    specs: { "L/D Ratio": "4.5:1", "Downforce": "800kg @ 150mph", "Drag Penalty": "Minimal" }
  },
  {
    id: 4,
    title: "Mechanical LSD vs. Electronic Torque Vectoring in High-G Transitions",
    category: "Track Testing",
    excerpt: "Analyzing mechanical preload against millisecond brake-based and active-clutch vectoring algorithms.",
    readTime: "5 min",
    date: "SEP 22, 2024",
    content: "Active differential locking offers predictive turn-in agility, whereas traditional mechanical clutch-packs deliver consistent, overheat-resistant lockup under endurance conditions.",
    specs: { "Response": "15ms (Active)", "Durability": "High (Mech)", "Thermal Load": "Low" }
  }
];

const callGemini = async (prompt, apiKey) => {
  if (!apiKey) throw new Error("API Key missing");
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  return result.response.text();
};

export default function ApexDynamics() {
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [apiKey, setApiKey] = useState(import.meta.env?.VITE_GEMINI_API_KEY || "");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [engineInput, setEngineInput] = useState("");
  const [engineResult, setEngineResult] = useState(null);
  const [engineLoading, setEngineLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);

  const filtered = useMemo(() => ARTICLES.filter(a => 
    (cat === "All" || a.category === cat) && a.title.toLowerCase().includes(search.toLowerCase())
  ), [cat, search]);

  const featured = ARTICLES.find(a => a.featured);

  const decryptEngine = async (query) => {
    const target = query || engineInput;
    if (!target) return;
    setEngineLoading(true);
    try {
      const res = await callGemini(`Race engineer analysis of: "${target}". Give bullet points: ARCHITECTURE, INDUCTION, TRACK DURABILITY.`, apiKey);
      setEngineResult(res);
    } catch (e) {
      alert("AI Error: " + e.message);
    } finally {
      setEngineLoading(false);
    }
  };

  const summarize = async (content) => {
    setSummaryLoading(true);
    try {
      const res = await callGemini(`Summarize in 3 technical takeaways: "${content}"`, apiKey);
      setSummary(res);
    } catch (e) {
      setSummary("Failed to generate summary. Verify API key.");
    } finally {
      setSummaryLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 font-sans">
      <nav className="sticky top-0 z-30 bg-[#0B0F17]/90 backdrop-blur border-b border-white/5 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 flex items-center justify-center -rotate-12"><Zap size={16} /></div>
          <span className="font-black tracking-tighter italic text-lg">APEX DYNAMICS</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={14} />
            <input 
              type="text" 
              placeholder="Search telemetry..."
              className="bg-slate-900 border border-white/10 rounded-full py-1.5 pl-9 pr-3 text-xs w-36 md:w-56 focus:outline-none focus:border-blue-500"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button onClick={() => setSettingsOpen(true)} className="p-2 text-slate-400 hover:text-white"><Settings size={18} /></button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-wrap gap-2 mb-8">
          {["All", "Powertrains", "Chassis & Aero", "Track Testing"].map(c => (
            <button key={c} onClick={() => setCat(c)} className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${cat === c ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 border border-white/5'}`}>{c}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {cat === "All" && !search && featured && (
              <div onClick={() => setSelected(featured)} className="relative p-8 rounded-2xl border border-white/10 bg-gradient-to-t from-slate-950 to-slate-900 cursor-pointer hover:border-blue-500/40 transition">
                <span className="text-[10px] bg-blue-600 px-2 py-0.5 rounded font-bold uppercase">Featured</span>
                <h2 className="text-2xl md:text-3xl font-bold mt-4 mb-2">{featured.title}</h2>
                <p className="text-slate-400 text-sm mb-4">{featured.excerpt}</p>
                <span className="text-blue-400 text-xs font-bold flex items-center gap-1">READ TELEMETRY <ChevronRight size={14} /></span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.filter(a => !a.featured || cat !== "All").map(art => (
                <div key={art.id} onClick={() => setSelected(art)} className="bg-slate-900/40 border border-white/5 p-5 rounded-xl cursor-pointer hover:border-blue-500/50 transition flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-blue-500 font-bold uppercase tracking-wider block mb-2">{art.category}</span>
                    <h3 className="font-bold text-base mb-2">{art.title}</h3>
                    <p className="text-slate-400 text-xs line-clamp-2">{art.excerpt}</p>
                  </div>
                  <div className="flex justify-between items-center pt-4 mt-4 border-t border-white/5 text-[10px] text-slate-500">
                    <span>{art.date}</span>
                    <Maximize2 size={12} className="text-blue-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#151B27] border border-blue-500/20 rounded-2xl p-6">
              <h3 className="font-bold text-base flex items-center gap-2 mb-2"><Settings2 size={16} className="text-blue-400" /> Engine Decrypter</h3>
              <p className="text-xs text-slate-400 mb-4">Enter engine code or car model for engineering analysis.</p>
              <input 
                type="text" 
                placeholder="e.g. S58, 4.0L Flat-6, 2JZ..." 
                className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs mb-3 focus:outline-none focus:border-blue-500"
                value={engineInput}
                onChange={e => setEngineInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && decryptEngine()}
              />
              <button onClick={() => decryptEngine()} disabled={engineLoading || !apiKey} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 text-white font-bold py-2 rounded-lg text-xs flex justify-center items-center gap-2">
                {engineLoading ? <Loader2 size={14} className="animate-spin" /> : "Analyze Powertrain"}
              </button>
              <div className="flex gap-2 mt-3">
                {["BMW S58", "Porsche GT3 4.0", "Honda K20C1"].map(c => (
                  <button key={c} onClick={() => decryptEngine(c)} className="text-[10px] bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded text-slate-300">{c}</button>
                ))}
              </div>
              {engineResult && (
                <div className="mt-4 p-3 bg-black/50 border border-white/5 rounded text-xs whitespace-pre-wrap font-mono text-slate-300 max-h-48 overflow-y-auto">{engineResult}</div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Reader Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 relative">
            <button onClick={() => { setSelected(null); setSummary(""); }} className="absolute right-4 top-4 p-2 text-slate-400 hover:text-white"><X size={18} /></button>
            <span className="text-[10px] text-blue-500 font-bold uppercase tracking-wider">{selected.category}</span>
            <h2 className="text-xl md:text-2xl font-bold mt-2 mb-4">{selected.title}</h2>
            <div className="grid grid-cols-3 gap-2 bg-black/40 p-3 rounded-lg mb-6 border border-white/5">
              {Object.entries(selected.specs).map(([k, v]) => (
                <div key={k}><div className="text-[9px] text-slate-500 uppercase">{k}</div><div className="text-xs font-bold text-slate-200">{v}</div></div>
              ))}
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">{selected.content}</p>
            <button onClick={() => summarize(selected.content)} disabled={summaryLoading || !apiKey} className="bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-xs font-bold py-2 px-4 rounded-lg flex items-center gap-2">
              {summaryLoading ? <Loader2 size={14} className="animate-spin" /> : <Activity size={14} />} Generate AI Summary
            </button>
            {summary && <div className="mt-3 p-3 bg-indigo-950/40 border-l-2 border-indigo-500 text-xs text-indigo-200 whitespace-pre-wrap">{summary}</div>}
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-sm w-full p-6">
            <h3 className="font-bold text-base mb-4 flex items-center gap-2"><Settings size={18} /> API Settings</h3>
            <label className="text-xs text-slate-400 block mb-2 font-bold uppercase">Gemini API Key</label>
            <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="AIza..." className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-xs mb-4 focus:outline-none focus:border-blue-500" />
            <button onClick={() => setSettingsOpen(false)} className="w-full bg-blue-600 py-2 rounded-lg font-bold text-xs">Save & Close</button>
          </div>
        </div>
      )}

      <footer className="border-t border-white/5 py-8 text-center text-xs text-slate-500 mt-12">
        APEX DYNAMICS &copy; Track Engineering Editorial
      </footer>
    </div>
  );
}

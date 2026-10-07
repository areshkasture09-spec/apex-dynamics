import React, { useState, useMemo } from 'react';
import { Search, Zap, Settings2, Cpu, Clock, ChevronRight, X, Info, Activity, Maximize2, Settings, AlertCircle, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { motion, AnimatePresence } from 'framer-motion';

const ARTICLES = [
  {
    id: 1,
    title: "Weight Distribution vs. Raw Horsepower: Why Polar Moment of Inertia Wins Track Days",
    category: "Chassis & Aero",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    excerpt: "Modern tuning obsessively chases dyno sheets, but mass distribution dictates rotational velocity at the friction circle limit.",
    readTime: "7 min",
    date: "OCT 07, 2024",
    paragraphs: [
      "Automotive engineering often defaults to the colloquial term 'balance,' but the underlying mathematical reality governing high-speed direction changes is Polar Moment of Inertia (PMI). PMI represents an object's resistance to angular acceleration about its vertical yaw axis. When high-mass components—namely the powertrain, fuel reservoir, and driver—are pushed toward the extremities of the chassis, the lever arm acting on the center of gravity increases exponentially.",
      "Consider a comparison between a front-engine platform and a mid-engine platform. Even with an identical 50:50 static weight distribution, a front-engine configuration positions its internal combustion unit over or ahead of the front axle centerline, with a heavy rear differential mounted out back. A mid-engine chassis concentrates these components within the wheelbase. In practical track conditions, entering a tight chicane requires significantly less lateral tire grip to initiate yaw in the centralized chassis.",
      "Furthermore, low polar inertia minimizes transient body oscillations during quick curb strikes and mid-corner throttle adjustments. When combined with proper anti-squat rear geometry and stiffened spherical bushings, a well-balanced 350-horsepower chassis consistently outpaces a nose-heavy 650-horsepower platform across technical, continuous-radius circuits."
    ],
    specs: { "Ideal Ratio": "50:50 Static", "Yaw Response": "High Transient", "Key Metric": "Polar Moment (I_z)" },
    featured: true
  },
  {
    id: 2,
    title: "Twin-Turbo Inline-6 vs. High-Revving V8: Modern Boost vs. Linear Response",
    category: "Powertrains",
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80",
    excerpt: "The S58 twin-turbo platform meets naturally aspirated, 9000-RPM atmospheric engineering at the apex.",
    readTime: "8 min",
    date: "OCT 05, 2024",
    paragraphs: [
      "The ongoing debate between forced-induction inline configurations and high-revving atmospheric blocks defines modern sports car development. On paper, twin-monoscroll turbocharged engines dominate standard performance benchmarks: peak torque lands as early as 2,750 RPM and maintains a wide plateau across the entire mid-range.",
      "However, peak torque flexibility comes at the cost of throttle metering resolution. At the limit of lateral adhesion—where a driver modulates the throttle by 2% to 3% increments to stabilize rear slip angle—turbocharged boost pressure can build non-linearly against manifold vacuum. This can disrupt chassis balance mid-corner if wastegate control lacks sub-millisecond precision.",
      "A naturally aspirated flat-plane or cross-plane V8 offers an uncompromising 1:1 throttle-to-intake mechanical response. The power curve climbs strictly linear toward a stratospheric 8,500+ RPM redline. While it requires disciplined gear selection to stay in the powerband, the predictable torque delivery allows drivers to commit to throttle earlier on corner exit without overwhelming the rear tires."
    ],
    specs: { "Induction": "Twin-Turbo vs Atmospheric", "Redline Target": "7,200 - 9,000 RPM", "Torque Curve": "Plateau vs Linear" }
  },
  {
    id: 3,
    title: "Underfloor Aerodynamics: Ground Effect & Venturi Diffuser Extraction",
    category: "Chassis & Aero",
    image: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80",
    excerpt: "Harnessing underbody low-pressure fields to achieve maximum downforce without severe aerodynamic drag.",
    readTime: "9 min",
    date: "SEP 28, 2024",
    paragraphs: [
      "Aerodynamic efficiency on track is quantified through the lift-to-drag ratio (L/D). Traditional top-surface wings generate essential vertical load, but their aggressive angle of attack creates a substantial wake of parasitic drag, compromising straightaway top speed.",
      "Underfloor ground effect relies on fluid dynamics governed by Bernoulli's theorem. As airflow enters beneath a sealed front splitter, channeled venturi tunnels reduce the cross-sectional area under the chassis, accelerating air velocity and causing static pressure to drop drastically. This creates a suction zone that pulls the chassis directly toward the tarmac.",
      "The effectiveness of this underfloor low-pressure pocket relies heavily on the rear diffuser. By gently expanding the airflow back to atmospheric pressure at the vehicle's trailing edge, the diffuser acts as a fluid extraction pump. When paired with tightly tuned ride-height stiffness to prevent aero stalling, ground-effect aero yields high downforce with minimal drag penalties."
    ],
    specs: { "L/D Ratio": "4.5:1 Target", "Downforce Load": "750kg @ 150mph", "Drag Penalty": "Minimal Wake" }
  },
  {
    id: 4,
    title: "Mechanical LSD vs. Electronic Torque Vectoring in High-G Transitions",
    category: "Track Testing",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80",
    excerpt: "Analyzing clutch-pack preload stability against active electronically controlled multi-plate differentials.",
    readTime: "6 min",
    date: "SEP 22, 2024",
    paragraphs: [
      "A differential's fundamental responsibility is allowing driven wheels to rotate at differing speeds during cornering while still transmitting forward thrust. However, an open differential sends drive torque to the path of least resistance—meaning an unloaded inner wheel simply spins freely.",
      "Traditional mechanical Limited-Slip Differentials (LSD) rely on multi-plate clutch packs and ramp angles. Under throttle input, internal cross pins ride up the ramps, compressing the friction clutches to mechanically bind both axle shafts. This lock-up occurs predictably and without computational latency, maintaining thermal stability throughout 30-minute track sessions.",
      "Electronic active differentials (e-diffs) replace passive mechanical ramp pressure with electric actuator motors or hydraulic pressure clutches managed by high-frequency CAN-bus sensors. An e-diff can run 0% lock-up on initial turn-in to eliminate corner-entry push (understeer), then ramp up to 100% full lock on corner exit for maximum traction. The trade-off remains calibration complexity and increased thermal load on prolonged track sessions."
    ],
    specs: { "Lockup Latency": "15ms (Active) / Instant (Mech)", "Durability": "High Endurance", "Dynamic Range": "0-100% Variable" }
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
      const res = await callGemini(`Act as a race engineer. Analyze: "${target}". Provide structured bullet points for: 1. ARCHITECTURE & DISPLACEMENT, 2. INDUCTION & BOOST DYNAMICS, 3. TRACK DURABILITY & WEAK POINTS. Keep it professional.`, apiKey);
      setEngineResult(res);
    } catch (e) {
      alert("AI Error: " + e.message);
    } finally {
      setEngineLoading(false);
    }
  };

  const summarize = async (paragraphs) => {
    setSummaryLoading(true);
    try {
      const fullText = paragraphs.join(" ");
      const res = await callGemini(`Analyze this technical automotive article and provide 3 key mechanical engineering takeaways as concise bullet points: "${fullText}"`, apiKey);
      setSummary(res);
    } catch (e) {
      setSummary("Failed to generate summary. Verify your API key in settings.");
    } finally {
      setSummaryLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 font-sans selection:bg-blue-600/40">
      {/* Header */}
      <nav className="sticky top-0 z-30 bg-[#0B0F17]/90 backdrop-blur-md border-b border-white/5 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 flex items-center justify-center -rotate-12 rounded">
            <Zap size={18} className="text-white" />
          </div>
          <span className="font-black tracking-tighter italic text-xl">APEX DYNAMICS</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={14} />
            <input 
              type="text" 
              placeholder="Search engineering logs..."
              className="bg-slate-900 border border-white/10 rounded-full py-1.5 pl-9 pr-3 text-xs w-40 md:w-60 focus:outline-none focus:border-blue-500 transition-colors"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button onClick={() => setSettingsOpen(true)} className="p-2 text-slate-400 hover:text-white transition-colors">
            <Settings size={18} />
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {["All", "Powertrains", "Chassis & Aero", "Track Testing"].map(c => (
            <button 
              key={c} 
              onClick={() => setCat(c)} 
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                cat === c ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-slate-900 text-slate-400 border border-white/5 hover:border-white/20'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured Article Hero Card with Background Image */}
            {cat === "All" && !search && featured && (
              <div 
                onClick={() => { setSelected(featured); setSummary(""); }} 
                className="group relative h-96 rounded-2xl border border-white/10 overflow-hidden cursor-pointer shadow-2xl flex flex-col justify-end p-6 md:p-8"
              >
                <img 
                  src={featured.image} 
                  alt={featured.title} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-[#0B0F17]/60 to-transparent" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[10px] bg-blue-600 px-2.5 py-1 rounded font-bold uppercase tracking-wider">Featured</span>
                    <span className="text-slate-400 text-xs flex items-center gap-1"><Clock size={12} /> {featured.readTime}</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-extrabold leading-tight mb-2 group-hover:text-blue-400 transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-slate-300 text-xs md:text-sm line-clamp-2 max-w-xl mb-4">
                    {featured.excerpt}
                  </p>
                  <span className="text-blue-400 text-xs font-bold flex items-center gap-1 uppercase tracking-wider group-hover:gap-2 transition-all">
                    Read In-Depth Analysis <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            )}

            {/* Articles Grid with Individual Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.filter(a => !a.featured || cat !== "All").map(art => (
                <div 
                  key={art.id} 
                  onClick={() => { setSelected(art); setSummary(""); }} 
                  className="bg-slate-900/60 border border-white/5 rounded-xl overflow-hidden cursor-pointer hover:border-blue-500/50 transition-all flex flex-col justify-between group shadow-lg"
                >
                  <div className="h-44 overflow-hidden relative">
                    <img 
                      src={art.image} 
                      alt={art.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent" />
                    <span className="absolute bottom-3 left-3 text-[10px] font-bold text-blue-400 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-white/10 uppercase tracking-wider">
                      {art.category}
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-base mb-2 group-hover:text-blue-400 transition-colors leading-snug">
                        {art.title}
                      </h3>
                      <p className="text-slate-400 text-xs line-clamp-2 mb-4 leading-relaxed">
                        {art.excerpt}
                      </p>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-white/5 text-[11px] text-slate-500">
                      <span>{art.date}</span>
                      <span className="text-blue-400 font-bold flex items-center gap-1 text-[10px] uppercase">
                        Read <Maximize2 size={12} />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar / Engine Decrypter Tool */}
          <div className="space-y-6">
            <div className="bg-[#151B27] border border-blue-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute -top-4 -right-4 opacity-10">
                <Cpu size={100} className="text-blue-500" />
              </div>
              <h3 className="font-bold text-base flex items-center gap-2 mb-2 text-white">
                <Settings2 size={18} className="text-blue-400" /> Engine Decrypter
              </h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Query Google Gemini to analyze any engine block, displacement, or platform specs in real-time.
              </p>
              <input 
                type="text" 
                placeholder="e.g. BMW S58, Porsche GT3 4.0L..." 
                className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-xs mb-3 focus:outline-none focus:border-blue-500"
                value={engineInput}
                onChange={e => setEngineInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && decryptEngine()}
              />
              <button 
                onClick={() => decryptEngine()} 
                disabled={engineLoading || !apiKey} 
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 text-white font-bold py-2.5 rounded-lg text-xs flex justify-center items-center gap-2 transition-colors"
              >
                {engineLoading ? <Loader2 size={14} className="animate-spin" /> : "Run Technical Analysis"}
              </button>
              <div className="flex flex-wrap gap-2 mt-3">
                {["BMW S58", "Porsche 4.0L NA", "Honda K20C1"].map(c => (
                  <button 
                    key={c} 
                    onClick={() => decryptEngine(c)} 
                    className="text-[10px] bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded text-slate-300 transition-colors"
                  >
                    {c}
                  </button>
                ))}
              </div>
              {engineResult && (
                <div className="mt-4 p-3 bg-black/60 border border-white/5 rounded-lg text-xs whitespace-pre-wrap font-mono text-slate-300 max-h-56 overflow-y-auto leading-relaxed">
                  {engineResult}
                </div>
              )}
            </div>

            {/* Telemetry Card */}
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Live Track Telemetry Baseline</h4>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Optimal Oil Temp</span>
                  <span className="text-green-400 font-mono font-bold">215°F / 102°C</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Front Brake Bias</span>
                  <span className="text-blue-400 font-mono font-bold">54.2%</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Peak Downforce @ Apex</span>
                  <span className="text-orange-400 font-mono font-bold">1.48 Lateral G</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Reader Modal (Expanded Lengthy Article View) */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl">
            {/* Header Image inside Reader */}
            <div className="h-56 relative w-full overflow-hidden">
              <img src={selected.image} alt={selected.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
              <button 
                onClick={() => { setSelected(null); setSummary(""); }} 
                className="absolute right-4 top-4 p-2 bg-black/60 hover:bg-black rounded-full text-slate-300 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 md:p-8">
              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block mb-2">{selected.category}</span>
              <h2 className="text-2xl md:text-3xl font-black mb-4 leading-tight">{selected.title}</h2>

              {/* Technical Spec Box */}
              <div className="grid grid-cols-3 gap-3 bg-black/40 p-4 rounded-xl mb-8 border border-white/5">
                {Object.entries(selected.specs).map(([k, v]) => (
                  <div key={k}>
                    <div className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">{k}</div>
                    <div className="text-xs md:text-sm font-bold text-slate-200 mt-0.5">{v}</div>
                  </div>
                ))}
              </div>

              {/* Lengthy Editorial Paragraphs */}
              <div className="space-y-5 text-slate-300 text-sm md:text-base leading-relaxed border-b border-white/10 pb-8 mb-8">
                {selected.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              {/* AI Summarizer Button */}
              <div className="bg-slate-950/60 p-5 rounded-xl border border-white/5">
                <button 
                  onClick={() => summarize(selected.paragraphs)} 
                  disabled={summaryLoading || !apiKey} 
                  className="bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/30 text-indigo-300 text-xs font-bold py-2.5 px-4 rounded-lg flex items-center gap-2 transition-colors"
                >
                  {summaryLoading ? <Loader2 size={14} className="animate-spin" /> : <Activity size={14} />} 
                  Generate AI Engineering Summary
                </button>
                {summary && (
                  <div className="mt-4 p-4 bg-indigo-950/40 border-l-2 border-indigo-500 text-xs text-indigo-200 whitespace-pre-wrap leading-relaxed">
                    {summary}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-sm w-full p-6 shadow-2xl">
            <h3 className="font-bold text-base mb-4 flex items-center gap-2"><Settings size={18} /> API Settings</h3>
            <label className="text-xs text-slate-400 block mb-2 font-bold uppercase">Gemini API Key</label>
            <input 
              type="password" 
              value={apiKey} 
              onChange={e => setApiKey(e.target.value)} 
              placeholder="Paste AIza... key here" 
              className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-xs mb-4 focus:outline-none focus:border-blue-500 text-white" 
            />
            <button 
              onClick={() => setSettingsOpen(false)} 
              className="w-full bg-blue-600 hover:bg-blue-700 py-2.5 rounded-lg font-bold text-xs transition-colors"
            >
              Save & Close
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-slate-500 mt-16">
        APEX DYNAMICS &copy; Performance Engineering Editorial
      </footer>
    </div>
  );
}

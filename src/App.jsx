import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Zap, 
  Settings2, 
  Cpu, 
  Clock, 
  ChevronRight, 
  X, 
  Info, 
  Activity,
  Maximize2,
  Settings,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { motion, AnimatePresence } from 'framer-motion';

const ARTICLES = [
  {
    id: 1,
    title: "Weight Distribution vs. Raw Horsepower: Why Polar Moment of Inertia Wins Track Days",
    category: "Chassis & Aero",
    excerpt: "Modern tuning often obsesses over peak dyno numbers, but the distribution of mass dictates how a car rotates at the limit. We dive into the physics of centralizing mass.",
    readTime: "6 min",
    date: "OCT 07, 2024",
    content: "Engineers often talk about balance, but the mathematical reality of Polar Moment of Inertia (PMI) is what separates a nimble sports car from a high-horsepower muscle car. PMI measures an object's resistance to change in rotational speed. In automotive terms, if you concentrate the heavy components (engine, fuel tank, driver) between the axles, the car requires less force to initiate a turn. This is why a 300hp mid-engine Cayman can often outpace a 600hp front-engine sedan on technical circuits.",
    specs: {
      "Ideal Ratio": "50:50 Static",
      "Yaw Rate": "High Response",
      "Key Factor": "Mass Centralization"
    },
    featured: true
  },
  {
    id: 2,
    title: "Twin-Turbo Inline-6 vs. High-Revving V8: Modern Boost vs. Linear Response",
    category: "Powertrains",
    excerpt: "The S58 and the GT3's 4.0L Flat-6 represent two different philosophies of speed. Which one provides the superior exit speed?",
    readTime: "8 min",
    date: "OCT 05, 2024",
    content: "The modern turbocharged engine has virtually eliminated lag, but it still cannot replicate the razor-sharp throttle modulation of a naturally aspirated high-revving unit. However, the torque plateau of an I6 allows for gear flexibility that keeps the chassis more stable through long sweepers.",
    specs: {
      "Induction": "Twin-Mono Scroll",
      "Redline": "7,200 - 9,000 RPM",
      "Torque Delivery": "Plateau vs Linear"
    }
  },
  {
    id: 3,
    title: "Underfloor Aerodynamics: How Ground Effect & Diffusers Generate Downforce",
    category: "Chassis & Aero",
    excerpt: "The dark art of Venturi tunnels. How to suck the car to the pavement without the massive drag penalty of a GT3-style wing.",
    readTime: "10 min",
    date: "SEP 28, 2024",
    content: "Airflow beneath the car is far more efficient than airflow over it. By creating a low-pressure zone using a flat floor and a steep diffuser, we create suction that increases grip exponentially with speed.",
    specs: {
      "L/D Ratio": "4.5:1",
      "Downforce": "800kg @ 150mph",
      "Drag Penalty": "Minimal"
    }
  },
  {
    id: 4,
    title: "Mechanical LSD vs. Electronic Torque Vectoring: Corner Exit Analysis",
    category: "Track Testing",
    excerpt: "Testing the limits of a Torsen differential against modern brake-based vectoring systems in high-G transitions.",
    readTime: "5 min",
    date: "SEP 22, 2024",
    content: "An e-diff can react in milliseconds, but many purists prefer the predictable lock-up of a mechanical unit. Telemetry shows that brake-based systems generate excessive heat in 20-minute track sessions.",
    specs: {
      "Response Time": "15ms (E-Diff)",
      "Durability": "Infinite (Mech)",
      "Heat Load": "High (Brake-based)"
    }
  },
  {
    id: 5,
    title: "Dual-Clutch (DCT) vs. Planetary Torque-Converter: Shift Latency & Thermal Limits",
    category: "Powertrains",
    excerpt: "Can the modern ZF8 really keep up with a PDK? Analyzing shift speeds and transmission oil temperatures under load.",
    readTime: "7 min",
    date: "SEP 15, 2024",
    content: "While the DCT offers instantaneous mechanical shifts, the planetary automatic has caught up in software logic while offering superior cooling for endurance racing.",
    specs: {
      "Shift Speed": "80ms (DCT)",
      "Max Torque": "1000Nm+ (Auto)",
      "Clutch Wear": "Medium"
    }
  }
];

const getGeminiResponse = async (prompt, apiKey) => {
  if (!apiKey) throw new Error("Missing API Key");
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  return result.response.text();
};

export default function ApexDynamics() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [apiKey, setApiKey] = useState(import.meta.env?.VITE_GEMINI_API_KEY || "");
  const [showSettings, setShowSettings] = useState(false);
  
  const [engineInput, setEngineInput] = useState("");
  const [engineResult, setEngineResult] = useState(null);
  const [isDecrypterLoading, setIsDecrypterLoading] = useState(false);

  const [aiSummary, setAiSummary] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);

  const filteredArticles = useMemo(() => {
    return ARTICLES.filter(art => {
      const matchesCat = activeCategory === "All" || art.category === activeCategory;
      const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const featuredArticle = ARTICLES.find(a => a.featured);

  const handleEngineDecryption = async (input) => {
    const query = input || engineInput;
    if (!query) return;
    setIsDecrypterLoading(true);
    try {
      const prompt = `Act as a senior race engineer. Analyze the car/engine: "${query}". Return concise technical breakdown: ARCHITECTURE, INDUCTION & OUTPUT, MECHANICAL HIGHLIGHTS, TRACK DURABILITY.`;
      const res = await getGeminiResponse(prompt, apiKey);
      setEngineResult(res);
    } catch (err) {
      alert("AI Error: " + err.message);
    } finally {
      setIsDecrypterLoading(false);
    }
  };

  const handleSummarize = async (article) => {
    setIsSummarizing(true);
    try {
      const prompt = `Provide 3 highly technical mechanical takeaways from this article: "${article.content}". Keep them as concise bullet points.`;
      const res = await getGeminiResponse(prompt, apiKey);
      setAiSummary(res);
    } catch (err) {
      setAiSummary("Failed to generate summary. Verify your API key.");
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 font-sans selection:bg-blue-500/30">
      <nav className="sticky top-0 z-40 bg-[#0B0F17]/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 flex items-center justify-center transform rotate-45">
              <Zap size={18} className="-rotate-45 text-white" />
            </div>
            <h1 className="text-xl font-black tracking-tighter italic">APEX DYNAMICS</h1>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text"
                placeholder="Search engineering logs..."
                className="w-full bg-slate-900/50 border border-white/10 rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-slate-800 rounded-full text-slate-400"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-wrap gap-2 mb-10">
          {["All", "Powertrains", "Chassis & Aero", "Track Testing"].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                activeCategory === cat 
                ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]" 
                : "bg-slate-900 text-slate-400 border border-white/5 hover:border-white/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {activeCategory === "All" && !searchQuery && featuredArticle && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative h-[450px] rounded-2xl overflow-hidden border border-white/10 cursor-pointer"
                onClick={() => setSelectedArticle(featuredArticle)}
              >
                <div className="absolute inset-0 bg-slate-800 group-hover:scale-105 transition-transform duration-700 opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-[#0B0F17]/40 to-transparent" />
                <div className="absolute bottom-0 p-8 w-full">
                  <div className="flex gap-3 mb-4">
                    <span className="px-3 py-1 bg-blue-600 text-[10px] font-bold uppercase rounded-sm">Featured</span>
                    <span className="flex items-center gap-1 text-[10px] text-slate-300 uppercase tracking-widest"><Clock size={12} /> {featuredArticle.readTime}</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight max-w-2xl">{featuredArticle.title}</h2>
                  <p className="text-slate-300 text-sm max-w-xl mb-6 line-clamp-2">{featuredArticle.excerpt}</p>
                  <button className="flex items-center gap-2 text-blue-400 font-bold text-sm uppercase tracking-wider">
                    Read Analysis <ChevronRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredArticles.filter(a => !a.featured || activeCategory !== "All").map((article, idx) => (
                <motion.div 
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-slate-900/40 border border-white/5 p-6 rounded-xl hover:border-blue-500/50 transition-all cursor-pointer flex flex-col justify-between"
                  onClick={() => setSelectedArticle(article)}
                >
                  <div>
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-3 block">{article.category}</span>
                    <h3 className="text-xl font-bold mb-3 leading-snug">{article.title}</h3>
                    <p className="text-slate-400 text-sm line-clamp-3 mb-6">{article.excerpt}</p>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-white/5">
                    <span className="text-[10px] text-slate-500 font-medium">{article.date}</span>
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
                      READ <Maximize2 size={12} className="text-blue-500" />
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#151B27] border border-blue-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Cpu size={80} className="text-blue-500" />
              </div>
              
              <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                <Settings2 size={18} className="text-blue-400" /> 
                Engine Decrypter
              </h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                Enter any engine code or car model for a senior race engineer's technical breakdown.
              </p>

              <div className="space-y-4">
                <input 
                  type="text"
                  placeholder="e.g. BMW S58, Porsche 4.0L NA..."
                  className="w-full bg-black/40 border border-white/10 rounded-lg py-2 px-4 text-sm focus:outline-none focus:border-blue-500"
                  value={engineInput}
                  onChange={(e) => setEngineInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleEngineDecryption()}
                />
                
                <button 
                  onClick={() => handleEngineDecryption()}
                  disabled={isDecrypterLoading || !apiKey}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white font-bold py-2 rounded-lg text-sm transition-all flex items-center justify-center gap-2"
                >
                  {isDecrypterLoading ? <Loader2 className="animate-spin" size={16} /> : "Run Technical Analysis"}
                </button>

                {!apiKey && (
                  <p className="text-[10px] text-yellow-500 flex items-center gap-1">
                    <AlertCircle size={12} /> API Key required in settings
                  </p>
                )}

                <div className="flex flex-wrap gap-2 mt-4">
                  {["Porsche 4.0L NA", "BMW B58", "Honda K20C1"].map(chip => (
                    <button 
                      key={chip}
                      onClick={() => handleEngineDecryption(chip)}
                      className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded hover:bg-blue-900/40"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {engineResult && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 p-4 bg-black/40 rounded-lg border border-white/5 overflow-y-auto max-h-[300px]"
                >
                  <pre className="text-[11px] leading-relaxed text-slate-300 whitespace-pre-wrap font-mono">
                    {engineResult}
                  </pre>
                </motion.div>
              )}
            </div>

            <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Track Telemetry Overview</h4>
              <div className="space-y-4">
                {[
                  { label: "Optimal Oil Temp", value: "215°F", color: "text-green-400" },
                  { label: "Brake Bias", value: "54% Front", color: "text-blue-400" },
                  { label: "Tire Pressure (Hot)", value: "32 PSI", color: "text-orange-400" }
                ].map((stat, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">{stat.label}</span>
                    <span className={`text-sm font-mono font-bold ${stat.color}`}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {selectedArticle && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10"
          >
            <div 
              className="absolute inset-0 bg-[#0B0F17]/95 backdrop-blur-sm" 
              onClick={() => {
                setSelectedArticle(null);
                setAiSummary("");
              }}
            />
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="relative w-full max-w-5xl h-full max-h-[90vh] bg-slate-900 border border-white/10 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl"
            >
              <div className="w-full md:w-80 bg-black/40 border-r border-white/5 p-8 overflow-y-auto shrink-0">
                <button 
                  onClick={() => setSelectedArticle(null)}
                  className="mb-8 p-2 bg-slate-800 rounded-full hover:bg-slate-700"
                >
                  <X size={20} />
                </button>
                <div className="mb-8">
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest block mb-2">{selectedArticle.category}</span>
                  <h3 className="text-2xl font-bold leading-tight">{selectedArticle.title}</h3>
                </div>

                <div className="space-y-6 mb-8">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">Technical Specs</h4>
                  {Object.entries(selectedArticle.specs).map(([key, val]) => (
                    <div key={key}>
                      <div className="text-[10px] text-slate-500 uppercase">{key}</div>
                      <div className="text-sm font-bold text-slate-200">{val}</div>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-white/5">
                  <button 
                    onClick={() => handleSummarize(selectedArticle)}
                    disabled={isSummarizing || !apiKey}
                    className="w-full bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 border border-indigo-500/30 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2"
                  >
                    {isSummarizing ? <Loader2 className="animate-spin" size={14} /> : <Activity size={14} />}
                    AI Engineering Summary
                  </button>
                  {aiSummary && (
                    <div className="mt-4 p-4 bg-indigo-500/5 rounded-lg text-xs leading-relaxed text-indigo-200/80 italic border-l-2 border-indigo-500">
                      {aiSummary}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto bg-[#0B0F17] p-8 md:p-12">
                <div className="max-w-2xl mx-auto">
                  <div className="flex items-center gap-4 text-slate-500 text-xs mb-8">
                    <span>{selectedArticle.date}</span>
                    <span>•</span>
                    <span>{selectedArticle.readTime} reading</span>
                  </div>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-xl text-slate-300 leading-relaxed font-serif italic mb-8">
                      {selectedArticle.excerpt}
                    </p>
                    <div className="space-y-6 text-slate-400 leading-8">
                      <p>{selectedArticle.content}</p>
                      <div className="bg-slate-900 p-6 rounded-xl border border-white/5 mt-10">
                        <h4 className="text-slate-200 font-bold mb-2 

import React, { useState, useMemo } from 'react';
import { Search, Zap, Settings2, Cpu, Clock, ChevronRight, X, Info, Activity, Maximize2, Settings, AlertCircle, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const ARTICLES = [
  {
    id: 1,
    title: "Weight Distribution vs. Raw Horsepower: Why Polar Moment of Inertia Wins Track Days",
    category: "Chassis & Aero",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    excerpt: "Modern tuning obsessively chases dyno numbers, but mass distribution dictates rotational velocity at the friction circle limit.",
    readTime: "8 min",
    date: "OCT 07, 2024",
    paragraphs: [
      "Automotive engineering often defaults to the colloquial term 'balance,' but the underlying mathematical reality governing high-speed direction changes is Polar Moment of Inertia (PMI). PMI represents an object's resistance to angular acceleration about its vertical yaw axis. When high-mass components—namely the powertrain, fuel reservoir, and driver—are pushed toward the extremities of the chassis, the lever arm acting on the center of gravity increases exponentially.",
      "Consider a comparison between a front-engine platform and a mid-engine platform. Even with an identical 50:50 static weight distribution, a front-engine configuration positions its internal combustion unit over or ahead of the front axle centerline, with a heavy rear differential mounted out back. A mid-engine chassis concentrates these components within the wheelbase. In practical track conditions, entering a tight chicane requires significantly less lateral tire grip to initiate yaw in the centralized chassis.",
      "Furthermore, low polar inertia minimizes transient body oscillations during quick curb strikes and mid-corner throttle adjustments. When a vehicle rotates easily, the tires spend less work establishing slip angle, keeping tire surface temperatures cooler over prolonged sessions. This preserves mechanical grip across continuous laps.",
      "High polar inertia setups create an inherent pendulum effect. Once a high-PMI chassis enters a slide, the kinetic energy stored in the heavy extremities requires substantial counter-steering torque to arrest. This makes recovery knife-edge and strains the rear tire contact patches under deceleration.",
      "By contrast, centralizing mass lowers yaw damping requirements, allowing chassis tuners to run softer anti-roll bars. Softer roll rates improve compliance across uneven curbs and undulating tarmac without introducing excessive body wallow.",
      "When combined with optimized anti-squat rear geometry and spherical suspension bushings, a well-balanced 350-horsepower mid-engine platform consistently outpaces a nose-heavy 650-horsepower muscle platform across technical, continuous-radius circuits."
    ],
    specs: { "Ideal Ratio": "50:50 Static", "Yaw Response": "High Transient", "Key Metric": "Polar Moment (I_z)" },
    featured: true
  },
  {
    id: 2,
    title: "Twin-Turbo Inline-6 vs. High-Revving V8: Boost vs. Linear Throttle Response",
    category: "Powertrains",
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80",
    excerpt: "The S58 twin-turbo platform meets naturally aspirated, 9000-RPM atmospheric engineering at the apex.",
    readTime: "9 min",
    date: "OCT 05, 2024",
    paragraphs: [
      "The ongoing debate between forced-induction inline configurations and high-revving atmospheric blocks defines modern performance car development. On paper, twin-monoscroll turbocharged engines dominate standard performance benchmarks: peak torque lands as early as 2,750 RPM and maintains a wide plateau across the entire mid-range.",
      "However, peak torque flexibility comes at the cost of throttle metering resolution. At the absolute limit of lateral adhesion—where a driver modulates the pedal by 2% to 3% increments to stabilize rear slip angle—turbocharged boost pressure can build non-linearly against manifold vacuum. This can disrupt chassis balance mid-corner if electronic wastegate solenoids lack sub-millisecond precision.",
      "A naturally aspirated flat-plane or cross-plane V8 offers an uncompromising 1:1 throttle-to-intake mechanical response. The power curve climbs strictly linear toward an 8,500+ RPM redline. While it requires disciplined gear selection to stay in the powerband, the predictable torque delivery allows drivers to commit to full throttle earlier on corner exit without overwhelming the rear tires.",
      "Thermal load is another critical operational divergence. Twin-turbo configurations produce massive exhaust gas heat inside closed engine bays, often requiring complex water-to-air charge coolers, secondary radiators, and auxiliary transmission coolers to avoid ECU power pull-backs.",
      "Naturally aspirated architectures run cooler cylinder head temperatures under continuous full-throttle duty cycles, maintaining consistent lap times across 30-minute endurance stints without thermal throttling.",
      "Ultimately, while twin-turbocharged platforms provide devastating straight-line punch and effortless overtaking torque, high-revving atmospheric mills deliver the surgical precision required to extract every millisecond out of trail-braking and corner apex transitions."
    ],
    specs: { "Induction": "Twin-Turbo vs NA", "Redline Target": "7,200 - 9,000 RPM", "Torque Curve": "Plateau vs Linear" }
  },
  {
    id: 3,
    title: "Underfloor Aerodynamics: Ground Effect & Venturi Diffuser Extraction",
    category: "Chassis & Aero",
    image: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80",
    excerpt: "Harnessing underbody low-pressure fields to achieve maximum downforce without severe aerodynamic drag.",
    readTime: "10 min",
    date: "SEP 28, 2024",
    paragraphs: [
      "Aerodynamic efficiency on circuit is quantified through the lift-to-drag ratio (L/D). Traditional top-surface wings generate essential vertical load, but their aggressive angle of attack creates a massive wake of induced drag, penalizing straightaway terminal velocity.",
      "Underfloor ground effect relies on fluid dynamics governed by Bernoulli's theorem. As airflow enters beneath a sealed front splitter, channeled venturi tunnels reduce the cross-sectional area under the chassis, accelerating air velocity and causing static pressure to drop drastically. This creates a low-pressure suction zone that pulls the chassis directly toward the tarmac.",
      "The effectiveness of this underfloor low-pressure pocket relies heavily on the rear diffuser. By gently expanding the airflow back to atmospheric pressure at the vehicle's trailing edge, the diffuser acts as a fluid extraction pump, drawing air through the underside at high velocity.",
      "Ride height control is paramount to keeping underfloor aero functional. If a car experiences excessive pitch or roll, the ground clearance changes, breaking the underfloor aerodynamic seal and inducing catastrophic downforce loss (aero stall).",
      "Modern GT and prototype race cars solve this with third-element heave springs and hydraulic bump stops. These components allow compliance under normal cornering loads while arresting vertical chassis dive at triple-digit speeds where downforce loads exceed the vehicle's static weight.",
      "When calibrated correctly, ground-effect aero yields high downforce numbers with only a fraction of the drag penalty imposed by giant rear wings."
    ],
    specs: { "L/D Ratio": "4.5:1 Target", "Downforce Load": "750kg @ 150mph", "Drag Penalty": "Minimal Wake" }
  },
  {
    id: 4,
    title: "Mechanical LSD vs. Electronic Torque Vectoring in High-G Transitions",
    category: "Track Testing",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80",
    excerpt: "Analyzing clutch-pack preload stability against active electronically controlled multi-plate differentials.",
    readTime: "7 min",
    date: "SEP 22, 2024",
    paragraphs: [
      "A differential's fundamental responsibility is allowing driven wheels to rotate at differing speeds during cornering while transmitting forward thrust. However, an open differential sends drive torque to the path of least resistance—meaning an unloaded inner wheel simply spins freely under hard acceleration.",
      "Traditional mechanical Limited-Slip Differentials (LSD) rely on multi-plate clutch packs and angled ramps. Under throttle input, internal cross pins ride up the ramps, compressing the friction clutches to mechanically bind both axle shafts together. This lock-up occurs predictably and without computational latency.",
      "Clutch-pack LSD setups can be fine-tuned via 1-way, 1.5-way, or 2-way ramp angles to dictate lock-up under acceleration and decel. A 1.5-way differential provides solid stability during heavy braking while allowing the car to turn freely into corner entry.",
      "Electronic active differentials (e-diffs) replace passive mechanical ramp pressure with electric actuator motors or hydraulic clutches managed by high-frequency CAN-bus sensors. An e-diff can run 0% lock-up on initial turn-in to eliminate corner-entry push (understeer), then ramp up to 100% full lock on corner exit for maximum traction.",
      "The trade-off remains calibration complexity and thermal sensitivity. Electronic systems generate intense localized heat in multi-plate packs when managing high-slip transitions, requiring dedicated fluid scavenge pumps and coolers.",
      "For sprint racing and track purists, mechanical limited-slip units remain the benchmark for predictable feedback, while electronic torque vectoring excels in maximizing grip across varied wet-and-dry surface conditions."
    ],
    specs: { "Lockup Latency": "15ms (Active) / Instant (Mech)", "Durability": "High Endurance", "Dynamic Range": "0-100% Variable" }
  },
  {
    id: 5,
    title: "Dual-Clutch Transmissions (DCT) vs. Planetary Torque Converters on Circuit",
    category: "Powertrains",
    image: "https://images.unsplash.com/photo-1541348263662-e0c866657c9a?auto=format&fit=crop&w=800&q=80",
    excerpt: "Can the ubiquitous ZF 8-speed automatic truly match a dual-clutch transmission under continuous track punishment?",
    readTime: "8 min",
    date: "SEP 15, 2024",
    paragraphs: [
      "For over a decade, the Dual-Clutch Transmission (DCT) stood as the undisputed benchmark for high-performance track vehicles. By pre-selecting the next gear on an alternating shaft, shift interruptions were reduced to under 50 milliseconds, eliminating driveline shock and keeping turbo boost pinned.",
      "However, modern torque-converter automatics—most notably the ZF 8HP family—have made rapid advancements. With aggressive torque converter lock-up clutches that engage almost immediately after initial roll-off, planetary gearboxes have largely eliminated the historical sluggishness of traditional automatics.",
      "In track driving, shift speed is only one variable in the equation. Thermal dissipation under continuous full-throttle upshifts and rev-matched downshifts plays a crucial role. Wet dual-clutch packs produce friction heat during low-speed engagements and high-RPM shifts, demanding dedicated oil-to-air cooling radiators.",
      "Torque converters, conversely, distribute planetary gear loads over multiple gear sets simultaneously. This distribution allows them to withstand four-figure torque loads with superior mechanical durability and gentler engagement characteristics over hundreds of heat cycles.",
      "Where DCTs retain an edge is downshift immediacy under threshold braking. Dropping three gears from 150 mph into a second-gear hairpin requires instantaneous clutch release and throttle blips, where the direct mechanical coupling of a DCT provides unmatched tactile control.",
      "The decision between the two comes down to philosophy: the razor-sharp mechanical immediacy of a DCT versus the bulletproof torque capacity and thermal packaging advantages of a modern planetary automatic."
    ],
    specs: { "Shift Latency": "40ms (DCT) vs 120ms (8HP)", "Max Torque": "1000Nm+ (Auto)", "Thermal Load": "High in Wet-Clutch" }
  },
  {
    id: 6,
    title: "Brake Fade Dynamics: Carbon Ceramic (CCB) vs. Cast Iron Rotors",
    category: "Track Testing",
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80",
    excerpt: "Evaluating thermal dissipation, unsprung rotating mass, and pad friction coefficients at 800°C.",
    readTime: "9 min",
    date: "SEP 08, 2024",
    paragraphs: [
      "Braking systems operate as kinetic energy converters, converting forward vehicle velocity into heat through friction between the pads and rotor faces. On a racing circuit, stopping a 3,500-lb sports car from 140 mph into a 40 mph corner dumps millions of joules of thermal energy into the front wheel assemblies.",
      "Brake fade occurs in two distinct forms: pad fade and fluid vapor lock. Pad fade happens when friction material exceeds its optimal operating temperature, outgassing and creating a boundary layer that lubricates rather than grips. Fluid fade happens when caliper heat boils the brake fluid, creating compressible steam pockets in the lines.",
      "Cast iron rotors offer high thermal mass and predictable modulation. When paired with high-temperature motorsport pads (such as Pagid or Endless compounds) and fresh racing brake fluid with a dry boiling point over 320°C, iron brakes deliver consistent pedal firmness across prolonged track sessions.",
      "Carbon Ceramic Matrix (CCM) rotors offer substantial benefits in heat tolerance and weight reduction. A typical carbon ceramic setup sheds between 30 and 45 lbs of unsprung rotating mass across all four corners. Reducing unsprung mass dramatically improves suspension response over track curbs and reduces steering effort.",
      "Furthermore, carbon ceramic rotors operate comfortably at temperatures exceeding 800°C without warping or experiencing micro-cracking, conditions that would destroy standard iron discs within laps.",
      "The primary drawback of carbon ceramics remains operating cost. If run at peak track temperatures, oxidation of the carbon fibers degrades the disc material, resulting in four-figure replacement bills that make iron floating rotors the preferred choice for frequent track-day drivers."
    ],
    specs: { "Max Operating Temp": "1000°C (CCM) vs 650°C (Iron)", "Unsprung Weight Saving": "-35 lbs Total", "Friction Coeff (μ)": "0.45 - 0.55" }
  },
  {
    id: 7,
    title: "Suspension Kinematics: Roll Center, Camber Curves, and Bump Steer",
    category: "Chassis & Aero",
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80",
    excerpt: "Why double wishbone geometry out-grips MacPherson struts when lateral loads exceed 1.5G.",
    readTime: "10 min",
    date: "AUG 30, 2024",
    paragraphs: [
      "Static chassis alignment numbers mean very little once dynamic cornering loads compress the outside suspension. As lateral cornering forces transfer weight across the axle, the vehicle body rolls, and the suspension arms articulate through their respective arcs.",
      "The critical distinction between double wishbone setups and MacPherson strut suspensions lies in their dynamic camber curves. In a double wishbone configuration, unequal-length upper and lower control arms can be angled so that as the outside wheel compresses into bump, the knuckle gains negative camber, keeping the tire contact patch flat against the tarmac.",
      "A MacPherson strut, constrained by its rigid damper body acting as an upper locator, struggles to gain sufficient negative camber in roll. Beyond a certain compression threshold, the strut begins losing dynamic camber, rolling the tire onto its outer shoulder and causing sudden front-end understeer.",
      "Roll center height dictates how lateral cornering forces are partitioned between the chassis springs and the rigid suspension links. If the geometric roll center is positioned too far below the center of gravity, the roll moment arm lengthens, causing the car to lean excessively without stiff anti-roll bars.",
      "Bump steer describes unwanted steering angle changes induced when suspension travels over pavement undulations. If the steering tie-rod does not swing through the exact same radius and plane as the suspension control arms, every bump turns the front wheels involuntarily.",
      "Dialing in suspension geometry requires balancing camber gain, roll center migration, and bump steer shimming to maintain maximum tire footprint contact across all dynamic phases of cornering."
    ],
    specs: { "Camber Gain in Bump": "-1.5° / inch", "Roll Center Height": "3.2 inches Above Ground", "Bushings": "Spherical Monoball" }
  },
  {
    id: 8,
    title: "Forced Induction Thermodynamics: Water-to-Air vs. Air-to-Air Intercooling",
    category: "Powertrains",
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80",
    excerpt: "Managing intake charge temperatures and manifold pressure drops over 30-minute track stints.",
    readTime: "8 min",
    date: "AUG 22, 2024",
    paragraphs: [
      "Compressing ambient air through a turbocharger compressor wheel generates substantial heat as dictated by the ideal gas law. Boosted air leaving a turbo can easily exceed 160°C (320°F). Without efficient heat exchange, this elevated charge temperature drastically reduces air density and induces engine knock.",
      "Traditional air-to-air intercoolers mount a heat exchanger core directly in the vehicle's front fascia. Ambient air rushing through the bumper cools the compressed intake charge flowing inside the internal tubes. While simple and lightweight, long intercooler piping runs increase system volume, slightly dulling throttle response.",
      "Water-to-air intercooling systems (such as those on BMW's S58 and Mercedes-AMG architectures) relocate the heat exchanger core directly inside or on top of the intake manifold. Intake charge air passes through compact liquid-cooled cores, while a secondary water pump circulates coolant to a front-mounted heat exchanger.",
      "The primary advantage of water-to-air cooling is minimal intake runner volume. Short intake runners result in crisp, immediate throttle pickup. Water also possesses a much higher specific heat capacity than air, acting as an effective thermal buffer during short bursts of full acceleration.",
      "However, on sustained track sessions exceeding 20 minutes, water-to-air setups can suffer from heat soak. Once the coolant in the secondary circuit reaches high temperatures, heat rejection slows down, causing Intake Air Temperatures (IAT) to climb and triggering ignition timing retards.",
      "Engineers address this by installing high-flow auxiliary heat exchangers, split-cooling radiators, and dual electric water pumps to ensure charge temperatures stay within optimal power windows under continuous track loads."
    ],
    specs: { "Target IAT": "< 45°C Above Ambient", "Core Volume": "Dual Multi-Pass", "Thermal Capacity": "High Water Buffer" }
  },
  {
    id: 9,
    title: "Tire Dynamics: Slip Angle, Thermal Windows, and the Friction Circle",
    category: "Track Testing",
    image: "https://images.unsplash.com/photo-1578836537282-3171d77f8632?auto=format&fit=crop&w=800&q=80",
    excerpt: "Understanding the physics of tire slip angle, pneumatic trail, and operating temperatures for maximum lateral G.",
    readTime: "9 min",
    date: "AUG 14, 2024",
    paragraphs: [
      "Every control input made through the steering wheel, brakes, and throttle reaches the racetrack through four tire contact patches, each roughly the size of a smartphone. A tire does not generate lateral cornering grip simply by pointing in the desired direction; it requires a slip angle.",
      "Slip angle is the angular difference between the direction the wheel is pointed and the actual direction the vehicle is traveling. As the tire rolls, flexible rubber tread blocks distort and shear against the pavement, generating cornering force. Peak lateral grip generally occurs at slip angles between 5 and 8 degrees.",
      "If a driver exceeds the optimal slip angle, the rubber blocks begin sliding rather than gripping, transitioning from static friction to dynamic kinetic friction. This results in understeer or oversteer and rapidly overheats the tire's outer compound surface.",
      "Every motorsport compound has a specific thermal operating window. A 200-treadwear track tire typically performs best between 75°C and 95°C (170°F - 200°F). If cold, the rubber remains hard and lacks chemical adhesion; if overheated, the compound softens excessively and blisters.",
      "Managing hot tire pressures is just as crucial. A cold tire set at 28 PSI can easily rise to 38 PSI after 5 hard laps. Excessive pressure crowns the center tread, shrinking the effective contact patch and reducing lateral traction.",
      "Mastering the friction circle means seamlessly blending braking into corner entry and throttle on corner exit without demanding more combined grip than the tire's operating window can provide."
    ],
    specs: { "Optimal Slip Angle": "6° - 8°", "Thermal Window": "75°C - 95°C", "Hot Pressure Target": "32 - 34 PSI" }
  },
  {
    id: 10,
    title: "Aerodynamic Pitch Sensitivity: Center of Pressure & Splitter Ground Proximity",
    category: "Chassis & Aero",
    image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80",
    excerpt: "Balancing downforce migration during threshold braking and curb strikes to eliminate high-speed instability.",
    readTime: "10 min",
    date: "AUG 05, 2024",
    paragraphs: [
      "A race car is not a static object moving through clean air; it continuously dives under braking, squats under acceleration, and rolls in corners. These chassis attitude changes dramatically alter the Center of Pressure (CoP)—the central point where total aerodynamic downforce acts upon the vehicle.",
      "Front splitters are notoriously pitch-sensitive. As a car enters a heavy braking zone at 150 mph, front suspension compression drives the splitter lip toward the tarmac. Because ground-effect downforce increases exponentially as ground clearance decreases, the front downforce spikes sharply.",
      "This forward migration of the Center of Pressure can create severe high-speed instability. If the front downforce percentage jumps from 40% to 60% during initial turn-in, the rear axle suddenly becomes light, inducing snap oversteer during trail-braking.",
      "Conversely, if the splitter gets pushed too close to the ground, the air gap chokes and airflow stalls completely. When a splitter stalls, front downforce vanishes in milliseconds, causing the front tires to wash out into severe high-speed understeer.",
      "Aerodynamicists prevent this instability using front diffuser tunnels with gradual expansion angles and stiff third-element heave springs. These springs lock out forward pitch at high speeds while allowing the suspension to remain supple over low-speed curbs.",
      "Harmonizing aero balance with mechanical suspension stiffness ensures that downforce remains linear and predictable across every phase of track driving."
    ],
    specs: { "Aero Balance": "42% Front / 58% Rear", "Splitter Clearance": "45mm Under Load", "Pitch Sensitivity": "High at >130mph" }
  }
];

const callGemini = async (prompt, apiKey) => {
  if (!apiKey) throw new Error("API Key missing");
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-3.8-flash" });
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
        {/* Category Filters */}
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
            {/* Featured Hero Article */}
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

            {/* Articles Grid (10 Total Articles) */}
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

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Engine Decrypter Widget */}
            <div className="bg-[#151B27] border border-blue-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute -top-4 -right-4 opacity-10">
                <Cpu size={100} className="text-blue-500" />
              </div>
              <h3 className="font-bold text-base flex items-center gap-2 mb-2 text-white">
                <Settings2 size={18} className="text-blue-400" /> Engine Decrypter
              </h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Query Gemini 3.8 Flash to analyze any powertrain, displacement, or platform specs in real-time.
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
                {["BMW S58", "Porsche 4.0L NA", "Honda K20C1", "M5"].map(c => (
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

            {/* Live Track Telemetry Baseline */}
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
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Peak Downforce @ Apex</span>
                  <span className="text-orange-400 font-mono font-bold">1.48 Lateral G</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Hot Tire Pressure Window</span>
                  <span className="text-cyan-400 font-mono font-bold">32.5 PSI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Reader Modal (Displays 5 to 6 Full Paragraphs) */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl">
            {/* Header Image inside Reader */}
            <div className="h-64 relative w-full overflow-hidden">
              <img src={selected.image} alt={selected.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
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

              {/* Technical Spec Matrix */}
              <div className="grid grid-cols-3 gap-3 bg-black/40 p-4 rounded-xl mb-8 border border-white/5">
                {Object.entries(selected.specs).map(([k, v]) => (
                  <div key={k}>
                    <div className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">{k}</div>
                    <div className="text-xs md:text-sm font-bold text-slate-200 mt-0.5">{v}</div>
                  </div>
                ))}
              </div>

              {/* 5 to 6 Full Editorial Paragraphs */}
              <div className="space-y-6 text-slate-300 text-sm md:text-base leading-relaxed border-b border-white/10 pb-8 mb-8">
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

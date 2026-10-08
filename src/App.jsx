import React, { useState, useEffect, useMemo } from 'react';
import { Search, Zap, Settings2, Cpu, Clock, ChevronRight, ArrowLeft, Activity, Maximize2, Settings, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const ARTICLES = [
  {
    id: 1,
    slug: "polar-moment-of-inertia",
    title: "Weight Distribution vs Horsepower: Polar Moment of Inertia Explained",
    category: "Chassis & Aero",
    primaryKeyword: "polar moment of inertia car handling",
    secondaryKeywords: ["weight distribution vs horsepower", "race car yaw inertia"],
    metaTitle: "Polar Moment of Inertia vs Horsepower | Apex Dynamics Track Guide",
    metaDesc: "Discover why polar moment of inertia dictates race car cornering speeds over raw horsepower, with complete chassis balance and yaw analysis.",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=75",
    imageAlt: "High-performance sports car cornering at high speed on track demonstrating polar moment of inertia balance",
    excerpt: "Modern tuning obsessively chases dyno numbers, but mass distribution dictates rotational velocity at the friction circle limit.",
    readTime: "8 min",
    date: "OCT 07, 2024",
    paragraphs: [
      "Automotive engineering often defaults to the colloquial term 'balance,' but the underlying mathematical reality governing high-speed direction changes is Polar Moment of Inertia (PMI). PMI represents an object's resistance to angular acceleration about its vertical yaw axis. When high-mass components—namely the powertrain, fuel reservoir, and driver—are pushed toward the extremities of the chassis, the lever arm acting on the center of gravity increases exponentially.",
      "Consider a comparison between a front-engine platform and a mid-engine platform. Even with an identical 50:50 static weight distribution, a front-engine configuration positions its internal combustion unit over or ahead of the front axle centerline, with a heavy rear differential mounted out back. A mid-engine chassis concentrates these components within the wheelbase. In practical track conditions, entering a tight chicane requires significantly less lateral tire grip to initiate yaw in the centralized chassis.",
      "Furthermore, low polar inertia minimizes transient body oscillations during quick curb strikes and mid-corner throttle adjustments. When a vehicle rotates easily, the tires spend less work establishing slip angle, keeping tire surface temperatures cooler over prolonged sessions. This preserves mechanical grip across continuous laps.",
      "High polar inertia setups create an inherent pendulum effect. Once a high-PMI chassis enters a slide, the kinetic energy stored in the heavy extremities requires substantial counter-steering torque to arrest. This makes recovery knife-edge and strains the rear tire contact patches under deceleration."
    ],
    aeoQuestions: [
      {
        question: "Why does polar moment of inertia matter more than horsepower on track?",
        answer: "Polar moment of inertia dictates how quickly a chassis can initiate and arrest rotation along its vertical yaw axis. A low polar moment allows rapid direction changes with less tire scrub, enabling higher mid-corner apex speeds that straight-line horsepower cannot recover."
      },
      {
        question: "How does engine placement affect a vehicle's yaw inertia?",
        answer: "Mid-engine and rear-mid configurations package the heaviest mechanical assemblies between the front and rear axles. By reducing the physical distance of mass from the center of gravity, yaw inertia drops significantly compared to front-engine configurations."
      }
    ],
    specs: { "Ideal Ratio": "50:50 Static", "Yaw Response": "High Transient", "Key Metric": "Polar Moment (I_z)" },
    featured: true
  },
  {
    id: 2,
    slug: "twin-turbo-inline-6-vs-v8",
    title: "Twin-Turbo Inline-6 vs High-Revving V8: Throttle Response & Track Usability",
    category: "Powertrains",
    primaryKeyword: "twin turbo inline 6 vs v8",
    secondaryKeywords: ["linear throttle response", "turbo boost threshold track"],
    metaTitle: "Twin-Turbo Inline-6 vs High-Revving V8 | Apex Dynamics Powertrain Guide",
    metaDesc: "Compare twin-turbo inline-6 boost dynamics with high-revving naturally aspirated V8 linear throttle response for circuit driving.",
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=75",
    imageAlt: "Twin-turbo performance engine block showing turbo plumbing and intake architecture",
    excerpt: "The twin-turbo inline-6 platform meets naturally aspirated, 9000-RPM atmospheric engineering at the corner apex.",
    readTime: "9 min",
    date: "OCT 05, 2024",
    paragraphs: [
      "The ongoing debate between forced-induction inline configurations and high-revving atmospheric blocks defines modern performance car development. On paper, twin-monoscroll turbocharged engines dominate standard performance benchmarks: peak torque lands as early as 2,750 RPM and maintains a wide plateau across the entire mid-range.",
      "However, peak torque flexibility comes at the cost of throttle metering resolution. At the absolute limit of lateral adhesion—where a driver modulates the pedal by 2% to 3% increments to stabilize rear slip angle—turbocharged boost pressure can build non-linearly against manifold vacuum. This can disrupt chassis balance mid-corner if electronic wastegate solenoids lack sub-millisecond precision.",
      "A naturally aspirated flat-plane or cross-plane V8 offers an uncompromising 1:1 throttle-to-intake mechanical response. The power curve climbs strictly linear toward an 8,500+ RPM redline. While it requires disciplined gear selection to stay in the powerband, the predictable torque delivery allows drivers to commit to full throttle earlier on corner exit without overwhelming the rear tires.",
      "Thermal load is another critical operational divergence. Twin-turbo configurations produce massive exhaust gas heat inside closed engine bays, often requiring complex water-to-air charge coolers, secondary radiators, and auxiliary transmission coolers to avoid ECU power pull-backs."
    ],
    aeoQuestions: [
      {
        question: "Is a twin-turbo inline-6 faster on track than a naturally aspirated V8?",
        answer: "A twin-turbo inline-6 produces broader mid-range torque, resulting in faster straight-line acceleration and corner exits. However, naturally aspirated V8 engines deliver superior throttle linearity, making them easier to control at the edge of tire adhesion."
      },
      {
        question: "What causes turbo lag when exiting high-speed corners?",
        answer: "Turbo lag occurs due to the rotational inertia of the turbine and compressor wheels combined with the time needed for exhaust gas volume to build sufficient manifold pressure to drive the compressor."
      }
    ],
    specs: { "Induction": "Twin-Turbo vs NA", "Redline Target": "7,200 - 9,000 RPM", "Torque Curve": "Plateau vs Linear" }
  },
  {
    id: 3,
    slug: "underfloor-aerodynamics-ground-effect",
    title: "Underfloor Aerodynamics: Ground Effect & Venturi Diffusers Explained",
    category: "Chassis & Aero",
    primaryKeyword: "underfloor aerodynamics ground effect",
    secondaryKeywords: ["venturi diffuser downforce", "lift to drag ratio race car"],
    metaTitle: "Underfloor Aerodynamics & Venturi Diffusers | Apex Dynamics Aero Guide",
    metaDesc: "Learn how underfloor ground effects and venturi tunnels generate race-winning downforce with minimal aerodynamic drag penalties.",
    image: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=75",
    imageAlt: "Aerodynamic underbody diffuser and ground-effect splitters on a circuit-tuned supercar",
    excerpt: "Harnessing underbody low-pressure fields to achieve maximum downforce without severe aerodynamic drag.",
    readTime: "10 min",
    date: "SEP 28, 2024",
    paragraphs: [
      "Aerodynamic efficiency on circuit is quantified through the lift-to-drag ratio (L/D). Traditional top-surface wings generate essential vertical load, but their aggressive angle of attack creates a massive wake of induced drag, penalizing straightaway terminal velocity.",
      "Underfloor ground effect relies on fluid dynamics governed by Bernoulli's theorem. As airflow enters beneath a sealed front splitter, channeled venturi tunnels reduce the cross-sectional area under the chassis, accelerating air velocity and causing static pressure to drop drastically. This creates a low-pressure suction zone that pulls the chassis directly toward the tarmac.",
      "The effectiveness of this underfloor low-pressure pocket relies heavily on the rear diffuser. By gently expanding the airflow back to atmospheric pressure at the vehicle's trailing edge, the diffuser acts as a fluid extraction pump, drawing air through the underside at high velocity.",
      "Ride height control is paramount to keeping underfloor aero functional. If a car experiences excessive pitch or roll, the ground clearance changes, breaking the underfloor aerodynamic seal and inducing catastrophic downforce loss (aero stall)."
    ],
    aeoQuestions: [
      {
        question: "How does ground effect produce downforce without high drag?",
        answer: "Ground effect accelerates airflow underneath the vehicle via venturi tunnels, creating a localized low-pressure zone beneath the floor pan. Because suction pulls downward across the large surface area of the floor, it generates downforce without the turbulent frontal wake of large wings."
      },
      {
        question: "What causes underfloor aerodynamic stalling?",
        answer: "Aerodynamic stall occurs when excessive chassis pitch, body roll, or bottoming out disrupts laminar underbody airflow, detaching boundary layers inside the diffuser and immediately shedding downforce."
      }
    ],
    specs: { "L/D Ratio": "4.5:1 Target", "Downforce Load": "750kg @ 150mph", "Drag Penalty": "Minimal Wake" }
  },
  {
    id: 4,
    slug: "mechanical-lsd-vs-torque-vectoring",
    title: "Mechanical LSD vs Electronic Torque Vectoring in High-G Transitions",
    category: "Track Testing",
    primaryKeyword: "mechanical lsd vs torque vectoring",
    secondaryKeywords: ["limited slip differential track", "electronic differential latency"],
    metaTitle: "Mechanical LSD vs Electronic Torque Vectoring | Apex Dynamics Drivetrain",
    metaDesc: "Compare clutch-pack limited slip differentials with active electronic torque vectoring across corner entry, mid-apex, and corner exit.",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=75",
    imageAlt: "High-performance sports car rear axle and mechanical limited-slip differential assembly",
    excerpt: "Analyzing clutch-pack preload stability against active electronically controlled multi-plate differentials.",
    readTime: "7 min",
    date: "SEP 22, 2024",
    paragraphs: [
      "A differential's fundamental responsibility is allowing driven wheels to rotate at differing speeds during cornering while transmitting forward thrust. However, an open differential sends drive torque to the path of least resistance—meaning an unloaded inner wheel simply spins freely under hard acceleration.",
      "Traditional mechanical Limited-Slip Differentials (LSD) rely on multi-plate clutch packs and angled ramps. Under throttle input, internal cross pins ride up the ramps, compressing the friction clutches to mechanically bind both axle shafts together. This lock-up occurs predictably and without computational latency.",
      "Clutch-pack LSD setups can be fine-tuned via 1-way, 1.5-way, or 2-way ramp angles to dictate lock-up under acceleration and decel. A 1.5-way differential provides solid stability during heavy braking while allowing the car to turn freely into corner entry.",
      "Electronic active differentials (e-diffs) replace passive mechanical ramp pressure with electric actuator motors or hydraulic clutches managed by high-frequency CAN-bus sensors. An e-diff can run 0% lock-up on initial turn-in to eliminate corner-entry push (understeer), then ramp up to 100% full lock on corner exit for maximum traction."
    ],
    aeoQuestions: [
      {
        question: "Which is better for track endurance: a mechanical LSD or an electronic diff?",
        answer: "A mechanical clutch-pack LSD is generally superior for sustained endurance racing because it provides zero-latency lock-up, thermal predictability, and no reliance on ECU sensor calibrations that can overheat."
      },
      {
        question: "What is the primary advantage of active torque vectoring?",
        answer: "Active torque vectoring allows decoupled left-to-right wheel speed control, actively overspeeding the outside rear tire to eliminate turn-in understeer before corner-exit acceleration begins."
      }
    ],
    specs: { "Lockup Latency": "15ms (Active) / Instant (Mech)", "Durability": "High Endurance", "Dynamic Range": "0-100% Variable" }
  },
  {
    id: 5,
    slug: "dct-vs-torque-converter-transmissions",
    title: "Dual-Clutch Transmissions (DCT) vs Planetary Automatics on Track",
    category: "Powertrains",
    primaryKeyword: "dct vs torque converter track",
    secondaryKeywords: ["dual clutch transmission shift speed", "zf 8-speed automatic racing"],
    metaTitle: "DCT vs Torque Converter Automatics on Track | Apex Dynamics Drivetrain",
    metaDesc: "Examine whether modern multi-clutch planetary automatics can surpass dual-clutch gearboxes under severe circuit track conditions.",
    image: "https://images.unsplash.com/photo-1541348263662-e0c866657c9a?auto=format&fit=crop&w=800&q=75",
    imageAlt: "Cockpit paddle shifters and central transmission console in an endurance race car",
    excerpt: "Can modern torque converter automatics match dual-clutch gearboxes under sustained track punishment?",
    readTime: "8 min",
    date: "SEP 15, 2024",
    paragraphs: [
      "For over a decade, the Dual-Clutch Transmission (DCT) stood as the undisputed benchmark for high-performance track vehicles. By pre-selecting the next gear on an alternating shaft, shift interruptions were reduced to under 50 milliseconds, eliminating driveline shock and keeping turbo boost pinned.",
      "However, modern torque-converter automatics—most notably the ZF 8HP family—have made rapid advancements. With aggressive torque converter lock-up clutches that engage almost immediately after initial roll-off, planetary gearboxes have largely eliminated the historical sluggishness of traditional automatics.",
      "In track driving, shift speed is only one variable in the equation. Thermal dissipation under continuous full-throttle upshifts and rev-matched downshifts plays a crucial role. Wet dual-clutch packs produce friction heat during low-speed engagements and high-RPM shifts, demanding dedicated oil-to-air cooling radiators.",
      "Torque converters distribute planetary gear loads across multiple gear sets simultaneously, allowing them to handle immense torque with consistent durability across hundreds of thermal cycles."
    ],
    aeoQuestions: [
      {
        question: "Why are high-performance manufacturers switching from DCT to torque converter automatics?",
        answer: "Modern planetary gearboxes handle massive torque outputs with lower manufacturing and maintenance complexity while offering comparable shift speeds via ultra-fast torque converter lock-up clutches."
      },
      {
        question: "Does a DCT shift faster than a planetary automatic on track?",
        answer: "Yes, dual-clutch transmissions shift in approximately 30 to 50 milliseconds compared to 100 to 150 milliseconds in quick torque-converter gearboxes, providing instantaneous mechanical engagement."
      }
    ],
    specs: { "Shift Latency": "40ms (DCT) vs 120ms (8HP)", "Max Torque": "1000Nm+ (Auto)", "Thermal Load": "High in Wet-Clutch" }
  },
  {
    id: 6,
    slug: "carbon-ceramic-vs-iron-brakes",
    title: "Brake Fade Dynamics: Carbon Ceramic vs Cast Iron Rotors",
    category: "Track Testing",
    primaryKeyword: "carbon ceramic vs iron brakes track",
    secondaryKeywords: ["brake fade track driving", "unsprung weight brake rotors"],
    metaTitle: "Carbon Ceramic vs Cast Iron Brakes on Track | Apex Dynamics Braking Guide",
    metaDesc: "Analyze thermal capacity, unsprung weight benefits, and cost-per-lap differences between carbon ceramic and iron brake systems.",
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=75",
    imageAlt: "Close-up of perforated carbon-ceramic brake rotor and multi-piston caliper glowing under heat",
    excerpt: "Evaluating thermal dissipation, unsprung rotating mass, and pad friction coefficients at 800°C.",
    readTime: "9 min",
    date: "SEP 08, 2024",
    paragraphs: [
      "Braking systems operate as kinetic energy converters, converting forward vehicle velocity into heat through friction between the pads and rotor faces. On a racing circuit, stopping a 3,500-lb sports car from 140 mph into a 40 mph corner dumps millions of joules of thermal energy into the front wheel assemblies.",
      "Brake fade occurs in two distinct forms: pad fade and fluid vapor lock. Pad fade happens when friction material exceeds its optimal operating temperature, outgassing and creating a boundary layer that lubricates rather than grips. Fluid fade happens when caliper heat boils the brake fluid, creating compressible steam pockets in the lines.",
      "Cast iron rotors offer high thermal mass and predictable modulation. When paired with high-temperature motorsport pads (such as Pagid or Endless compounds) and fresh racing brake fluid with a dry boiling point over 320°C, iron brakes deliver consistent pedal firmness across prolonged track sessions.",
      "Carbon Ceramic Matrix (CCM) rotors offer substantial benefits in heat tolerance and weight reduction. A typical carbon ceramic setup sheds between 30 and 45 lbs of unsprung rotating mass across all four corners, markedly improving damper compliance."
    ],
    aeoQuestions: [
      {
        question: "Are carbon ceramic brakes worth the cost for track days?",
        answer: "Carbon ceramic brakes provide significant unsprung weight reduction and superior thermal fade resistance, but their high rotor replacement cost makes two-piece floating cast iron rotors more economical for frequent track-day participants."
      },
      {
        question: "At what temperature do track brake pads begin to fade?",
        answer: "Standard street pads fade around 350°C to 400°C, while dedicated endurance motorsport compounds remain effective up to 750°C to 850°C before experiencing thermal degradation."
      }
    ],
    specs: { "Max Operating Temp": "1000°C (CCM) vs 650°C (Iron)", "Unsprung Weight Saving": "-35 lbs Total", "Friction Coeff (μ)": "0.45 - 0.55" }
  },
  {
    id: 7,
    slug: "suspension-kinematics-camber-curves",
    title: "Suspension Kinematics: Double Wishbone vs MacPherson Struts",
    category: "Chassis & Aero",
    primaryKeyword: "double wishbone vs macpherson strut",
    secondaryKeywords: ["dynamic camber gain", "suspension roll center kinematics"],
    metaTitle: "Suspension Kinematics & Camber Curves | Apex Dynamics Chassis Guide",
    metaDesc: "Understand dynamic camber curves, roll center migration, and bump steer geometry in double wishbone and MacPherson designs.",
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=75",
    imageAlt: "Double wishbone front suspension assembly with coilover damper and machined billet control arms",
    excerpt: "Why double wishbone geometry maintains higher grip levels than MacPherson struts when lateral loads exceed 1.5G.",
    readTime: "10 min",
    date: "AUG 30, 2024",
    paragraphs: [
      "Static chassis alignment numbers mean very little once dynamic cornering loads compress the outside suspension. As lateral cornering forces transfer weight across the axle, the vehicle body rolls, and the suspension arms articulate through their respective arcs.",
      "The critical distinction between double wishbone setups and MacPherson strut suspensions lies in their dynamic camber curves. In a double wishbone configuration, unequal-length upper and lower control arms can be angled so that as the outside wheel compresses into bump, the knuckle gains negative camber, keeping the tire contact patch flat against the tarmac.",
      "A MacPherson strut, constrained by its rigid damper body acting as an upper locator, struggles to gain sufficient negative camber in roll. Beyond a certain compression threshold, the strut begins losing dynamic camber, rolling the tire onto its outer shoulder and causing sudden front-end understeer.",
      "Roll center height dictates how lateral cornering forces are partitioned between the chassis springs and the rigid suspension links. If the geometric roll center is positioned too far below the center of gravity, the roll moment arm lengthens, causing the car to lean excessively without stiff anti-roll bars."
    ],
    aeoQuestions: [
      {
        question: "Why do dedicated race cars use double wishbone suspension?",
        answer: "Double wishbone geometry allows engineers to independently tune dynamic camber gain, roll center migration, and anti-dive properties throughout suspension travel without compromising damper performance."
      },
      {
        question: "What is bump steer and how does it hurt lap times?",
        answer: "Bump steer is unwanted toe change as the wheel moves vertically through its suspension stroke. It forces the driver to constantly make micro-corrections over curbs and uneven pavement, destabilizing the chassis."
      }
    ],
    specs: { "Camber Gain in Bump": "-1.5° / inch", "Roll Center Height": "3.2 inches Above Ground", "Bushings": "Spherical Monoball" }
  },
  {
    id: 8,
    slug: "water-to-air-vs-air-to-air-intercooling",
    title: "Thermodynamics: Water-to-Air vs Air-to-Air Charge Cooling",
    category: "Powertrains",
    primaryKeyword: "water to air vs air to air intercooler",
    secondaryKeywords: ["turbo intake charge temperature", "heat soak track performance"],
    metaTitle: "Water-to-Air vs Air-to-Air Intercoolers | Apex Dynamics Turbo Tech",
    metaDesc: "Explore the thermodynamic pros and cons of water-to-air versus air-to-air intercooling systems on high-boost circuit cars.",
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=75",
    imageAlt: "Front-mounted aluminum performance intercooler core exposed behind lightweight track bumper",
    excerpt: "Managing intake charge temperatures and manifold pressure drops over 30-minute track stints.",
    readTime: "8 min",
    date: "AUG 22, 2024",
    paragraphs: [
      "Compressing ambient air through a turbocharger compressor wheel generates substantial heat as dictated by the ideal gas law. Boosted air leaving a turbo can easily exceed 160°C (320°F). Without efficient heat exchange, this elevated charge temperature drastically reduces air density and induces engine knock.",
      "Traditional air-to-air intercoolers mount a heat exchanger core directly in the vehicle's front fascia. Ambient air rushing through the bumper cools the compressed intake charge flowing inside the internal tubes. While simple and lightweight, long intercooler piping runs increase system volume, slightly dulling throttle response.",
      "Water-to-air intercooling systems relocate the heat exchanger core directly inside or on top of the intake manifold. Intake charge air passes through compact liquid-cooled cores, while a secondary water pump circulates coolant to a front-mounted heat exchanger.",
      "The primary advantage of water-to-air cooling is minimal intake runner volume. Short intake runners result in crisp, immediate throttle pickup. Water also possesses a much higher specific heat capacity than air, acting as an effective thermal buffer during short bursts of full acceleration."
    ],
    aeoQuestions: [
      {
        question: "Does a water-to-air intercooler reduce turbo lag?",
        answer: "Yes, placing the liquid intercooler core directly inside or next to the intake manifold drastically shortens the total intake tract volume, reducing the time required to pressurize the system under throttle application."
      },
      {
        question: "What is intercooler heat soak and how does it reduce engine output?",
        answer: "Heat soak occurs when the cooling core reaches thermal equilibrium with the engine bay and cannot reject heat efficiently. High intake air temperatures force the ECU to pull ignition timing to prevent pre-detonation, lowering horsepower."
      }
    ],
    specs: { "Target IAT": "< 45°C Above Ambient", "Core Volume": "Dual Multi-Pass", "Thermal Capacity": "High Water Buffer" }
  },
  {
    id: 9,
    slug: "tire-slip-angle-friction-circle",
    title: "Tire Dynamics: Slip Angle, Friction Circle, and Grip Windows",
    category: "Track Testing",
    primaryKeyword: "tire slip angle friction circle",
    secondaryKeywords: ["motorsport tire thermal window", "optimal hot tire pressure track"],
    metaTitle: "Tire Slip Angle & Friction Circle Guide | Apex Dynamics Track Telemetry",
    metaDesc: "Master the physics of tire slip angle, pneumatic trail, and chemical adhesion windows to maximize cornering G-forces on track.",
    image: "https://images.unsplash.com/photo-1578836537282-3171d77f8632?auto=format&fit=crop&w=800&q=75",
    imageAlt: "Semi-slick racing tire on forged alloy wheel showing graining and track pickup rubber",
    excerpt: "Understanding the physics of tire slip angle, pneumatic trail, and operating temperatures for maximum lateral G.",
    readTime: "9 min",
    date: "AUG 14, 2024",
    paragraphs: [
      "Every control input made through the steering wheel, brakes, and throttle reaches the racetrack through four tire contact patches, each roughly the size of a smartphone. A tire does not generate lateral cornering grip simply by pointing in the desired direction; it requires a slip angle.",
      "Slip angle is the angular difference between the direction the wheel is pointed and the actual direction the vehicle is traveling. As the tire rolls, flexible rubber tread blocks distort and shear against the pavement, generating cornering force. Peak lateral grip generally occurs at slip angles between 5 and 8 degrees.",
      "If a driver exceeds the optimal slip angle, the rubber blocks begin sliding rather than gripping, transitioning from static friction to dynamic kinetic friction. This results in understeer or oversteer and rapidly overheats the tire's outer compound surface.",
      "Every motorsport compound has a specific thermal operating window. A 200-treadwear track tire typically performs best between 75°C and 95°C (170°F - 200°F). If cold, the rubber remains hard and lacks chemical adhesion; if overheated, the compound softens excessively and blisters."
    ],
    aeoQuestions: [
      {
        question: "What is tire slip angle in circuit racing?",
        answer: "Slip angle is the angular divergence between the wheel's pointing plane and the actual direction of tire patch travel. Peak cornering force is generated as tread blocks deform within this angle before sliding starts."
      },
      {
        question: "How does tire pressure affect the contact patch at track operating temperatures?",
        answer: "Overinflated hot tires cause the center of the tread to crown, reducing the effective contact patch size. Underinflated tires cause the tread shoulders to roll over, creating uneven heat buildup and squirm."
      }
    ],
    specs: { "Optimal Slip Angle": "6° - 8°", "Thermal Window": "75°C - 95°C", "Hot Pressure Target": "32 - 34 PSI" }
  },
  {
    id: 10,
    slug: "aerodynamic-pitch-sensitivity-splitter-stall",
    title: "Aerodynamic Pitch Sensitivity: Center of Pressure & Splitter Stall",
    category: "Chassis & Aero",
    primaryKeyword: "aerodynamic pitch sensitivity race car",
    secondaryKeywords: ["front splitter aero stall", "center of pressure migration"],
    metaTitle: "Aerodynamic Pitch Sensitivity & Splitter Stall | Apex Dynamics Aero",
    metaDesc: "Discover how braking dive and chassis roll cause front splitter stalls, center of pressure shifts, and high-speed instability.",
    image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=75",
    imageAlt: "Carbon fiber front splitter and dive planes mounted on a low-ground-clearance GT track car",
    excerpt: "Balancing downforce migration during threshold braking and curb strikes to eliminate high-speed instability.",
    readTime: "10 min",
    date: "AUG 05, 2024",
    paragraphs: [
      "A race car is not a static object moving through clean air; it continuously dives under braking, squats under acceleration, and rolls in corners. These chassis attitude changes dramatically alter the Center of Pressure (CoP)—the central point where total aerodynamic downforce acts upon the vehicle.",
      "Front splitters are notoriously pitch-sensitive. As a car enters a heavy braking zone at 150 mph, front suspension compression drives the splitter lip toward the tarmac. Because ground-effect downforce increases exponentially as ground clearance decreases, the front downforce spikes sharply.",
      "This forward migration of the Center of Pressure can create severe high-speed instability. If the front downforce percentage jumps from 40% to 60% during initial turn-in, the rear axle suddenly becomes light, inducing snap oversteer during trail-braking.",
      "Conversely, if the splitter gets pushed too close to the ground, the air gap chokes and airflow stalls completely. When a splitter stalls, front downforce vanishes in milliseconds, causing the front tires to wash out into severe high-speed understeer."
    ],
    aeoQuestions: [
      {
        question: "What causes a front splitter to stall at high speeds?",
        answer: "A front splitter stalls when the distance between the splitter lip and the ground becomes too narrow, choking incoming air volume and detaching boundary airflow layers, causing instant downforce loss."
      },
      {
        question: "How do race engineers control aerodynamic pitch sensitivity?",
        answer: "Teams employ stiff third-element heave springs or bump rubbers on the front suspension to lock out forward pitch dive at high speeds while maintaining soft mechanical springing for low-speed corner compliance."
      }
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
  const [currentRoute, setCurrentRoute] = useState(window.location.hash || '#/');
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");
  const [apiKey, setApiKey] = useState(import.meta.env?.VITE_GEMINI_API_KEY || "");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [engineInput, setEngineInput] = useState("");
  const [engineResult, setEngineResult] = useState(null);
  const [engineLoading, setEngineLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);

  // Sync hash routing with window state
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(window.location.hash || '#/');
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (path) => {
    window.location.hash = path;
  };

  // Determine current active article from hash route
  const activeArticle = useMemo(() => {
    const match = currentRoute.match(/^#\/articles\/(.+)$/);
    if (match) {
      const slug = match[1];
      return ARTICLES.find(a => a.slug === slug) || null;
    }
    return null;
  }, [currentRoute]);

  // Update dynamic Title & Meta Description tags for SEO
  useEffect(() => {
    let title = "Apex Dynamics | Motorsport Engineering Telemetry & Powertrain Journal";
    let desc = "Apex Dynamics is a technical automotive engineering publication breaking down chassis kinematics, powertrain performance, and aerodynamics.";

    if (activeArticle) {
      title = activeArticle.metaTitle;
      desc = activeArticle.metaDesc;
    }

    document.title = title;

    let metaTag = document.querySelector('meta[name="description"]');
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.name = "description";
      document.head.appendChild(metaTag);
    }
    metaTag.content = desc;
  }, [activeArticle]);

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
      {/* Navigation Header */}
      <nav className="sticky top-0 z-30 bg-[#0B0F17]/95 backdrop-blur-md border-b border-white/5 px-6 py-4 flex justify-between items-center">
        <a 
          href="#/" 
          onClick={(e) => { e.preventDefault(); navigateTo('#/'); }}
          className="flex items-center gap-2 group text-inherit no-underline"
          title="Apex Dynamics Homepage"
        >
          <div className="w-8 h-8 bg-blue-600 flex items-center justify-center -rotate-12 rounded group-hover:bg-blue-500 transition-colors">
            <Zap size={18} className="text-white" />
          </div>
          <span className="font-black tracking-tighter italic text-xl">APEX DYNAMICS</span>
        </a>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={14} />
            <input 
              type="text" 
              placeholder="Search engineering logs..."
              className="bg-slate-900 border border-white/10 rounded-full py-1.5 pl-9 pr-3 text-xs w-36 md:w-60 focus:outline-none focus:border-blue-500 transition-colors"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setSettingsOpen(true)} 
            className="p-2 text-slate-400 hover:text-white transition-colors"
            aria-label="Open settings and API key configurations"
          >
            <Settings size={18} />
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeArticle ? (
          /* Dedicated Article Page (3.i Unique URL View) */
          <article className="max-w-4xl mx-auto bg-slate-900/60 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            {/* Top Anchor Link */}
            <div className="p-4 border-b border-white/5 bg-slate-950/40 flex justify-between items-center">
              <a 
                href="#/" 
                onClick={(e) => { e.preventDefault(); navigateTo('#/'); }}
                className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1.5"
                title="Return to Apex Dynamics Homepage"
              >
                <ArrowLeft size={14} /> Back to Telemetry Hub
              </a>
              <span className="text-[11px] font-mono text-slate-400">{activeArticle.date}</span>
            </div>

            {/* Optimized Article Header Image */}
            <div className="h-72 md:h-96 relative w-full overflow-hidden">
              <img 
                src={activeArticle.image} 
                alt={activeArticle.imageAlt} 
                className="w-full h-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
            </div>

            <div className="p-6 md:p-10">
              <span className="text-xs text-blue-400 font-bold uppercase tracking-wider block mb-2">{activeArticle.category}</span>
              <h1 className="text-2xl md:text-4xl font-black mb-4 leading-tight">{activeArticle.title}</h1>

              {/* Technical Specifications Matrix */}
              <div className="grid grid-cols-3 gap-3 bg-black/40 p-4 rounded-xl mb-8 border border-white/5">
                {Object.entries(activeArticle.specs).map(([k, v]) => (
                  <div key={k}>
                    <div className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">{k}</div>
                    <div className="text-xs md:text-sm font-bold text-slate-200 mt-0.5">{v}</div>
                  </div>
                ))}
              </div>

              {/* In-Depth Article Content */}
              <div className="space-y-6 text-slate-300 text-sm md:text-base leading-relaxed mb-10">
                {activeArticle.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              {/* AEO Question & Answer Section */}
              <section className="bg-slate-950/80 border border-blue-500/20 rounded-xl p-6 mb-10">
                <h2 className="text-lg md:text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Info size={18} className="text-blue-400" /> Engineering FAQ: Critical Principles
                </h2>
                <div className="space-y-6">
                  {activeArticle.aeoQuestions.map((qa, i) => (
                    <div key={i} className="border-l-2 border-blue-500 pl-4 space-y-2">
                      <h3 className="text-sm md:text-base font-bold text-slate-100">{qa.question}</h3>
                      <p className="text-xs md:text-sm text-slate-400 leading-relaxed">{qa.answer}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Gemini AI Summary Generator */}
              <div className="bg-black/40 p-5 rounded-xl border border-white/5">
                <button 
                  onClick={() => summarize(activeArticle.paragraphs)} 
                  disabled={summaryLoading || !apiKey} 
                  className="bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/30 text-indigo-300 text-xs font-bold py-2.5 px-4 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
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
          </article>
        ) : (
          /* Homepage View */
          <div>
            {/* Category Filter Pills */}
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
              {/* Articles Column */}
              <div className="lg:col-span-2 space-y-8">
                {/* Featured Hero Article */}
                {cat === "All" && !search && featured && (
                  <div 
                    onClick={() => navigateTo(`#/articles/${featured.slug}`)} 
                    className="group relative h-96 rounded-2xl border border-white/10 overflow-hidden cursor-pointer shadow-2xl flex flex-col justify-end p-6 md:p-8"
                  >
                    <img 
                      src={featured.image} 
                      alt={featured.imageAlt} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-50"
                      loading="eager"
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
                      <a 
                        href={`#/articles/${featured.slug}`} 
                        className="text-blue-400 text-xs font-bold flex items-center gap-1 uppercase tracking-wider group-hover:gap-2 transition-all no-underline"
                        title="Read full article on Polar Moment of Inertia"
                      >
                        Read In-Depth Analysis on Weight Distribution <ChevronRight size={14} />
                      </a>
                    </div>
                  </div>
                )}

                {/* Article Grid with Keyword Anchors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filtered.filter(a => !a.featured || cat !== "All").map(art => (
                    <div 
                      key={art.id} 
                      onClick={() => navigateTo(`#/articles/${art.slug}`)} 
                      className="bg-slate-900/60 border border-white/5 rounded-xl overflow-hidden cursor-pointer hover:border-blue-500/50 transition-all flex flex-col justify-between group shadow-lg"
                    >
                      <div className="h-44 overflow-hidden relative">
                        <img 
                          src={art.image} 
                          alt={art.imageAlt} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                          loading="lazy"
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
                          <a 
                            href={`#/articles/${art.slug}`} 
                            className="text-blue-400 font-bold flex items-center gap-1 text-[10px] uppercase hover:underline"
                            title={`Read engineering analysis for ${art.title}`}
                          >
                            Read Full Telemetry Log <Maximize2 size={12} />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Homepage AEO Q&A Section */}
                <section className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 space-y-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Info size={18} className="text-blue-400" /> Frequently Asked Motorsport Engineering Questions
                  </h2>
                  <div className="space-y-4">
                    <div className="border-l-2 border-blue-500 pl-4 space-y-1">
                      <h3 className="text-sm font-bold text-slate-200">What is the primary mission of Apex Dynamics?</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Apex Dynamics is an automotive technical editorial providing circuit-verified breakdowns of chassis kinematics, powertrain efficiency, tire contact patch thermodynamics, and active aerodynamic setups.
                      </p>
                    </div>
                    <div className="border-l-2 border-blue-500 pl-4 space-y-1">
                      <h3 className="text-sm font-bold text-slate-200">How does AI telemetry analysis enhance track tuning?</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        By coupling Google Gemini 3.8 Flash algorithms with mechanical performance datasets, our decrypter models decompose engine architectures, boost delivery, and chassis vulnerabilities in seconds.
                      </p>
                    </div>
                  </div>
                </section>
              </div>

              {/* Sidebar Tools */}
              <div className="space-y-6">
                {/* Engine Decrypter AI Box */}
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

                {/* Track Telemetry Widget */}
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
          </div>
        )}
      </main>

      {/* Settings Modal */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
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

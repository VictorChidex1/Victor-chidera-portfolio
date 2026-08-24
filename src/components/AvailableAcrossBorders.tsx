import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  ComposableMap,
  Geographies,
  Geography,
  Line,
  Marker,
} from "react-simple-maps";
import { fadeInUp, staggerContainer } from "../utils/animations";

// Use a reliable world topojson
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const countries = [
  { name: "Nigeria", flag: "🇳🇬", isBase: true, coordinates: [8.6753, 9.082] }, // [longitude, latitude]
  { name: "United States", flag: "🇺🇸", isBase: false, coordinates: [-95.7129, 37.0902] },
  { name: "United Kingdom", flag: "🇬🇧", isBase: false, coordinates: [-3.436, 55.3781] },
  { name: "Canada", flag: "🇨🇦", isBase: false, coordinates: [-106.3468, 56.1304] },
];

const baseCoords = countries[0].coordinates;

const AvailableAcrossBorders = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax Mouse Tracking
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { damping: 30, stiffness: 100, mass: 1.5 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Map mouse position to 3D rotation (-8deg to +8deg)
  const rotateX = useTransform(smoothMouseY, [0, 1], [8, -8]);
  const rotateY = useTransform(smoothMouseX, [0, 1], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // Calculate normalized mouse position (0 to 1)
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    // Reset to center on leave
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <section className="py-32 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Header */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <div>
              <motion.p
                variants={fadeInUp}
                className="text-brand-muted font-medium uppercase tracking-widest text-sm mb-4"
              >
                Remote Collaboration
              </motion.p>
              <motion.h2
                variants={fadeInUp}
                className="text-5xl md:text-7xl font-bold font-display text-brand-ink leading-tight"
              >
                Available Across
                <br />
                Borders
              </motion.h2>
            </div>
            <motion.div
              variants={fadeInUp}
              className="flex items-end lg:justify-end"
            >
              <p className="text-brand-muted text-lg max-w-md leading-relaxed">
                Time zones don&apos;t slow me down. I work async and in
                real-time with clients worldwide, delivering the same quality
                whether you&apos;re in New York, London, or Toronto.
              </p>
            </motion.div>
          </div>

          {/* Interactive Parallax Canvas */}
          <motion.div
            variants={fadeInUp}
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ perspective: 2000 }} // Deep perspective for the 3D effect
            className="relative bg-[#f8fafc] rounded-[40px] border border-slate-200 p-6 md:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between overflow-visible"
          >
            {/* Informational overlay (Top Left) */}
            <div className="absolute top-12 left-12 z-20 hidden md:block pointer-events-none">
               <h3 className="text-3xl font-bold font-display text-brand-ink mb-2">
                 Global Reach,<br/>Local Precision.
               </h3>
               <div className="flex items-center gap-3 mt-4">
                 <div className="w-2.5 h-2.5 rounded-full bg-brand-accent animate-pulse" />
                 <span className="text-brand-ink text-sm font-medium tracking-wide">Available across GMT-8 to GMT+1</span>
               </div>
            </div>

            {/* The 3D Map Layer */}
            <motion.div 
              style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
              }}
              className="w-full relative z-10 aspect-[16/9] max-h-[600px] flex items-center justify-center cursor-crosshair"
            >
              {/* CSS Drop shadow on the entire map container instead of SVG filters guarantees 120fps on Safari */}
              <div className="w-full h-full" style={{ filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.05))" }}>
                <ComposableMap
                  projection="geoMercator"
                  projectionConfig={{
                    scale: 140,
                    center: [0, 30], 
                  }}
                  style={{ width: "100%", height: "100%", outline: "none" }}
                >
                  {/* Flawless, flat rendering of the landmasses */}
                  <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                      geographies.map((geo) => (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill="#e2e8f0" // Clean slate grey
                          stroke="#ffffff"
                          strokeWidth={0.5}
                          style={{
                            default: { outline: "none" },
                            hover: { outline: "none", fill: "#cbd5e1", transition: "all 0.3s" },
                            pressed: { outline: "none" },
                          }}
                        />
                      ))
                    }
                  </Geographies>

                  {/* Animated Connection Lines */}
                  {countries
                    .filter((c) => !c.isBase)
                    .map((country, idx) => (
                      <Line
                        key={`line-${country.name}`}
                        from={baseCoords as [number, number]}
                        to={country.coordinates as [number, number]}
                        stroke="#94a3b8"
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        strokeDasharray="4 4"
                        style={{
                          opacity: 0.6,
                        }}
                      />
                    ))}

                  {/* Location Pins & Tooltips */}
                  {countries.map((country) => (
                    <Marker
                      key={`marker-${country.name}`}
                      coordinates={country.coordinates as [number, number]}
                    >
                      <g className="group cursor-pointer">
                        {/* Outer Glow Ring */}
                        <circle
                          r={12}
                          fill={country.isBase ? "rgba(249,115,22,0.15)" : "rgba(15, 23, 42, 0.10)"}
                          className="origin-center animate-ping"
                        />
                        {/* Inner Solid Dot */}
                        <circle
                          r={4}
                          fill={country.isBase ? "#F97316" : "#0f172a"}
                          stroke="#ffffff"
                          strokeWidth={1.5}
                          className="transition-transform duration-300 group-hover:scale-150"
                        />
                        {/* Beautiful Floating Tooltip */}
                        <foreignObject
                          x={10}
                          y={-14}
                          width={160}
                          height={40}
                          style={{ overflow: "visible" }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl rounded-full px-3 py-1.5 w-max transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            <span className="text-sm">{country.flag}</span>
                            <span className="text-xs font-semibold text-slate-800">
                              {country.name}
                            </span>

                          </div>
                        </foreignObject>
                      </g>
                    </Marker>
                  ))}
                </ComposableMap>
              </div>
            </motion.div>
          </motion.div>

          {/* Country Cards (For Mobile / Backup) */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-6"
          >
            {countries.map((country) => (
              <motion.div
                key={country.name}
                variants={fadeInUp}
                className="group flex items-center justify-between bg-white border border-slate-200 rounded-2xl px-4 py-3.5 md:px-5 md:py-4 hover:border-slate-300 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-default shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base md:text-lg">{country.flag}</span>
                  <span className="text-sm md:text-base text-slate-800 font-semibold">
                    {country.name}
                  </span>

                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AvailableAcrossBorders;

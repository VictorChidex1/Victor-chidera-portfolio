import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ComposableMap,
  Geographies,
  Geography,
  Line,
  Marker,
  Graticule,
} from "react-simple-maps";
import { fadeInUp, staggerContainer } from "../utils/animations";

// Use a reliable world topojson
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const countries = [
  { name: "Nigeria", flag: "🇳🇬", isHome: true, coordinates: [8.6753, 9.082] }, // [longitude, latitude]
  { name: "United States", flag: "🇺🇸", isHome: false, coordinates: [-95.7129, 37.0902] },
  { name: "United Kingdom", flag: "🇬🇧", isHome: false, coordinates: [-3.436, 55.3781] },
  { name: "Canada", flag: "🇨🇦", isHome: false, coordinates: [-106.3468, 56.1304] },
];

const nigeriaCoords = countries[0].coordinates;

const AvailableAcrossBorders = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

          {/* White Card matching the Reference Design */}
          <motion.div
            variants={fadeInUp}
            className="relative bg-[#fbfcfd] rounded-[40px] border border-slate-200 overflow-hidden p-6 md:p-12 shadow-2xl"
          >
            {/* The Map */}
            <div className="relative w-full aspect-[16/9] max-h-[600px]">
              {isMounted && (
                <ComposableMap
                  projection="geoMercator"
                  projectionConfig={{
                    scale: 130,
                    center: [0, 30], // Center to show NA, Europe, Africa nicely
                  }}
                  style={{ width: "100%", height: "100%" }}
                >
                  {/* Definition for Emboss & Drop Shadow Filters */}
                  <defs>
                    <filter id="emboss" x="-20%" y="-20%" width="140%" height="140%">
                      {/* Drop shadow */}
                      <feDropShadow
                        dx="2"
                        dy="4"
                        stdDeviation="4"
                        floodColor="#cbd5e1"
                        floodOpacity="0.8"
                      />
                      {/* Inner highlight (top-left) */}
                      <feOffset dx="-1" dy="-1" in="SourceAlpha" result="offsetAlpha1" />
                      <feGaussianBlur stdDeviation="1" in="offsetAlpha1" result="blur1" />
                      <feComposite operator="out" in2="blur1" in="SourceAlpha" result="inverse1" />
                      <feFlood floodColor="#ffffff" floodOpacity="1" result="color1" />
                      <feComposite operator="in" in2="inverse1" in="color1" result="highlight" />
                      
                      {/* Inner shadow (bottom-right) */}
                      <feOffset dx="2" dy="2" in="SourceAlpha" result="offsetAlpha2" />
                      <feGaussianBlur stdDeviation="2" in="offsetAlpha2" result="blur2" />
                      <feComposite operator="out" in2="blur2" in="SourceAlpha" result="inverse2" />
                      <feFlood floodColor="#94a3b8" floodOpacity="0.4" result="color2" />
                      <feComposite operator="in" in2="inverse2" in="color2" result="shadow" />
                      
                      {/* Combine everything */}
                      <feMerge>
                        <feMergeNode in="SourceGraphic" />
                        <feMergeNode in="highlight" />
                        <feMergeNode in="shadow" />
                      </feMerge>
                    </filter>
                  </defs>

                  <Graticule stroke="#e2e8f0" strokeWidth={0.5} strokeDasharray="4 4" />

                  <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                      geographies.map((geo) => (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill="#f8fafc"
                          stroke="#f8fafc"
                          strokeWidth={0.5}
                          style={{
                            default: { outline: "none", filter: "url(#emboss)" },
                            hover: { outline: "none", filter: "url(#emboss)" },
                            pressed: { outline: "none", filter: "url(#emboss)" },
                          }}
                        />
                      ))
                    }
                  </Geographies>

                  {/* Connection Lines */}
                  {countries
                    .filter((c) => !c.isHome)
                    .map((country, idx) => (
                      <Line
                        key={`line-${country.name}`}
                        from={nigeriaCoords as [number, number]}
                        to={country.coordinates as [number, number]}
                        stroke="#111111"
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        strokeDasharray="6 6"
                        style={{
                          opacity: 0,
                          animation: `draw-line 2s ease-out ${1 + idx * 0.3}s forwards`,
                        }}
                      />
                    ))}

                  {/* Pins & Labels */}
                  {countries.map((country, idx) => (
                    <Marker
                      key={`marker-${country.name}`}
                      coordinates={country.coordinates as [number, number]}
                    >
                      <g
                        style={{
                          opacity: 0,
                          animation: `fade-in-up 0.5s ease-out ${0.5 + idx * 0.2}s forwards`,
                        }}
                      >
                        {/* Outer Glow Ring */}
                        <circle
                          r={12}
                          fill={country.isHome ? "rgba(249,115,22,0.15)" : "rgba(17,17,17,0.10)"}
                          className="origin-center animate-ping"
                        />
                        {/* Inner Dot */}
                        <circle
                          r={4}
                          fill={country.isHome ? "#F97316" : "#111111"}
                          stroke="#ffffff"
                          strokeWidth={1.5}
                        />

                        {/* Beautiful Floating Label matching reference */}
                        <foreignObject
                          x={12}
                          y={-14}
                          width={140}
                          height={40}
                          style={{ overflow: "visible" }}
                        >
                          <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md border border-slate-200/60 shadow-lg rounded-full px-2.5 py-1 w-max">
                            <span className="text-xs">{country.flag}</span>
                            <span className="text-xs font-semibold text-slate-800">
                              {country.name}
                            </span>
                            {country.isHome && (
                              <span className="text-[9px] bg-brand-ink/5 text-brand-ink px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                                Home
                              </span>
                            )}
                          </div>
                        </foreignObject>
                      </g>
                    </Marker>
                  ))}
                </ComposableMap>
              )}
            </div>

            {/* Injected CSS for SVG animations since SVG paths can't use standard Tailwind variants easily for stroke-dashoffset drawing */}
            <style>{`
              @keyframes draw-line {
                0% { stroke-dashoffset: 100; opacity: 0; }
                10% { opacity: 1; }
                100% { stroke-dashoffset: 0; opacity: 0.5; }
              }
              @keyframes fade-in-up {
                0% { opacity: 0; transform: translateY(10px); }
                100% { opacity: 1; transform: translateY(0); }
              }
            `}</style>
          </motion.div>

          {/* Country Cards (Updated to Light Mode) */}
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
                  {country.isHome && (
                    <span className="text-[10px] bg-brand-ink/5 text-brand-ink px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                      Home
                    </span>
                  )}
                </div>
                <svg
                  className="w-4 h-4 text-slate-400 group-hover:text-brand-ink transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 17L17 7M17 7H7M17 7V17"
                  />
                </svg>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AvailableAcrossBorders;

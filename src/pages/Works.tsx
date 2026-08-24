import { useState } from "react";
import { ExternalLink, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProjects } from "../hooks/useFirebaseData";

// Assets
const foodflowImg = "/assets/images/foodflow.webp";
const eventflow = "/assets/images/eventflow.webp";
const healthpoint = "/assets/images/healthpoint.webp";
const novluma = "/assets/images/novluma.webp";
const raploard = "/assets/images/raploard.webp";
const veravox = "/assets/images/veravox.webp";
const kelvinsGrid = "/assets/images/kelvins-grid.webp";
const canManHero = "/assets/images/canman-hero.webp";
const oxygenHealth = "/assets/images/oxygen-health.webp";
const kudiflow = "/assets/images/kudiflow.webp";
const houseOfAnna = "/assets/images/houseofanna.webp";

export const projects = [
  {
    id: 1,
    title: "KudiFlow: The Offline-First App for Smart Vendors",
    category: "Fintech & Offline-First B2B SaaS",
    description:
      "An offline-first business operating system engineered to digitize retail shops and market vendors. Built with a robust React and Firebase architecture, the platform transitions users from traditional paper ledgers to secure, cloud-backed inventory and debtor management.",
    tech: ["React", "Firebase", "Tailwind CSS", "TypeScript", "Framer Motion", "Zustand"],
    link: "https://kudiflow.vercel.app/",
    image: kudiflow,
  },
  {
    id: 2,
    title: "Oxygen Health Systems: Premium Landing Page",
    category: "Health Tech & Lead Generation",
    description:
      "A high-converting, custom-coded landing page engineered for a US-based health technology brand. Features a premium UI/UX architecture, seamless video integrations, and direct GoHighLevel (CRM) webhook connections.",
    tech: ["React", "Firebase", "Tailwind CSS", "GoHighLevel", "Framer Motion"],
    link: "https://oxygen-health.vercel.app/",
    image: oxygenHealth,
  },
  {
    id: 3,
    title: "House of Anna: Digital Atelier",
    category: "Bespoke Fashion & Luxury Portfolio",
    description:
      "A luxury digital atelier engineered for an elite custom fashion designer. Built with a performant serverless architecture, it features an automated image optimization pipeline and asynchronous multi-step bespoke inquiry models.",
    tech: ["React", "Firebase", "Tailwind CSS", "TypeScript", "Framer Motion", "Resend API"],
    link: "https://house-of-anna.vercel.app/",
    image: houseOfAnna,
  },
  {
    id: 4,
    title: "Novluma AI: Content Orchestration SaaS",
    category: "Generative AI Platform & B2B SaaS",
    description:
      "A production-ready AI content workspace built with React and Google Gemini. Features a custom credit-based consumption model, real-time content generation streams, and a secure serverless architecture.",
    tech: ["React", "Firebase", "Tailwind CSS", "TypeScript", "Framer Motion", "Google Gemini API"],
    link: "https://novluma-saas.vercel.app/",
    image: novluma,
  },
  {
    id: 5,
    title: "VeraVox AI: Automated Reputation Engine",
    category: "Serverless Micro-SaaS & AI Automation",
    description:
      "A production-grade reputation management platform engineered with a serverless architecture. Leverages Google Gemini AI to analyze customer sentiment and generate context-aware, persona-driven responses.",
    tech: ["React", "Firebase", "Tailwind CSS", "TypeScript", "Framer Motion", "Google Gemini API"],
    link: "https://vevavox-ai.vercel.app/",
    image: veravox,
  },
  {
    id: 6,
    title: "Raploard official Website",
    category: "Artist Portfolio & Bookings",
    description:
      "A high-performance artist portfolio designed to showcase music, tour dates, and facilitate bookings. Features a sleek, immersive media player and direct contact integration.",
    tech: ["React", "Firebase", "Tailwind CSS", "TypeScript", "Framer Motion"],
    link: "https://raploard-web.vercel.app/",
    image: raploard,
  },
  {
    id: 7,
    title: "Kelvin's Grid: Serverless Solar Platform",
    category: "Renewable Energy CRM",
    description:
      "A production-grade serverless application for a Nigerian energy infrastructure firm. Engineered a ‘God Mode’ admin dashboard for real-time asset tracking and client management.",
    tech: ["React", "Firebase", "Tailwind CSS", "TypeScript", "Framer Motion"],
    link: "https://kelvins-grid.vercel.app/",
    image: kelvinsGrid,
  },
  {
    id: 8,
    title: "The CanMan: Operations & Recruitment Platform",
    category: "Service Business Management SaaS",
    description:
      "A scalable web platform built for a premier DFW home service provider. Integrated a high-conversion public recruitment portal with a custom internal 'Mission Control' dashboard.",
    tech: ["React", "Firebase", "Tailwind CSS", "TypeScript", "Framer Motion"],
    link: "https://canmancan.com/careers/",
    image: canManHero,
  },
  {
    id: 9,
    title: "EventFlow: Event Booking Platform",
    category: "Advanced React Architecture",
    description:
      "A complete event ticketing platform simulation engineered entirely on the frontend. Features a fully functional booking flow where users can browse events and simulate purchases.",
    tech: ["React", "Tailwind CSS", "TypeScript", "Zustand", "Mock Paystack"],
    link: "https://eventflow-neon.vercel.app/#/",
    image: eventflow,
  },
  {
    id: 10,
    title: "HealthPoint: Hospital Management System",
    category: "Advanced Healthcare UI",
    description:
      "A dual-portal frontend application simulating the complete patient-doctor lifecycle. I engineered distinct interfaces for Patients and Doctors, utilizing complex client-side state management.",
    tech: ["React", "Tailwind CSS", "TypeScript", "Zustand", "Framer Motion"],
    link: "https://healthpoint-hospital.vercel.app/#/",
    image: healthpoint,
  },
  {
    id: 11,
    title: "FoodFlow: Logistics Platform",
    category: "Advanced Frontend & Geospatial UI",
    description:
      "A high-fidelity food delivery ecosystem engineered entirely on the frontend. I built a complete e-commerce lifecycle and a real-time delivery simulation using Leaflet Maps.",
    tech: ["React", "Tailwind CSS", "TypeScript", "Zustand", "Leaflet Maps"],
    link: "https://food-delivery-app-zeta-beige.vercel.app/#/",
    image: foodflowImg,
  },
];

const ProjectAccordionItem = ({ 
  project, 
  index, 
  isActive, 
  onClick 
}: { 
  project: typeof projects[0], 
  index: number, 
  isActive: boolean, 
  onClick: () => void 
}) => {
  // Extract just the main name before the colon for a cleaner accordion header
  const shortTitle = project.title.split(':')[0];

  return (
    <div className="border-b border-neutral-200 overflow-hidden">
      {/* Header Strip */}
      <button 
        onClick={onClick}
        className="w-full flex flex-col md:flex-row md:items-center justify-between py-8 md:py-12 group text-left outline-none"
      >
        <div className="flex items-center gap-6 md:gap-12">
          <span className={`text-xl md:text-2xl font-medium font-mono transition-colors duration-300 ${isActive ? 'text-brand-accent' : 'text-neutral-400 group-hover:text-brand-accent'}`}>
            {String(index).padStart(2, '0')}
          </span>
          <h3 className={`text-4xl md:text-5xl lg:text-7xl font-bold font-display tracking-tight transition-colors duration-300 ${isActive ? 'text-brand-ink' : 'text-neutral-400 group-hover:text-brand-ink/80'}`}>
            {shortTitle}
          </h3>
        </div>
        
        <div className="flex items-center justify-between w-full md:w-auto mt-6 md:mt-0">
          <span className="text-brand-accent text-xs md:text-sm tracking-widest uppercase font-bold md:mr-12">
            {project.category}
          </span>
          
          <div className={`w-12 h-12 shrink-0 rounded-full border flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-brand-accent border-brand-accent text-white' : 'border-neutral-200 bg-neutral-50 group-hover:bg-neutral-100 text-brand-ink'}`}>
             <motion.div animate={{ rotate: isActive ? 135 : 0 }} transition={{ duration: 0.3, ease: "easeOut" }}>
               <Plus size={24} className="currentColor" />
             </motion.div>
          </div>
        </div>
      </button>

      {/* Expandable Content Area */}
      <AnimatePresence initial={false}>
        {isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} // Apple-style smooth ease
          >
            <div className="pb-16 pt-4 flex flex-col">
              
              {/* Massive Cinematic Image */}
              <div className="w-full h-[40vh] md:h-[60vh] rounded-[24px] md:rounded-[32px] overflow-hidden mb-12 relative group cursor-crosshair">
                <motion.img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover object-center origin-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
                <div className="absolute inset-0 bg-brand-ink/10 group-hover:bg-transparent transition-colors duration-500 pointer-events-none" />
              </div>
              
              <div className="flex flex-col xl:flex-row justify-between gap-8 items-start xl:items-end">
                <div className="max-w-4xl">
                  <h4 className="text-2xl md:text-3xl text-brand-ink font-display font-bold mb-6 tracking-tight">
                    {project.title}
                  </h4>
                  <p className="text-neutral-600 text-lg md:text-xl leading-relaxed mb-10 font-medium">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {project.tech.map((t, i) => (
                      <span key={i} className="px-4 py-2 bg-neutral-100 border border-neutral-200 text-neutral-800 text-sm rounded-full font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn inline-flex items-center gap-3 bg-brand-ink text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-neutral-800 transition-colors shrink-0 mt-8 xl:mt-0"
                >
                  Explore Project 
                  <ExternalLink size={20} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                </a>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PROJECTS_PER_PAGE = 10;

const Works = () => {
  const { projects: liveProjects } = useProjects();
  const displayProjects = liveProjects.length > 0 ? liveProjects : projects;
  
  // Keep track of which accordion is open. Default to the first one open.
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(displayProjects.length / PROJECTS_PER_PAGE);

  // Slice projects for the current page
  const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE;
  const paginatedProjects = displayProjects.slice(startIndex, startIndex + PROJECTS_PER_PAGE);

  const handleToggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    setActiveIndex(0); // Open the first accordion on the new page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="bg-white min-h-screen pt-32 pb-32 selection:bg-brand-accent selection:text-white">
      <div className="max-w-[90%] mx-auto">
        
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16 md:mb-24"
        >
          <span className="text-brand-accent font-bold tracking-widest uppercase mb-4 block">
            Portfolio Showcase
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold font-display text-brand-ink tracking-tighter mb-6 leading-none">
            Selected <span className="text-neutral-300 italic">Works</span>
          </h1>
          <p className="text-neutral-500 text-xl md:text-2xl font-medium max-w-3xl mt-8">
            An architectural breakdown of production-grade platforms, immersive interfaces, and scalable applications.
          </p>
        </motion.div>

        {/* Minimalist Expandable Accordion List */}
        <div className="flex flex-col w-full border-t border-neutral-200">
          {paginatedProjects.map((project, index) => (
            <ProjectAccordionItem 
              key={project.id} 
              project={project} 
              index={startIndex + index + 1} 
              isActive={activeIndex === index}
              onClick={() => handleToggle(index)}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-20">
            {/* Previous Button */}
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-5 py-3 rounded-full text-sm font-bold uppercase tracking-widest border border-neutral-200 text-brand-ink hover:bg-neutral-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Prev
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`w-12 h-12 rounded-full text-sm font-bold transition-all duration-300 ${
                  currentPage === page
                    ? "bg-brand-ink text-white scale-110"
                    : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                }`}
              >
                {page}
              </button>
            ))}

            {/* Next Button */}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-5 py-3 rounded-full text-sm font-bold uppercase tracking-widest border border-neutral-200 text-brand-ink hover:bg-neutral-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

      </div>
    </main>
  );
};

export default Works;


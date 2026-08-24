import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import WebGLImageHover from "../components/WebGLImageHover";
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

// Returns alternating, asymmetric heights to create the editorial masonry effect
const getCardStyle = (index: number) => {
  const styles = [
    "h-[500px]", 
    "h-[750px]", 
    "h-[600px]", 
    "h-[400px]", 
    "h-[800px]", 
    "h-[650px]", 
  ];
  return styles[index % styles.length];
};

const ProjectCard = ({ project, index }: { project: typeof projects[0]; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      // break-inside-avoid prevents the card from splitting across CSS columns
      className={`relative w-full overflow-hidden rounded-[24px] group mb-6 md:mb-8 break-inside-avoid bg-slate-100 ${getCardStyle(index)}`}
    >
      {/* Background Image Layer */}
      <div className="absolute inset-0 w-full h-full">
        <WebGLImageHover src={project.image} alt={project.title} />
      </div>

      {/* Hover Overlay - Only appears on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117]/95 via-[#0d1117]/60 to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 ease-out pointer-events-none" />

      {/* Persistent gradient for Mobile readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117]/80 via-transparent to-transparent opacity-100 md:opacity-0 pointer-events-none" />

      {/* Content Layer */}
      <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col justify-end translate-y-0 md:translate-y-8 opacity-100 md:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out z-10">
        <span className="text-brand-accent text-xs md:text-sm font-bold uppercase tracking-widest mb-3 block">
          {project.category}
        </span>
        
        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold font-display text-white mb-4 leading-[1.1] tracking-tight drop-shadow-md">
          {project.title}
        </h3>
        
        <p className="text-white/80 text-sm md:text-base mb-6 line-clamp-3 md:line-clamp-4 drop-shadow-sm">
          {project.description}
        </p>

        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="w-fit flex items-center justify-center gap-2 bg-white text-[#0d1117] px-6 py-3 rounded-full font-bold text-sm hover:scale-105 transition-transform duration-300"
        >
          Explore <ExternalLink size={16} />
        </a>
      </div>
    </motion.div>
  );
};

const Works = () => {
  const { projects: liveProjects } = useProjects();
  
  // Use Firebase data if available, otherwise fallback to local projects
  const displayProjects = liveProjects.length > 0 ? liveProjects : projects;

  return (
    <main className="bg-white min-h-screen pt-32 pb-24 selection:bg-brand-accent selection:text-white">
      <div className="max-w-[95%] mx-auto px-4 md:px-6">
        
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16 md:mb-24 text-center md:text-left pt-8 md:pt-16"
        >
          <h1 className="text-[12vw] lg:text-[10vw] font-bold font-display text-brand-ink tracking-tighter leading-none mb-6">
            SELECTED <br className="hidden md:block"/>
            <span className="text-brand-accent italic pr-4">WORKS</span>
          </h1>
          <p className="text-brand-muted text-lg md:text-2xl font-medium max-w-2xl mt-4 md:mt-8">
            A curated showcase of production-grade architectures, immersive interfaces, and scalable applications.
          </p>
        </motion.div>

        {/* Immersive Asymmetric Masonry Grid using CSS Columns */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 md:gap-8 space-y-6 md:space-y-8 pb-12">
          {displayProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

      </div>
    </main>
  );
};

export default Works;

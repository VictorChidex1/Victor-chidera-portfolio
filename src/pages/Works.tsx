import { useState  } from "react";
import { ExternalLink, Code } from "lucide-react";
import { motion } from "framer-motion";
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

export const projects = [
  {
    id: 1,
    title: "KudiFlow: The Offline-First App for Smart Vendors",
    category: "Fintech & Offline-First B2B SaaS",
    description:
      "An offline-first business operating system engineered to digitize retail shops and market vendors. Built with a robust React and Firebase architecture, the platform transitions users from traditional paper ledgers to secure, cloud-backed inventory and debtor management. Features include a fully automated serverless email onboarding pipeline (Resend), custom-routed Firebase authentication flows, automated WhatsApp reminders, and build-time SEO prerendering for a dynamic in-house content management system.",
    tech: [
      "React",
      "Firebase (Firestore DB/Auth)",
      "Tailwind CSS",
      "TypeScript",
      "Framer Motion",
      "Zustand (State)",
      "Resend API",
      "React Helmet (SEO)",
    ],
    link: "https://kudiflow.vercel.app/",
    image: kudiflow,
  },
  {
    id: 2,
    title: "Oxygen Health Systems: Premium Landing Page",
    category: "Health Tech & Lead Generation",
    description:
      "A high-converting, custom-coded landing page engineered for a US-based health technology brand. Features a premium UI/UX architecture, seamless video integrations, and direct GoHighLevel (CRM) webhook connections to streamline lead generation and pricing requests.",
    tech: [
      "React",
      "Firebase (Hosting)",
      "Tailwind CSS",
      "GoHighLevel (Webhooks)",
      "Framer Motion",
    ],
    link: "https://oxygen-health.vercel.app/",
    image: oxygenHealth,
  },
  {
    id: 3,
    title: "Novluma AI: Content Orchestration SaaS",
    category: "Generative AI Platform & B2B SaaS",
    description:
      "A production-ready AI content workspace built with React and Google Gemini. Features a custom credit-based consumption model, real-time content generation streams, and a secure serverless architecture (Firebase) for managing user authentication and data persistence.",
    tech: [
      "React",
      "Firebase (Firestore DB/Auth)",
      "Tailwind CSS",
      "TypeScript",
      "Framer Motion",
      "Zustand (State)",
      "Google Gemini API (AI)",
      "Vercel (Deployment)",
    ],
    link: "https://novluma-saas.vercel.app/",
    image: novluma,
  },
  {
    id: 4,
    title: "VeraVox AI: Automated Reputation Engine",
    category: "Serverless Micro-SaaS & AI Automation",
    description:
      "A production-grade reputation management platform engineered with a serverless architecture. Leverages Google Gemini AI to analyze customer sentiment and generate context-aware, persona-driven responses. Features an automated workflow engine that detects reputation risks and drafts strategic recovery responses in real-time, eliminating manual intervention for local business owners.",
    tech: [
      "React",
      "Firebase (Firestore DB/Auth)",
      "Tailwind CSS",
      "TypeScript",
      "Framer Motion",
      "Zustand (State)",
      "Google Gemini API (AI)",
      "Vercel (Deployment)",
    ],
    link: "https://vevavox-ai.vercel.app/",
    image: veravox,
  },
  {
    id: 5,
    title: "Raploard official Website",
    category: "Artist Portfolio Website for bookings and contact",
    description:
      "A high-performance artist portfolio designed to showcase music, tour dates, and facilitate bookings. Features a sleek, immersive media player and direct contact integration.",
    tech: [
      "React",
      "Firebase (Firestore DB/Auth)",
      "Tailwind CSS",
      "TypeScript",
      "Framer Motion",
      "Zustand (State)",
      "Vercel (Deployment)",
    ],
    link: "https://raploard-web.vercel.app/",
    image: raploard,
  },
  {
    id: 6,
    title: "Kelvin's Grid: Serverless Solar Utility Platform",
    category: "Renewable Energy CRM & Customer Portal (SaaS)",
    description:
      "A production-grade serverless application for a Nigerian energy infrastructure firm. Engineered a ‘God Mode’ admin dashboard for real-time asset tracking and client management using Firebase. Features a high-performance, physics-based UI (Framer Motion) optimized for mobile Safari with 0ms blocking navigation and render-slicing strategies.",
    tech: [
      "React",
      "Firebase (Firestore DB/Auth)",
      "Tailwind CSS",
      "TypeScript",
      "Framer Motion",
      "Zustand (State)",
      "Vercel (Deployment)",
    ],
    link: "https://kelvins-grid.vercel.app/",
    image: kelvinsGrid,
  },
  {
    id: 7,
    title: "The CanMan: Operations & Recruitment Platform",
    category: "Service Business Management System (SaaS)",
    description:
      "A scalable web platform built for a premier DFW home service provider. Integrated a high-conversion public recruitment portal with a custom internal 'Mission Control' dashboard. Features automated applicant filtering, real-time booking logistics, and a responsive, brand-aligned UI designed to streamline the hiring and scheduling pipeline.",
    tech: [
      "React",
      "Firebase (Firestore/Functions)",
      "Tailwind CSS",
      "TypeScript",
      "React Hook Form",
      "Framer Motion",
      "Vercel",
    ],
    link: "https://canmancan.com/careers/",
    image: canManHero,
  },
  {
    id: 8,
    title: "EventFlow: Event Booking & Management Platform",
    category: "Advanced React Architecture & E-commerce Simulation",
    description:
      "A complete event ticketing platform simulation engineered entirely on the frontend. Features a fully functional booking flow where users can browse events, simulate purchases via a mock Paystack integration, and manage their booked tickets in a personal dashboard. Utilizes advanced client-side state management to persist user data and transaction history without a backend connection.",
    tech: [
      "React",
      "Tailwind CSS",
      "TypeScript",
      "Vercel (Deployment)",
      "Context API (Global State Store)",
      "Zustand (State Management)",
      "Mock Paystack Implementation",
      "Framer Motion (for Smooth Animations)",
    ],
    link: "https://eventflow-neon.vercel.app/#/",
    image: eventflow,
  },
  {
    id: 9,
    title: "HealthPoint: Hospital Management System",
    category: "Advanced Healthcare UI & Workflow Simulation",
    description:
      "A dual-portal frontend application simulating the complete patient-doctor lifecycle. I engineered distinct interfaces for Patients (finding specialists, checking availability, booking slots) and Doctors (admin dashboard for reviewing and accepting requests). The app utilizes complex client-side state management to mock real-time status updates, demonstrating the logic of a production-grade medical platform.",
    tech: [
      "React",
      "Tailwind CSS",
      "TypeScript",
      "Vercel (Deployment)",
      "Context API (Global State Store)",
      "React Router (for Role-Based Routing)",
      "Zustand (State Management)",
      "Framer Motion (for Smooth Animations)",
    ],
    link: "https://healthpoint-hospital.vercel.app/#/",
    image: healthpoint,
  },
  {
    id: 10,
    title: "FoodFlow: Restaurant Management and Delivery Logistics Platform",
    category: "Advanced Frontend Simulation & Geospatial UI",
    description:
      "A high-fidelity food delivery ecosystem engineered entirely on the frontend. I built a complete e-commerce lifecycle: browsing menus, cart management, and a real-time delivery simulation using Leaflet Maps. The application mocks backend latency and GPS coordinates to visualize a delivery rider's path, while simultaneously persisting order history and status updates in a user-specific dashboard.",
    tech: [
      "React",
      "Tailwind CSS",
      "TypeScript",
      "Vercel (Deployment)",
      "Context API (Global State Store)",
      "React Router (for Role-Based Routing)",
      "Zustand (State Management)",
      "Framer Motion (for Smooth Animations)",
      "Leaflet Maps (for Geospatial UI)",
    ],
    link: "https://food-delivery-app-zeta-beige.vercel.app/#/",
    image: foodflowImg,
  },
];

const Works = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProjects = projects.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="py-24 pt-32 bg-brand-dark min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Selected Works
          </h2>
          <div className="w-20 h-1 bg-brand-orange"></div>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-brand-orange/50 transition-all duration-300 hover:-translate-y-2 flex flex-col"
            >
              {/* IMAGE AREA */}
              <div className="h-48 bg-slate-800 relative overflow-hidden group">
                {/* Dark Overlay that disappears on hover */}
                <div className="absolute inset-0 bg-brand-dark/20 group-hover:bg-transparent transition-all duration-300 z-10" />

                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  // Fallback logic if image fails to load
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                    ((e.target as HTMLElement).nextSibling as HTMLElement).style.display = "flex";
                  }}
                />

                {/* Fallback Icon (Hidden unless image fails) */}
                <div className="absolute inset-0 flex items-center justify-center hidden bg-slate-800">
                  <Code
                    className="text-slate-600 group-hover:text-brand-orange transition-colors"
                    size={48}
                  />
                </div>
              </div>

              {/* CONTENT AREA */}
              <div className="p-6 flex-1 flex flex-col">
                <span className="text-brand-orange text-xs font-bold uppercase tracking-wider mb-2 block">
                  {project.category}
                </span>
                <h3 className="text-xl font-bold text-white mb-3">
                  {project.title}
                </h3>
                <p className="text-slate-400 text-sm mb-4 flex-grow">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map((t, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-brand-dark text-slate-300 text-xs rounded border border-slate-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* BUTTON */}
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-white hover:text-brand-orange font-medium transition-colors"
                >
                  View Project <ExternalLink size={16} className="ml-2" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-16 flex justify-center items-center gap-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                currentPage === 1
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                  : "bg-brand-orange text-white hover:bg-orange-600"
              }`}
            >
              Previous
            </button>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-md flex items-center justify-center font-medium transition-colors ${
                      currentPage === pageNum
                        ? "bg-brand-orange text-white"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                currentPage === totalPages
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                  : "bg-brand-orange text-white hover:bg-orange-600"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Works;

import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";

// Fallback static data - contains all 11 projects exactly as in original Works.tsx
export const STATIC_PROJECTS = [
  {
    id: "1",
    order: 1,
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
    image: "/assets/images/kudiflow.webp",
  },
  {
    id: "2",
    order: 2,
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
    image: "/assets/images/oxygen-health.webp",
  },
  {
    id: "3",
    order: 3,
    title: "House of Anna: Digital Atelier & Luxury Fashion Portfolio",
    category: "Bespoke Fashion, High-End Portfolio & Lead Generation",
    description:
      "A luxury digital atelier engineered for an elite custom fashion designer and tailor. Designed to transition a traditional physical brand identity into a highly editorial, premium web experience. Built with a performant, non-Next.js serverless architecture, the platform features an automated image optimization pipeline using Firebase Extensions to serve high-fidelity, fluid layout assets instantly. It includes filterable masonry lookbook grids, asynchronous multi-step bespoke inquiry models, full Firebase administrative controls, and an automated lead routing system powered by the Resend API.",
    tech: [
      "React (Vite)",
      "Firebase (Firestore DB/Auth/Hosting)",
      "Tailwind CSS v4",
      "TypeScript",
      "Framer Motion",
      "Resend API",
      "Vercel (Deployment)",
      "puppeteer",
    ],
    link: "https://house-of-anna.vercel.app/",
    image: "/assets/images/houseofanna.webp",
  },
  {
    id: "4",
    order: 4,
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
    image: "/assets/images/novluma.webp",
  },
  {
    id: "5",
    order: 5,
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
    image: "/assets/images/veravox.webp",
  },
  {
    id: "6",
    order: 6,
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
    image: "/assets/images/raploard.webp",
  },
  {
    id: "7",
    order: 7,
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
    image: "/assets/images/kelvins-grid.webp",
  },
  {
    id: "8",
    order: 8,
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
    image: "/assets/images/canman-hero.webp",
  },
  {
    id: "9",
    order: 9,
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
    image: "/assets/images/eventflow.webp",
  },
  {
    id: "10",
    order: 10,
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
    image: "/assets/images/healthpoint.webp",
  },
  {
    id: "11",
    order: 11,
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
    image: "/assets/images/foodflow.webp",
  },
];

export const STATIC_BLOGS = [
  {
    id: "1",
    title: "Blueprint Before Code: Structuring Data for a Scalable Food Delivery App",
    excerpt: "Why I spent hours designing my JSON structure before writing a single line of React code.",
    date: "Nov 26, 2025",
    readTime: "3 min read",
    link: "https://medium.com/@victor.chidera/blueprint-before-code-structuring-data-for-a-scalable-food-delivery-app-3ae5162f356a",
    image: "/assets/images/blog1.webp",
  },
  {
    id: "2",
    title: "The Art of “It Works on My Machine”",
    excerpt: "Surviving the beautiful chaos of modern web development and environment configs.",
    date: "Nov 27, 2025",
    readTime: "4 min read",
    link: "https://medium.com/@victor.chidera/the-art-of-it-works-on-my-machine-surviving-the-beautiful-chaos-of-modern-web-dev-ecf0795c0316",
    image: "/assets/images/blog2.webp",
  },
  {
    id: "3",
    title: "Building Scalable APIs: How to Prevent Your Server from Crying",
    excerpt: "Best practices for structuring RESTful services in Node.js environments.",
    date: "Nov 28, 2025",
    readTime: "5 min read",
    link: "https://hashnode.com/@yourusername/scalable-apis",
    image: "/assets/images/blog3.webp",
  }
];

// Helper to sort projects client-side
export const sortProjects = (projs: any[]) => {
  return [...projs].sort((a, b) => {
    const orderA = a.order !== undefined && a.order !== "" ? Number(a.order) : 99999;
    const orderB = b.order !== undefined && b.order !== "" ? Number(b.order) : 99999;
    
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    
    // Fallback to createdAt timestamp sorting if order is identical
    const timeA = a.createdAt?.seconds || 0;
    const timeB = b.createdAt?.seconds || 0;
    return timeB - timeA; // newer projects first
  });
};

// Custom Hook to Fetch Dynamic Projects
export const useProjects = () => {
  const [projectsList, setProjectsList] = useState<any[]>(sortProjects(STATIC_PROJECTS));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = collection(db, "projects");
        const querySnapshot = await getDocs(q);
        const fetchedProjects: any[] = [];
        querySnapshot.forEach((doc) => {
          fetchedProjects.push({ id: doc.id, ...doc.data() });
        });
        if (fetchedProjects.length > 0) {
          setProjectsList(sortProjects(fetchedProjects));
        }
      } catch (err) {
        console.warn("Falling back to static projects list. Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return { projects: projectsList, loading };
};

// Custom Hook to Fetch Dynamic Blogs
export const useBlogs = () => {
  const [blogsList, setBlogsList] = useState<any[]>(STATIC_BLOGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const fetchedBlogs: any[] = [];
        querySnapshot.forEach((doc) => {
          fetchedBlogs.push({ id: doc.id, ...doc.data() });
        });
        if (fetchedBlogs.length > 0) {
          setBlogsList(fetchedBlogs);
        }
      } catch (err) {
        console.warn("Falling back to static blogs list. Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return { blogs: blogsList, loading };
};

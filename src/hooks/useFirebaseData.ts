import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";

// Fallback static data
export const STATIC_PROJECTS = [
  {
    id: 1,
    title: "KudiFlow: The Offline-First App for Smart Vendors",
    category: "Fintech & Offline-First B2B SaaS",
    description:
      "An offline-first business operating system engineered to digitize retail shops and market vendors. Built with a robust React and Firebase architecture, the platform transitions users from traditional paper ledgers to secure, cloud-backed inventory and debtor management.",
    tech: ["React", "Firebase (Firestore DB/Auth)", "Tailwind CSS", "TypeScript", "Framer Motion", "Zustand (State)", "Resend API", "React Helmet (SEO)"],
    link: "https://kudiflow.vercel.app/",
    image: "/assets/images/kudiflow.webp",
  },
  {
    id: 2,
    title: "Oxygen Health Systems: Premium Landing Page",
    category: "Health Tech & Lead Generation",
    description:
      "A high-converting, custom-coded landing page engineered for a US-based health technology brand. Features a premium UI/UX architecture, seamless video integrations, and direct GoHighLevel (CRM) webhook connections to streamline lead generation and pricing requests.",
    tech: ["React", "Firebase (Hosting)", "Tailwind CSS", "GoHighLevel (Webhooks)", "Framer Motion"],
    link: "https://oxygen-health.vercel.app/",
    image: "/assets/images/oxygen-health.webp",
  },
  {
    id: 3,
    title: "House of Anna: Digital Atelier & Luxury Fashion Portfolio",
    category: "Bespoke Fashion, High-End Portfolio & Lead Generation",
    description:
      "A luxury digital atelier engineered for an elite custom fashion designer and tailor. Features filterable masonry lookbook grids, asynchronous multi-step bespoke inquiry models, full Firebase administrative controls, and an automated lead routing system powered by the Resend API.",
    tech: ["React (Vite)", "Firebase (Firestore DB/Auth/Hosting)", "Tailwind CSS v4", "TypeScript", "Framer Motion", "Resend API", "Vercel (Deployment)", "puppeteer"],
    link: "https://house-of-anna.vercel.app/",
    image: "/assets/images/houseofanna.webp",
  },
  {
    id: 4,
    title: "Novluma AI: Content Orchestration SaaS",
    category: "Generative AI Platform & B2B SaaS",
    description:
      "A production-ready AI content workspace built with React and Google Gemini. Features a custom credit-based consumption model, real-time content generation streams, and a secure serverless architecture (Firebase) for managing user authentication and data persistence.",
    tech: ["React", "Firebase (Firestore DB/Auth)", "Tailwind CSS", "TypeScript", "Framer Motion", "Zustand (State)", "Google Gemini API (AI)", "Vercel (Deployment)"],
    link: "https://novluma-saas.vercel.app/",
    image: "/assets/images/novluma.webp",
  },
  {
    id: 5,
    title: "VeraVox AI: Automated Reputation Engine",
    category: "Serverless Micro-SaaS & AI Automation",
    description:
      "A production-grade reputation management platform engineered with a serverless architecture. Leverages Google Gemini AI to analyze customer sentiment and generate context-aware, persona-driven responses.",
    tech: ["React", "Firebase (Firestore DB/Auth)", "Tailwind CSS", "TypeScript", "Framer Motion", "Zustand (State)", "Google Gemini API (AI)", "Vercel (Deployment)"],
    link: "https://vevavox-ai.vercel.app/",
    image: "/assets/images/veravox.webp",
  }
];

export const STATIC_BLOGS = [
  {
    id: 1,
    title: "Blueprint Before Code: Structuring Data for a Scalable Food Delivery App",
    excerpt: "Why I spent hours designing my JSON structure before writing a single line of React code.",
    date: "Nov 26, 2025",
    readTime: "3 min read",
    link: "https://medium.com/@victor.chidera/blueprint-before-code-structuring-data-for-a-scalable-food-delivery-app-3ae5162f356a",
    image: "/assets/images/blog1.webp",
  },
  {
    id: 2,
    title: "The Art of “It Works on My Machine”",
    excerpt: "Surviving the beautiful chaos of modern web development and environment configs.",
    date: "Nov 27, 2025",
    readTime: "4 min read",
    link: "https://medium.com/@victor.chidera/the-art-of-it-works-on-my-machine-surviving-the-beautiful-chaos-of-modern-web-dev-ecf0795c0316",
    image: "/assets/images/blog2.webp",
  },
  {
    id: 3,
    title: "Building Scalable APIs: How to Prevent Your Server from Crying",
    excerpt: "Best practices for structuring RESTful services in Node.js environments.",
    date: "Nov 28, 2025",
    readTime: "5 min read",
    link: "https://hashnode.com/@yourusername/scalable-apis",
    image: "/assets/images/blog3.webp",
  }
];

// Custom Hook to Fetch Dynamic Projects
export const useProjects = () => {
  const [projectsList, setProjectsList] = useState<any[]>(STATIC_PROJECTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const fetchedProjects: any[] = [];
        querySnapshot.forEach((doc) => {
          fetchedProjects.push({ id: doc.id, ...doc.data() });
        });
        if (fetchedProjects.length > 0) {
          setProjectsList(fetchedProjects);
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

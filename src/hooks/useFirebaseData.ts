import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  limit,
} from "firebase/firestore";
import { db } from "../firebase";

import servicesFallback from "../data/services.json";
import testimonialsFallback from "../data/testimonials.json";
import projectsFallback from "../data/projects-fallback.json";
import blogPostsFallback from "../data/blog-posts-fallback.json";

const isLive = (doc: any): boolean => {
  const ts = doc.publishedAt;
  if (!ts) return true;
  const seconds = typeof ts === "number" ? ts : ts.seconds;
  return typeof seconds === "number" ? seconds * 1000 <= Date.now() : true;
};

const isPublished = (doc: any) =>
  (doc.status === undefined || doc.status !== "draft") && isLive(doc);

// Generic order-first sort: numeric `order` ascending, then newest first.
export const sortByOrder = (items: any[]) => {
  return [...items].sort((a, b) => {
    const orderA =
      a.order !== undefined && a.order !== "" ? Number(a.order) : 99999;
    const orderB =
      b.order !== undefined && b.order !== "" ? Number(b.order) : 99999;
    if (orderA !== orderB) return orderA - orderB;
    const timeA = a.createdAt?.seconds || 0;
    const timeB = b.createdAt?.seconds || 0;
    return timeB - timeA;
  });
};

// Back-compat alias used by the admin panel.
export const sortProjects = sortByOrder;

function mapDocs(snap: any) {
  return snap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
}

// Custom Hook to Fetch Dynamic Projects (published only).
export const useProjects = () => {
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = collection(db, "projects");
        const snap = await getDocs(q);
        const projects = mapDocs(snap).filter(isPublished);
        setProjectsList(projects.length > 0 ? sortByOrder(projects) : projectsFallback);
      } catch (err) {
        console.warn("Error fetching projects:", err);
        setProjectsList(projectsFallback);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return { projects: projectsList, loading };
};

// Fetch a single project by slug (published only).
export const useProjectBySlug = (slug?: string) => {
  const [project, setProject] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    const fetchProject = async () => {
      try {
        const q = query(collection(db, "projects"), where("slug", "==", slug), limit(1));
        const snap = await getDocs(q);
        const doc = mapDocs(snap)[0];
        setProject(doc && isPublished(doc) ? doc : null);
      } catch (err) {
        console.warn("Error fetching project:", err);
        setProject(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [slug]);

  return { project, loading };
};

// Custom Hook to Fetch Dynamic Blogs (published only).
export const useBlogs = () => {
  const [blogsList, setBlogsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        const blogs = mapDocs(snap)
          .filter(isPublished)
          .sort((a: any, b: any) => {
            const ta = a.publishedAt?.seconds || a.createdAt?.seconds || 0;
            const tb = b.publishedAt?.seconds || b.createdAt?.seconds || 0;
            return tb - ta;
          });
        setBlogsList(blogs.length > 0 ? blogs : blogPostsFallback);
      } catch (err) {
        console.warn("Error fetching blogs:", err);
        setBlogsList(blogPostsFallback);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return { blogs: blogsList, loading };
};

// Fetch a single blog post by slug (published only).
export const useBlogBySlug = (slug?: string) => {
  const [post, setPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    const fetchPost = async () => {
      try {
        const q = query(collection(db, "blogs"), where("slug", "==", slug), limit(1));
        const snap = await getDocs(q);
        const doc = mapDocs(snap)[0];
        setPost(doc && isPublished(doc) ? doc : null);
      } catch (err) {
        console.warn("Error fetching blog post:", err);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  return { post, loading };
};

// Custom Hook to Fetch Dynamic Services (published only, JSON fallback).
export const useServices = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const snap = await getDocs(collection(db, "services"));
        const items = mapDocs(snap).filter(isPublished);
        setServices(items.length > 0 ? sortByOrder(items) : servicesFallback);
      } catch (err) {
        console.warn("Error fetching services:", err);
        setServices(servicesFallback);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return { services, loading };
};

// Custom Hook to Fetch Dynamic Testimonials (published only, JSON fallback).
export const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const snap = await getDocs(collection(db, "testimonials"));
        const items = mapDocs(snap).filter(isPublished);
        setTestimonials(items.length > 0 ? sortByOrder(items) : testimonialsFallback);
      } catch (err) {
        console.warn("Error fetching testimonials:", err);
        setTestimonials(testimonialsFallback);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  return { testimonials, loading };
};

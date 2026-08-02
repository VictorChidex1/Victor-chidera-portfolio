import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";

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
  const [projectsList, setProjectsList] = useState<any[]>([]);
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
        console.warn("Error fetching projects:", err);
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
  const [blogsList, setBlogsList] = useState<any[]>([]);
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
        console.warn("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return { blogs: blogsList, loading };
};

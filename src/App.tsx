import { useEffect, useLayoutEffect, lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Import Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SmoothScroll, { lenisRef } from "./components/SmoothScroll";
import CustomCursor from "./components/CustomCursor";
import PageTransition from "./components/PageTransition";
import WhatsAppButton from "./components/WhatsAppButton";
import ScrollToTop from "./components/ScrollToTop";

import {
  loadHome,
  loadWorks,
  loadCaseStudy,
  loadServices,
  loadTestimonials,
  loadBlog,
  loadBlogPost,
  loadContact,
  loadAdmin,
  loadNotFound,
} from "./lib/lazyRoutes";

const Home = lazy(loadHome);
const Works = lazy(loadWorks);
const CaseStudy = lazy(loadCaseStudy);
const Services = lazy(loadServices);
const Testimonials = lazy(loadTestimonials);
const Blog = lazy(loadBlog);
const BlogPost = lazy(loadBlogPost);
const Contact = lazy(loadContact);
const Admin = lazy(loadAdmin);
const NotFound = lazy(loadNotFound);

const PageLoader = () => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-brand-ink border-t-transparent rounded-full animate-spin" />
  </div>
);

function App() {
  const location = useLocation();

  // Remove the build-time FOUC guard class once React has mounted, so the
  // hydrated app is revealed before paint. (No-op when the class is absent,
  // e.g. local dev or no-JS.)
  useLayoutEffect(() => {
    document.documentElement.classList.remove("prerender");
  }, []);

  // Reset scroll to top instantly whenever the route changes so the
  // newly loaded page always opens from its top, not a mid-page position.
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  const isControlPanel = location.pathname === "/admin";

  return (
    <SmoothScroll>
      <CustomCursor />
      <div className="min-h-screen bg-brand-bg text-brand-ink font-sans flex flex-col relative">
      {/* Navbar stays at the top */}
      {!isControlPanel && <Navbar />}

      {/* Main content grows to fill space */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Suspense fallback={<PageLoader />}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageTransition><Home /></PageTransition>} />
              <Route path="/works" element={<PageTransition><Works /></PageTransition>} />
              <Route path="/works/:slug" element={<PageTransition><CaseStudy /></PageTransition>} />
              <Route path="/services" element={<PageTransition><Services /></PageTransition>} />
              <Route path="/testimonials" element={<PageTransition><Testimonials /></PageTransition>} />
              <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
              <Route path="/blog/:slug" element={<PageTransition><BlogPost /></PageTransition>} />
              <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
              <Route path="/admin" element={<PageTransition><Admin /></PageTransition>} />
              <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </main>

      {/* Footer stays at the bottom */}
      {!isControlPanel && <Footer />}
      </div>
      <WhatsAppButton />
      <ScrollToTop />
    </SmoothScroll>
  );
}

export default App;

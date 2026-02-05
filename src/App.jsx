import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// Import Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import StarBackground from "./components/StarBackground";

// Lazy Import Pages
const Home = React.lazy(() => import("./pages/Home"));
const Works = React.lazy(() => import("./pages/Works"));
const Services = React.lazy(() => import("./pages/Services"));
const Testimonials = React.lazy(() => import("./pages/Testimonials"));
const Blog = React.lazy(() => import("./pages/Blog"));
const Contact = React.lazy(() => import("./pages/Contact"));

function App() {
  return (
    <div className="min-h-screen bg-brand-dark text-slate-200 font-sans flex flex-col relative">
      <StarBackground />
      {/* Navbar stays at the top */}
      <Navbar />

      {/* Main content grows to fill space */}
      <main className="flex-grow">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/works" element={<Works />} />
            <Route path="/services" element={<Services />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Suspense>
      </main>

      {/* Footer stays at the bottom */}
      <Footer />
    </div>
  );
}

export default App;

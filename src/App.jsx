import React from "react";
import { Routes, Route } from "react-router-dom";

// Import Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import StarBackground from "./components/StarBackground";

// Import Pages
import Home from "./pages/Home";
import Works from "./pages/Works";
import Services from "./pages/Services";
import Testimonials from "./pages/Testimonials";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";

function App() {
  return (
    <div className="min-h-screen bg-brand-dark text-slate-200 font-sans flex flex-col relative">
      <StarBackground />
      {/* Navbar stays at the top */}
      <Navbar />

      {/* Main content grows to fill space */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/works" element={<Works />} />
          <Route path="/services" element={<Services />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>

      {/* Footer stays at the bottom */}
      <Footer />
    </div>
  );
}

export default App;

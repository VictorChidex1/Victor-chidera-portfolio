import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Import Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SmoothScroll from "./components/SmoothScroll";
import CustomCursor from "./components/CustomCursor";
import PageTransition from "./components/PageTransition";
import WhatsAppButton from "./components/WhatsAppButton";
import ScrollToTop from "./components/ScrollToTop";
import useDocumentTitle from "./hooks/useDocumentTitle";

// Import Pages
import Home from "./pages/Home";
import Works from "./pages/Works";
import Services from "./pages/Services";
import Testimonials from "./pages/Testimonials";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";

function App() {
  const location = useLocation();
  useDocumentTitle();

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
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/works" element={<PageTransition><Works /></PageTransition>} />
            <Route path="/services" element={<PageTransition><Services /></PageTransition>} />
            <Route path="/testimonials" element={<PageTransition><Testimonials /></PageTransition>} />
            <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
            <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
            <Route path="/admin" element={<PageTransition><Admin /></PageTransition>} />
          </Routes>
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

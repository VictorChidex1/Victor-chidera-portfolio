import Hero from "../components/Hero";
import About from "../components/About";
import FeaturedProjects from "../components/FeaturedProjects";
import Benefits from "../components/Benefits";
import Process from "../components/Process";
import Services from "../components/Services";
import Testimonials from "../components/Testimonials";
import CallToAction from "../components/CallToAction";
import WhatsAppButton from "../components/WhatsAppButton";
import ScrollToTop from "../components/ScrollToTop";
import FAQ from "../components/FAQ";

const Home = () => {
  return (
    <main className="overflow-hidden">
      <Hero />
      <About />
      <Benefits />
      <Process />
      <FeaturedProjects />
      <Services />
      <Testimonials />
      <FAQ />
      <CallToAction />
      <WhatsAppButton />
      <ScrollToTop />
    </main>
  );
};

export default Home;

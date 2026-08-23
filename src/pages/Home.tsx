import Hero from "../components/Hero";
import About from "../components/About";
import FeaturedProjects from "../components/FeaturedProjects";
import Benefits from "../components/Benefits";
import AvailableAcrossBorders from "../components/AvailableAcrossBorders";
import Process from "../components/Process";
import Services from "../components/Services";
import Testimonials from "../components/Testimonials";
import CallToAction from "../components/CallToAction";
import FAQ from "../components/FAQ";

const Home = () => {
  return (
    <main className="overflow-hidden">
      <Hero />
      <About />
      <Benefits />
      <AvailableAcrossBorders />
      <Process />
      <FeaturedProjects />
      <Services />
      <Testimonials />
      <FAQ />
      <CallToAction />
    </main>
  );
};

export default Home;

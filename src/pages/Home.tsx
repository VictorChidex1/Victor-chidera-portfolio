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
import RouteSeo from "../components/seo/RouteSeo";
import { personSchema, websiteSchema, faqSchema } from "../seo/schemas";
import faqs from "../data/faqs.json";

const Home = () => {
  return (
    <main className="overflow-hidden">
      <RouteSeo
        path="/"
        jsonLd={[personSchema(), websiteSchema(), faqSchema(faqs)]}
      />
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

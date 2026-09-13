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
import { personSchema, websiteSchema, faqSchema, organizationSchema } from "../seo/schemas";
import { useSiteSettings } from "../hooks/useFirebaseData";
import faqs from "../data/faqs.json";

const Home = () => {
  const { settings } = useSiteSettings();
  return (
    <main className="overflow-hidden">
      <RouteSeo
        path="/"
        jsonLd={[
          personSchema({
            name: settings?.name,
            jobTitle: settings?.editorialTitle,
            image: settings?.avatar,
          }),
          websiteSchema(),
          organizationSchema(),
          faqSchema(faqs),
        ]}
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

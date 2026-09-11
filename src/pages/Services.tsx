import ServicesComponent from "../components/Services";
import CallToAction from "../components/CallToAction";
import ScrollToTop from "../components/ScrollToTop";
import RouteSeo from "../components/seo/RouteSeo";
import { collectionPageSchema } from "../seo/schemas";
import services from "../data/services.json";

const Services = () => {
  return (
    <>
      <ScrollToTop />
      <RouteSeo
        path="/services"
        jsonLd={[
          collectionPageSchema(
            "Services",
            "/services",
            "Professional web development, performance optimization, and scalable serverless architecture services.",
            services.map((s) => ({ name: s.title, url: "/services" }))
          ),
        ]}
      />
      <div className="pt-20">
        <ServicesComponent />
        <CallToAction />
      </div>
    </>
  );
};

export default Services;

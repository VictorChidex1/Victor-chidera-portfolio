import TestimonialsComponent from "../components/Testimonials";
import CallToAction from "../components/CallToAction";
import ScrollToTop from "../components/ScrollToTop";
import RouteSeo from "../components/seo/RouteSeo";
import { collectionPageSchema } from "../seo/schemas";

const Testimonials = () => {
  return (
    <>
      <ScrollToTop />
      <RouteSeo
        path="/testimonials"
        jsonLd={[
          collectionPageSchema(
            "Testimonials",
            "/testimonials",
            "See what clients and partners say about Victor Chidera's software engineering and development process."
          ),
        ]}
      />
      <div className="pt-20">
        <TestimonialsComponent />
        <CallToAction />
      </div>
    </>
  );
};

export default Testimonials;

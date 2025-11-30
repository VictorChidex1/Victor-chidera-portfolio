import React from "react";
import TestimonialsComponent from "../components/Testimonials";
import CallToAction from "../components/CallToAction";
import ScrollToTop from "../components/ScrollToTop";

const Testimonials = () => {
  return (
    <>
      <ScrollToTop />
      <div className="pt-20">
        <TestimonialsComponent />
        <CallToAction />
      </div>
    </>
  );
};

export default Testimonials;

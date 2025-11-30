import React from "react";
import ServicesComponent from "../components/Services";
import CallToAction from "../components/CallToAction";
import ScrollToTop from "../components/ScrollToTop";

const Services = () => {
  return (
    <>
      <ScrollToTop />
      <div className="pt-20">
        <ServicesComponent />
        <CallToAction />
      </div>
    </>
  );
};

export default Services;

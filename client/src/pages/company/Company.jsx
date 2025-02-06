import React from "react";
import Introabout from "../../components/company/intro/Introabout";
import Metrics from "../../components/company/metrics/Metrics";
import Testimonial from "../../components/company/testimonial/Testimonial";
import Whatwedo from "../../components/company/whatwedo/Whatwedo";
import Vision from "../../components/company/vision/Vision";
import Story from "../../components/company/story/Story";
import Values from "../../components/company/values/Values";
import Leadership from "../../components/company/leadership/Leadership";

function Company() {
  return (
    <main className="company__section">
      <Introabout />
      <Metrics />
      <Testimonial />
      <Whatwedo />
      <Vision />
      <Story />
      <Values />
      <Leadership />
    </main>
  );
}

export default Company;

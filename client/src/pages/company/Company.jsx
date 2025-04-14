import React from "react";
import { Helmet } from "react-helmet-async";
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
    <>
      <Helmet>
        <title>About Us | Estate Syndicates</title>
        <meta
          name="description"
          content="Learn about Estate Syndicates: our mission, vision, values, and the passionate team driving our real estate investment platform."
        />
        <meta
          name="keywords"
          content="About Estate Syndicates, Real Estate, Vision, Company Story, Leadership, Investments"
        />
        <meta name="author" content="Estate Syndicates Team" />

        {/* Open Graph Tags */}
        <meta property="og:title" content="About Us | Estate Syndicates" />
        <meta
          property="og:description"
          content="Discover who we are, what we do, and why investors trust Estate Syndicates for property investments in Nigeria."
        />
        <meta
          property="og:image"
          content="https://www.estatesindicates.com/assets/og-cover.jpg"
        />
        <meta
          property="og:url"
          content="https://www.estatesindicates.com/company"
        />
        <meta property="og:type" content="website" />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Us | Estate Syndicates" />
        <meta
          name="twitter:description"
          content="Explore our mission and the story behind Estate Syndicates."
        />
        <meta
          name="twitter:image"
          content="https://www.estatesindicates.com/assets/og-cover.jpg"
        />
      </Helmet>

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
    </>
  );
}

export default Company;

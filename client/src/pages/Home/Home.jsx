import React from "react";
import { Helmet } from "react-helmet-async";
import Hero from "../../components/hero/Hero";
import Homeintro from "../../components/homeIntro/Homeintro";
import Homechoose from "../../components/homeChoose/Homechoose";
import Homeprojects from "../../components/homeProjects/Homeprojects";
import Homebenefits from "../../components/homeBenefits/Homebenefits";
import Investorsreview from "../../components/investorreview/Investorsreview";
import Homefirststep from "../../components/homefistStep/HomefirstStep";
import Homeprocess from "../../components/homeprocess/Homeprocess";

function Home() {
  return (
    <>
      <Helmet>
        <title>Estate Syndicates | Invest in Properties That Pay You</title>
        <meta
          name="description"
          content="Discover affordable property investment opportunities with Estate Syndicates. Earn ROI, explore projects, and join hundreds of smart investors."
        />
        <meta
          name="keywords"
          content="real estate, property, investment, ROI, estate syndicates"
        />
        <meta name="author" content="Estate Syndicates Team" />
        <link rel="canonical" href="https://www.estatesindicates.com/" />
      </Helmet>
      <main className="home__container !text-white w-full bg-black-900">
        <div className="home__wrapper w-10/12 mx-auto">
          {/* hero section starts here */}
          <div className="hero__section">
            <Hero />
          </div>
          {/* hero section ends here */}
          {/* Home intro starts here  */}
          <Homeintro />
          {/* Home Intro ends here */}
          {/* Home Why Choose us Starts Here */}
          <Homechoose />
          {/* Home Why Choose us ends here */}
          {/* Home Projects Starts Here */}
          <Homeprojects />
          {/* Home Projects Ends Here */}
          {/* Home benfits starts Here */}
          {/* Home - How it works Starts Here */}
          <Homeprocess />
          {/* Home - How it works ends Here */}
          <Homebenefits />
          {/* Home benefits ends here */}
          {/* Home Investors Review Starts Here */}
          <Investorsreview />
          {/* Home Investors Review Ends Here */}
          {/* Home first Step start here */}
          <Homefirststep />
          {/* Home first step ends here */}
        </div>
      </main>
    </>
  );
}

export default Home;

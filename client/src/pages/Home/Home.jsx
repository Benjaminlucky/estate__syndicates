import React from "react";
import Hero from "../../components/hero/Hero";
import Homeintro from "../../components/homeIntro/Homeintro";
import Homechoose from "../../components/homeChoose/Homechoose";
import Homeprojects from "../../components/homeProjects/Homeprojects";
import Homebenefits from "../../components/homeBenefits/Homebenefits";
import Investorsreview from "../../components/investorreview/Investorsreview";
import Homefirststep from "../../components/homefistStep/HomefirstStep";

function Home() {
  return (
    <main className="home__container !text-white w-full">
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
  );
}

export default Home;

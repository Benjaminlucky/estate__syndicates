import React from "react";
import Hero from "../../components/hero/Hero";

function Home() {
  return (
    <main className="home__container !text-white w-full">
      <div className="home__wrapper w-10/12 mx-auto">
        {/* hero section starts here */}
        <div className="hero__section">
          <Hero />
        </div>
        {/* hero section ends here */}
      </div>
    </main>
  );
}

export default Home;

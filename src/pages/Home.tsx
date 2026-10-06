import Hero from "../components/Hero"
import Programs from "../components/Programs"
import AlumniSection from "../components/Stories"
// import Feedback from "../components/feedback"
import Welcone from "../components/WelcomeSection"
import PartnersSection from "../components/PartnersSection"
import { LandingProvider } from "../content/LandingContext"
// import BlogSection from "../components/Blog"

export const Home = () => {
  return (
    <LandingProvider>
      <Hero />
      <Welcone />
      <Programs />
      <PartnersSection />
      <AlumniSection />
      {/* <Feedback /> */}
      {/* <BlogSection /> */}
    </LandingProvider>
  );
};


export default Home;
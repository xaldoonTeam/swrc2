import Hero from "../components/Hero"
import Programs from "../components/Programs"
import AlumniSection from "../components/Stories"
import Feedback from "../components/feedback"
import Welcone from "../components/WelcomeSection"
import PartnersSection from "../components/PartnersSection"
import BlogSection from "../components/Blog"

export const Home = () => {
  return (
    <>
      <Hero />
      <Welcone />
      <Programs />
      <PartnersSection />
      <AlumniSection />
      {/* <Feedback /> */}
      {/* <BlogSection /> */}
    </>
  );
};


export default Home;
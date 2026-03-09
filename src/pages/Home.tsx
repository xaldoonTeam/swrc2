import Hero from "../components/Hero"
import Services from "../components/Programs"
import AlumniSection from "../components/Stories"
import Feedback from "../components/feedback"   
import Welcone from "../components/WelcomeSection"


export const Home = () => {
  return (
    <>
      <Hero /> 
      <Welcone />
      <Services />
      <AlumniSection />
      <Feedback />
    </>
  );
};


export default Home;
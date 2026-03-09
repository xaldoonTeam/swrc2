import { Outlet } from 'react-router-dom';
import Navbar from './nav';
import Footer from './Footer';

const MainLayout = () => {
  return (
    <>
      <Navbar /> 
      <Outlet /> 
      <Footer />
    </>
  );
};

export default MainLayout;
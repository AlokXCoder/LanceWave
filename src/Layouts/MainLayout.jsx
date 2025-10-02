import React from 'react';
import { Outlet, useLocation } from 'react-router';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MainLayout = () => {
  const location = useLocation();

  // Dashboard route এ Header/Footer hide করবো
  const isDashboardRoute = location.pathname.startsWith('/dashboard');

  return (
    <>
      {!isDashboardRoute && <Header />}
      
      <div className={!isDashboardRoute ? "pt-20" : ""}>
        <Outlet />
      </div>
      
      {!isDashboardRoute && <Footer />}
    </>
  );
};

export default MainLayout;

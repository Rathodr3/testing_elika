
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import ProtectedAdmin from '@/components/ProtectedAdmin';

const Admin = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24">
        <ProtectedAdmin />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Admin;

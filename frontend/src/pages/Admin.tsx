
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import AdminDashboard from '@/components/AdminDashboard';

const Admin = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24">
        <AdminDashboard />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Admin;

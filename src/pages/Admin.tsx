
import React from 'react';
import ProtectedAdmin from '@/components/ProtectedAdmin';

const Admin = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ProtectedAdmin />
    </div>
  );
};

export default Admin;

import React from 'react';
import { Navigate } from 'react-router-dom';
import useCheckAdmin from '../components/useCheckAdmin';

const Home = () => {
  const { isAdmin } = useCheckAdmin();
  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace={true} />
  }
  else return <Navigate to="/products" replace={true} />
};

export default Home; 
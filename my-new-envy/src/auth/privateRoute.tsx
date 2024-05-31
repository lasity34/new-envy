import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface PrivateRouteProps {
  element: React.ReactElement;
  path: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  return token ? (
    element
  ) : (
    <Navigate to="/login" state={{ from: location }} />
  );
};

export default PrivateRoute;

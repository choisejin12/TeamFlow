import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

function ProtectedRoute({ children }) {
  const { isAuth} = useSelector(state => state.user);

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
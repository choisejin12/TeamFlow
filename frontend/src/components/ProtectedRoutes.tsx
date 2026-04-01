import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../store/hook';

function ProtectedRoute() {
  const { isAuth } = useAppSelector(state => state.user);

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
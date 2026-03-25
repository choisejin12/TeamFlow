import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function AdminRoute({ children }) {
  const { user, isAuth } = useSelector(state => state.user);

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  if (user?.platformRole !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default AdminRoute;
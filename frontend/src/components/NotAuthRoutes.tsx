import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../store/hook';

function NotAuthRoute() {
  const { isAuth } = useAppSelector(state => state.user);

  // 🔥 로그인 되어 있으면 접근 막기
  if (isAuth) {
    return <Navigate to="/dashboard" replace />;
  }

  // 🔥 로그인 안 된 사람만 통과
  return <Outlet />;
}

export default NotAuthRoute;
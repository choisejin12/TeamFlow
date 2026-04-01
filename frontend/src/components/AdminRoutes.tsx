import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../store/hook'
import { toast } from 'react-toastify';

function AdminRoute() {
  const { userData, isAuth } = useAppSelector(state => state.user);

  // ❌ 로그인 안됨
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  // ❌ 관리자 아님
  if (userData?.platformRole !== 'ADMIN') {
    toast.error("관리자만 접근 가능합니다.", {
      toastId: "admin-error",
    });

    return <Navigate to="/dashboard" replace />;
  }

  // ✅ 정상 접근
  return <Outlet />;
}

export default AdminRoute;
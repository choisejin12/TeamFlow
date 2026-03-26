import { useSelector } from 'react-redux';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

function AdminRoute() {
  const { userData, isAuth } = useSelector(state => state.user);
  const navigate = useNavigate();
  console.log(userData)
  useEffect(() => {
    if (isAuth && userData?.platformRole !== 'ADMIN') {
      toast.error("관리자만 접근 가능합니다.", {
      toastId: "admin-error",
    });
      navigate("/dashboard", { replace: true });
    }
  }, [isAuth, userData, navigate]);

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  if (userData?.platformRole !== 'ADMIN') {
    return null; // 🔥 navigate가 이미 실행되니까 렌더 안함
  }

  return <Outlet />;
}

export default AdminRoute;
import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react'
import Login from './pages/LoginPage';
import Register from './pages/RagisterPage';
import { useDispatch } from 'react-redux'
import {authUser} from './store/thunkFunctions';
import ProtectedRoute from './components/ProtectedRoutes';
import NotAuthRoute from './components/NotAuthRoutes';
import AdminRoute from './components/AdminRoutes';
import Admin from './pages/AdminPage';
import Join from './pages/JoinPage';
import Team from './pages/TeamPage';
import Dashboard from './pages/DashboardPage';

function App() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(authUser());
    }
  }, []);



  return (
    <Routes>
      <Route path="/" element={<Dashboard />} /> {/*홈화면*/}
      
      {/* 🔥 로그아웃 전용 */}
      <Route element={<NotAuthRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* 🔥 로그인 필요 */}
      <Route element={<ProtectedRoute />}>
        <Route path="/teams/:teamId" element={<Team />} /> {/*팀 페이지*/}
        <Route path="/invite/join" element={<Join />} /> {/* 초대코드 입력페이지 */}
      </Route>

      {/* 🔥 관리자 */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<Admin />} />
      </Route>

    </Routes>
  );
}

export default App;
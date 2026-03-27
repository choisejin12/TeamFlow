import './App.css'
import { Outlet, Routes, Route } from 'react-router-dom';
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
import {ToastContainer} from 'react-toastify';
import Dashboard from './pages/DashboardPage';
import NavBar from './layout';
import Home from './pages/HomePage';
import DetailTeamPage from './pages/DetailTeamPage';


function App() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(authUser());
    }
  }, []);



  return (
    <>
      <ToastContainer position='bottom-right' thema='light' pauseOnHover autoClose={2000}/>
      <Routes>
        {/* 홈 (Navbar 없음) */}
        <Route path='/' element={<Home />} />

        {/* 로그인 X 전용 */}
        <Route element={<NotAuthRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Route>

        {/* Layout 사용하는 영역 */}
        <Route element={<NavBar />}>
          {/* 로그인 필요 */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/teams" element={<Team />} />
            <Route path="/teams/:teamId" element={<DetailTeamPage />} />
            <Route path="/invite/join" element={<Join />} />
          </Route>

          {/* 관리자 */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;


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


function Layout() {
  return(

    <div className='flex flex-col h-screen justify-between'>
      <NavBar/>
      <main className='mb-auto w-10/12 max-w-4xl mx-auto'> {/*해당 css는 공식처럼 사용함 메인페이지기준*/}
        <Outlet/> {/*페이지 내용 바뀌는 자리에 Outlet 사용*/}
      </main>
    </div>

  )
}
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
      <ToastContainer position='bottom-right' thema='light' pauseOnHover autoClose={1500}/>
      <Routes>
        {/* 홈 (Navbar 없음) */}
        <Route path='/' element={<Home />} />

        {/* 로그인 X 전용 */}
        <Route Route element={<NotAuthRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Route>

        {/* Layout 사용하는 영역 */}
        <Route element={<Layout />}>
          {/* 로그인 필요 */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/teams" element={<Team />} />
            <Route path="/teams/:teamId" element={<Team />} />
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


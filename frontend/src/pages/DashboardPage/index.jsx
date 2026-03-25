import { useDispatch } from 'react-redux';
import { logout } from '../../store/userSlice';
import { useNavigate , Link} from 'react-router-dom';

const DashboardPage = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };


  return (
    <div>
      대쉬보드
      <Link to='/login'>로그인</Link>
      <Link to='/register'>회원가입</Link>
      <button onClick={handleLogout}>
        로그아웃
      </button>

    </div>
  )
}

export default DashboardPage

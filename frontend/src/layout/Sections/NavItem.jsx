import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/userSlice';

const menus = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Teams', path: '/teams' },
    { name: 'Calendar', path: '/calendar' },
    { name: 'Setting', path: '/admin' },
];

function NavItems({ onClose }) {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="flex h-full flex-col justify-between">
      
      {/* 상단 유저 */}
      <div>
        <div className="mb-6">
          <h2 className="text-lg font-bold">
            {userData?.name}님, 반가워요!
          </h2>

          <div className="mt-4 flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-green-300" />
            <div className="text-sm text-gray-500">
              {userData?.email}
            </div>
          </div>
        </div>

        {/* 메뉴 */}
        <nav className="flex flex-col gap-2">
          {menus.map((menu) => (
            <NavLink
              key={menu.path}
              to={menu.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition
                ${
                  isActive
                    ? 'bg-green-200 text-black'
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              {menu.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* 로그아웃 */}
      <button
        onClick={handleLogout}
        className="mt-6 text-left text-sm text-green-700 hover:underline"
      >
        Logout
      </button>
    </div>
  );
}

export default NavItems;
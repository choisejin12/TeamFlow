import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/userSlice';
import { FaHome } from "react-icons/fa";
import { FaCalendarCheck } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import { GrTask } from "react-icons/gr";
import { MdSpaceDashboard } from "react-icons/md";
import { FaSignOutAlt } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";

const menus = [
    { name: 'Home', path: '/' ,icon: <FaHome size={40}/> },
    { name: 'Dashboard', path: '/dashboard',icon: <MdSpaceDashboard size={40}/> },
    { name: 'Teams', path: '/teams',icon: <GrTask size={40}/> },
    { name: 'Calendar', path: '/calendar',icon: <FaCalendarCheck size={40}/> },
    { name: 'Setting', path: '/admin' ,icon: <IoSettingsSharp size={40}/>  },
];

function NavItems({ className = "", onClose }) {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className={`flex h-full flex-col justify-between ${className}`}>
      <div>
        {/* 상단 유저 */}
        <div className='border-b md:border-b-0 border-[#C5C5C5] pb-4 md:p-0'>
          <div className="mt-4 flex items-center gap-3">
            <FaUserCircle size={60}/>
            <div>
              <h2 className="text-lg font-bold">
                {userData?.name}님, 반가워요!
              </h2>
              <div className="text-sm text-gray-500">
                {userData?.email}
              </div>
            </div>

          </div>

        </div>

        {/* 메뉴 */}
        <nav className="flex flex-col gap-4 md:mt-10 mt-5 font-normal">
          {menus.map((menu) => (
            <NavLink
              key={menu.path}
              to={menu.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-xl font-medium transition rounded-l-2xl md:w-[calc(100%+24px)] md:-mr-6 -mr-2
                ${
                  isActive
                    ? 'drop-shadow-[-1px_5px_2px_rgba(129,158,122,0.2)] bg-white text-black '
                    : 'text-[#819E7A]'
                }`
              }
            >
              {menu.icon}
              {menu.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* 로그아웃 */}
      <div className='flex text-green-700'>
        <FaSignOutAlt/>
        <button
          onClick={handleLogout}
          className="ml-2 text-left text-sm  hover:underline"
        >Logout
        </button>
      </div>

    </div>
  );
}

export default NavItems;
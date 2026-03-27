import { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import { useNavigate } from 'react-router-dom';
import MyCalendar from '../../components/Calendar';
import { FaCheckCircle } from "react-icons/fa";
import { FaRegCheckCircle } from "react-icons/fa";
import { MdAccessTime } from "react-icons/md";
import NoticeSlider from '../../components/NoticeSlider';

function Dashboard() {
  const navigate = useNavigate();

  const [teams, setTeams] = useState([]);
  const [notice, setNotice] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    done: 0,
    progress: 0,
    todo: 0,
  });

  const colors = [
  'bg-[#A3BEE9] ',
  'bg-[#ECB2AF] ',
  'bg-[#DCC9A2] ',
  'bg-[#C894FF]',
  'bg-[#FF94A3] ',
  'bg-[#E6AD0D] '
  ];

  const getColor = (str = '') => {
    if (!str) return 'bg-gray-200';
    
    let sum = 0;
    for (let i = 0; i < str.length; i++) {
      sum += str.charCodeAt(i);
    }
    
    return colors[sum % colors.length];
  };

  // 🔥 데이터 가져오기
  useEffect(() => {
    fetchTeams();
    fetchNotice();
    fetchStats();
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await axios.get('/teams');
      setTeams(res.data.teams);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNotice = async () => {
    try {
      const res = await axios.get('/admin/notices');
      setNotice(res.data.notices); 
    } catch (err) {
      console.log("에러:", err)
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get('/tasks/stats');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">

      {/* 🔥 공지 */}
      <div className="flex items-center gap-3 rounded-xl bg-[#FEF7E9] px-5 py-3 text-sm h-16">
        <span>📢</span>
        <span className="font-medium text-[#D94100]">금주의 공지사항</span>
          <NoticeSlider notice={notice} />
      </div>

      {/* 🔥 내 팀 목록 */}
      <div className="rounded-2xl bg-gray-100 p-6">
  
    {/* 헤더 */}
    <div className="mb-5 flex items-center justify-between">
      <h2 className="text-lg font-bold">내 팀 목록</h2>

      <div className="flex gap-2">
        <button
          onClick={() => navigate('/invite/join')}
          className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm hover:bg-gray-50"
        >
          + 팀 가입하기
        </button>

        <button
          onClick={() => navigate('/teams')}
          className="rounded-md bg-[#819E7A] px-3 py-1 text-sm text-white hover:opacity-90"
        >
          + 팀 생성하기
        </button>
      </div>
    </div>

    {/* 팀 리스트 */}
    <div className="space-y-3">
      {teams.map((team) => (
        <div
          key={team._id}
          className="flex items-center justify-between bg-white px-5 py-4 transition mb-0 first:rounded-t-2xl last:rounded-b-2xl border-t border-l border-r last:border-b border-[#BCCBB8] " 
        >
          {/* 왼쪽 */}
          <div className="flex items-center gap-4">
            
            {/* 아이콘 */}
            <div className={`flex h-11 w-11 items-center justify-center rounded-full ${getColor(team.teamId)} text-lg font-bold text-white`}>
              {team.name[0]}
            </div>

            {/* 텍스트 */}
            <div>
              <p className="font-semibold">{team.name}</p>
              <p className="text-sm text-gray-500">
                {team.description}
              </p>
            </div>
          </div>

          {/* 오른쪽 */}
          <div className="flex items-center gap-3 shrink-0">
            
            {/* 역할 */}
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium w-18   ${
                team.role === 'OWNER'
                  ? 'bg-[#819E7A] text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {team.role || 'MEMBER'}
            </span>

            {/* 버튼 */}
            <button
              onClick={() => navigate(`/teams/${team._id}`)}
              className="shrink-0 w-72 h-10 rounded-full border border-gray-300 px-4 py-1 text-sm bg-[#F8F8F8] hover:bg-[#819E7A] hover:text-white text-[#819E7A] font-semibold "
            >
              팀 들어가기 →
            </button>
          </div>
        </div>
        ))}
      </div>
      </div>

        {/* 🔥 캘린더 + 할일 */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          
          {/* 캘린더 (임시) */}
          <div className="rounded-xl bg-gray-50 p-5">
            <MyCalendar/>
          </div>

          {/* 오늘 할일 */}
          <div className="space-y-2 rounded-xl bg-gray-50 p-7">

            <div className="flex items-center rounded-full border-2 border-[#7A9276] bg-white h-16 pr-4 overflow-hidden mb-8">
              {/* 왼쪽 날짜 */}
              <div className="flex h-16 w-25 items-center justify-center rounded-full border-r-2 border-[#7A9276] bg-[#C9D6C5] text-3xl font-semibold text-[#5E775A]">
                24
              </div>
              {/* 오른쪽 내용 */}
              <div className="ml-4">
                <p className="text-lg font-semibold text-[#5E775A]">
                  웹디자인 완성하기
                </p>
                <p className="text-sm text-[#5E775A] opacity-80">
                  18:00
                </p>
              </div>
            </div>

            <div className="flex items-center rounded-full border-2 border-[#7A9276] bg-white h-16 pr-4 overflow-hidden mb-8">
              {/* 왼쪽 날짜 */}
              <div className="flex h-16 w-25 items-center justify-center rounded-full border-r-2 border-[#7A9276] bg-[#C9D6C5] text-3xl font-semibold text-[#5E775A]">
                24
              </div>
              {/* 오른쪽 내용 */}
              <div className="ml-4">
                <p className="text-lg font-semibold text-[#5E775A]">
                  웹디자인 완성하기
                </p>
                <p className="text-sm text-[#5E775A] opacity-80">
                  18:00
                </p>
              </div>
            </div>


            <div className="flex items-center rounded-full border-2 border-[#7A9276] bg-white h-16 pr-4 overflow-hidden">
              {/* 왼쪽 날짜 */}
              <div className="flex h-16 w-25 items-center justify-center rounded-full border-r-2 border-[#7A9276] bg-[#C9D6C5] text-3xl font-semibold text-[#5E775A]">
                24
              </div>
              {/* 오른쪽 내용 */}
              <div className="ml-4">
                <p className="text-lg font-semibold text-[#5E775A]">
                  웹디자인 완성하기
                </p>
                <p className="text-sm text-[#5E775A] opacity-80">
                  18:00
                </p>
              </div>
            </div> 

          </div>
        </div>

        {/* 🔥 통계 */}
        <div className="rounded-xl bg-gray-50 p-5">
          <h3 className="mb-3 text-lg font-bold">
            세진님의 할일 통계
          </h3>

          <div className="flex flex-wrap gap-6 text-sm">
            <div className='text-2xl font-bold'>  총 {stats.total}개</div>
            <div className='flex justify-between text-[#819E7A] text-xl'> <FaCheckCircle className="mr-3" size={30}/>완료 {stats.done}개</div>
            <div className='flex justify-between text-[#819E7A] text-xl'> <FaRegCheckCircle className="mr-3" size={30}/>진행중 {stats.progress}개</div>
            <div className='flex justify-between text-[#819E7A] text-xl'> <MdAccessTime className="mr-3" size={30}/>대기중 {stats.todo}개</div>
          </div>
        </div>

    </div>
  );
}

export default Dashboard;
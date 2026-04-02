import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MyCalendar from '../../components/Calendar';
import { FaCheckCircle } from "react-icons/fa";
import { FaRegCheckCircle } from "react-icons/fa";
import { MdAccessTime } from "react-icons/md";
import NoticeSlider from '../../components/NoticeSlider';
import TeamCreateModal  from '../../components/TeamCreateModal';
import TeamList from '../../components/TeamList';
import {toast} from 'react-toastify';

import { useTeams, useCreateTeam } from '../../hooks/useTeam';
import { useNotice } from '../../hooks/useNotice';
import { useStats, useMyTasks } from '../../hooks/useTask';

function Dashboard() {
  const navigate = useNavigate();

  const [open, setOpen] = useState<boolean>(false);
  const [showTeamList, setShowTeamList] = useState<boolean>(true);

  // ✅ React Query
  const { data: teams = [], isLoading: teamLoading } = useTeams();
  const { data: notice = [], isLoading: noticeLoading } = useNotice();
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: task = [], isLoading: taskLoading } = useMyTasks();

  const createTeamMutation = useCreateTeam({
    onSuccess: () => {
      toast.success('팀 생성 완료 🎉');
      setOpen(false); 
    },
    onError: () => {
      toast.error('팀 생성 실패 ❌');
    }
  });

  return (
    <div className="space-y-4 md:space-y-6 px-4 sm:px-6 md:px-0 max-w-md mx-auto md:max-w-full">
      {/* 🔥 공지 */}
      <div className="flex items-center gap-2 md:gap-3 rounded-xl bg-[#FEF7E9] px-3 md:px-5 py-2 md:py-3 text-xs md:text-sm h-12 md:h-16 overflow-hidden">
        <span className="shrink-0">📢</span>
        <span className="font-medium text-[#D94100] shrink-0 whitespace-nowrap">금주의 공지사항</span>
        <div className='flex-1 min-w-0 truncate'>
          {noticeLoading ? (
            <span className="text-gray-400">공지 불러오는 중...</span>
          ) : (
            <NoticeSlider notice={notice} />
          )}
        </div>
      </div>

      {/* 🔥 내 팀 목록 */}
      <div className="rounded-2xl bg-gray-100 p-6 fade-in hover-scale hover-shadow">
  
        {/* 헤더 */}
        <div className="mb-5 flex items-center flex-col md:flex-row md:justify-between">
          <h2 className="text-lg font-bold mb-3 md:mb-0">내 팀 목록</h2>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/invite/join')}
              className="rounded-md border border-gray-300 bg-white px-3 py-1 text-[11px] hover:bg-gray-50 "
            >
              + 팀 가입하기
            </button>

            <button
              onClick={() => setOpen(true)}
              className="rounded-md bg-[#819E7A] px-3 py-1 text-[11px] text-white hover:opacity-90"
            >
              + 팀 생성하기
            </button>

            <button
            onClick={() => setShowTeamList(prev => !prev)}
            className="text-[11px] px-3 py-1 rounded-md bg-[#819E7A] hover:opacity-90 text-white"
            >
            {showTeamList ? '접기 ▲' : '펼치기 ▼'}
            </button>
        </div>
        </div>
        {/* 팀 리스트 */}
        {teamLoading ? (
          <div className="text-center text-gray-400 py-5">팀 불러오는 중...</div>
        ) : (
          showTeamList && <TeamList teams={teams} />
        )}
      </div>

      <TeamCreateModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onCreate={(data) => createTeamMutation.mutate(data)}
      />      

        {/* 🔥 캘린더 + 할일 */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 ">
          
          {/* 캘린더 */}
          <div className="rounded-xl bg-gray-50 p-5 fade-in hover-scale hover-shadow">
            <MyCalendar/>
          </div>

          {/* 오늘 할일 */}
          <div className="space-y-2 rounded-xl bg-gray-50 p-7 fade-in hover-scale hover-shadow">
            {
              taskLoading ? (
                  <div className="text-center text-gray-400 py-10">로딩 중...</div>
                ) : task.length === 0 ? (
                  <div className="text-center text-gray-400 py-10">할 일이 없습니다.</div>
              ) : 
              (task.map((task) => {
                const date = new Date(task.dueDate);
                const day = date.toLocaleDateString('ko-KR', {
                  day: 'numeric'
                });

                const time = date.toLocaleTimeString('ko-KR', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                  timeZone: 'Asia/Seoul'
                });

                return(
                  <div
                    key={task._id}
                    className="flex items-center rounded-full border-2 border-[#7A9276] bg-white 
                    h-12 md:h-16 pr-3 md:pr-4 overflow-hidden mb-4 md:mb-8"
                  >
                    {/* 날짜 */}
                    <div className="flex h-12 md:h-16 w-16 md:w-25 items-center justify-center rounded-full border-r-2 border-[#7A9276] bg-[#C9D6C5] 
                      text-xl md:text-3xl font-semibold text-[#5E775A]">
                      {day}
                    </div>

                    {/* 텍스트 */}
                    <div className="ml-3 md:ml-4 flex-1 min-w-0">
                      <p className="text-sm md:text-lg font-semibold text-[#5E775A] truncate">
                        {task.title}
                      </p>
                      <p className="text-xs md:text-sm text-[#5E775A] opacity-80">
                        {time}
                      </p>
                    </div>
                  </div>

              )
            })
            )}
          </div>
        </div>

        {/* 🔥 통계 */}
        <div className="rounded-xl bg-gray-50 p-4 md:p-5 mb-5 md:mb-0 fade-in hover-scale hover-shadow">
          <h3 className="mb-3 text-base md:text-lg font-bold">
            세진님의 할일 통계
          </h3>

          {statsLoading || !stats ? (
          <div className="text-gray-400">통계 불러오는 중...</div>
          ) : 
          (<div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:gap-6 text-sm">
            {/* 총 개수 */}
            <div className="text-lg md:text-2xl font-bold">
              총 {stats.total}개
            </div>

            {/* 진행중 */}
            <div className="flex items-center justify-start text-[#819E7A] text-base md:text-xl">
              <FaRegCheckCircle className="mr-2 md:mr-3" size={20} />
              진행중 {stats.progress}개
            </div>

            {/* 대기중 */}
            <div className="flex items-center justify-start text-[#819E7A] text-base md:text-xl">
              <MdAccessTime className="mr-2 md:mr-3" size={20} />
              대기중 {stats.todo}개
            </div>

            {/* 완료 */}
            <div className="flex items-center justify-start text-[#819E7A] text-base md:text-xl">
              <FaCheckCircle className="mr-2 md:mr-3" size={20} />
              완료 {stats.done}개
            </div>

          </div>
        )}
        </div>
    </div>
  );
}

export default Dashboard;
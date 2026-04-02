import NoticeSlider from '../../components/NoticeSlider';
import { useState } from 'react';
import TeamCreateModal  from '../../components/TeamCreateModal';
import { toast } from 'react-toastify';
import TeamList from '../../components/TeamList';
import { FaCheckCircle } from "react-icons/fa";
import { FaRegCheckCircle } from "react-icons/fa";
import { MdAccessTime } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

import { ActivityType } from '../../types/activity';

import { useTeams, useCreateTeam } from '../../hooks/useTeam';
import { useNotice } from '../../hooks/useNotice';
import { useStats } from '../../hooks/useTask';
import { useActivities } from '../../hooks/useActivity';

const TeamPage = () => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'OWNER' | 'MEMBER'>('ALL');

  // ✅ React Query
  const { data: teams = [] } = useTeams();
  const { data: notice = [] } = useNotice();
  const { data: stats = { total: 0, done: 0, progress: 0, todo: 0 } } = useStats();
  const { data: activities = [] } = useActivities();

  const createTeamMutation = useCreateTeam({
    onSuccess: () => {
      toast.success('팀 생성 완료 🎉');
      setOpen(false);
    },
    onError: () => {
      toast.error('팀 생성 실패 ❌');
    }
  });

  const filteredTeams = teams.filter((team) => {
    if (filter === 'ALL') return true;
    return team.role === filter;
  });


  const getIcon = (type: ActivityType): string => {
    switch (type) {
      case 'TEAM_CREATE':
        return '🟢';
      case 'MEMBER_ADD':
        return '👤';
      case 'NOTICE_CREATE':
        return '📢';
      default:
        return '📌';
    }
  };

  const ownerlengt = teams.filter(t => t.role === 'OWNER').length;
  const memberlengt = teams.filter(t => t.role === 'MEMBER').length;


  return (
    <div className='space-y-4 md:space-y-6 px-4 sm:px-6 md:px-0 max-w-md mx-auto md:max-w-full'>

      {/* 공지 */}
      <div className="flex items-center gap-2 md:gap-3 rounded-xl bg-[#FEF7E9] px-3 md:px-5 py-2 md:py-3 text-xs md:text-sm h-12 md:h-16 overflow-hidden">
        <span className="shrink-0">📢</span>
        <span className="font-medium text-[#D94100] shrink-0 whitespace-nowrap">금주의 공지사항</span>
        <div className='flex-1 min-w-0 truncate'>
          <NoticeSlider notice={notice} />
        </div>
      </div>  
      {/* END */}

      {/* 팀 통계 부분*/}
      <div className='flex flex-col md:flex-row gap-2 md:gap-3 bg-[#F8F8F8] p-3 md:p-5 fade-in hover-scale hover-shadow'>
        
        <div className='bg-white w-full md:w-80 border border-gray-300 md:border-0 rounded-lg p-3 md:p-6 text-[#4A4A4A]'>
          <div className='text-xs md:text-base'>총 팀</div>
          <div className='mt-2 md:mt-5'>
            <span className='text-xl md:text-4xl font-semibold'>{teams.length}</span>
            <span className='text-sm md:text-xl'>개</span>
          </div>
        </div>

        <div className='bg-white w-full md:w-80 border border-gray-300 md:border-0 rounded-lg p-3 md:p-6 text-[#4A4A4A]'>
          <div className='text-xs md:text-base'>OWNER인 팀</div>
          <div className='mt-2 md:mt-5'>
            <span className='text-xl md:text-4xl font-semibold'>{ownerlengt}</span>
            <span className='text-sm md:text-xl'>개</span>
          </div>
        </div>

        <div className='flex flex-col md:flex-row justify-between bg-white rounded-lg p-3 md:p-6 text-[#4A4A4A] w-full'>
          
          <div className='w-full md:w-75'>
            <div className='text-xs md:text-base'>진행중인 팀</div>
            <div className='mt-2 md:mt-5'>
              <span className='text-xl md:text-4xl font-semibold'>{memberlengt}</span>
              <span className='text-sm md:text-xl'>개</span>
            </div>
          </div>

          <div className='w-full md:w-full mt-3 md:mt-0 flex flex-col gap-2'>
            <button
              onClick={() => setOpen(true)}
              className='w-full bg-[#819E7A] text-white px-5 py-2 text-center rounded-sm'
            >
              + 새 팀 생성하기
            </button>         

            <button
              onClick={() => navigate('/invite/join')}
              className='w-full bg-[#F2F2F2] text-[#585858] border border-[#8F8F8F] px-5 py-2 text-center rounded-sm'
            >
              초대코드 입력
            </button>
          </div>   

        </div>
      </div>
      {/* END */}
      <TeamCreateModal
        isOpen={open}
         onClose={() => setOpen(false)}
        onCreate={(data) => createTeamMutation.mutate(data)}
      />

      {/* 팀 목록 부분 */}
      <div className="rounded-2xl bg-[#F8F8F8] p-6 fade-in hover-scale hover-shadow">
  
        {/* 헤더 */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-l md:text-lg font-ligt">내 팀 목록</h2>
          <div className="flex justify-center md:justify-start">
            <div className="flex w-full md:w-fit rounded-xl border border-[#D9D9D9] overflow-hidden text-xs md:text-sm">

              {/* 전체 */}
              <button
                onClick={() => setFilter('ALL')}
                className={`flex-1 md:flex-none px-2 md:px-6 py-1 ${
                  filter === 'ALL'
                    ? 'bg-white font-semibold text-black'
                    : 'bg-[#F5F5F5] text-gray-500'
                }`}
              >
                { filter === 'ALL' ?<span className="w-2 h-2 rounded-full bg-[#7A9276]"></span>:''}
                전체
              </button>

              {/* OWNER */}
              <button
                onClick={() => setFilter('OWNER')}
                className={`flex-1 md:flex-none flex items-center justify-center gap-1 md:gap-2 px-2 md:px-6 py-1 border-l border-[#D9D9D9] ${
                  filter === 'OWNER'
                    ? 'bg-white font-semibold text-black'
                    : 'bg-[#F5F5F5] text-gray-500'
                }`}
              >
                { filter === 'OWNER' ?<span className="w-2 h-2 rounded-full bg-[#7A9276]"></span>:''}
                OWNER
              </button>

              {/* MEMBER */}
              <button
                onClick={() => setFilter('MEMBER')}
                className={`flex-1 md:flex-none flex items-center justify-center gap-1 md:gap-2 px-2 md:px-6 py-1 border-l border-[#D9D9D9] ${
                  filter === 'MEMBER'
                    ? 'bg-white font-semibold text-black'
                    : 'bg-[#F5F5F5] text-gray-500'
                }`}
              >
                { filter === 'MEMBER' ?<span className="w-2 h-2 rounded-full bg-[#7A9276]"></span>:''}
                MEMBER
              </button>

            </div>
          </div>
        </div>
        <TeamList teams={filteredTeams} />
      </div>      
      {/* END */}

      {/* 최근 활동 / 할일 부분 */}
      <div className='flex flex-col md:flex-row md:justify-between gap-4 md:gap-3'>
        {/* 최근 활동 */}

        <div className='rounded-xl bg-gray-50 p-4 md:p-5 md:w-full md:mr-5 fade-in hover-scale hover-shadow'>
          <h3 className="mb-3 text-base md:text-lg font-ligt">
            최근 활동
          </h3>
          <div className='bg-white border border-[#BCCBB8] p-4'>
            {activities.map((item) => (
              <div key={item._id} className='border-b border-[#BCCBB8] py-3'>
                <span className='mr-2'>{getIcon(item.type)}</span>
                <span className='mr-2 font-semibold'>{item.teamId?.name || "NOTICE"}</span>
                <span>{item.message}</span>
              </div>
            ))}
          </div>

        </div>

        {/* 할일 */}          
        <div className="rounded-xl bg-gray-50 p-4 md:p-5 md:w-200 mb-3 md:mb-0 fade-in hover-scale hover-shadow">
          <h3 className="mb-3 text-base md:text-lg font-light">
            세진님의 할일 통계
          </h3>
          {/* 총 개수 */}
          <div className="text-lg md:text-2xl font-bold">
            총 {stats.total}개
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:gap-6 text-sm mt-2">
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
        </div>

      </div>
      {/* END */}
    </div>
  )
}

export default TeamPage

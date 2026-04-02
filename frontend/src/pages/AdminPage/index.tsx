import { IoSearch } from "react-icons/io5";
import { useEffect, useState } from 'react';
import DataTable from '../../components/DataTable';
import NoticeCreate from '../../components/NoticeCreate';
import { toast } from 'react-toastify';
import {
  useAdminData,
  useDeleteUser,
  useDeleteTeam,
  useDeleteNotice,
} from '../../hooks/useAdmin';
import { Notice, User, Team } from "../../types/admin";
import { Column } from "../../types/common"


const AdminPage = () => {

  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState(keyword);

  const { data, isLoading } = useAdminData(debouncedKeyword);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 500); // 0.5초 후 실행

    return () => clearTimeout(timer);
  }, [keyword]);

  const deleteUser = useDeleteUser();
  const deleteTeam = useDeleteTeam();
  const deleteNotice = useDeleteNotice();

  if (isLoading) return <div>로딩중...</div>;

  const users = data?.users || [];
  const teams = data?.teams || [];
  const notices = data?.notices || [];

  const userColumns: Column<User>[] = [
    { label: '이름', key: 'name' },
    { label: '이메일', key: 'email' },
    { 
      label: '권한', 
      key: 'platformRole',
      render: (value) => (
        <span className={value === 'ADMIN' ? 'text-red-500' : ''}>
          {value}
        </span>
      )
    },
    { label: '가입일', key: 'createdAt',},
    { label: '소속팀(갯수)', key: 'teamCount' },
    { label: '할일(갯수)', key: 'taskCount' },
  ];

  const teamColums: Column<Team>[]  = [
    { label : '이름', key: 'name'},
    { label : '설명', key: 'description'},
    { label : '팀장', key: 'ownerName'},
    { label: '생성일', key: 'createdAt',},
    { label : '멤버(갯수)', key: 'memberCount'},
    { label : '할일(갯수)', key: 'taskCount'},
  ]

  const noticeColums: Column<Notice, any>[] = [
    {
      label: '작성자',
      key: 'createdBy',
      render: (value: Notice['createdBy']) => value?.name || '없음'
    },
    { label : '제목', key: 'title'},
    { 
      label: '생성일', 
      key: 'createdAt',
      render: (value: Notice['createdAt']) => {
        const date = new Date(value);
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
      }
    },
  ]


  const handleDeleteUser = (id: string) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    deleteUser.mutate(id, {
      onSuccess: () => toast.success('유저 삭제 완료'),
      onError: () => toast.error('삭제 실패'),
    });
  };


  const handleDeleteTeam = (id: string) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    deleteTeam.mutate(id, {
      onSuccess: () => toast.success('팀 삭제 완료'),
      onError: () => toast.error('삭제 실패'),
    });
  };


  const handleDeleteNotice = (id: string) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    deleteNotice.mutate(id, {
      onSuccess: () => toast.success('공지 삭제 완료'),
      onError: () => toast.error('삭제 실패'),
    });
  };

  return (
    <div className="space-y-4 md:space-y-6 px-4 sm:px-6 md:px-0 max-w-md mx-auto md:max-w-full">
      {/* 헤더 */}
      <div className='flex flex-col md:flex-row md:justify-between p-3 pb-6 border-b border-[#BCCBB8]'>
        <div>
          <div className='text-4xl font-bold'>ADMIN</div>
          <div className='text-[#7E7E7E] font-light text-xl'>멤버 및 팀을 관리하세요.</div>
        </div>
        <div className='relative mt-5 md:mt-0'>
          <IoSearch className='absolute left-2 top-5 -translate-y-1/2 text-gray-400'/>
          <input 
            type="text" 
            className='w-70 md:w-90 pl-8 pr-3 py-2 bg-[#F5F5F5] rounded-md'
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder='Search for member , team , notice ...'
          />
        </div>
      </div>
      {/* end */}

      {/* 유저목록 */}
      <div className="w-full">
        <div className="text-3xl font-bold mb-5">
          Members
        </div>
        <DataTable 
          columns={userColumns}
          data={users}
          renderAction={(item) => (
            <button 
              onClick={() => handleDeleteUser(item._id)}
              className="text-orange-500 hover:text-red-600 cursor-pointer"
            >
              X
            </button>
          )}
        />
      </div>
      {/* end */}

      {/* 팀목록 */}
      <div className="w-full">
        <div className="text-3xl font-bold mb-5">
          Teams
        </div>
        <DataTable 
          columns={teamColums}
          data={teams}
          renderAction={(item) => (
            <button 
              onClick={() => handleDeleteTeam(item._id)}
              className="text-orange-500 hover:text-red-600 cursor-pointer"
            >
              X
            </button>
          )}
        />
      </div>
      {/* end */}

      {/* 공지목록 */}
      <div className="w-full md:mb-0 mb-5">
        <div className='flex flex-row'>
          <div className="text-3xl font-bold mb-5 mr-3">
            Notices
          </div>
          <NoticeCreate />
        </div>
        <DataTable 
          columns={noticeColums}
          data={notices}
          renderAction={(item) => (
            <button 
              onClick={() => handleDeleteNotice(item._id)}
              className="text-orange-500 hover:text-red-600 cursor-pointer"
            >
              X
            </button>
          )}
        />    
      </div>
      {/* end */}


    </div>
  )
}

export default AdminPage

import React from 'react'
import { IoSearch } from "react-icons/io5";
import { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import DataTable from '../../components/DataTable';
import NoticeCreate from '../../components/NoticeCreate';
import { toast } from 'react-toastify';

const AdminPage = () => {

  const [users,setUser] = useState([]);
  const [teams,setTeam] = useState([]);
  const [notices,setNotice] = useState([]);
  const [keyword, setKeyword] = useState('');

  const userColumns = [
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

  const teamColums = [
    { label : '이름', key: 'name'},
    { label : '설명', key: 'description'},
    { label : '팀장', key: 'ownerName'},
    { label: '생성일', key: 'createdAt',},
    { label : '멤버(갯수)', key: 'memberCount'},
    { label : '할일(갯수)', key: 'taskCount'},
  ]

  const noticeColums = [
    {
      label: '작성자',
      key: 'createdBy',
      render: (value) => value?.name || '없음'
    },
    { label : '제목', key: 'title'},
    { 
      label: '생성일', 
      key: 'createdAt',
      render: (value) => {
        const date = new Date(value);
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
      }
    },
  ]
  // 🔵 기존 전체 데이터 불러오기
  const fetchAll = async () => {
    const [u, t, n] = await Promise.all([
      axios.get('/admin/users'),
      axios.get('/admin/teams'),
      axios.get('/admin/notices')
    ]);

    setUser(u.data.users);
    setTeam(t.data.teams);
    setNotice(n.data.notices);
  };


  // 🔵 검색
  const handleSearch = async () => {
    try {
      const res = await axios.get(`/admin/search?q=${keyword}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setUser(res.data.users);
      setTeam(res.data.teams);
      setNotice(res.data.notices);

    } catch (err) {
      console.error(err);
    }
  };


  useEffect(() => {
  // 🔴 검색어 없으면 전체 데이터
    if (!keyword.trim()) {
      fetchAll();
      return;
    }

    const delay = setTimeout(() => {
      handleSearch();
    }, 300); // 0.3초 딜레이

    return () => clearTimeout(delay);

  }, [keyword]);

  useEffect(() => {
    fetchAll();
  },[])

  const fetchUsers = async () => {
    try{
      const res = await axios.get('/admin/users');
      setUser(res.data?.users)
    }catch(err){
      console.log(err)
    }
  }

  const fetchTeams = async () => {
    try{
      const res = await axios.get('/admin/teams');
      setTeam(res.data?.teams)
    }catch(err){
      console.log(err)
    }
  }

  const fetchNotices = async () => {
    try{
      const res = await axios.get('/admin/notices');
      setNotice(res.data?.notices)
    }catch(err){
      console.log(err)
    }
  }

  const deleteUser = async (userId) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      const res=await axios.delete(`/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast.success(res?.data?.message || '유저 삭제 완료');
      await fetchUsers(); // 목록 다시 불러오기

    } catch (err) {
      toast.error(err.response?.data?.message || '삭제 실패');
    }
  };

  const deleteTeam = async (teamId) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      const res=await axios.delete(`/admin/teams/${teamId}`)

      toast.success(res?.data?.message || '팀 삭제 완료');
      await fetchTeams(); // await 추가 (안정성)
    } catch (err) {
      toast.error(err.response?.data?.message || '삭제 실패');
    }
  };

  const deleteNotice = async (noticeId) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      const res=await axios.delete(`/admin/notices/${noticeId}`)

      toast.success(res?.data?.message || '공지 삭제 완료');
      await fetchNotices(); // await 추가 (안정성)
    } catch (err) {
      toast.error(err.response?.data?.message || '삭제 실패');
    }
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
              onClick={() => deleteUser(item._id)}
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
              onClick={() => deleteTeam(item._id)}
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
          <NoticeCreate onSuccess={fetchNotices} />
        </div>
        <DataTable 
          columns={noticeColums}
          data={notices}
          renderAction={(item) => (
            <button 
              onClick={() => deleteNotice(item._id)}
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

import React from 'react'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import { IoSettingsSharp } from "react-icons/io5";
import { FaUserAstronaut } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa";
import { MdOutlineCalendarToday } from "react-icons/md";
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const DetailTeamPage = () => {

  const { teamId } = useParams();
  const [data,setdata] = useState();
  const member = data?.members || [];
  const [mytasks, setMyTasks] = useState([]);
  const teamtasks = data?.teamTasks || [];
  const [showInput, setShowInput] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editStatus, setEditStatus] = useState("");

  const userData = useSelector(state => state.user?.userData);


  useEffect(() => {
    fetchTeams();
  }, []);


  const fetchTeams = async () => {
    try {
      const res = await axios.get(`/teams/${teamId}`);
      setdata(res.data);
      setMyTasks(res.data?.myTasks)

    } catch (err) {
      console.error(err);
    }
  };

  const getColor = (status) => {
    switch (status) {
      case "TODO":
        return "bg-green-500";
      case "IN_PROGRESS":
        return "bg-blue-500";
      case "DONE":
        return "bg-orange-500";
      default:
        return "bg-gray-400";
    }
  };  

  const handleEditStart = (task) => {
    setEditTaskId(task.taskId);
    setEditTitle(task.title);
    setEditDate(task.dueDate?.split("T")[0] || "");
    setEditStatus(task.status);
  };
  
  const handleEditSave = async () => {
    try {
      await axios.patch(`/tasks/${editTaskId}`, {
        title: editTitle,
        dueDate: editDate,
        status: editStatus
      });
      setEditTaskId(null);
      fetchTeams(); 
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (taskId) => {
    const confirmDelete = window.confirm("삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/tasks/${taskId}`);
      fetchTeams(); 
    } catch (err) {
      console.error(err);
    }
  };
  
  const statusMap = {
    TODO: { text: "진행중", color: "text-green-500" },
    IN_PROGRESS: { text: "대기중", color: "text-blue-500" },
    DONE: { text: "완료", color: "text-orange-500" },
  };

  const handleAddTask = async () => {
    if (!newTask) return;

    try {
      const res = await axios.post("/tasks", {
        teamId,
        title: newTask,
        status: "TODO", 
        dueDate,
        createdBy: userData.id 
      });

      setMyTasks((prev) => [
        ...prev,
        {
          taskId: res.data._id,
          title: newTask,
          status: "TODO",
          dueDate
        }
      ]);

      // 🔥 초기화
      setNewTask("");
      setDueDate("");
      setShowInput(false);

    } catch (err) {
      console.error(err);
    }
  };

  const createCode = async () => {
    try{
      const res = await axios.post(`/invite/${teamId}`)
      const inviteCode = res.data.code;
      const message = res.data.message;

      await navigator.clipboard.writeText(inviteCode);

      toast.success(`${message}\n${inviteCode}`, {
        position: "top-center",
        autoClose: 4000, // ← 시간 길게
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }catch(err){
      toast.error(err.response?.data?.message)
    }
  }

  return (
    <div className="space-y-4 md:space-y-6 px-4 sm:px-6 md:px-0 max-w-md mx-auto md:max-w-full">
      {/* 헤더 부분 */}
      <div className='flex flex-row md:justify-between border-b border-[#BCCBB8] py-5 pb-8 md:pb-10'>
        <div className='flex flex-row'>
          {/* 아이콘 */}
          <div
          className="flex h-12 w-12 md:h-15 md:w-15 items-center justify-center rounded-full text-lg md:text-2xl font-semibold text-white"
          style={{ backgroundColor: data?.team.color }}>{data?.team.name[0]}</div>

          {/* 팀정보 */}
          <div className='ml-3 md:ml-5'>
            <div className='flex flex-row items-center'>
              <div className='font-semibold md:font-bold text-base md:text-2xl mr-5'>{data?.team.name}</div>
              <span
                      className={`rounded-full px-3 py-1 text-[13px] m-0 whitespace-nowrap ${
                        data?.team.myRole === 'OWNER'
                          ? 'bg-[#819E7A] text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {data?.team.myRole || 'MEMBER'}
                    </span>
            </div>
            <div className='text-[#7D7D7D] text-sm md:text-xl font-light m-0'>
              {data?.team.description}
            </div>
          </div>
        </div>

        {/* 설정 */}
        <div className='flex items-center md:hidden ml-10'>
          <IoSettingsSharp size={24}/>
        </div>

        {/* 🔥 PC용 설정 아이콘 */}
        <div className='hidden md:flex items-center mr-5'>
          <IoSettingsSharp size={30}/>
        </div>
      </div>
      {/* END */}

      {/* 멤버 목록 */}
      <div className="rounded-xl bg-[#F8F8F8] px-4 md:px-10 py-5">

        <div className='flex justify-between items-center'>
          <div className='text-base md:text-xl text-[#4B4B4B]'>멤버목록</div>
          <button
          onClick={createCode}
          className="h-7 md:h-5 border border-gray-300 px-3 md:px-4 text-[11px] md:text-[10px] bg-[#FFFFFF] hover:bg-[#819E7A] hover:text-white text-[#819E7A]"
          >
            + 멤버 초대하기
          </button>
        </div>

        <div className=" mt-5">
          {member
          .filter((member) => member?.userId)
          .map((member) => (
            <div className="flex flex-row md:items-center md:justify-between bg-white px-5 py-4 transition mb-0 first:rounded-t-2xl last:rounded-b-2xl border-t border-l border-r last:border-b border-[#BCCBB8]">
              {/* 왼쪽 */}
              <div className="flex items-center gap-4">     
                <FaUserAstronaut size={30} className="md:text-[40px]"/>
                <div className='flex flex-col md:flex-row text-base md:text-xl md:items-center'>
                  <p className="font-semibold mr-0 md:mr-6">{member.name}</p>
                  <p className="text-sm text-[#A7A7A7] break-all">{member.email}</p>
                </div>
              </div>
              {/* 오른쪽 */}
              <div className="flex items-center gap-3 shrink-0 mt-3 md:mt-0">
                <span className={`rounded-full ml-10 md:ml-0 px-3 md:px-5 py-0.5 md:py-1 text-sm md:text-[16px] whitespace-nowrap ${
                          member?.role === 'OWNER'
                            ? 'bg-[#819E7A] text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                  {member?.role || 'MEMBER'}
                </span>
              </div>
            </div>
          ))
          }
        </div>
      </div>
      {/* END */}

      {/* TODO  */}
      <div className="bg-white rounded-xl p-4 md:p-6">
        
        {/* 🔵 헤더 */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          
          <div className="flex items-center gap-2">
            <h2 className="text-xl md:text-2xl font-semibold">My Todo</h2>

            <span className="px-2 py-0.5 rounded-md border border-[#BCCBB8] text-sm md:text-base">
              {mytasks.length}
            </span>
          </div>

          {/* 상태 */}
          <div className="flex gap-3 text-xs md:text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              진행중
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              대기중
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              완료
            </div>
          </div>
        </div>

        {/* 🔵 Add Task */}
        <div className="flex items-center gap-2 text-gray-400 mt-4 cursor-pointer"
        onClick={() => setShowInput(prev => !prev)}>
          <FaPlus />
          <span>Add New Task</span>
        </div>

        <div className="border-t mt-4 border-[#BCCBB8]" />

        {/* 🔵 리스트 */}
        <div className="mt-2">
          {mytasks.map((task) => {
            const date = new Date(task.dueDate);
            const formatted = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;

            const isEditing = editTaskId === task.taskId;

            return (
              <div
                key={task.taskId}
                className="group flex flex-col md:flex-row md:items-center md:justify-between py-4 border-b border-[#BCCBB8]"
              >
                {/* ✅ 수정모드 */}
                {isEditing ? (
                  <div className="flex flex-col md:flex-row md:items-center w-full gap-3">

                    {/* 상태 선택 */}
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="TODO">진행중</option>
                      <option value="IN_PROGRESS">대기중</option>
                      <option value="DONE">완료</option>
                    </select>

                    {/* 타이틀 */}
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="flex-1 border rounded px-3 py-1 text-sm"
                    />

                    {/* 날짜 */}
                    <input
                      type="date"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    />

                    {/* 버튼 */}
                    <div className="flex gap-2">
                      <button
                        onClick={handleEditSave}
                        className="text-green-600 text-sm"
                      >
                        저장
                      </button>
                      <button
                        onClick={() => setEditTaskId(null)}
                        className="text-gray-400 text-sm"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div
                      className="flex items-center gap-3 cursor-pointer mr-0"
                      onClick={() => handleEditStart(task)}
                    >
                      <div className={`w-4 h-4 rounded-full ${getColor(task.status)}`} />

                      <div
                        className={`text-sm md:text-base ${
                          task.status === "DONE"
                            ? "line-through text-gray-400"
                            : ""
                        }`}
                      >
                        {task.title}
                      </div>

                      {task.status === "DONE" && (
                        <span className="ml-2 text-orange-500 text-xs">
                          complete
                        </span>
                      )}

                      <button
                      onClick={() => handleDelete(task.taskId)}
                      className="ml-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition text-red-400 text-xs md:text-sm"
                      >
                      삭제
                      </button>
                    </div>



                    {/* 오른쪽 날짜 */}
                    <div className="flex items-center gap-2 text-green-600 text-xs md:text-sm mt-2 md:mt-0">
                      <MdOutlineCalendarToday />
                      {formatted}
                    </div>
                  </>
                )}
              </div>
            );
          })}

          {/* 🔵 input */}
          {showInput && (
          <div className="flex flex-col md:flex-row md:items-center gap-3 py-4">
            
            <div className="w-4 h-4 rounded-full bg-green-500" />

            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddTask();
              }}
              placeholder="Please enter your Task"
              className="flex-1 border rounded-lg px-4 py-2 text-sm md:text-base"
            />

            <div className="flex items-center gap-2 text-green-600 text-xs md:text-sm">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-transparent outline-none"
              />
            </div>
          </div>
        )}
        </div>
      </div>
      {/* END */}

      {/* TEAM TODO */}
      <div className="bg-white rounded-xl p-4 md:p-6">
        
        {/* 🔵 헤더 */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          
          <div className="flex items-center gap-2">
            <h2 className="text-xl md:text-2xl font-semibold">Team Todo</h2>

            <span className="px-2 py-0.5 rounded-md border border-[#BCCBB8] text-sm md:text-base">
              {teamtasks.length}
            </span>
          </div>
        </div>


      <div className="border-t mt-4 border-[#BCCBB8]" />
        {/* 🔵 리스트 */}
        <div className="mt-2">
          {teamtasks.map((task) => {
            const date = new Date(task.dueDate);
            const formatted = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
            const status = statusMap[task.status] || {
              text: "기타",
              color: "text-gray-400",
            };
            return(
              <div
                key={task.taskId}
                className="flex flex-col md:flex-row md:items-center md:justify-between py-4 border-b border-[#BCCBB8]"
              >
                
                {/* 왼쪽 */}
                <div className="flex items-center gap-3">
                  {/*<div className={`w-4 h-4 rounded-full ${getColor(task.status)}`} />*/}
                  <FaUserAstronaut size={20} />
                  <div>
                    {task.assignee.name}
                  </div>
                  <div
                    className={`text-sm md:text-base ${
                      task.status === "DONE" ? "line-through text-gray-400" : ""
                    }`}>{task.title}</div>
                    <span className={`ml-2 text-xs ${status.color}`}>
                      {status.text}
                    </span>
                </div>

                {/* 오른쪽 */}
                <div className="flex items-center gap-2 text-green-600 text-xs md:text-sm mt-2 md:mt-0">
                  <MdOutlineCalendarToday />
                  {formatted}
                </div>
              </div>
            )}
          )}
        </div>
      </div>      
      {/* END */}



    </div>
  )
}

export default DetailTeamPage

import { useParams } from 'react-router-dom'
import {  useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoSettingsSharp } from "react-icons/io5";
import { FaUserAstronaut } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa";
import { MdOutlineCalendarToday } from "react-icons/md";
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { useDetailTeam } from '../../hooks/detailTeam';
import { useCreateTask, useUpdateTask, useDeleteTask } from '../../hooks/useTask';
import { useDeleteTeam } from '../../hooks/useTeam';
import { useInviteCode } from '../../hooks/useInvite';

import { RootState } from '../../store';
import { TaskStatus } from '../../types/task';

const DetailTeamPage = () => {
  const navigate = useNavigate();

  const { teamId } = useParams<{ teamId: string }>();
  if (!teamId) return null;

  const [showInput, setShowInput] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [showSet, setShowSet] = useState(false);

  
  const { data, refetch } = useDetailTeam(teamId!);

  const member = data?.members || [];
  const mytasks = data?.myTasks || [];
  const teamtasks = data?.teamTasks || [];


  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  const deleteTeamMutation = useDeleteTeam();
  const inviteMutation = useInviteCode();
    
  const userData = useSelector((state: RootState) => state.user?.userData);

  const getColor = (status: string): string => {
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


  const TeamDelete = () => {
    deleteTeamMutation.mutate(teamId!, {
      onSuccess: (data) => {
        toast.success(data.message);
        navigate('/teams');
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message);
      }
    });
  };

  const handleEditStart = (task: any) => {
    setEditTaskId(task.taskId);
    setEditTitle(task.title);
    setEditDate(task.dueDate?.split("T")[0] || "");
    setEditStatus(task.status);
  };
  
  const handleEditSave = () => {
    updateTaskMutation.mutate({
      taskId: editTaskId,
      data: {
        title: editTitle,
        dueDate: editDate,
        status: editStatus
      }
    });

    setEditTaskId(null);
  };

  const handleDelete = (taskId: string) => {
    if (!window.confirm("삭제하시겠습니까?")) return;
    deleteTaskMutation.mutate(taskId);
  };

  const statusMap = {
    TODO: { text: "진행중", color: "text-green-500" },
    IN_PROGRESS: { text: "대기중", color: "text-blue-500" },
    DONE: { text: "완료", color: "text-orange-500" },
  };


  const handleAddTask = () => {
    if (!newTask || !teamId || !userData?.id) return;

    createTaskMutation.mutate(
      {
        teamId,
        title: newTask,
        status: 'TODO',
        dueDate,
        createdBy: userData.id,
      },
      {
        onSuccess: () => {
          setNewTask('');
          setDueDate('');
          setShowInput(false);
        },
      }
    );
  };


  const createCode = () => {
    inviteMutation.mutate(teamId!, {
      onSuccess: async (data) => {
        await navigator.clipboard.writeText(data.code);

        toast.success(`${data.message}\n${data.code}`, {
          position: "top-center",
          autoClose: 4000, // ← 시간 길게
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message);
      }
    });
  };

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
        <div className='flex items-center md:hidden flex-col mr-5 relative text-center ml-3'>
          <IoSettingsSharp onClick={() => setShowSet(prev => !prev)} className='cursor-pointer  ' size={24}/>
          {showSet && 
          (
            <div className='shadow-[0px_0px_4px_rgba(0,0,0,0.25)] px-4 py-2 absolute top-10 min-w-30 '>
              <button onClick={TeamDelete} className='cursor-pointer'>팀 삭제하기</button>
            </div>
          )}
        </div>

        {/* 🔥 PC용 설정 아이콘 */}
        <div className='hidden md:flex flex-col items-center mr-5 relative text-center'>
          <IoSettingsSharp onClick={() => setShowSet(prev => !prev)} className='cursor-pointer  ' size={30}/>
          {showSet && 
          (
            <div className='shadow-[0px_0px_4px_rgba(0,0,0,0.25)] px-4 py-2 absolute top-10 min-w-30 '>
              <button onClick={TeamDelete} className='cursor-pointer'>팀 삭제하기</button>
            </div>
          )}
        </div>
      </div>
      {/* END */}

      {/* 멤버 목록 */}
      <div className="rounded-xl bg-[#F8F8F8] px-4 md:px-10 py-5">

        <div className='flex justify-between items-center '>
          <div className='text-base md:text-xl text-[#4B4B4B]'>멤버목록</div>
          <button
          onClick={createCode}
          className="h-7 md:h-5 border border-gray-300 px-3 md:px-4 text-[11px] md:text-[10px] bg-[#FFFFFF] hover:bg-[#819E7A] hover:text-white text-[#819E7A]"
          >
            + 멤버 초대하기
          </button>
        </div>

        <div className=" mt-5 ">
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
                      className="border rounded px-2 py-1 text-sm transition-all duration-200 focus:scale-105"
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
            <div className='flex flex-col md:flex-row'>
              <div className="flex flex-row md:items-center gap-3 py-4">

                <div className="w-4 h-4 rounded-full bg-green-500 shrink-0" />

                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddTask();
                  }}
                  placeholder="Please enter your Task"
                  className="flex-1 border px-2 py-1 rounded bg-white text-black min-h-9"
                />

              </div>
              
              <div className="flex items-center gap-1 flex-shrink-0">
                <span className="text-gray-400">📅</span>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-[130px] px-3 py-2 border rounded  text-black text-base outline-none bg-transparent"
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
            const status = statusMap[task.status as TaskStatus] || {
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

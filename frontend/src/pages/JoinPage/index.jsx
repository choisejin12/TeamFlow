import React from 'react'
import axios from '../../utils/axios';
import NoticeSlider from '../../components/NoticeSlider';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const JoinPage = () => {
  const navigate = useNavigate();

  const [notice, setNotice] = useState([]); 
  const [code,setCode] = useState();
  const [confirmCode, setConfirmCode] = useState('');

  useEffect(() => {
    fetchNotice();
  }, []);

  const fetchNotice = async () => {
    try {
      const res = await axios.get('/admin/notices');
      setNotice(res.data.notices); 
    } catch (err) {
      console.log("에러:", err)
    }
  };  

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if (code !== confirmCode) {
      toast.error('초대코드가 일치하지 않습니다.');
      return;
    }
    try {
      const res = await axios.post('/invite/join', { code })
      toast.success(res.data.message);
      navigate(`/teams/${res.data.teamId}`);
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

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


      <div className="bg-[#F8F8F8] md:p-10">

        <div className='bg-[#FFFFFF] border border-[#BCCBB8] rounded-2xl p-4 md:p-8'>
          <div className='flex flex-col'>

            {/*  Title  */}
            <div className='text-[#819E7A] w-45 md:w-auto md:text-3xl pb-5 font-light'>
              팀장에게 받은 <span className='font-semibold'>초대코드</span>로 팀에 가입해보세요 !
            </div>
            {/*  END  */}

            {/*  SubTitle  */}
            <div className='flex border-t md:border-t-2 border-[#819E7A] md:w-85 pt-3'> 
              <div>
                <img
                  src="/logo.png" // 👉 public 폴더에 이미지 넣어
                  alt="logo preview"
                />
              </div>
              <div className='pt-5 ml-3'>
                <div className='text-[#5D5D5D] text-3xl font-semibold'>
                  Join a team
                </div>
                <div className='text-[#9E9E9E] text-sm font-light'>
                  초대코드를 입력하세요.
                </div>
              </div>
            </div>
            {/*  END  */}

            {/* 초대코드 입력란*/}
            <form onSubmit={handleSubmit}>
              <div>
                <input type="text" placeholder="Enter invite code ...."
                className='w-full h-13 px-4 py-2 mt-2 bg-[#819E7A] focus:ring-2 focus:ring-[#BCCBB8] transition-all'
                onChange={(e) => setCode(e.target.value)} />
              </div>
              <div>
                <input type="text" placeholder="Enter invite code again ...."
                className='w-full h-13 px-4 py-2 mt-2 bg-[#819E7A] focus:ring-2 focus:ring-[#BCCBB8] transition-all'
                onChange={(e) => setConfirmCode(e.target.value)}/>
              </div>

              <div className='flex justify-center mt-5'>
                <button type='submit' className=' w-25 md:w-40 p-3 bg-[#819E7A] text-white hover:opacity-90 active:scale-95 transition'>가입하기</button>
              </div>

              <p className='mt-2 text-xs font-light text-center text-gray-700'>
              코드가 없나요? {""}
              <a href="/dashboard" className='font-semibold hover:underline text-black'>
                팀생성
              </a>
              </p>
            </form>
            {/*  END  */}

          </div>
        </div>




      </div>
    </div>
  )
}

export default JoinPage

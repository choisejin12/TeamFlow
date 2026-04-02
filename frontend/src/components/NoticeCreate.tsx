import { useState } from 'react';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import { useCreateNotice } from '../hooks/useAdmin';

type Props = {
  onSuccess?: () => void; // 기존 구조 유지 (안써도 됨)
};

const NoticeCreate = () => {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');

  const createNotice = useCreateNotice();


  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error('내용을 입력하세요');
      return;
    }

    createNotice.mutate(title, {
      onSuccess: () => {
        toast.success('공지 생성 완료');
        setTitle('');
        setShowForm(false);
      },
      onError: () => {
        toast.error('공지 생성 실패');
      },
    });
  };

  return (
    <div >

      {/* 🔵 버튼 */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-black text-white px-4 py-2 rounded-md"
      >
        공지 작성하기
      </button>

      {/* 🔵 입력창 */}
      {showForm && (
        <div className="flex flex-col md:gap-4 md:flex-row mt-4 space-y-3 md:w-xl ">

          <input
            type="text"
            placeholder="공지 내용을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          />

          <div className="flex gap-3 md:w-full">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-1 rounded-md "
            >
              등록
            </button>

            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-300 px-4 py-1 rounded-md"
            >
              취소
            </button>
          </div>

        </div>
      )}

    </div>
  );
};

export default NoticeCreate;
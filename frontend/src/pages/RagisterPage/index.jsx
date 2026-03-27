// src/pages/Register.jsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../store/thunkFunctions';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { useForm } from 'react-hook-form';
import { AiOutlineSmile } from 'react-icons/ai';


function Register() {
 // 전체 흐름 
  // 입력 → register로 추적 → 검증 → handleSubmit → onSubmit 실행
  const navigate = useNavigate();
    const {
      register, // input을 react-hook-form에 등록
      handleSubmit, // 검증 → 성공 시 onSubmit 실행
      watch, //비밀번호 일치확인
      formState: { errors }, // 검증 실패 시 에러 정보 저장
      reset // 리셋 함수
    } = useForm({ mode: 'onChange'}) // 입력 값이 바뀔 때 마다 실행

    const dispatch = useDispatch();


  const onSubmit = ({ email,password, name}) => { // 검증 성공 후 실행
    // email,password 👉 register된 input 값들을 자동으로 모아서 줌
    const body = {
      email,
      password,
      name
    }

    dispatch(registerUser(body)) // Redux thunk 실행
      .unwrap()
      .then(() => {
        toast("TeamFlow 멤버가 되신 걸 환영합니다 !")
        navigate('/login');
      })
      .catch((err) => {
        toast.error(err);
      })

    reset();
    }

  const userEmail = {
    required : "필수 필드입니다.",
    pattern: {
      value: /\S+@\S+\.\S+/,
      message: "올바른 이메일 형식이 아닙니다.",
    }
    
  }

  const userPassword = {
    required : "필수 필드입니다.",
    minLength: {
      value : 6,
      message: "최소 6자 이상 입력해주세요.",
    }
  }

  const userName = {
    required : "필수 필드입니다."
  }

  const password = watch("password");

  return (
    <div className="min-h-screen bg-[#BCCBB8] flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-xl p-8 md:p-12">
        {/* 상단 영역 */}
        <div className='flex flex-col items-center justify-center '>
            <p className='font-bold text-4xl'>Welcome <AiOutlineSmile className='inline'/> </p>
            <p className='text-[#9F9F9F] md:text-xl font-light text-xs'>Please enter your detail to sign up.</p>

        </div>

        {/* 회원가입 영역 */}
        <div>
          <form className='mt-6' onSubmit={handleSubmit(onSubmit)}> 
            {/*
            handleSubmit = "검사하고 나서 실행해주는 함수"
            검사 먼저 하고 통과하면 onSubmit 실행
            */}
            <div className='mb-2'>
              <label htmlFor="name" className='text-sm font-semibold text-gray-800'>이름</label>
              <input type="text" id="name" placeholder="Enter your name"
              {...register('name', userName)} className='w-full h-13 px-4 py-2 mt-2 bg-white border rounded-4xl border-[#727272]'/>
              {
                errors?.name &&
                <div>
                  <span className='text-red-500 text-xs'>
                    {errors.name.message}
                  </span>
                </div>
              }
            </div>
            <div className='mb-2'>
              <label htmlFor="email" className='text-sm font-semibold text-gray-800'>이메일</label>
              <input type="email" id="email" placeholder="Enter your email"
              {...register('email', userEmail)} className='w-full px-4 h-13 py-2 mt-2 bg-white border rounded-4xl border-[#727272]'/>
              {/* 
              register 👉 검증까지 자동 연결됨 
              'email' 👉 폼 데이터의 key 이름 -> 결과적으로 이렇게 됨 onSubmit({ email, password, name })
              
              < 전체적인 흐름 >
              (1) input 입력
              (2) register가 값 추적
              (3) validation 적용
              (4) submit 시 값 모아서
              (5) onSubmit으로 전달
              
              */}
              {
                errors?.email &&
                <div>
                  <span className='text-red-500 text-xs'>
                    {errors.email.message}
                  </span>
                </div>
              }
            </div>

            <div className='mb-2'>
              <label htmlFor="password" className='text-sm font-semibold text-gray-800'>비밀번호</label>
              <input type="password" id="password" placeholder="Enter your password"
              {...register('password', userPassword)} className='w-full h-13 px-4 py-2 mt-2 bg-white border rounded-4xl border-[#727272]'/>
              {
                errors?.password &&
                <div>
                  <span className='text-red-500 text-xs'>
                    {errors.password.message}
                  </span>
                </div>
              }
            </div>


            
            <div className='mb-2'>
              <label htmlFor="password" className='text-sm font-semibold text-gray-800'>비밀번호 확인</label>
              <input
                type="password"
                placeholder="Enter your password again"
                {...register("confirmPassword", {
                  required: "필수 필드입니다.",
                  validate: (value) =>
                    value === password || "비밀번호가 일치하지 않습니다.",
                })}
                className="w-full h-13 px-4 py-2 mt-2 bg-white border rounded-4xl border-[#727272]"
              />
              {errors?.confirmPassword && (
                <span className="text-red-500 text-xs">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>

            <div className='mt-6'>
              <button type='submit' className='w-full px-4 py-2 text-white duration-200 bg-black rounded-md hover:bg-gray-700'>
                회원가입 하기
              </button>
            </div>

            <p className='mt-2 text-xs font-light text-center text-gray-700'>
              아이디가 있다면? {""}
              <a href="/login" className='font-semibold hover:underline text-black'>
                로그인
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;


/*
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.user);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleRegister = () => {
    dispatch(registerUser(form))
      .unwrap()
      .then(() => {
        alert('회원가입 성공');
        navigate('/login');
      })
      .catch(() => {});
  };

  return (
    <div>
      <h2>Register</h2>

      <input
        placeholder="name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        placeholder="email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        placeholder="password"
        type="password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button onClick={handleRegister} disabled={loading}>
        회원가입
      </button>

      <button onClick={() => navigate('/login')}>
        로그인으로 이동
      </button>

      {error && <p style={{ color: 'red' }}>회원가입 실패</p>}
    </div>
  );

*/
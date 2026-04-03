// src/pages/Login.jsx
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { setUser } from '../../store/userSlice'; 
import { useLogin } from '../../features/auth/useLogin';



function Login() {
  type FormValues = {
    email: string;
    password: string;
  };

  const navigate = useNavigate();

    const {
      register, // input을 react-hook-form에 등록
      handleSubmit, // 검증 → 성공 시 onSubmit 실행
      formState: { errors }, // 검증 실패 시 에러 정보 저장
      reset // 리셋 함수
    } = useForm<FormValues>({ mode: 'onChange' }) // 입력 값이 바뀔 때 마다 실행

    const dispatch = useDispatch();
  const { mutate } = useLogin();

  const onSubmit = ({ email, password }: FormValues) => {
    const body = { email, password };

    mutate(body, {
      onSuccess: (user) => {
        dispatch(setUser(user)); 
        navigate('/dashboard');
        reset();
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || "로그인 실패");
      },
    });
  };


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


  return (
    <div className="min-h-screen bg-[#BCCBB8] flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-xl p-8 md:p-12">
        {/* 상단 영역 */}
        <div className='flex flex-col items-center justify-center '>
          <img
              src="/logo.png" 
              alt="logo preview"
              className="w-15 md:w-20"
            />
            <p className='font-bold text-4xl'>Welcome back</p>
            <p className='text-[#9F9F9F] md:text-xl font-light text-xs'>Please enter your detail to sign in.</p>
            <button className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-full mt-4">
              카카오 로그인
            </button>
        </div>

        {/* 로그인 영역 */}
        <div>
          <form className='mt-6' onSubmit={handleSubmit(onSubmit)}> 
            {/*
            handleSubmit = "검사하고 나서 실행해주는 함수"
            검사 먼저 하고 통과하면 onSubmit 실행
            */}
            
            <div className='mb-2'>
              <label htmlFor="email" className='text-sm font-semibold text-gray-800'>이메일</label>
              <input type="email" id="email" placeholder="Enter your email"
              {...register('email', userEmail)} className='w-full px-4 h-13 py-2 mt-2 bg-white border rounded-4xl border-[#727272] focus:ring-2 focus:ring-[#BCCBB8] transition-all'/>
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
              {...register('password', userPassword)} className='w-full h-13 px-4 py-2 mt-2 bg-white border rounded-4xl border-[#727272] focus:ring-2 focus:ring-[#BCCBB8] transition-all'/>
              {
                errors?.password &&
                <div>
                  <span className='text-red-500 text-xs'>
                    {errors.password.message}
                  </span>
                </div>
              }
            </div>

            <div className='mt-6'>
              <button type='submit' className='w-full px-4 py-2 text-white duration-200 bg-black rounded-md hover:bg-gray-700 hover:opacity-90 active:scale-95 transition'>
                로그인 하기
              </button>
            </div>

            <p className='mt-2 text-xs font-light text-center text-gray-700'>
              아이디가 없다면? {""}
              <a href="/register" className='font-semibold hover:underline text-black'>
                회원가입
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaCheckSquare, FaUsers, FaCalendarAlt } from "react-icons/fa";

function Home() {
  const navigate = useNavigate();
  const isAuth = useSelector((state) => state.user?.isAuth); 

  return (
    <div className="min-h-screen bg-[#BCCBB8] flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-6xl p-8 md:p-12">

        {/* 🔥 상단 영역 */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">

          {/* 왼쪽 텍스트 */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 leading-snug">
              TeamFlow에 오신것을 <br /> 환영합니다!
            </h1>
            <p className="text-gray-500 mt-4">
              팀 협업과 일정 관리를 위한 최고의 서비스!
            </p>

            {/* 버튼 */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center md:justify-start">

              {!isAuth ? (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="bg-[#BCCBB8] hover:bg-[#92B189] text-white px-6 py-2 rounded-xl"
                  >
                    로그인
                  </button>

                  <button
                    onClick={() => navigate("/register")}
                    className="hover:bg-[#92B189] hover:text-white border border-gray-300 px-6 py-2 rounded-xl hover:shadow-md"
                  >
                    회원가입
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="bg-[#BCCBB8] hover:bg-[#92B189] text-white px-6 py-2 rounded-xl"
                >
                  대쉬보드로 이동하기
                </button>
              )}
            </div>
          </div>

          {/* 오른쪽 이미지 */}
          <div className="flex-1 flex justify-center">
            <img
              src="/hero.png" // 👉 public 폴더에 이미지 넣어
              alt="todo preview"
              className="w-72 md:w-96"
            />
          </div>
        </div>

        {/* 🔥 기능 소개 */}
        <div className="mt-12 bg-linear-to-t from-[rgba(240,249,240,0.33)] to-[#F0F9F0] rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">

          <div className="flex flex-col items-center border-b md:border-b-0 md:border-r border-[#92B189] pb-4 md:pb-0">
            <FaCheckSquare className="text-[#92B189] text-3xl mb-2" />
            <h3 className="font-semibold">간편한 ToDo 관리</h3>
            <p className="text-sm text-gray-500">
              할 일을 쉽게 설정하고 관리할 수 있어요.
            </p>
          </div>

          <div className="flex flex-col items-center border-b md:border-b-0 md:border-r border-[#92B189] pb-4 md:pb-0">
            <FaUsers className="text-[#92B189] text-3xl mb-2" />
            <h3 className="font-semibold">효율적인 팀 협업</h3>
            <p className="text-sm text-gray-500">
              멤버들과 함께 일정과 업무를 공유해보세요.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <FaCalendarAlt className="text-[#92B189] text-3xl mb-2" />
            <h3 className="font-semibold">일정 관리 기능</h3>
            <p className="text-sm text-gray-500">
              캘린더로 일정을 한 눈에 확인할 수 있어요.
            </p>
          </div>

        </div>

        {/* 🔥 하단 CTA */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6">

          <div className="text-center md:text-left">
            <h2 className="text-xl font-semibold">
              지금 바로 시작해보세요!
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              가입은 무료이며, 이메일 계정으로 간편하게 시작할 수 있습니다.
            </p>
          </div>

          <button
            onClick={() => navigate(isAuth ? "/dashboard" : "/register")}
            className="bg-[#BCCBB8] hover:bg-[#92B189] text-white px-8 py-3 rounded-xl"
          >
            {isAuth ? "대쉬보드로 이동하기" : "회원가입"}
          </button>
        </div>

      </div>
    </div>
  );
}

export default Home;
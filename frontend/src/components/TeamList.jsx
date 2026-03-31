import { useNavigate } from 'react-router-dom';

function TeamList({ teams }) {
  const navigate = useNavigate();
  return (
    <>
            {/* 팀 리스트 */}
        <div className="space-y-3">
            {teams.length === 0 && (
              <div className="bg-white rounded-2xl border border-[#BCCBB8] p-6 text-center text-gray-500">
                아직 가입된 팀이 없습니다.
              </div>
            )}
          {/* 🔵 모바일  */}
          <div className="md:hidden space-y-3">
            {teams.map((team) => (
              <div
                key={team._id}
                className="bg-white px-4 py-4 rounded-2xl border border-[#BCCBB8]"
              >
                {/* 상단 */}
                <div className="flex items-center gap-3">
                  
                  {/* 아이콘 */}
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ backgroundColor: team.color }}
                  >
                    {team.name[0]}
                  </div>

                  {/* 텍스트 */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">
                      {team.name}
                    </p>
                    <p className="text-xs text-gray-500 break-keep">
                      {team.description}
                    </p>
                  </div>

                  {/* 역할 */}
                  <span
                    className={`rounded-full px-2 py-1 text-[10px] font-medium whitespace-nowrap ${
                      team.role === 'OWNER'
                        ? 'bg-[#819E7A] text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {team.role || 'MEMBER'}
                  </span>
                </div>

                {/* 버튼 (이미지처럼 아래) */}
                <button
                  onClick={() => navigate(`/teams/${team._id}`)}
                  className="mt-3 w-full h-9 rounded-full border border-gray-300 px-4 text-sm bg-[#F8F8F8] hover:bg-[#819E7A] hover:text-white text-[#819E7A] font-semibold"
                >
                  팀 들어가기 →
                </button>
              </div>
            ))}
          </div>
        </div>


        {/* 🟢 PC */}
        <div className="hidden md:block">
            {teams.length === 0 && (
              <div className="bg-white rounded-2xl border border-[#BCCBB8] p-6 text-center text-gray-500">
                아직 가입된 팀이 없습니다.
              </div>
            )}
          {teams
          .filter((team) => team?.teamId)
          .map((team) => (
            <div
              key={team._id}
              className="flex items-center justify-between bg-white px-5 py-4 transition mb-0 first:rounded-t-2xl last:rounded-b-2xl border-t border-l border-r last:border-b border-[#BCCBB8]"
            >
              {/* 왼쪽 */}
              <div className="flex items-center gap-4">
                
                <div className="flex h-11 w-11 items-center justify-center rounded-full text-lg font-bold text-white" style={{ backgroundColor: team.color }}>
                  {team.name[0]}
                </div>

                <div>
                  <p className="font-semibold">{team.name}</p>
                  <p className="text-sm text-gray-500">
                    {team.description}
                  </p>
                </div>
              </div>

              {/* 오른쪽 */}
              <div className="flex items-center gap-3 shrink-0">
                
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    team.role === 'OWNER'
                      ? 'bg-[#819E7A] text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {team.role || 'MEMBER'}
                </span>

                <button
                  onClick={() => navigate(`/teams/${team?.teamId}`)}
                  className="shrink-0 w-72 h-10 rounded-full border border-gray-300 px-4 py-1 text-sm bg-[#F8F8F8] hover:bg-[#819E7A] hover:text-white text-[#819E7A] font-semibold"
                >
                  팀 들어가기 →
                </button>
              </div>
            </div>
          ))}
        </div>
    </>
  );
}

export default TeamList;
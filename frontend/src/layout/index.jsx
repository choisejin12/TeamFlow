import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import NavItems from './Sections/NavItem';

function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#dfe8d8] p-4 md:p-6">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1400px] overflow-hidden rounded-[30px] bg-white shadow-xl">

        {/* 🔥 데스크톱 사이드바 */}
        <aside className="hidden w-[260px] bg-[#f3f6f0] p-6 md:block">
          <NavItems />
        </aside>

        {/* 🔥 모바일 overlay */}
        {open && (
          <div
            className="fixed inset-0 z-40 bg-black/30 md:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        {/* 🔥 모바일 사이드 메뉴 */}
        <div
          className={`fixed left-0 top-0 z-50 h-full w-[75%] max-w-75 bg-[#f3f6f0] p-0 transition-transform duration-300 md:hidden 
          ${open ? 'translate-x-0' : '-translate-x-full'}`}
        >
          {/* 상단 */}
          <div className="flex items-center justify-between bg-[#BCCBB8] h-16 m-0 p-6">
            <h2 className="text-lg font-bold">TeamFlow</h2>
            <button onClick={() => setOpen(false)}>X</button>
          </div>
          <NavItems className="p-2" onClose={() => setOpen(false)} />
        </div>

        {/* 🔥 메인 영역 */}
        <div className="flex flex-1 flex-col">

          {/* 모바일 헤더 */}
          <div className="flex items-center justify-between border-b px-4 py-3 md:hidden">
            <button onClick={() => setOpen(true)}>☰</button>
            <h2 className="font-bold">TeamFlow</h2>
          </div>

          {/* 페이지*/}
          <div className="flex-1 p-4 md:p-8">
            <Outlet />
          </div>  
        </div>

      </div>
    </div>
  );
}

export default Layout;
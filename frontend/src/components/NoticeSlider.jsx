import { useEffect, useState } from "react";

export default function NoticeSlider({ notice }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    
    if (!notice || notice.length === 0) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % notice.length);
    }, 3000); // 3초마다 변경

    return () => clearInterval(interval);
  }, [notice]);

  return (
    <div className="h-6 overflow-hidden">
    <div
        className="transition-transform duration-500 ease-in-out"
        style={{
        transform: `translateY(-${index * 24}px)`
        }}
    >
        {notice.map((item) => (
        <div
            key={item._id}
            className="h-6 flex items-center text-gray-600"
        >
            {item.title}
        </div>
        ))}
    </div>
    </div>
  );
}
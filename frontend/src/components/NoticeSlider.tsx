import { useEffect, useState } from "react";

type Notice = {
  _id: string;
  title: string;
};

type Props = {
  notice: Notice[];
};

export default function NoticeSlider({ notice }: Props) {
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    if (!notice || notice.length === 0) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % notice.length);
    }, 3000);

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
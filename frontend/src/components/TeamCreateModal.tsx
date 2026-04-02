import { useState } from 'react';

const colors = [
  '#000000',
  '#15803d',
  '#2563eb',
  '#94a3b8',
  '#e7a4a4',
  '#d6b98c'
];

type CreateTeamInput = {
  name: string;
  description: string;
  color: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: CreateTeamInput) => void;
};

export default function TeamCreateModal({ isOpen, onClose, onCreate }: Props) {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>(colors[0]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onCreate({
      name: title,
      description,
      color: selectedColor
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 h-full">
      
      {/* 모달 */}
      <div className="bg-white w-125 rounded-3xl p-6 relative shadow-lg">
        
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-xl font-bold"
        >
          x
        </button>

        {/* 헤더 */}
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 rounded-full bg-blue-300 flex items-center justify-center text-white font-bold text-xl">
            P
          </div>
          <div className="ml-3">
            <h2 className="text-xl font-bold">Create a new team !</h2>
            <p className="text-sm text-gray-500">
              팀 이름과 설명을 추가하여 팀을 생성해보세요.
            </p>
          </div>
        </div>

        <form
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {/* 입력 */}
          <div className="mb-4">
            <label className="text-sm text-gray-600">팀 이름</label>
            <input
              className="w-full border rounded-lg p-2 mt-1 border-[#BCCBB8]"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="text-sm text-gray-600">설명</label>
            <input
              className="w-full border rounded-lg p-2 mt-1 border-[#BCCBB8]"
              value={description}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
            />
          </div>

          {/* 색상 선택 */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">아이콘 설정</p>
            <div className="flex gap-3">
              {colors.map((color) => (
                <div
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
                    selectedColor === color ? 'border-black' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#7A9276] text-white"
            >
              생성하기
            </button>
          </div>
        </form>




      </div>
    </div>
  );
}
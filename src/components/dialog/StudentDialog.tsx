import React, { useState, useEffect } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  name: string;
  weight: number;
  likes: number;
  onSave: (weight: number, likes: number, password: string) => void;
}

export const StudentDialog: React.FC<Props> = ({ open, onClose, name, weight, likes, onSave }) => {
  const [localWeight, setLocalWeight] = useState(weight);
  const [localLikes, setLocalLikes] = useState(likes);
  const [password, setPassword] = useState('admin');

  useEffect(() => {
    if (open) {
      setLocalWeight(weight);
      setLocalLikes(likes);
      setPassword('');
    }
  }, [open, weight, likes]);

  const handleSave = () => {
    if (password !== 'admin') {
      alert('密码错误，请输入正确的密码');
      return;
    }
    onSave(localWeight, localLikes, password);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-xl p-6 rounded-2xl shadow-2xl w-80 animate-fade-in">
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">编辑学生信息</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
          <div className="p-2 bg-gray-100 rounded text-gray-800">{name}</div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">权重</label>
          <input
            type="number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={localWeight}
            min={0}
            onChange={(e) => setLocalWeight(parseInt(e.target.value) || 0)}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">点赞数</label>
          <input
            type="number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
            value={localLikes}
            min={0}
            onChange={(e) => setLocalLikes(parseInt(e.target.value) || 0)}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
          <input
            type="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
};

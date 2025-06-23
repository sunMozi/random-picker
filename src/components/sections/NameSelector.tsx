// NameSelector.tsx
import React from 'react';

interface NameSelectorProps {
  selectedName: string;
  isRunning: boolean;
  names: unknown[];
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  onLike: (name: string, button: HTMLElement) => void;
}

const NameSelector: React.FC<NameSelectorProps> = ({
  selectedName,
  isRunning,
  names,
  onStart,
  onStop,
  onReset,
  onLike,
}) => {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
      <div className="relative h-64 mb-8 flex flex-col items-center justify-center">
        <div
          className={`text-7xl font-extrabold transition-all duration-200 select-none ${
            isRunning ? 'text-indigo-600 animate-pulse' : 'text-gray-900'
          }`}
        >
          {selectedName || '准备就绪'}
        </div>
        {selectedName && (
          <button
            onClick={(e) => {
              const button = e.target as HTMLElement;
              onLike(selectedName, button);
            }}
            className="mt-4 px-6 py-2 bg-pink-300 text-pink-900 rounded-full shadow-md relative overflow-hidden"
          >
            👍 点赞
          </button>
        )}
      </div>

      <div className="flex justify-center gap-6 mb-8">
        {!isRunning ? (
          <button
            className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl shadow-md hover:scale-105 hover:from-purple-500 hover:to-indigo-500 transition-transform focus:ring-4"
            onClick={onStart}
            disabled={names.length === 0}
          >
            开始
          </button>
        ) : (
          <button
            className="px-8 py-3 bg-red-600 text-white rounded-xl shadow-md hover:bg-red-700 focus:ring-4"
            onClick={onStop}
          >
            停止
          </button>
        )}
        <button
          onClick={onReset}
          className="px-8 py-3 bg-gray-400 text-white rounded-xl shadow-md hover:bg-gray-500 focus:ring-4"
        >
          重置已点名单
        </button>
      </div>
    </div>
  );
};

export default NameSelector;

import React from 'react';
import '../../styles/animations.css';

interface NameSelectorProps {
  selectedName: string;
  isRunning: boolean;
  names: unknown[];
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  onLike: (name: string, button: HTMLElement) => void;
  showShine: boolean;
  isStopping: boolean; // 新增：点击停止后，停止按钮隐藏
}

const NameSelector: React.FC<NameSelectorProps> = ({
  selectedName,
  isRunning,
  names,
  onStart,
  onStop,
  onReset,
  onLike,
  showShine,
  isStopping, // 新增解构
}) => {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
      <div className="relative h-64 mb-8 flex flex-col items-center justify-center">
        <div
          className={`text-[3.5rem] md:text-[5rem] lg:text-[6rem]
                      font-extrabold leading-tight tracking-wide text-center relative z-10 ${
                        isRunning
                          ? 'hearthstone-animate'
                          : `text-gray-900 select-none ${showShine ? 'shine-animation' : ''}`
                      }`}
        >
          {selectedName || '准备就绪'}
        </div>

        {!isRunning && selectedName && (
          <button
            onClick={(e) => {
              const button = e.currentTarget;
              onLike(selectedName, button);
            }}
            className="mt-4 px-6 py-2 bg-pink-300 text-pink-900 rounded-full shadow-md relative overflow-hidden select-none"
          >
            👍 点赞
          </button>
        )}
      </div>

      {/* 控制按钮区域只在非运行时显示 */}
      {!isRunning && (
        <div className="flex justify-center gap-6 mb-8">
          <button
            className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl shadow-md hover:scale-105 hover:from-purple-500 hover:to-indigo-500 transition-transform focus:ring-4"
            onClick={onStart}
            disabled={names.length === 0}
          >
            开始
          </button>

          <button
            onClick={onReset}
            className="px-8 py-3 bg-gray-400 text-white rounded-xl shadow-md hover:bg-gray-500 focus:ring-4"
          >
            重置已点名单
          </button>
        </div>
      )}

      {/* 可选：若你想在运行中仍保留“停止”按钮，可以放开这个部分 */}
      {isRunning &&
        !isStopping && ( // 修改：只有运行状态且未点击停止时显示停止按钮
          <div className="flex justify-center mb-8">
            <button
              className="px-8 py-3 bg-red-600 text-white rounded-xl shadow-md hover:bg-red-700 focus:ring-4"
              onClick={onStop}
            >
              停止
            </button>
          </div>
        )}
    </div>
  );
};

export default NameSelector;

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';

export const NineGrid = () => {
  const items = useMemo(
    () => ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    []
  );

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [drawCount, setDrawCount] = useState(0); // 新增：记录抽奖次数

  const stepRef = useRef(0);
  const intervalRef = useRef(50); // 修改：减少初始间隔时间
  const finalIndexRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  const MAX_DRAW_COUNT = 20; // 新增：最大抽奖次数

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const reset = () => {
    // 新增：重置功能
    clearTimer();
    setSelectedIndex(null);
    setResult(null);
    setIsDrawing(false);
    setDrawCount(0);
    stepRef.current = 0;
    intervalRef.current = 50; // 修改：重置为新的初始间隔时间
  };

  const spin = useCallback(() => {
    const totalSteps = 40 + finalIndexRef.current;
    const currentStep = stepRef.current;

    setSelectedIndex(currentStep % items.length);
    stepRef.current += 1;

    if (totalSteps - currentStep < 8) {
      intervalRef.current += 20; // 修改：减少每步增加的时间
    }

    if (stepRef.current < totalSteps) {
      timerRef.current = window.setTimeout(spin, intervalRef.current);
    } else {
      setSelectedIndex(finalIndexRef.current);
      setResult(items[finalIndexRef.current]);
      setIsDrawing(false);
      stepRef.current = 0;
      intervalRef.current = 50; // 修改：重置为新的初始间隔时间
    }
  }, [items]);

  const handleDraw = () => {
    if (isDrawing || drawCount >= MAX_DRAW_COUNT) return; // 限制抽奖次数

    setIsDrawing(true);
    setResult(null);
    setDrawCount((prev) => prev + 1); // 更新抽奖次数

    finalIndexRef.current = Math.floor(Math.random() * items.length);
    stepRef.current = 0;
    intervalRef.current = 50; // 修改：重置为新的初始间隔时间

    spin();
  };

  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, []);

  return (
    <div className="" role="region" aria-label="九宫格抽奖区">
      <div
        className="mt-2 text-center text-lg font-bold text-green-700"
        aria-live="polite"
      >
        {'恭喜抽中了' + result + '号题目' || '请等待抽奖结果'}
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        {items.map((item, index) => (
          <div
            key={index}
            className={`flex items-center justify-center h-16 text-center bg-gradient-to-br from-white to-gray-100 text-gray-700 text-lg font-semibold rounded-lg shadow-lg transition-transform duration-200 ease-in-out ${
              selectedIndex === index
                ? 'bg-gradient-to-br from-green-400 to-green-600 scale-110 ring-4 ring-green-500 animate-pulse'
                : 'hover:scale-105 hover:shadow-xl'
            }`}
            aria-label={`号码 ${item} ${selectedIndex === index ? '选中' : ''}`}
            tabIndex={0}
          >
            {item}
          </div>
        ))}
        <button
          onClick={handleDraw}
          disabled={isDrawing || drawCount >= MAX_DRAW_COUNT}
          className={`flex items-center justify-center text-white font-bold text-lg py-3 px-6 rounded-lg shadow-lg col-span-3 transition-all duration-200 ease-in-out ${
            isDrawing || drawCount >= MAX_DRAW_COUNT
              ? 'bg-gradient-to-br from-gray-400 to-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-br from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 focus:outline-none focus:ring-4 focus:ring-yellow-300'
          }`}
          aria-disabled={isDrawing || drawCount >= MAX_DRAW_COUNT}
          aria-live="assertive"
        >
          {isDrawing
            ? '抽奖中...'
            : drawCount >= MAX_DRAW_COUNT
            ? '抽奖次数已用完'
            : '立即抽奖'}
        </button>
        <button
          onClick={reset}
          className="flex items-center justify-center text-white font-bold text-lg py-3 px-6 rounded-lg shadow-lg col-span-3 bg-gradient-to-br from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 mt-4 transition-all duration-200 ease-in-out"
        >
          重置
        </button>
      </div>
    </div>
  );
};

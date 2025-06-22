import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Brush,
} from 'recharts';
import { LikeRanking } from './LikeRanking';
import { StudentDialog } from '../dialog/StudentDialog';
import { NineGrid } from '../NineGrid';

interface NameEntry {
  name: string;
  weight: number;
  number: number;
  count: number;
}

const RANDOM_INTERVAL = 30;
const MIN_WEIGHT = 0;
const TOP_N = 10;

export const HomeWork = () => {
  const [names, setNames] = useState<NameEntry[]>([]);
  const [selectedName, setSelectedName] = useState<string>('');
  const [calledNames, setCalledNames] = useState<string[]>([]);
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentEditName, setCurrentEditName] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(''); // 添加搜索状态
  const [filteredNames, setFilteredNames] = useState<NameEntry[]>([]); // 添加过滤后的名单状态

  const handleOpenDialog = (name: string) => {
    setCurrentEditName(name);
    setDialogOpen(true);
  };

  const handleSaveEdit = (newWeight: number, newLikes: number) => {
    if (!currentEditName) return;

    setNames((prev) =>
      prev.map((entry) =>
        entry.name === currentEditName ? { ...entry, weight: newWeight } : entry
      )
    );

    setLikes((prev) => {
      const updated = { ...prev, [currentEditName!]: newLikes };
      localStorage.setItem('nameLikes', JSON.stringify(updated));
      return updated;
    });

    setDialogOpen(false);
  };

  const topNames = useMemo(() => {
    return names
      .filter((entry) => entry.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, TOP_N);
  }, [names]);

  const loadSavedCounts = useCallback(() => {
    try {
      const saved = localStorage.getItem('nameCounts');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error('Failed to load counts from localStorage:', e);
      return {};
    }
  }, []);

  const saveCountsToStorage = useCallback((names: NameEntry[]) => {
    try {
      const counts = names.reduce((acc, entry) => {
        acc[entry.name] = entry.count;
        return acc;
      }, {} as Record<string, number>);
      localStorage.setItem('nameCounts', JSON.stringify(counts));
    } catch (e) {
      console.error('保存失败:', e);
    }
  }, []);

  const handleLike = useCallback((name: string, button: HTMLElement) => {
    setLikes((prevLikes) => {
      const updated = {
        ...prevLikes,
        [name]: (prevLikes[name] || 0) + 1,
      };
      localStorage.setItem('nameLikes', JSON.stringify(updated));
      return updated;
    });

    const emojis = ['❤️', '💖', '💕', '💗', '💓', '💞', '💝'];
    const colors = [
      '#FF5252',
      '#FF4081',
      '#E040FB',
      '#7C4DFF',
      '#536DFE',
      '#448AFF',
      '#40C4FF',
    ];

    const fragment = document.createDocumentFragment(); // 使用 DocumentFragment 提高性能
    const count = Math.floor(Math.random() * 3) + 3;

    for (let i = 0; i < count; i++) {
      const like = document.createElement('div');
      like.className = 'heart-animation';
      like.innerText = emojis[Math.floor(Math.random() * emojis.length)];
      like.style.color = colors[Math.floor(Math.random() * colors.length)];
      like.style.fontSize = `${Math.random() * 16 + 70}px`;
      like.style.position = 'fixed';
      like.style.left = `${Math.random() * window.innerWidth}px`;
      like.style.top = `${Math.random() * window.innerHeight}px`;

      fragment.appendChild(like);

      setTimeout(() => {
        like.remove();
      }, 800 + Math.random() * 400);
    }

    button.appendChild(fragment); // 一次性添加所有动画元素
  }, []);

  useEffect(() => {
    audioRef.current = new Audio('/tick-sound.mp3');

    const savedLikes = localStorage.getItem('nameLikes');
    if (savedLikes) {
      setLikes(JSON.parse(savedLikes));
    }
  }, []);

  useEffect(() => {
    // 加载本地存储的点名历史
    const savedHistory = localStorage.getItem('callHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const getStudentList = useCallback(async () => {
    const savedCounts = loadSavedCounts();
    try {
      const response = await fetch('/names.txt');
      const text = await response.text();
      const parsedNames = text
        .split('\n')
        .filter(Boolean)
        .map((line) => {
          const [name, numberStr, weightStr] = line.split(',');
          const trimmedName = name.trim();
          return {
            name: trimmedName,
            number: parseInt(numberStr, 10) || 0,
            weight: Math.max(parseInt(weightStr, 10) || 0, 0),
            count: savedCounts[trimmedName] || 0,
          };
        });
      setNames(parsedNames);
    } catch (error) {
      console.error('Failed to fetch student list:', error);
    }
  }, [loadSavedCounts]);

  const getWeightedList = useCallback(() => {
    return names.flatMap((entry) =>
      entry.weight >= MIN_WEIGHT ? Array(entry.weight).fill(entry) : []
    );
  }, [names]);

  const startRandomSelect = useCallback(() => {
    const weightedList = getWeightedList();
    if (weightedList.length === 0) {
      alert('请先设置有效权重(至少一个权重≥1)');
      return;
    }

    setIsRunning(true);
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = window.setInterval(() => {
      setNames((prevNames) => {
        const newWeightedList = prevNames.flatMap((entry) =>
          entry.weight >= MIN_WEIGHT ? Array(entry.weight).fill(entry) : []
        );
        const randomIndex = Math.floor(Math.random() * newWeightedList.length);
        const selectedEntry = newWeightedList[randomIndex];
        if (selectedEntry) {
          setSelectedName(selectedEntry.name);
          // audioRef.current?.play().catch((err) => {
          //   if (err.name !== 'NotAllowedError') {
          //     console.error('音效播放失败:', err);
          //   }
          // });
        }
        return prevNames;
      });
    }, RANDOM_INTERVAL);
  }, [getWeightedList]);

  const stopRandomSelect = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    audioRef.current?.pause();

    setNames((prevNames) => {
      const updated = prevNames.map((entry) =>
        entry.name === selectedName
          ? { ...entry, count: entry.count + 1 }
          : entry
      );
      saveCountsToStorage(updated);
      return updated;
    });

    setCalledNames((prev) =>
      selectedName && !prev.includes(selectedName)
        ? [...prev, selectedName]
        : prev
    );

    if (selectedName) {
      const timestamp = new Date().toLocaleString();
      setHistory((prevHistory) => {
        const updatedHistory = [
          ...prevHistory,
          { name: selectedName, time: timestamp },
        ];
        localStorage.setItem('callHistory', JSON.stringify(updatedHistory)); // 保存到本地存储
        return updatedHistory;
      });
    }
  }, [selectedName, saveCountsToStorage]);

  const resetCalledNames = useCallback(() => {
    setSelectedName('');
    setCalledNames([]);
    setHistory([]); // 清空历史记录
    localStorage.removeItem('callHistory'); // 从本地存储中移除历史记录
  }, []);

  useEffect(() => {
    getStudentList();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [getStudentList]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredNames(names); // 恢复完整列表
    } else {
      setFilteredNames(
        names.filter((entry) =>
          entry.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, names]); // 监听搜索输入和名单变化

  // 添加公平性分析计算逻辑
  const fairnessAnalysis = useMemo(() => {
    const totalWeight = names.reduce((sum, entry) => sum + entry.weight, 0);
    const totalCalls = calledNames.length;

    return names
      .map((entry) => ({
        name: entry.name,
        expected: totalWeight > 0 ? entry.weight / totalWeight : 0,
        actual: totalCalls > 0 ? entry.count / totalCalls : 0,
      }))
      .sort((a, b) => b.expected - a.expected)
      .slice(0, 20); // 只计算一次，避免重复排序
  }, [names, calledNames]);

  const [studentGroups, setStudentGroups] = useState<string[][]>([]);
  const [groupCount, setGroupCount] = useState<number>(1);
  const [shuffleEnabled, setShuffleEnabled] = useState<boolean>(true);

  const groupStudents = useCallback(
    (groupCount: number) => {
      if (groupCount <= 0) return [];
      const studentList = shuffleEnabled
        ? [...names].sort(() => Math.random() - 0.5)
        : [...names];
      return studentList.reduce<string[][]>(
        (groups, student, index) => {
          groups[index % groupCount].push(student.name);
          return groups;
        },
        Array.from({ length: groupCount }, () => [])
      );
    },
    [names, shuffleEnabled]
  );

  const [history, setHistory] = useState<{ name: string; time: string }[]>([]);

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-hidden">
      <div className="max-w-screen-xl mx-auto px-6 py-10">
        <div className="grid grid-cols-12 gap-6">
          {/* 主内容区域 */}
          <main className="col-span-8 w-200 space-y-10">
            <div className="text-center mb-8">
              <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
                课堂随机点名系统
              </h1>
            </div>

            {/* 抽奖展示区 */}
            <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
              <div className="relative h-64 mb-8 flex flex-col items-center justify-center">
                <div
                  className={`text-7xl font-extrabold transition-all duration-200 select-none ${
                    isRunning
                      ? 'text-indigo-600 animate-pulse'
                      : 'text-gray-900'
                  }`}
                >
                  {selectedName || '准备就绪'}
                </div>
                {selectedName && (
                  <button
                    onClick={(e) => {
                      const button = e.target as HTMLElement;
                      handleLike(selectedName, button);
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
                    onClick={startRandomSelect}
                    disabled={names.length === 0}
                  >
                    开始
                  </button>
                ) : (
                  <button
                    className="px-8 py-3 bg-red-600 text-white rounded-xl shadow-md hover:bg-red-700 focus:ring-4"
                    onClick={stopRandomSelect}
                  >
                    停止
                  </button>
                )}
                <button
                  onClick={resetCalledNames}
                  className="px-8 py-3 bg-gray-400 text-white rounded-xl shadow-md hover:bg-gray-500 focus:ring-4"
                >
                  重置已点名单
                </button>
              </div>
            </div>

            {/* 已点名单 */}
            <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
              <h3 className="text-gray-800 font-semibold mb-6 text-xl">
                已点名单
              </h3>
              <div className="grid grid-cols-2 gap-4 max-h-60 overflow-y-auto">
                {calledNames.length > 0 ? (
                  calledNames.map((name, index) => (
                    <div
                      key={index}
                      className="bg-indigo-100 px-4 py-2 rounded-lg text-indigo-900 text-sm flex justify-between items-center hover:bg-indigo-200 cursor-pointer transition"
                    >
                      <span className="truncate">{name}</span>
                      <button
                        onClick={(e) => {
                          const button = e.target as HTMLElement;
                          handleLike(name, button);
                        }}
                        className="text-sm px-3 py-1 rounded-full bg-pink-300 text-pink-900 hover:bg-pink-400 relative overflow-hidden"
                      >
                        👍
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-indigo-300 italic text-center select-none">
                    暂无记录
                  </p>
                )}
              </div>
            </div>

            {/* 公平性分析图表 */}
            <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
              <h3 className="text-gray-800 font-semibold mb-6 text-xl">
                公平性分析
              </h3>
              <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={fairnessAnalysis}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      interval={0}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis
                      tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                    />
                    <Tooltip
                      formatter={(value: number) =>
                        `${(value * 100).toFixed(2)}%`
                      }
                    />
                    <Bar dataKey="expected" fill="#8884d8" name="期望概率" />
                    <Bar dataKey="actual" fill="#82ca9d" name="实际概率" />
                    <Brush dataKey="name" height={30} stroke="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 点名统计 */}
            <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
              <h3 className="text-gray-800 font-semibold mb-6 text-xl">
                点名统计
              </h3>
              <div style={{ width: '100%', height: 320 }}>
                {names.some((entry) => entry.count > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={topNames}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        interval={Math.ceil(fairnessAnalysis.length / 10)}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#34d399" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-green-400 italic text-center select-none">
                    暂无统计
                  </p>
                )}
              </div>
            </div>

            {/* 全体学生名单 */}
            <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
              <h3 className="text-gray-800 font-semibold mb-6 text-xl">
                全体学生名单
              </h3>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="搜索学生..."
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onChange={(e) => setSearchQuery(e.target.value)} // 更新搜索状态
                />
              </div>
              <div className="grid grid-cols-6 gap-4 max-h-80 overflow-y-auto">
                {filteredNames.map(
                  (
                    entry,
                    index // 使用过滤后的名单
                  ) => (
                    <div
                      key={index}
                      onClick={() => handleOpenDialog(entry.name)}
                      className={`p-4 cursor-pointer text-center rounded-xl transition-colors flex flex-col items-center justify-center truncate
                        ${
                          calledNames.includes(entry.name)
                            ? 'bg-purple-100 text-purple-800 shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                      `}
                      title={`姓名: ${entry.name}\n权重: ${entry.weight}`}
                      tabIndex={0}
                      role="button"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleOpenDialog(entry.name);
                        }
                      }}
                    >
                      <span className="select-none text-sm font-medium truncate">
                        {entry.name}
                      </span>
                    </div>
                  )
                )}
              </div>
              <div className="mt-4">
                <button
                  onClick={() => {
                    const data = names.map((entry) => ({
                      name: entry.name,
                      count: entry.count,
                      likes: likes[entry.name] || 0,
                    }));
                    const csvContent =
                      'data:text/csv;charset=utf-8,' +
                      [
                        'Name,Count,Likes',
                        ...data.map((d) => `${d.name},${d.count},${d.likes}`),
                      ].join('\n');
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement('a');
                    link.setAttribute('href', encodedUri);
                    link.setAttribute('download', 'data.csv');
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
                >
                  导出数据
                </button>
                <button
                  onClick={() => setHistory([])} // 清空历史记录
                  className="px-4 ml-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600"
                >
                  清空历史
                </button>
              </div>
            </div>
          </main>

          {/* 右侧功能栏 */}
          <aside className="col-span-4 space-y-8">
            <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
              <div className="text-gray-800 text-xl font-semibold">
                👥 当前人数：
                <span className="text-indigo-600">{names.length}</span>
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
              <NineGrid />
            </div>

            <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
              <LikeRanking likes={likes} title="点赞榜" limit={names.length} />
            </div>

            <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
              <h3 className="text-gray-800 font-semibold mb-6 text-xl">
                点名历史
              </h3>
              <div className="max-h-60 overflow-y-auto">
                {history.length > 0 ? (
                  history.map((entry, index) => (
                    <div key={index} className="text-sm text-gray-700 mb-2">
                      {entry.time} - {entry.name}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 italic text-center">暂无记录</p>
                )}
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
              <h3 className="text-gray-800 font-semibold mb-6 text-xl">
                学生分组
              </h3>
              <div className="flex items-center gap-4 mb-4">
                <input
                  type="number"
                  min="1"
                  placeholder="输入分组数量"
                  className="w-32 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onChange={(e) => setGroupCount(Number(e.target.value))}
                />
                <button
                  onClick={() => setStudentGroups(groupStudents(groupCount))}
                  className="px-4 py-2 bg-indigo-500 text-white rounded-lg shadow-md hover:bg-indigo-600"
                >
                  生成分组
                </button>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  id="shuffle"
                  checked={shuffleEnabled}
                  onChange={(e) => setShuffleEnabled(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="shuffle" className="text-gray-700">
                  随机打乱名单
                </label>
              </div>
              <div className="space-y-4">
                {studentGroups.map((group, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 p-4 rounded-lg shadow-md"
                  >
                    <h4 className="text-gray-800 font-semibold mb-2">
                      组 {index + 1}
                    </h4>
                    <ul className="list-disc pl-5">
                      {group.map((name, i) => (
                        <li key={i} className="text-gray-700">
                          {name}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* 编辑对话框 */}
        {currentEditName && (
          <StudentDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            name={currentEditName}
            weight={names.find((n) => n.name === currentEditName)?.weight || 0}
            likes={likes[currentEditName] || 0}
            onSave={handleSaveEdit}
          />
        )}
      </div>
      <style>
        {`
          .heart-animation {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(1);
            animation: fly-up 1s ease-out forwards;
            font-size: 1.5rem;
            pointer-events: none;
          }

          @keyframes fly-up {
            0% {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1);
            }
            100% {
              opacity: 0;
              transform: translate(-50%, -150%) scale(1.5);
            }
          }
        `}
      </style>
    </div>
  );
};

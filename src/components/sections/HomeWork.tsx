import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import Header from './Header';
import NameSelector from './NameSelector';
import CalledNamesList from './CalledNamesList';
import FairnessChart from './FairnessChart';
import StatisticsChart from './StatisticsChart';
import StudentList from './StudentList';
import Sidebar from './Sidebar';
import { StudentDialog } from '../dialog/StudentDialog';

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
  const [history, setHistory] = useState<{ name: string; time: string }[]>([]);
  const [studentGroups, setStudentGroups] = useState<string[][]>([]);
  const [groupCount, setGroupCount] = useState<number>(1);
  const [shuffleEnabled, setShuffleEnabled] = useState<boolean>(true);

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
    const colors = ['#FF5252', '#FF4081', '#E040FB', '#7C4DFF', '#536DFE', '#448AFF', '#40C4FF'];

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
        entry.name === selectedName ? { ...entry, count: entry.count + 1 } : entry
      );
      saveCountsToStorage(updated);
      return updated;
    });

    setCalledNames((prev) =>
      selectedName && !prev.includes(selectedName) ? [...prev, selectedName] : prev
    );

    if (selectedName) {
      const timestamp = new Date().toLocaleString();
      setHistory((prevHistory) => {
        const updatedHistory = [...prevHistory, { name: selectedName, time: timestamp }];
        localStorage.setItem('callHistory', JSON.stringify(updatedHistory));
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
        names.filter((entry) => entry.name.toLowerCase().includes(searchQuery.toLowerCase()))
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

  const groupStudents = useCallback(
    (groupCount: number) => {
      if (groupCount <= 0) return [];
      const studentList = shuffleEnabled ? [...names].sort(() => Math.random() - 0.5) : [...names];
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

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-hidden">
      <div className="max-w-screen-xl mx-auto px-6 py-10">
        <div className="grid grid-cols-12 gap-6">
          <main className="col-span-8 w-200 space-y-10">
            <Header />
            <NameSelector
              selectedName={selectedName}
              isRunning={isRunning}
              names={names}
              onStart={startRandomSelect}
              onStop={stopRandomSelect}
              onReset={resetCalledNames}
              onLike={handleLike}
            />
            <CalledNamesList calledNames={calledNames} onLike={handleLike} />
            <FairnessChart fairnessAnalysis={fairnessAnalysis} />
            <StatisticsChart names={names} topNames={topNames} />
            <StudentList
              names={names}
              filteredNames={filteredNames}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleOpenDialog={handleOpenDialog}
              likes={likes}
            />
          </main>
          <Sidebar
            names={names}
            history={history}
            setHistory={setHistory}
            studentGroups={studentGroups}
            setStudentGroups={setStudentGroups}
            groupCount={groupCount}
            setGroupCount={setGroupCount}
            shuffleEnabled={shuffleEnabled}
            setShuffleEnabled={setShuffleEnabled}
            groupStudents={groupStudents}
            likes={likes} // 修复：传递 likes 属性
          />
        </div>
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
    </div>
  );
};

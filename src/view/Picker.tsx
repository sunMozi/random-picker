import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import '../styles/animations.css';
import Header from '../components/picker/Header';
import NameSelector from '../components/picker/NameSelector';
import CalledNamesList from '../components/picker/CalledNamesList';
import FairnessChart from '../components/picker/FairnessChart';
import StatisticsChart from '../components/picker/StatisticsChart';
import StudentList from '../components/picker/StudentList';
import Sidebar from '../components/picker/Sidebar';
import { StudentDialog } from '../components/dialog/StudentDialog';
import AdminDialog from '../components/dialog/AdminDialog';

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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredNames, setFilteredNames] = useState<NameEntry[]>([]);
  const [history, setHistory] = useState<{ name: string; time: string }[]>([]);
  const [studentGroups, setStudentGroups] = useState<string[][]>([]);
  const [groupCount, setGroupCount] = useState<number>(1);
  const [shuffleEnabled, setShuffleEnabled] = useState<boolean>(true);
  const [showShine, setShowShine] = useState(false);
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);

  const handleSaveAdminChanges = (updatedNames: { name: string; weight: number }[]) => {
    setNames(updatedNames.map((entry) => ({ ...entry, count: 0, number: 0 }))); // 更新名单
  };

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

    const count = Math.min(3, Math.floor(Math.random() * 2) + 2); // 限制动画元素数量

    for (let i = 0; i < count; i++) {
      const like = document.createElement('div');
      like.className = 'heart-animation';
      like.innerText = emojis[Math.floor(Math.random() * emojis.length)];
      like.style.color = colors[Math.floor(Math.random() * colors.length)];
      like.style.fontSize = `${Math.random() * 10 + 20}px`; // 调整字体大小范围
      like.style.position = 'fixed'; // 使用固定定位
      like.style.left = `${button.getBoundingClientRect().left + button.offsetWidth / 2}px`;
      like.style.top = `${button.getBoundingClientRect().top}px`;
      like.style.pointerEvents = 'none'; // 防止干扰点击

      document.body.appendChild(like);

      setTimeout(() => {
        like.style.transform = `translateY(-100px) scale(1.5)`;
        like.style.opacity = '0';
        like.style.transition = 'transform 0.6s ease, opacity 0.6s ease';
      }, 0);

      setTimeout(() => {
        like.remove();
      }, 600); // 动画持续时间
    }
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
    const list = names.flatMap((entry) =>
      entry.weight >= MIN_WEIGHT ? Array(entry.weight).fill(entry) : []
    );

    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }

    return list;
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
    if (!isRunning) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    let delay = RANDOM_INTERVAL;
    const stopTime = Date.now() + 3000;
    let finalSelectedName = selectedName; // 默认当前值

    const slowDown = () => {
      if (Date.now() >= stopTime) {
        setNames((prevNames) => {
          const updated = prevNames.map((entry) =>
            entry.name === finalSelectedName ? { ...entry, count: entry.count + 1 } : entry
          );
          saveCountsToStorage(updated);
          return updated;
        });

        setCalledNames((prev) =>
          finalSelectedName && !prev.includes(finalSelectedName)
            ? [...prev, finalSelectedName]
            : prev
        );

        if (finalSelectedName) {
          const timestamp = new Date().toLocaleString();
          setHistory((prevHistory) => {
            const updatedHistory = [...prevHistory, { name: finalSelectedName, time: timestamp }];
            localStorage.setItem('callHistory', JSON.stringify(updatedHistory));
            return updatedHistory;
          });
        }

        setSelectedName(finalSelectedName);
        setIsRunning(false);
        setShowShine(true);
        setTimeout(() => setShowShine(false), 2500);

        // audioRef.current?.play().catch((err) => {
        //   if (err.name !== 'NotAllowedError') {
        //     console.error('音效播放失败:', err);
        //   }
        // });

        return;
      }

      setTimeout(() => {
        const newWeightedList = getWeightedList();
        if (newWeightedList.length > 0) {
          const randomIndex = Math.floor(Math.random() * newWeightedList.length);
          const selectedEntry = newWeightedList[randomIndex];
          if (selectedEntry) {
            finalSelectedName = selectedEntry.name;
            setSelectedName(selectedEntry.name);
          }
        }

        delay += 50;
        slowDown();
      }, delay);
    };

    slowDown();
  }, [getWeightedList, saveCountsToStorage, isRunning, selectedName]);

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
              showShine={showShine}
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
            likes={likes}
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

      <AdminDialog
        open={adminDialogOpen}
        onClose={() => setAdminDialogOpen(false)}
        names={names.map(({ name, weight }) => ({ name, weight }))}
        onSave={handleSaveAdminChanges}
      />
    </div>
  );
};

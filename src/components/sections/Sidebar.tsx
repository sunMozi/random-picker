import { NineGrid } from '../NineGrid';
import { LikeRanking } from './LikeRanking';

interface SidebarProps {
  names: { name: string }[];
  history: { name: string; time: string }[];
  setHistory: (history: { name: string; time: string }[]) => void;
  studentGroups: string[][];
  setStudentGroups: (groups: string[][]) => void;
  groupCount: number;
  setGroupCount: (count: number) => void;
  shuffleEnabled: boolean;
  setShuffleEnabled: (enabled: boolean) => void;
  groupStudents: (groupCount: number) => string[][];
  likes: Record<string, number>; // 修复：添加 likes 属性
}

const Sidebar = ({
  names,
  history,
  studentGroups,
  setStudentGroups,
  groupCount,
  setGroupCount,
  shuffleEnabled,
  setShuffleEnabled,
  groupStudents,
  likes, // 修复：解构 likes 属性
}: SidebarProps) => {
  return (
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
        <LikeRanking likes={likes} title="点赞榜" limit={names.length} /> {/* 修复：传递 likes */}
      </div>

      <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
        <h3 className="text-gray-800 font-semibold mb-6 text-xl">点名历史</h3>
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
        <h3 className="text-gray-800 font-semibold mb-6 text-xl">学生分组</h3>
        <div className="flex items-center gap-4 mb-4">
          <input
            type="number"
            min="1"
            placeholder="输入分组数量"
            className="w-32 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={groupCount}
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
            <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md">
              <h4 className="text-gray-800 font-semibold mb-2">组 {index + 1}</h4>
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
  );
};

export default Sidebar;

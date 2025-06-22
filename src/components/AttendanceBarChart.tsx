import { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const PAGE_SIZE = 20;

export const AttendanceBarChart = ({
  names,
}: {
  names: { name: string; count: number }[];
}) => {
  // 筛选和排序
  const filteredSortedNames = useMemo(() => {
    return names
      .filter((entry) => entry.count > 0)
      .sort((a, b) => b.count - a.count);
  }, [names]);

  // 页码状态
  const [page, setPage] = useState(1);

  // 计算页数和当前页数据
  const pageCount = Math.ceil(filteredSortedNames.length / PAGE_SIZE);
  const pageData = filteredSortedNames.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  // 翻页函数
  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(pageCount, p + 1));

  return (
    <div>
      <div
        style={{ width: '100%', height: Math.max(300, pageData.length * 40) }}
      >
        {pageData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={pageData}
              margin={{ top: 20, right: 30, left: 120, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} />
              <YAxis
                dataKey="name"
                type="category"
                width={120}
                tick={{ fontSize: 14 }}
              />
              <Tooltip />
              <Bar dataKey="count" fill="#4ade80" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center">暂无统计数据</p>
        )}
      </div>

      {/* 分页按钮 */}
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          上一页
        </button>
        <span className="self-center">
          第 {page} 页 / 共 {pageCount} 页
        </span>
        <button
          onClick={handleNext}
          disabled={page === pageCount}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          下一页
        </button>
      </div>
    </div>
  );
};

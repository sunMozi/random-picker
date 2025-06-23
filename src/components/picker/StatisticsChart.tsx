import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StatisticsChartProps {
  names: { name: string; count: number }[];
  topNames: { name: string; count: number }[];
}

const StatisticsChart = ({ names, topNames }: StatisticsChartProps) => {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
      <h3 className="text-gray-800 font-semibold mb-6 text-xl">点名统计</h3>
      <div style={{ width: '100%', height: 320 }}>
        {names.some((entry) => entry.count > 0) ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topNames} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" interval={0} angle={-45} textAnchor="end" height={60} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#34d399" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-green-400 italic text-center select-none">暂无统计</p>
        )}
      </div>
    </div>
  );
};

export default StatisticsChart;

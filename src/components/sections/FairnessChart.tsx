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

interface FairnessChartProps {
  fairnessAnalysis: { name: string; expected: number; actual: number }[];
}

const FairnessChart = ({ fairnessAnalysis }: FairnessChartProps) => {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
      <h3 className="text-gray-800 font-semibold mb-6 text-xl">公平性分析</h3>
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={fairnessAnalysis} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" interval={0} angle={-45} textAnchor="end" height={60} />
            <YAxis tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
            <Tooltip formatter={(value: number) => `${(value * 100).toFixed(2)}%`} />
            <Bar dataKey="expected" fill="#8884d8" name="期望概率" />
            <Bar dataKey="actual" fill="#82ca9d" name="实际概率" />
            <Brush dataKey="name" height={30} stroke="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FairnessChart;

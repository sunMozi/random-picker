interface StudentListProps {
  names: { name: string; weight: number }[];
  filteredNames: { name: string; weight: number }[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleOpenDialog: (name: string) => void;
  likes: Record<string, number>;
}

const StudentList = ({
  names,
  filteredNames,
  searchQuery,
  setSearchQuery,
  handleOpenDialog,
}: StudentListProps) => {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
      <h3 className="text-gray-800 font-semibold mb-6 text-xl">全体学生名单</h3>
      <div className="mb-4">
        <input
          type="text"
          placeholder="搜索学生..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-6 gap-4 max-h-80 overflow-y-auto">
        {filteredNames.map((entry, index) => (
          <div
            key={index}
            onClick={() => handleOpenDialog(entry.name)}
            className={`p-4 cursor-pointer text-center rounded-xl transition-colors flex flex-col items-center justify-center truncate
              ${
                names.find((n) => n.name === entry.name) // 修复：使用 find 而非 some
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
            <span className="select-none text-sm font-medium truncate">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentList;

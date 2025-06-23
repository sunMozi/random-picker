interface CalledNamesListProps {
  calledNames: string[];
  onLike: (name: string, button: HTMLElement) => void;
}

const CalledNamesList = ({ calledNames, onLike }: CalledNamesListProps) => {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
      <h3 className="text-gray-800 font-semibold mb-6 text-xl">已点名单</h3>
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
                  onLike(name, button);
                }}
                className="text-sm px-3 py-1 rounded-full bg-pink-300 text-pink-900 hover:bg-pink-400 relative overflow-hidden"
              >
                👍
              </button>
            </div>
          ))
        ) : (
          <p className="text-indigo-300 italic text-center select-none">暂无记录</p>
        )}
      </div>
    </div>
  );
};

export default CalledNamesList;

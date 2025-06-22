import React from 'react';

interface LikeRankingProps {
  likes: Record<string, number>;
  title?: string;
  limit?: number;
}

export const LikeRanking: React.FC<LikeRankingProps> = ({
  likes,
  title = '点赞榜 🔥',
  limit = 5,
}) => {
  const sortedLikes = React.useMemo(
    () =>
      Object.entries(likes)
        .sort(([, a], [, b]) => b - a)
        .slice(0, limit),
    [likes, limit]
  );

  return (
    <div className="mt-6 w-full max-w-md mx-auto">
      <h3 className="text-center text-lg font-semibold text-pink-600 mb-2">
        {title}
      </h3>
      <ul className="bg-pink-50 rounded-lg shadow-sm divide-y divide-pink-100">
        {sortedLikes.length > 0 ? (
          sortedLikes.map(([name, count]) => (
            <li
              key={name}
              className="flex justify-between px-4 py-2 text-sm text-pink-800"
            >
              <span>{name}</span>
              <span className="font-bold">👍 {count}</span>
            </li>
          ))
        ) : (
          <li className="text-center text-gray-400 py-2">暂无点赞</li>
        )}
      </ul>
    </div>
  );
};

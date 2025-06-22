export const WebsiteLink = ({
	href,
	label,
}: {
	href: string;
	label: string;
}) => (
	<li
		className="group relative overflow-hidden transition-transform duration-200 
                hover:shadow-md hover:-translate-y-1
                dark:hover:shadow-gray-800/60
                active:scale-95">
		<a
			href={href}
			className="flex items-center justify-between gap-3
                bg-gradient-to-br from-white/80 to-white/50 dark:from-gray-800/85 dark:to-gray-900/95
                backdrop-blur-lg
                rounded-lg p-3
                border border-gray-300 dark:border-gray-700
                shadow-sm hover:shadow-indigo-400/40
                transition-all duration-200
                hover:bg-white dark:hover:bg-gray-800
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
			{/* 文字部分 */}
			<span
				className="text-sm font-medium text-gray-700 transition-colors
                      dark:text-gray-300
                      group-hover:text-indigo-600
                      dark:group-hover:text-indigo-400">
				{label}
			</span>

			{/* 动态箭头图标 */}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="h-4 w-4 text-gray-400 transition-transform
                  group-hover:translate-x-1 group-hover:text-indigo-500
                  dark:text-gray-500 dark:group-hover:text-indigo-400"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				strokeWidth="2">
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M14 5l7 7m0 0l-7 7m7-7H3"
				/>
			</svg>

			{/* 悬浮流光效果 */}
			<div className="absolute inset-0 -z-10 overflow-hidden">
				<div
					className="absolute -left-full top-0 h-full w-1/2
                      -skew-x-12 bg-gradient-to-r from-transparent
                      via-white/50 to-transparent
                      transition-all duration-300
                      group-hover:left-full"
				/>
			</div>
		</a>
	</li>
);

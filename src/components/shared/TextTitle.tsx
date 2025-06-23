export const TextTitle = ({ children }: { children: React.ReactNode }) => {
	return (
		<h1 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 mb-6">
			{children}
		</h1>
	);
};

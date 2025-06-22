interface ButtonProps {
	className?: string;
	children?: React.ReactNode;
	onClick?: () => void;
}

export const Button = ({ onClick, children, className = "" }: ButtonProps) => {
	return (
		<>
			<button
				className={`px-6 py-3 rounded-full outline-none cursor-pointer
                 			relative overflow-hidden border border-transparent bg-violet-600 ${className}`}
				onClick={onClick}>
				{children}
			</button>
		</>
	);
};

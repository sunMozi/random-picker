interface TitleProps {
	children: React.ReactNode;
	className?: string;
}

export const Title = ({ children, className = "" }: TitleProps) => {
	return (
		<h1
			className={`text-heading-1 font-semibld text-2xl sm:text-2xl md:text-3xl ${className}`}>
			{" "}
			{children}{" "}
		</h1>
	);
};

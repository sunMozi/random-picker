interface ContainerProps {
	children: React.ReactNode;
}

export const Container = ({ children }: ContainerProps) => {
	return <div className="container mx-auto px-4 max-w-5xl">{children}</div>;
};

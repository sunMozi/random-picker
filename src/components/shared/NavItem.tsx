interface NavItemProps {
	href: string;
	text: string;
	className?: string;
}

export const NavItem = ({ href, text, className = "" }: NavItemProps) => {
	return (
		<>
			<li className="relative px-4 py-2 cursor-pointer hover:text-violet-500">
				<a
					href={href}
					className={`duration-300 font-medium ease-linear hover:text-primary py-3 ${className}`}>
					{text}
				</a>
			</li>
		</>
	);
};

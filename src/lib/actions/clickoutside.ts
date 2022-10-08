export default function clickoutside(
	node: Node,
	handler: (e: MouseEvent) => void
): SvelteActionReturnType {
	const handleClick = (event: MouseEvent) => {
		if (!node.contains(event.target as Node)) {
			handler(event);
		}
	};

	document.addEventListener('click', handleClick, true);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		}
	};
}

export type OnClickOusideHandler = (e: MouseEvent) => void;

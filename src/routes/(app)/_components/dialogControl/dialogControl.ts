import type { ComponentProps, SvelteComponent } from 'svelte';
import { writable } from 'svelte/store';

function createDialogStores() {
	const { subscribe, update } = writable({
		opened: false,
		component: null as typeof SvelteComponent | null,
		props: null as ComponentProps<SvelteComponent> | null
	});

	return {
		subscribe,
		toggle: () => update(d => ({ ...d, opened: !d.opened })),
		open: () => update(d => ({ ...d, opened: true })),
		close: () => update(d => ({ ...d, opened: false })),
		setBody: <Component extends SvelteComponent>(body: DialogBody<Component>) => {
			update(d => ({ ...d, ...body }));
		}
	};
}

export const dialog = createDialogStores();

export interface DialogBody<Component extends SvelteComponent> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	component: new (...args: any[]) => Component;
	props: ComponentProps<Component>;
}

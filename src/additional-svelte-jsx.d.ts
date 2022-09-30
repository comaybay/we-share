// https://github.com/sveltejs/language-tools/blob/master/docs/preprocessors/typescript.md#im-using-an-attributeevent-on-a-dom-element-and-it-throws-a-type-error
/* eslint-disable @typescript-eslint/no-unused-vars */
declare namespace svelte.JSX {
	interface HTMLAttributes<T> {
		onclickoutside?: (event: MouseEvent) => void;
	}
}

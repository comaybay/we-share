<script lang="ts">
	import { PUBLIC_TINY_API_KEY } from '$env/static/public';
	import Editor from '@tinymce/tinymce-svelte';
	import { uuid } from 'src/lib/uuid';
	import { tick } from 'svelte';

	export let value: string;
	export let text: string;

	export let id = uuid('tinymce-svelte');
	export let disabled = false;

	export let conf: object;
</script>

<div
	class="outline outline-1 outline-transparent transition-all duration-100 
	{disabled ? '' : 'hover:outline-pri-base'}"
>
	<Editor
		apiKey={PUBLIC_TINY_API_KEY}
		{id}
		{disabled}
		{conf}
		bind:value
		bind:text
		modelEvents="input change keyup undo redo"
		on:init={async () => {
			//fix text content not changing on initial value content
			const v = value;
			value = '';
			await tick();
			value = v;
		}}
	/>
</div>

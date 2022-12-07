<script lang="ts">
	import { PUBLIC_TINY_API_KEY } from '$env/static/public';
	import Editor from '@tinymce/tinymce-svelte';

	//copied from TinyMCE Editor internal uuid function
	const uuid = (prefix: string): string => {
		return prefix + '_' + Math.floor(Math.random() * 1000000000) + String(Date.now());
	};

	export let value = '';
	export let text = '';
	export let placeholder = '';

	export let id = uuid('tinymce-svelte');
	export let disabled = false;
	export let minHeight = 300;
	export let maxHeight = 500;

	const conf = {
		skin_url: '/weshare-editor',
		skin: 'weshare-editor',
		content_css: 'weshare-editor',
		statusbar: false,
		menubar: false,
		contextmenu: false,
		paste_as_text: true,
		content_style: 'body { font-family: sans-serif; }', //set editor font to be the same as app's font
		resize: false,
		toolbar_mode: 'sliding',
		toolbar: [
			'undo redo | indent outdent | alignleft aligncenter alignright alignjustify alignnone | numlist bullist ',
			'h1 h2 h3 | bold italic underline strikethrough | subscript superscript | blockquote link codesample | emoticons image'
		],
		mobile: {
			toolbar_mode: 'sliding',
			toolbar:
				'bold italic underline strikethrough | h1 h2 h3 | numlist bullist | subscript superscript | blockquote link codesample | emoticons image | undo redo | indent outdent | alignleft aligncenter alignright alignjustify alignnone'
		},
		plugins: 'link autolink codesample autoresize emoticons image lists',
		link_default_protocol: 'https',
		default_link_target: '_blank',
		link_title: false,
		min_height: minHeight,
		max_height: maxHeight,
		placeholder
	};
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
	/>
</div>

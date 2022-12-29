<script lang="ts">
	import { commentEditorConfig } from 'src/lib/editors/commentEditorConfig';
	import { uuid } from 'src/lib/uuid';
	import CustomEditor from 'src/routes/(app)/_components/posts/CustomEditor.svelte';

	export let value = '';
	export let text = '';
	export let placeholder: string | undefined = undefined;
	export let disabled = false;
	export let config: any = commentEditorConfig;

	const id = uuid('tinymce-svelte');

	const conf = { ...config };

	if (placeholder !== undefined) {
		conf.placeholder = placeholder;
	}
</script>

<CustomEditor {conf} {id} {disabled} bind:text bind:value />

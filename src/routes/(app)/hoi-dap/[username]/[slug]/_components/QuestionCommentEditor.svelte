<script lang="ts">
	import { uuid } from 'src/lib/uuid';
	import CustomEditor from 'src/routes/(app)/_components/posts/CustomEditor.svelte';

	export let value = '';
	export let text = '';
	export let disabled = false;

	const id = uuid('tinymce-svelte');
	const conf = 
</script>

<CustomEditor {conf} {id} {disabled} bind:text bind:value />

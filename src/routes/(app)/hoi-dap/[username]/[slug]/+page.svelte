<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	console.log(data);
</script>

{#if data}
	<p>{data.post.title}</p>
	{@html data.post.content}
{/if}

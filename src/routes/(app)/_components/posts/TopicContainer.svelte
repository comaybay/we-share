<script lang="ts">
	import Topic from './Topic.svelte';

	export let baseHref: string;
	export let topics: string[];
</script>

<div class="flex flex-wrap gap-2">
	{#each topics as topic}
		<Topic href="{baseHref}?topic={encodeURIComponent(topic)}">{topic}</Topic>
	{/each}
</div>

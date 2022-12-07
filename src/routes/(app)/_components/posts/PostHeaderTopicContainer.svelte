<script lang="ts">
	export let baseHref: string;
	export let topics: string[];
</script>

<div class="mt-3 w-full flex flex-wrap gap-2">
	{#each topics as topic}
		<a
			href="{baseHref}?topic={encodeURIComponent(topic)}"
			class="min-w-0 truncate px-2.5 rounded-full border border-pri-light bg-paper hover:bg-pri-light hover:text-paper transition-colors duration-25"
		>
			{topic}
		</a>
	{/each}
</div>

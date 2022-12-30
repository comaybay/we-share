<script lang="ts">
	export let title = '';
	export let titleIncludesAppName = true;
	export let description = '';
	export let noindex = false;
</script>

<svelte:head>
	{#if title}
		<title>{title}{titleIncludesAppName ? ' • WeShare' : ''}</title>
	{/if}
	{#if description}
		<meta name="description" content={description} />
	{/if}
	{#if noindex}
		<meta name="robots" content="noindex" />
	{/if}
	<slot />
</svelte:head>

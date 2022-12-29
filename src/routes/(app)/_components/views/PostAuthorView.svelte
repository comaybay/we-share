<script lang="ts">
	import { page } from '$app/stores';
	export let authorId: string;
</script>

{#if $page.data.session?.user.id === authorId}
	<slot />
{/if}

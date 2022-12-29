<script lang="ts">
	import { page } from '$app/stores';
</script>

{#if $page.data.session?.user.id}
	<slot />
	<slot name="authorized" />
{:else}
	<slot name="else" />
{/if}

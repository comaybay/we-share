<script lang="ts">
	import { onMount } from 'svelte';
	import { dialog } from './dialogControl';

	let mounted = false;
	onMount(() => (mounted = true));

	$: if (mounted) {
		if ($dialog.opened) {
			document.body.classList.add('overflow-hidden');
		} else {
			document.body.classList.remove('overflow-hidden');
		}
	}
</script>

{#if $dialog.opened}
	<div class="fixed z-10 top-0 left-0 w-full h-full bg-dialog">
		<div class=" flex h-full justify-center items-center">
			<div class="p-6 bg-paper">
				<svelte:component this={$dialog.component} {...$dialog.props} />
			</div>
		</div>
	</div>
{/if}

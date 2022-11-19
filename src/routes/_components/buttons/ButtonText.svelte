<script lang="ts">
	export let active = false;
</script>

<div class="inline-block">
	<button
		on:click
		class="rounded-sm px-4 py-1 font-medium transition-colors duration-50 {active
			? 'hover:bg-pri-hover bg-pri-light text-paper'
			: 'hover:bg-pri-lighter'}"
	>
		<slot />
	</button>
</div>

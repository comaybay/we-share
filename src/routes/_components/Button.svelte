<script lang="ts">
	export let loading = false;
	export let disabled = false;
</script>

<div class="inline-block">
	{#if loading}
		<svg
			aria-hidden="true"
			class="inline mr-2 w-6 h-6 animate-spin"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle class="opacity-25 stroke-pri-base" cx="12" cy="12" r="10" stroke-width="4" />
			<path
				class="opacity-75 fill-sec-base"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
			/>
		</svg>
	{/if}
	<button
		on:click
		{disabled}
		class="rounded-sm px-4 py-2 text-pri-lighter font-medium 
		{loading || disabled ? 'bg-sec-loading' : 'bg-sec-base hover:bg-sec-hover'}"
	>
		<slot />
	</button>
</div>

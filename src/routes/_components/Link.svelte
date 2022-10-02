<script lang="ts">
	export let href: string;
</script>

<a {href} class="relative group text-qua-base hover:text-qua-hover">
	<slot />
	<div
		class="absolute bottom-0.5 h-0 w-0 group-hover:w-full transition-all duration-150 border-t bg-qua-base hover:bg-qua-hover"
	/>
</a>

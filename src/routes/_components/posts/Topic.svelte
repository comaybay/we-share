<script lang="ts">
	export let href: string;
</script>

<a
	{href}
	class="min-w-0 truncate px-4 py-1 rounded-full border border-pri-light bg-paper hover:bg-pri-light hover:text-paper transition-colors duration-25"
>
	<slot />
</a>

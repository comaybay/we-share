<script lang="ts">
	export let href: string;
	export let mini = false;
</script>

<h3 class="{mini ? 'text-xl' : 'text-2xl'} text-tert-base hover:text-tert-hover line-clamp-2">
	<a {href}>
		<slot />
	</a>
</h3>

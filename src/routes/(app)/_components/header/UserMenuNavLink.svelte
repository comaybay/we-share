<script lang="ts">
	export let href: string;
</script>

<div class="hover:bg-pri-lighter">
	<a class="block px-4 py-2" {href}><slot /></a>
</div>

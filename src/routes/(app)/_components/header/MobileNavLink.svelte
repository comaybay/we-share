<script lang="ts">
	import { page } from '$app/stores';

	export let href: string;

	$: active = $page.url.pathname === href;
</script>

<div class="hover:bg-pri-lighter">
	<div class="mx-8 border-b border-pri-base" />
	<a
		class="block text-center text-2xl px-4 py-3
		{active ? 'text-sec-base border-l-[6px] border-r-sec-base bg-pri-lighter' : ''}"
		{href}
	>
		<slot />
	</a>
</div>

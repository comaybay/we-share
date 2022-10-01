<script lang="ts">
	import { page } from '$app/stores';

	export let href: string;

	$: active = $page.url.pathname === href;
</script>

<a
	{href}
	class="flex items-center text-2xl px-3  transition-all duration-75 border-transparent 
	{active
		? 'text-sec-base border-b-[6px] border-b-sec-base'
		: 'text-pri-base border-y-[6px] hover:border-b-pri-light hover:border-t-transparent hover:border-opacity-70'}"
>
	<slot />
</a>

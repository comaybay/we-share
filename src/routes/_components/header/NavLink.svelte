<script lang="ts">
	import { page } from '$app/stores';

	export let href: string;

	$: active = $page.url.pathname === href;
</script>

<a
	{href}
	class="flex items-center text-2xl px-3 text-pri-base {active
		? 'border-b-[6px] border-sec-base'
		: ''}"
>
	<slot />
</a>

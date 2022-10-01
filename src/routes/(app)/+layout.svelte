<script lang="ts">
	import Header from './_components/Header.svelte';
	import type { LayoutServerData } from './$types';

	export let data: LayoutServerData;
</script>

<Header userProfile={data.userProfile} />
<slot />

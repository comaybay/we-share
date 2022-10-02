<script lang="ts">
	import type { LayoutServerData } from './$types';
	import Header from './_components/Header.svelte';

	export let data: LayoutServerData;
</script>

<Header userProfile={data.userProfile} />
<slot />

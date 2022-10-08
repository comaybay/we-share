<script lang="ts">
	import { userProfile } from 'src/lib/stores/userProfile';
	import type { LayoutServerData } from './$types';
	import Header from './_components/Header.svelte';

	export let data: LayoutServerData;

	$: $userProfile = data.userProfile;
</script>

<Header />
<slot />

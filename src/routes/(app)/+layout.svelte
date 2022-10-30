<script lang="ts">
	import { userProfile } from 'src/lib/stores/userProfile';
	import type { LayoutData } from './$types';
	import Header from './_components/Header.svelte';

	export let data: LayoutData;

	$: $userProfile = data.userProfile;
</script>

<Header />
<slot />

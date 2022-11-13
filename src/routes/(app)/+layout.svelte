<script lang="ts">
	import { userProfile } from 'src/lib/stores/userProfile';
	import type { LayoutData } from './$types';
	import Header from './_components/Header.svelte';

	export let data: LayoutData;

	$: $userProfile = data.userProfile;
</script>

<Header />
<div class="flex">
	<div
		class="hidden sm:block w-14 border-r-2 border-sec-base bg-stripes self-stretch min-h-screen"
	/>
	<!-- pt-16: Header Height -->
	<div class="mt-16 grow">
		<slot />
	</div>
</div>

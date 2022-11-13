<script lang="ts">
	import { userProfile } from 'src/lib/stores/userProfile';
	import type { LayoutData } from './$types';
	import Footer from './_components/Footer.svelte';
	import Header from './_components/Header.svelte';

	export let data: LayoutData;

	$: $userProfile = data.userProfile;
</script>

<Header />
<div class="flex items-stretch">
	<div class="hidden sm:block w-14 border-r-2 border-sec-base bg-stripes" />
	<!-- pt-16: Header Height -->
	<div class="pt-16 grow flex flex-col min-h-screen">
		<div class="grow my-8">
			<slot />
		</div>
		<Footer />
	</div>
</div>

<script lang="ts">
	import DialogControl from './_components/dialogControl/DialogControl.svelte';
	import Footer from './_components/Footer.svelte';
	import Header from './_components/Header.svelte';
</script>

<Header />
<div class="flex items-stretch">
	<div class="shrink-0 hidden sm:block w-14 border-r-2 border-sec-base bg-stripes" />
	<!-- pt-16: Header Height -->
	<div class="pt-16 grow flex flex-col min-h-screen">
		<div class="grow my-8">
			<slot />
		</div>
		<Footer />
	</div>
</div>

<DialogControl />

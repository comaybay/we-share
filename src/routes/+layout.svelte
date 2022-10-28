<script context="module" lang="ts">
	import { invalidate } from '$app/navigation';
	import { supabaseClient } from '$lib/db';
	import { onMount } from 'svelte';
</script>

<script lang="ts">
	import '../app.css';

	onMount(() => {
		const {
			data: { subscription }
		} = supabaseClient.auth.onAuthStateChange(() => {
			invalidate('supabase:auth');
		});

		return () => {
			subscription.unsubscribe();
		};
	});
</script>

<slot />

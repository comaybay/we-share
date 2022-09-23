<script context="module" lang="ts">
	import { setupSupabase, startSupabaseSessionSync } from '$lib/supabase';
	import { supabaseClient } from '$lib/supabaseClient';

	// set the supabase instance so it can be used in helpers
	setupSupabase({ supabaseClient });
</script>

<script lang="ts">
	import '../app.css';

	// sync session and refresh data when necessary
	startSupabaseSessionSync();
</script>

<slot />

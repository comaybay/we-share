// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	// interface PageError {}
	// interface Platform {}

	interface SupabaseSession {
		user: import('@supabase/supabase-js').User | null;
		accessToken: string | null;
	}

	interface Locals {
		user: import('@supabase/supabase-js').User | null;
		accessToken: string | null;
		error: string | null;
	}
	interface PageData {
		session: SupabaseSession;
	}
}

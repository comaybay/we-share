// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { UserProfile } from './lib/types/UserProfile';

// and what to do when importing types
declare namespace App {
	// interface PageError {}
	// interface Platform {}
	interface Supabase {
		Database: import('./database.types').Database;
		SchemaName: 'public';
	}
	// interface Locals {}
	interface PageData {
		session: import('@supabase/supabase-js').Session | null;
		userProfile: UserProfile | null;
	}
}

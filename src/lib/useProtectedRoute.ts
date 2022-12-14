import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { redirect, type LoadEvent, type RequestEvent } from '@sveltejs/kit';
import generateLoginPath from './login/generateLoginPath';

/**
 * redirects to login page if not logged in
 * @returns session and supabase client, guaranteed to not be null
 */
export async function useProtectedRoute(event: LoadEvent | RequestEvent) {
	const { session, supabaseClient } = await getSupabase(event);
	if (!session) {
		throw redirect(303, generateLoginPath(event.url.pathname));
	}

	return { session, supabaseClient };
}

import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { redirect, type LoadEvent, type RequestEvent } from '@sveltejs/kit';

export async function useProtectedRoute(event: LoadEvent | RequestEvent) {
	const { session } = await getSupabase(event);
	if (!session) {
		throw redirect(303, `/dang-nhap?returnto=${encodeURIComponent(event.url.pathname)}`);
	}
}

import { dev } from '$app/environment';
import { auth } from '$lib/supabase/server';
import { supabaseClient } from '$lib/supabaseClient';
auth;

export const handle = auth({
	supabaseClient,
	cookieOptions: {
		secure: !dev
	}
});

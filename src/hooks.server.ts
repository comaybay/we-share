import { dev } from '$app/environment';
import { auth } from '$lib/supabase-auth/server';
import { supabaseClient } from '$lib/supabase/supabaseClient';

export const handle = auth({
	supabaseClient,
	cookieOptions: {
		secure: !dev
	}
});

import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import redirectHome from 'src/lib/server/redirectHome';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async event => {
	const { supabaseClient } = await getSupabase(event);
	await supabaseClient.auth.signOut();
	throw redirectHome();
};

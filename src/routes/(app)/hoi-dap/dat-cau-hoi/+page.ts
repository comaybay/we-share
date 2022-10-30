import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { redirectLogin } from 'src/lib/redirectLogin';
import type { PageLoad } from './$types';

export const load: PageLoad = async event => {
	const { session } = await getSupabase(event);
	if (!session) {
		throw redirectLogin();
	}
};

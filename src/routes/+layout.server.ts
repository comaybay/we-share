import { getServerSession, getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async event => {
	const session = await getServerSession(event);
	const { supabaseClient } = await getSupabase(event);

	if (!session) {
		return { session: null, userProfile: null };
	} else {
		const { data: userProfile } = await supabaseClient
			.from('profiles')
			.select('*')
			.match({ id: session.user.id })
			.single();

		return {
			session,
			userProfile
		};
	}
};

import type UserProfile from '$lib/types/UserProfile';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad<{ userProfile: UserProfile | null }> = async event => {
	const { session, supabaseClient } = await getSupabase(event);

	if (!session) {
		return { userProfile: null };
	}

	const { data: profile } = await supabaseClient
		.from('profiles')
		.select('username, name, quote')
		.match({ id: session.user.id })
		.single();

	return {
		userProfile: {
			email: session.user.email as string,
			profilename: profile?.name as string,
			username: profile?.username as string,
			quote: profile?.quote as string
		}
	};
};

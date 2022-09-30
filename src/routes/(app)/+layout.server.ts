import { supabaseClient } from '$lib/supabase/supabaseClient';
import type UserProfile from '$lib/types/UserProfile';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad<{ userProfile: UserProfile | null }> = async ({ locals }) => {
	const user = locals.user;

	if (!user) {
		return { userProfile: null };
	}

	const { data: profile } = await supabaseClient
		.from('profiles')
		.select('username, name, quote')
		.match({ id: user.id })
		.single();

	return {
		userProfile: {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			email: user.email!,
			profilename: profile.name,
			username: profile.username,
			quote: profile.quote
		}
	};
};

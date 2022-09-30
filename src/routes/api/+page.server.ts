import { deleteSession } from '$lib/supabase-auth/server';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	async logout({ cookies }) {
		deleteSession(cookies);
		throw redirect(303, '/');
	}
};

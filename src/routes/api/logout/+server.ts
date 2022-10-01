import { deleteSession } from '$lib/supabase-auth/server';
import redirectHome from 'src/lib/server/redirectHome';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
	deleteSession(cookies);
	throw redirectHome();
};

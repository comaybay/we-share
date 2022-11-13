import type { TypedSupabaseClient } from '@supabase/auth-helpers-sveltekit/dist/types';

export async function getIdFromUsername(username: string, supabase: TypedSupabaseClient) {
	const { data } = await supabase.from('profiles').select('id').match({ username }).single();
	return data?.id as string | null;
}

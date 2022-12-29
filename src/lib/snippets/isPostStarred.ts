import type { TypedSupabaseClient } from '@supabase/auth-helpers-sveltekit/dist/types';
import type { PostType } from '../types/PostType';
import { postStarsTableByPostType } from './postTypeMaps';

export async function isPostStarred(
	postType: PostType,
	userId: string,
	postId: number,
	supabaseClient: TypedSupabaseClient
) {
	const result = await supabaseClient
		.from(postStarsTableByPostType[postType])
		.select('post_id')
		.eq('post_id', postId)
		.eq('user_id', userId);

	const starred = result.data ? result.data.length > 0 : false;
	return { starred, ...result };
}

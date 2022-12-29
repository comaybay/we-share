import type { TypedSupabaseClient } from '@supabase/auth-helpers-sveltekit/dist/types';
import type { PostType } from '../types/PostType';
import { postCommentStarsTableByPostType } from './postTypeMaps';

/**
 *
 * @param postType
 * @param userId
 * @param commentIds comments that needs to check if is starred
 * @param supabaseClient
 */
export async function getStarredCommentIds(
	postType: PostType,
	userId: string,
	commentIds: number[],
	supabaseClient: TypedSupabaseClient
) {
	const result = await supabaseClient
		.from(postCommentStarsTableByPostType[postType])
		.select('comment_id')
		.eq('user_id', userId)
		.in('comment_id', commentIds);

	if (result.error) {
		return { ...result, starredSet: null };
	}

	const starredSet = new Set<number>(result.data.map(ds => ds.comment_id));
	return { ...result, starredSet };
}

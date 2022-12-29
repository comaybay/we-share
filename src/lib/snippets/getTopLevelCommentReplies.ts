/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TypedSupabaseClient } from '@supabase/auth-helpers-sveltekit/dist/types';
import type { PostComment } from '../types/PostComment';
import type { PostType } from '../types/PostType';
import type { ForeignTableCount } from '../types/supabase/ForeignTableCount';
import { getStarredCommentIds } from './getStarredCommentIds';
import {
	postCommentStarsTableByPostType,
	postCommentsAuthorFKByPostType,
	postCommentsTableByPostType
} from './postTypeMaps';

/**
 *
 * @param postType
 * @param commentId comment to get replies
 * @param userId current user id, use to check whether they starred those comments
 * @param supabaseClient
 * @returns
 */
export async function getTopLevelCommentReplies(
	postType: PostType,
	commentId: number,
	userId: string | null,
	supabaseClient: TypedSupabaseClient
) {
	const isTeamType = postType === 'team';

	const fk = postCommentsAuthorFKByPostType[postType];
	const starCountQueryString = isTeamType
		? ''
		: `, comment_stars:${postCommentStarsTableByPostType[postType]}(count)`;

	const queryString = `id, post_id, author:profiles!${fk}(id, username), date_created, date_last_updated, content, 
			parent_comment_id, top_level_comment_id ${starCountQueryString}, 
			parent_comment:parent_comment_id(author:author_id(username, id))`;

	const result: any = await supabaseClient
		.from(postCommentsTableByPostType[postType])
		.select(queryString)
		.eq('top_level_comment_id', commentId);

	if (result.error) {
		return { ...result, replies: null };
	}

	let starredReplyIdSet = new Set<number>();

	if (userId && !isTeamType) {
		const starredRepliesResult = await getStarredCommentIds(
			postType,
			userId,
			result.data.map((c: any) => c.id),
			supabaseClient
		);

		if (starredRepliesResult.error) {
			return { ...starredRepliesResult, replies: null };
		}

		starredReplyIdSet = starredRepliesResult.starredSet;
	}

	const replies: PostComment[] = result.data.map((r: any) => ({
		id: r.id,
		postId: r.post_id,
		author: r.author as Exclude<Exclude<typeof r.author, object[]>, null>,
		content: r.content,
		dateCreated: new Date(r.date_created),
		dateLastUpdated: r.date_last_updated ? new Date(r.date_last_updated) : null,
		parentCommentId: r.parent_comment_id,
		topLevelCommentId: r.top_level_comment_id,
		starCount: isTeamType ? null : (r.comment_stars as ForeignTableCount)[0].count,
		starred: isTeamType ? null : starredReplyIdSet.has(r.id),
		parentCommentAuthor: r.parent_comment?.author ?? null
	}));

	return { ...result, replies };
}

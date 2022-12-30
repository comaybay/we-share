/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { TypedSupabaseClient } from '@supabase/auth-helpers-sveltekit/dist/types';
import { removeNewlines } from '../removeNewlines';
import type { PostComment } from '../types/PostComment';
import type { PostType } from '../types/PostType';
import type { ForeignProfileName } from '../types/supabase/ForeignProfileName';
import type { PostCommentInsert } from '../types/supabase/PostCommentInsert';
import { postCommentsTableByPostType } from './postTypeMaps';

export async function insertComment(
	postType: PostType,
	comment: PostCommentInsert,
	supabaseClient: TypedSupabaseClient
) {
	const result = await supabaseClient
		.from(postCommentsTableByPostType[postType])
		.insert({
			author_id: comment.authorId,
			content: comment.content,
			text_content: removeNewlines(comment.textContent),
			post_id: comment.postId,
			parent_comment_id: comment.parentCommentId,
			top_level_comment_id: comment.topLevelCommentId
		})
		.select(
			'*, author:author_id(username), parent_comment:parent_comment_id(author:author_id(username, id))'
		)
		.single();

	if (result.error) {
		return { model: null, ...result };
	}

	const data = result.data;

	const isTeamType = postType === 'team';

	const model: PostComment = {
		id: data.id,
		author: {
			id: data.author_id,
			username: (data.author as ForeignProfileName).username
		},
		content: data.content,
		dateCreated: new Date(data.date_created),
		dateLastUpdated: data.date_last_updated ? new Date(data.date_last_updated) : null,
		parentCommentId: data.parent_comment_id,
		topLevelCommentId: data.top_level_comment_id,
		postId: data.post_id,
		starCount: isTeamType ? null : 0,
		starred: isTeamType ? null : false,
		parentCommentAuthor: null
	};

	if (model.topLevelCommentId) {
		const dataParentComment = data.parent_comment as NonNullable<
			Exclude<typeof data.parent_comment, object[]>
		>;

		model.parentCommentAuthor = dataParentComment.author as { username: string; id: string };
	}

	return { model, ...result };
}

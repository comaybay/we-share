import type { TypedSupabaseClient } from '@supabase/auth-helpers-sveltekit/dist/types';
import type { PostTopLevelComment } from '../types/PostTopLevelComment';
import type { PostType } from '../types/PostType';
import type { ForeignProfileName } from '../types/supabase/ForeignProfileName';
import type { PostCommentInsert } from '../types/supabase/PostCommentInsert';
import { postCommentsTableByPostType } from './postTypeMaps';

export async function insertTopLevelComment(
	postType: PostType,
	comment: PostCommentInsert,
	supabaseClient: TypedSupabaseClient
) {
	const result = await supabaseClient
		.from(postCommentsTableByPostType[postType])
		.insert({
			author_id: comment.authorId,
			content: comment.content,
			text_content: comment.textContent,
			post_id: comment.postId,
			parent_comment_id: comment.parentCommentId,
			top_level_comment_id: comment.topLevelCommentId
		})
		.select('*, author:author_id(username)')
		.single();

	if (result.error) {
		return { model: null, ...result };
	}

	const data = result.data;
	const model: PostTopLevelComment = {
		id: data.id,
		author: {
			id: data.author_id,
			username: (data.author as ForeignProfileName).username
		},
		content: data.content,
		dateCreated: new Date(data.date_created),
		dateLastUpdated: data.date_last_updated ? new Date(data.date_last_updated) : null,
		postId: data.post_id,
		replyCount: 0,
		starCount: 0,
		starred: false
	};

	return { model, ...result };
}

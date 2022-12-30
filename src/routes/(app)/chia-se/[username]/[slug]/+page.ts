/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error404, error500 } from 'src/lib/errors';
import {
	MSG_POST_NOT_FOUND,
	MSG_SERVER_ERROR_TRY_AGAIN,
	MSG_USER_NOT_FOUND
} from 'src/lib/messages';
import { getIdFromUsername } from 'src/lib/snippets/getIdFromUsername';
import { getStarredCommentIds } from 'src/lib/snippets/getStarredCommentIds';
import { isPostStarred } from 'src/lib/snippets/isPostStarred';
import { truncateForMetaDescription } from 'src/lib/truncateForMetaDescription';
import type { PostTopLevelComment } from 'src/lib/types/PostTopLevelComment';
import type { ForeignTableCount } from 'src/lib/types/supabase/ForeignTableCount';
import type { PageLoad } from './$types';

export const load: PageLoad = async event => {
	const { session, supabaseClient } = await getSupabase(event);

	const authorId = await getIdFromUsername(event.params.username, supabaseClient);

	if (!authorId) {
		throw error404({ message: MSG_USER_NOT_FOUND });
	}

	const { data: dataPost } = await supabaseClient
		.from('post_sharings')
		.select(
			`id, date_created, date_last_updated, title, content, text_content, topics, view_count, 
			post_sharing_comments(count), post_sharing_stars!inner(count)`
		)
		.match({ slug: event.params.slug, author_id: authorId })
		.single();

	if (!dataPost) {
		throw error404({ message: MSG_POST_NOT_FOUND });
	}

	const { data: dataComments } = await supabaseClient
		.from('view_post_sharing_top_level_comments')
		.select(
			`
				id, post_id, date_created, date_last_updated, content, reply_count, 
				author_id, author_username, star_count
			`
		)
		.eq('post_id', dataPost.id);

	if (!dataComments) {
		throw error500({ message: MSG_SERVER_ERROR_TRY_AGAIN });
	}

	let postStarred = false;
	let starredCommentIds: Set<number> = new Set();

	if (session) {
		const { starred, error: errorStarredQuestion } = await isPostStarred(
			'sharing',
			session.user.id,
			dataPost.id,
			supabaseClient
		);

		const { starredSet, error: errorStarredComments } = await getStarredCommentIds(
			'sharing',
			session.user.id,
			dataComments.map(c => c.id!),
			supabaseClient
		);

		if (errorStarredComments || errorStarredQuestion) {
			throw error500({ message: MSG_SERVER_ERROR_TRY_AGAIN });
		}

		postStarred = starred;
		starredCommentIds = starredSet;
	}

	const comments: PostTopLevelComment[] = dataComments.map(c => {
		return {
			id: c.id!,
			postId: c.post_id!,
			author: {
				username: c.author_username!,
				id: c.author_id!
			},
			content: c.content!,
			dateCreated: new Date(c.date_created!),
			dateLastUpdated: c.date_last_updated ? new Date(c.date_last_updated) : null,
			starCount: c.star_count!,
			starred: starredCommentIds.has(c.id!),
			replyCount: c.reply_count!
		};
	});

	return {
		post: {
			author: {
				username: event.params.username,
				id: authorId
			},
			id: dataPost.id,
			title: dataPost.title,
			dateCreated: new Date(dataPost.date_created),
			dateLastUpdated: dataPost.date_last_updated ? new Date(dataPost.date_last_updated) : null,
			content: dataPost.content,
			topics: dataPost.topics,
			viewCount: dataPost.view_count,
			starCount: (dataPost.post_sharing_stars as ForeignTableCount)[0].count,
			commentCount: (dataPost.post_sharing_comments as ForeignTableCount)[0].count,
			starred: postStarred
		},
		comments,
		metaDescription: truncateForMetaDescription(dataPost.text_content)
	};
};

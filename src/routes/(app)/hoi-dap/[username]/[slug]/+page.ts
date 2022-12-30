/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error } from '@sveltejs/kit';
import { error404, error500 } from 'src/lib/errors';
import { MSG_SERVER_ERROR_TRY_AGAIN } from 'src/lib/messages';
import { getIdFromUsername } from 'src/lib/snippets/getIdFromUsername';
import { getStarredCommentIds } from 'src/lib/snippets/getStarredCommentIds';
import { isPostStarred } from 'src/lib/snippets/isPostStarred';
import { truncateForMetaDescription } from 'src/lib/truncateForMetaDescription';
import type { ForeignTableCount } from 'src/lib/types/supabase/ForeignTableCount';
import type { PageLoad } from './$types';

export const load: PageLoad = async event => {
	const { session, supabaseClient } = await getSupabase(event);

	const authorId = await getIdFromUsername(event.params.username, supabaseClient);

	if (!authorId) {
		throw error(404, { message: 'Người dùng này không tồn tại' });
	}

	const { data: dataQuestion } = await supabaseClient
		.from('post_questions')
		.select(
			`id, date_created, date_last_updated, title, content, text_content, topics, favorite_answer_id, view_count, 
			post_question_comments!post_question_comments_post_id_fkey(count), post_question_stars!inner(count)`
		)
		.match({ slug: event.params.slug, author_id: authorId })
		.single();

	if (!dataQuestion) {
		throw error404({ message: 'Câu hỏi này không tồn tại hoặc đã bị chủ bài viết xóa' });
	}

	const { data: dataComments } = await supabaseClient
		.from('view_post_question_top_level_comments')
		.select(
			`
				id, post_id, date_created, date_last_updated, content, reply_count, 
				author_id, author_username, star_count
			`
		)
		.eq('post_id', dataQuestion.id);

	if (!dataComments) {
		throw error500({ message: MSG_SERVER_ERROR_TRY_AGAIN });
	}

	let questionStarred = false;
	let starredCommentIds: Set<number> = new Set();

	if (session) {
		const { starred, error: errorStarredQuestion } = await isPostStarred(
			'question',
			session.user.id,
			dataQuestion.id,
			supabaseClient
		);

		const { starredSet, error: errorStarredComments } = await getStarredCommentIds(
			'question',
			session.user.id,
			dataComments.map(c => c.id!),
			supabaseClient
		);

		if (errorStarredComments || errorStarredQuestion) {
			throw error500({ message: MSG_SERVER_ERROR_TRY_AGAIN });
		}

		questionStarred = starred;
		starredCommentIds = starredSet;
	}

	return {
		post: {
			author: {
				username: event.params.username,
				id: authorId
			},
			id: dataQuestion.id,
			title: dataQuestion.title,
			dateCreated: new Date(dataQuestion.date_created),
			dateLastUpdated: dataQuestion.date_last_updated
				? new Date(dataQuestion.date_last_updated)
				: null,
			content: dataQuestion.content,
			topics: dataQuestion.topics,
			favoriteAnswerId: dataQuestion.favorite_answer_id,
			viewCount: dataQuestion.view_count,
			starCount: (dataQuestion.post_question_stars as ForeignTableCount)[0].count,
			commentCount: (dataQuestion.post_question_comments as ForeignTableCount)[0].count,
			starred: questionStarred
		},
		comments: dataComments.map(c => {
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
		}),
		metaDescription: truncateForMetaDescription(dataQuestion.text_content)
	};
};

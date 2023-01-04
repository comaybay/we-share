import type { TypedSupabaseClient } from '@supabase/auth-helpers-sveltekit/dist/types';
import type { Session } from '@supabase/supabase-js';
import { error } from '@sveltejs/kit';
import type { ForeignProfileName } from 'src/lib/types/supabase/ForeignProfileName';
import type { ForeignTableCount } from 'src/lib/types/supabase/ForeignTableCount';
import { error500 } from '../errors';
import { MSG_SERVER_ERROR } from '../messages';
import { getPaginationRange } from '../pagination';

export interface Options {
	page: number;
	limit: number;

	order: 'top' | 'newest';
	topics: string[];

	/** session will be used to check if this user has starred a post */
	session: Session | null;
}

export async function getQuestions(supabaseClient: TypedSupabaseClient, options: Options) {
	const { from, to } = getPaginationRange(options.page, options.limit);
	const query = supabaseClient
		.from('post_questions')
		.select(
			`id, title, date_created, date_last_updated, view_count, topics, favorite_answer_id, slug,
			profiles!post_questions_author_id_fkey(username), post_question_comments!post_question_comments_post_id_fkey(count), post_question_stars!inner(count)`
		)
		.range(from, to);

	if (options.topics.length > 0) {
		query.contains('topics', options.topics);
	}

	// https://github.com/supabase/supabase/discussions/7875
	if (options.order === 'top') {
		query.order('post_question_stars_count', { ascending: false });
	} else if (options.order === 'newest') {
		query.order('date_created', { ascending: false });
	} else {
		//TODO: sort by hot
		query.order('date_created', { ascending: false });
	}

	const { data: questionsData, error: getQuestionsError } = await query;

	if (getQuestionsError) {
		throw error500({ message: MSG_SERVER_ERROR });
	}

	let starredPosts = new Set<number>();
	if (options.session) {
		const { error: serverError, data } = await supabaseClient
			.from('post_question_stars')
			.select('post_id')
			.eq('user_id', options.session.user.id)
			.in(
				'post_id',
				questionsData.map(q => q.id)
			);

		if (serverError) {
			throw error(500);
		}

		starredPosts = new Set(data.map(s => s.post_id));
	}

	const questions = questionsData.map(q => ({
		id: q.id,
		title: q.title,
		slug: q.slug,
		dateCreated: new Date(q.date_created),
		dateLastUpdated: q.date_last_updated ? new Date(q.date_last_updated) : null,
		authorUsername: (q.profiles as ForeignProfileName).username,
		topics: q.topics,
		hasFavoritedAnswer: q.favorite_answer_id !== null,
		viewCount: q.view_count,
		commentCount: (q.post_question_comments as ForeignTableCount)[0].count,
		starCount: (q.post_question_stars as ForeignTableCount)[0].count,
		starred: starredPosts.has(q.id)
	}));

	return questions;
}

import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error } from '@sveltejs/kit';
import type { ForeignProfileName } from 'src/lib/types/supabase/ForeignProfileName';
import type { ForeignTableCount } from 'src/lib/types/supabase/ForeignTableCount';
import type { PageLoad } from './$types';

export const load: PageLoad = async event => {
	const { supabaseClient } = await getSupabase(event);

	const query = supabaseClient.from('post_questions').select(
		`title, date_created, date_last_updated, view_count, topics, favorite_answer_id, slug,
			profiles!post_questions_author_id_fkey(username), post_question_comments(count), post_question_stars(count)`
	);

	const { url } = event;
	if (url.searchParams.has('topic')) {
		query.contains('topics', [url.searchParams.get('topic')]);
	}

	const { data, error: getQuestionsError } = await query;

	if (getQuestionsError) {
		throw error(404);
	}

	const questions = data.map(q => ({
		title: q.title,
		slug: q.slug,
		dateCreated: new Date(q.date_created),
		dateLastUpdated: q.date_last_updated ? new Date(q.date_last_updated) : null,
		authorUsername: (q.profiles as ForeignProfileName).username,
		topics: q.topics,
		hasFavoritedAnswer: q.favorite_answer_id !== null,
		viewCount: q.view_count,
		commentCount: (q.post_question_comments as ForeignTableCount)[0].count,
		starCount: (q.post_question_stars as ForeignTableCount)[0].count
	}));

	return {
		questions
	};
};
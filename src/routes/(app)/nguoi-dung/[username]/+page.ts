/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error404 } from 'src/lib/errors';
import { MSG_SERVER_ERROR_TRY_AGAIN, MSG_USER_NOT_FOUND } from 'src/lib/messages';
import { getIdFromUsername } from 'src/lib/snippets/getIdFromUsername';
import type { PageLoad } from './$types';

export const load: PageLoad = async event => {
	const { supabaseClient } = await getSupabase(event);

	const id = await getIdFromUsername(event.params.username, supabaseClient);

	if (!id) {
		throw error404({ message: MSG_USER_NOT_FOUND });
	}

	const { data, error } = await supabaseClient
		.from('view_user_stats')
		.select(
			`name, username, quote, question_star_count, question_comment_star_count, 
			favorite_answer_count, sharing_star_count, sharing_comment_star_count, bookmark_count`
		)
		.match({ id })
		.single();

	if (error) {
		throw error404({ message: MSG_SERVER_ERROR_TRY_AGAIN });
	}

	return {
		user: {
			username: data.username!,
			name: data.name,
			quote: data.quote
		},
		stats: {
			questionStarCount: data.question_comment_star_count!,
			questionCommentStarCount: data.question_comment_star_count!,
			favoriteAnswerCount: data.favorite_answer_count!,
			sharingStarCount: data.sharing_star_count!,
			sharingCommentStarCount: data.sharing_comment_star_count!,
			bookmarkCount: data.bookmark_count!
		}
	};
};

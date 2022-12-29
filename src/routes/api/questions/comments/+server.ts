import { invalid, json } from '@sveltejs/kit';
import { error400 } from 'src/lib/errors';
import { MSG_SERVER_ERROR_TRY_AGAIN } from 'src/lib/messages';
import { insertTopLevelComment } from 'src/lib/snippets/insertTopLevelComment';
import { validPostCommentInsert } from 'src/lib/types/supabase/PostCommentInsert';
import { useProtectedRoute } from 'src/lib/useProtectedRoute';
import type { RequestHandler } from '../../comments/$types';

export const POST: RequestHandler = async event => {
	const { supabaseClient } = await useProtectedRoute(event);

	const comment = await event.request.json();

	if (!validPostCommentInsert(comment)) {
		throw error400({
			message:
				'invalid request body, possible reasons: missing properties, incorrect property types'
		});
	}

	const { data, error } = await insertTopLevelComment('question', comment, supabaseClient);

	if (error) {
		throw invalid(500, { userFriendlyMessage: MSG_SERVER_ERROR_TRY_AGAIN });
	}

	return json();
};

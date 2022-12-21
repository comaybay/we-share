import { error401, error404, error500 } from 'src/lib/errors';
import { MSG_NOT_ALLOW_EDIT_POST, MSG_POST_NOT_FOUND, MSG_SERVER_ERROR } from 'src/lib/messages';
import { useProtectedRoute } from 'src/lib/useProtectedRoute';
import type { PageLoad } from './$types';

export const load: PageLoad = async event => {
	const { session, supabaseClient } = await useProtectedRoute(event);

	const { data, error } = await supabaseClient
		.from('post_questions')
		.select('id, author_id, title, content, topics')
		.eq('id', event.params.id);

	if (error) {
		throw error500({ message: MSG_SERVER_ERROR });
	}

	if (data.length === 0) {
		throw error404({ message: MSG_POST_NOT_FOUND });
	}

	const post = data[0];
	if (post.author_id !== session.user.id) {
		throw error401({ message: MSG_NOT_ALLOW_EDIT_POST });
	}

	return {
		post: {
			id: post.id,
			title: post.title,
			content: post.content,
			topics: post.topics
		}
	};
};

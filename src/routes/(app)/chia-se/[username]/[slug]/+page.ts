import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error } from '@sveltejs/kit';
import { getIdFromUsername } from 'src/lib/getIdFromUsername';
import type { PageLoad } from './$types';

export const load: PageLoad = async event => {
	const { supabaseClient } = await getSupabase(event);

	const authorId = await getIdFromUsername(event.params.username, supabaseClient);

	if (!authorId) {
		throw error(404, { message: 'Người dùng này không tồn tại' });
	}

	const { data } = await supabaseClient
		.from('post_sharings')
		.select('id, date_created, date_last_updated, title, content, topics')
		.match({ slug: event.params.slug, author_id: authorId })
		.single();

	if (!data) {
		throw error(404, { message: 'Bài viết này không tồn tại hoặc đã bị chủ bài viết xóa' });
	}

	return {
		post: {
			author: {
				username: event.params.username,
				id: authorId
			},
			id: data.id,
			title: data.title,
			dateCreated: new Date(data.date_created),
			dateLastUpdated: data.date_last_updated ? new Date(data.date_last_updated) : null,
			content: data.content,
			topics: data.topics
		}
	};
};

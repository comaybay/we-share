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
		.from('post_questions')
		.select('id, date_created, date_last_updated, title, content, topics, favorite_answer_id')
		.match({ slug: event.params.slug, author_id: authorId })
		.single();

	if (!data) {
		throw error(404, { message: 'Câu hỏi này không tồn tại hoặc đã bị chủ bài viết xóa' });
	}

	return {
		post: {
			id: data.id,
			title: data.title,
			dateCreated: data.date_created,
			dateLastUpdated: data.date_last_updated,
			content: data.content,
			topics: data.topics,
			favoriteAnswerId: data.favorite_answer_id
		}
	};
};

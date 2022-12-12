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
		.from('post_teams')
		.select(
			'id, date_created, date_last_updated, title, content, team_size, course_code, needed_skills, view_count, members:profiles!post_team_members(username)'
		)
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
			neededSkills: data.needed_skills,
			courseCode: data.course_code,
			viewCount: data.view_count,
			members: data.members as Extract<typeof data.members, Array<object>>
		}
	};
};

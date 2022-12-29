/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error } from '@sveltejs/kit';
import { error404, error500 } from 'src/lib/errors';
import { MSG_POST_NOT_FOUND, MSG_SERVER_ERROR_TRY_AGAIN } from 'src/lib/messages';
import { getIdFromUsername } from 'src/lib/snippets/getIdFromUsername';
import type { PostTopLevelComment } from 'src/lib/types/PostTopLevelComment';
import type { ForeignTableCount } from 'src/lib/types/supabase/ForeignTableCount';
import type { PageLoad } from './$types';

export const load: PageLoad = async event => {
	const { session, supabaseClient } = await getSupabase(event);

	const authorId = await getIdFromUsername(event.params.username, supabaseClient);

	if (!authorId) {
		throw error(404, { message: 'Người dùng này không tồn tại' });
	}

	const { data: dataPost } = await supabaseClient
		.from('post_teams')
		.select(
			`id, date_created, date_last_updated, title, content, team_size, course_code, needed_skills, view_count, 
			members:profiles!post_team_members(username), post_team_comments(count)`
		)
		.match({ slug: event.params.slug, author_id: authorId })
		.single();

	if (!dataPost) {
		throw error404({ message: MSG_POST_NOT_FOUND });
	}

	const { data: dataComments } = await supabaseClient
		.from('view_post_team_top_level_comments')
		.select(
			`
				id, post_id, date_created, date_last_updated, content, reply_count, 
				author_id, author_username
			`
		)
		.eq('post_id', dataPost.id);

	if (!dataComments) {
		throw error500({ message: MSG_SERVER_ERROR_TRY_AGAIN });
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
			replyCount: c.reply_count!,
			starCount: null,
			starred: null,
			parentCommentAuthor: null
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
			neededSkills: dataPost.needed_skills,
			courseCode: dataPost.course_code,
			viewCount: dataPost.view_count,
			members: dataPost.members as Extract<typeof dataPost.members, Array<object>>,
			commentCount: (dataPost.post_team_comments as ForeignTableCount)[0].count,
			teamSize: dataPost.team_size
		},
		comments
	};
};

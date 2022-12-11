import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error } from '@sveltejs/kit';
import type { ForeignProfileName } from 'src/lib/types/supabase/ForeignProfileName';
import type { ForeignTableCount } from 'src/lib/types/supabase/ForeignTableCount';
import type { PageLoad } from './$types';

export const load: PageLoad = async event => {
	event.depends('findteamposts:get');
	const { supabaseClient } = await getSupabase(event);

	const query = supabaseClient.from('post_teams').select(
		`title, date_created, date_last_updated, team_size, course_code, needed_skills, view_count, slug,
			profiles!post_teams_author_id_fkey(username), post_team_comments(count), post_team_members(count)`
	);

	const { url } = event;
	const searchParams = url.searchParams;
	if (searchParams.has('topic')) {
		query.contains('needed_skills', [searchParams.get('topic')]);
	}

	if (searchParams.has('filter')) {
		const filter = searchParams.get('filter');

		if (filter === 'not-full') {
			query
				.neq('team_size', 'post_teams_members.count')
				.order('date_last_updated', { ascending: false })
				.order('date_created', { ascending: false });
		}
	}

	const { data, error: getPostsError } = await query;

	if (getPostsError) {
		console.log(getPostsError);
		throw error(404);
	}

	const posts = data.map(q => ({
		title: q.title,
		slug: q.slug,
		dateCreated: new Date(q.date_created),
		dateLastUpdated: q.date_last_updated ? new Date(q.date_last_updated) : null,
		authorUsername: (q.profiles as ForeignProfileName).username,
		teamSize: q.team_size,
		teamMemberCount: (q.post_team_members as ForeignTableCount)[0].count,
		courseCode: q.course_code,
		neededSkills: q.needed_skills,
		viewCount: q.view_count,
		commentCount: (q.post_team_comments as ForeignTableCount)[0].count
	}));

	return {
		posts
	};
};

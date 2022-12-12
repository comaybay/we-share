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
			author:profiles!post_teams_author_id_fkey(username), members:profiles!post_team_members(count), 
			post_team_comments(count), post_team_members(count)`
	);
	console.log('A');

	const { url } = event;
	const searchParams = url.searchParams;
	if (searchParams.has('topic')) {
		query.contains('needed_skills', [searchParams.get('topic')]);
	}

	if (searchParams.has('course-code')) {
		query.eq('course_code', searchParams.get('course-code'));
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
		throw error(404);
	}

	const posts = data.map(q => ({
		title: q.title,
		slug: q.slug,
		dateCreated: new Date(q.date_created),
		dateLastUpdated: q.date_last_updated ? new Date(q.date_last_updated) : null,
		authorUsername: (q.author as ForeignProfileName).username,
		teamSize: q.team_size,
		memberCount: (q.members as ForeignTableCount)[0].count,
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

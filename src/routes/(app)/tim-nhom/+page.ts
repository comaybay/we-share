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
			profiles!post_teams_author_id_fkey(username), post_team_comments(count), post_team_members!inner(count)`
	);

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
			query.eq('is_team_full', false);
		}
	}

	query.order('date_created', { ascending: false });

	const { data: postsData, error: getPostsError } = await query;

	if (getPostsError) {
		throw error(404);
	}

	const posts = postsData.map(p => ({
		title: p.title,
		slug: p.slug,
		dateCreated: new Date(p.date_created),
		dateLastUpdated: p.date_last_updated ? new Date(p.date_last_updated) : null,
		authorUsername: (p.profiles as ForeignProfileName).username,
		teamSize: p.team_size,
		teamMemberCount: (p.post_team_members as ForeignTableCount)[0].count,
		courseCode: p.course_code,
		neededSkills: p.needed_skills,
		viewCount: p.view_count,
		commentCount: (p.post_team_comments as ForeignTableCount)[0].count
	}));

	return {
		posts
	};
};

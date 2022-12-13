import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error } from '@sveltejs/kit';
import type { ForeignProfileName } from 'src/lib/types/supabase/ForeignProfileName';
import type { ForeignTableCount } from 'src/lib/types/supabase/ForeignTableCount';
import type { PageLoad } from './$types';

export const load: PageLoad = async event => {
	event.depends('sharingposts:get');
	const { supabaseClient } = await getSupabase(event);

	const query = supabaseClient.from('post_sharings').select(
		`title, date_created, date_last_updated, view_count, topics, slug,
			profiles!post_sharings_author_id_fkey(username), post_sharing_comments(count), post_sharing_stars(count)`
	);

	const { url } = event;
	const searchParams = url.searchParams;
	if (searchParams.has('topic')) {
		query.contains('topics', [searchParams.get('topic')]);
	}

	if (searchParams.has('order')) {
		const order = searchParams.get('order');
		// https://github.com/supabase/supabase/discussions/7875
		if (order === 'top') {
			query.order('post_sharing_stars_count', { ascending: false });
		} else if (order === 'newest') {
			query
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
		authorUsername: (q.profiles as ForeignProfileName).username,
		topics: q.topics,
		viewCount: q.view_count,
		commentCount: (q.post_sharing_comments as ForeignTableCount)[0].count,
		starCount: (q.post_sharing_stars as ForeignTableCount)[0].count
	}));

	return {
		posts
	};
};

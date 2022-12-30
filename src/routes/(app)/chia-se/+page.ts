import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error } from '@sveltejs/kit';
import type { ForeignProfileName } from 'src/lib/types/supabase/ForeignProfileName';
import type { ForeignTableCount } from 'src/lib/types/supabase/ForeignTableCount';
import type { PageLoad } from './$types';

export const load: PageLoad = async event => {
	event.depends('sharingposts:get');
	const { session, supabaseClient } = await getSupabase(event);

	const query = supabaseClient.from('post_sharings').select(
		`id, title, date_created, date_last_updated, view_count, topics, slug,
			profiles!post_sharings_author_id_fkey(username), post_sharing_comments(count), post_sharing_stars(count)`
	);

	const { url } = event;
	const searchParams = url.searchParams;
	if (searchParams.has('topic')) {
		query.contains('topics', [searchParams.get('topic')]);
	}

	const order = searchParams.get('order');
	// https://github.com/supabase/supabase/discussions/7875
	if (order === 'top') {
		query.order('post_sharing_stars_count', { ascending: false });
	} else if (order === 'newest') {
		query
			.order('date_last_updated', { ascending: false })
			.order('date_created', { ascending: false });
	} else {
		//TODO: sort by hot
		query
			.order('date_last_updated', { ascending: false })
			.order('date_created', { ascending: false });
	}
	const { data: postsData, error: getPostsError } = await query;

	if (getPostsError) {
		throw error(404);
	}

	let starredPosts: Set<number> | null = null;
	if (session) {
		const { error: serverError, data } = await supabaseClient
			.from('post_sharing_stars')
			.select('post_id')
			.eq('user_id', session.user.id)
			.in(
				'post_id',
				postsData.map(p => p.id)
			);

		if (serverError) {
			throw error(500);
		}

		starredPosts = new Set(data.map(s => s.post_id));
	}
	const posts = postsData.map(p => ({
		id: p.id,
		title: p.title,
		slug: p.slug,
		dateCreated: new Date(p.date_created),
		dateLastUpdated: p.date_last_updated ? new Date(p.date_last_updated) : null,
		authorUsername: (p.profiles as ForeignProfileName).username,
		topics: p.topics,
		viewCount: p.view_count,
		commentCount: (p.post_sharing_comments as ForeignTableCount)[0].count,
		starCount: (p.post_sharing_stars as ForeignTableCount)[0].count,
		starred: starredPosts ? starredPosts.has(p.id) : false
	}));

	return {
		posts
	};
};

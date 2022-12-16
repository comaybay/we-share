import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error } from '@sveltejs/kit';
import type { ForeignProfileName } from 'src/lib/types/supabase/ForeignProfileName';
import type { ForeignTableCount } from 'src/lib/types/supabase/ForeignTableCount';
import type { PageLoad } from './$types';

export const load: PageLoad = async event => {
	const { session, supabaseClient } = await getSupabase(event);

	const questionsQuery = supabaseClient
		.from('post_questions')
		.select(
			`id, title, date_created, date_last_updated, view_count, slug,
			profiles!post_questions_author_id_fkey(username), post_question_comments(count), post_question_stars!inner(count)`
		)
		.order('date_last_updated', { ascending: false })
		.order('date_created', { ascending: false })
		.limit(3);

	const sharingPostsQuery = supabaseClient
		.from('post_sharings')
		.select(
			`id, title, date_created, date_last_updated, view_count, slug,
			profiles!post_sharings_author_id_fkey(username), post_sharing_comments(count), post_sharing_stars(count)`
		)
		.order('date_last_updated', { ascending: false })
		.order('date_created', { ascending: false })
		.limit(3);

	const findTeamPostsQuery = supabaseClient
		.from('post_teams')
		.select(
			`title, date_created, date_last_updated, team_size, view_count, slug,
			profiles!post_teams_author_id_fkey(username), post_team_comments(count), post_team_members!inner(count)`
		)
		.order('date_last_updated', { ascending: false })
		.order('date_created', { ascending: false })
		.limit(3);

	await Promise.all([questionsQuery, sharingPostsQuery, findTeamPostsQuery]);

	const { data: questionsData, error: questionsError } = await questionsQuery;
	const { data: sharingPostsData, error: sharingpostsError } = await sharingPostsQuery;
	const { data: findTeamPostsData, error: findTeamPostsError } = await findTeamPostsQuery;

	if (questionsError || sharingpostsError || findTeamPostsError) {
		throw error(500);
	}

	let starredQuestionIdSet: Set<number> | null = null;
	let starredSharingPostIdSet: Set<number> | null = null;

	if (session) {
		const starredQuestionsQuery = supabaseClient
			.from('post_question_stars')
			.select('post_id')
			.eq('user_id', session.user.id)
			.in(
				'post_id',
				questionsData.map(q => q.id)
			);
		const starredSharingPostsQuery = supabaseClient
			.from('post_sharing_stars')
			.select('post_id')
			.eq('user_id', session.user.id)
			.in(
				'post_id',
				sharingPostsData.map(p => p.id)
			);
		await Promise.all([starredQuestionsQuery, starredSharingPostsQuery]);

		const { error: starredQuestionsError, data: starredQuestions } = await starredQuestionsQuery;
		const { error: starredSharingPostsError, data: starredSharingPosts } =
			await starredSharingPostsQuery;

		if (starredQuestionsError || starredSharingPostsError) {
			throw error(500);
		}

		starredQuestionIdSet = new Set(starredQuestions.map(s => s.post_id));
		starredSharingPostIdSet = new Set(starredSharingPosts.map(s => s.post_id));
	}

	return {
		questions: questionsData.map(q => ({
			id: q.id,
			title: q.title,
			slug: q.slug,
			dateCreated: new Date(q.date_created),
			dateLastUpdated: q.date_last_updated ? new Date(q.date_last_updated) : null,
			authorUsername: (q.profiles as ForeignProfileName).username,
			viewCount: q.view_count,
			commentCount: (q.post_question_comments as ForeignTableCount)[0].count,
			starCount: (q.post_question_stars as ForeignTableCount)[0].count,
			starred: starredQuestionIdSet ? starredQuestionIdSet.has(q.id) : false
		})),
		sharingPosts: sharingPostsData.map(p => ({
			id: p.id,
			title: p.title,
			slug: p.slug,
			dateCreated: new Date(p.date_created),
			dateLastUpdated: p.date_last_updated ? new Date(p.date_last_updated) : null,
			authorUsername: (p.profiles as ForeignProfileName).username,
			viewCount: p.view_count,
			commentCount: (p.post_sharing_comments as ForeignTableCount)[0].count,
			starCount: (p.post_sharing_stars as ForeignTableCount)[0].count,
			starred: starredSharingPostIdSet ? starredSharingPostIdSet.has(p.id) : false
		})),
		findTeamPosts: findTeamPostsData.map(p => ({
			title: p.title,
			slug: p.slug,
			dateCreated: new Date(p.date_created),
			dateLastUpdated: p.date_last_updated ? new Date(p.date_last_updated) : null,
			authorUsername: (p.profiles as ForeignProfileName).username,
			viewCount: p.view_count,
			commentCount: (p.post_team_comments as ForeignTableCount)[0].count,
			teamSize: p.team_size,
			teamMemberCount: (p.post_team_members as ForeignTableCount)[0].count
		}))
	};
};

import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { POST_PER_PAGE } from 'src/lib/constants';
import { getQuestions } from 'src/lib/snippets/getQuestions';
import { parseIntOrDefault } from 'src/lib/typecast';
import { validPostOption } from 'src/lib/types/PostSortOption';
import type { PageLoad } from './$types';

export const load: PageLoad = async event => {
	event.depends('questions:get');
	const { session, supabaseClient } = await getSupabase(event);

	const { url } = event;
	const searchParams = url.searchParams;

	const topics = [];
	if (searchParams.has('topic')) {
		topics.push(searchParams.get('topic') as string);
	}

	const paramOrder = searchParams.get('order');
	const order = validPostOption(paramOrder) ? paramOrder : 'newest';

	const page = parseIntOrDefault(searchParams.get('page'), 1);

	return {
		questions: await getQuestions(supabaseClient, {
			limit: POST_PER_PAGE,
			page,
			order,
			topics,
			session
		})
	};
};

/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { invalid, redirect, type Actions } from '@sveltejs/kit';
import { redirectLogin } from 'src/lib/redirectLogin';
import { ErrorType, getUserFriendlyMessage } from 'src/lib/server/errorExtraction';
import slugify from 'src/lib/server/slugify';
import type { PostSubmitionError } from 'src/lib/types/PostSubmitionError';

export const actions: Actions = {
	async default(event) {
		const { session, supabaseClient } = await getSupabase(event);

		if (!session) {
			throw redirectLogin();
		}

		const formData = await event.request.formData();
		const title = formData.get('title')?.toString()?.trim();
		const content = formData.get('content')?.toString()?.trim();
		const contentText = formData.get('text-content')?.toString()?.trim();
		let topics: string[];
		try {
			topics = JSON.parse(formData.get('topics') as string);
		} catch (e) {
			return invalid(400, { message: 'invalid topics' });
		}

		const result: PostSubmitionError = {};

		if (!title) {
			result.titleEmpty = true;
		}

		if (!contentText || !content) {
			result.contentEmpty = true;
		}

		if (result.contentEmpty || result.titleEmpty) {
			return invalid(400, result);
		}

		const date = new Date().toISOString();
		let slug = slugify(title!);

		if (slug.length === 0) {
			slug = Date.now().toString();
		} else {
			const { error: countError, data: duplicatedTitleCount } = await supabaseClient
				.rpc('post_questions_count_duplicated_slug', {
					_author_id: session.user.id,
					_slug: slug
				})
				.single();

			if (countError || duplicatedTitleCount === null) {
				console.log(countError);
				result.serverError = true;
				result.userFriendlyMessage = getUserFriendlyMessage(ErrorType.ServerError);
				return invalid(500, result);
			}

			if (duplicatedTitleCount && duplicatedTitleCount > 0) {
				slug = `${slug}--${duplicatedTitleCount + 1}`;
			}
		}

		const { error: insertError } = await supabaseClient.from('post_questions').insert({
			date_created: date,
			slug,
			text_content: contentText,
			author_id: session.user.id,
			title,
			content,
			topics
		});

		if (insertError) {
			result.serverError = true;
			result.userFriendlyMessage = getUserFriendlyMessage(ErrorType.ServerError);
			return invalid(500, result);
		}

		const { error: getUsernameError, data: userProfile } = await supabaseClient
			.from('profiles')
			.select('username, name, quote')
			.match({ id: session.user.id })
			.single();

		if (getUsernameError || !userProfile) {
			result.serverError = true;
			result.userFriendlyMessage = getUserFriendlyMessage(ErrorType.ServerError);
			return invalid(500, result);
		}

		throw redirect(303, `/hoi-dap/${userProfile.username}/${slug}`);
	}
};

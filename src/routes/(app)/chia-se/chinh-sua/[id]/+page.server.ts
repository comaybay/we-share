import { invalid, redirect, type Actions } from '@sveltejs/kit';
import { MAX_NUMBER_OF_TOPICS } from 'src/lib/constants';
import { error400, error500 } from 'src/lib/errors';
import {
	MSG_API_ID_MISSING,
	MSG_API_INVALID_TOPIC,
	MSG_API_PERMISSION_DENIED,
	MSG_API_TOPICS_EXCEEDED,
	MSG_SERVER_ERROR,
	MSG_SERVER_ERROR_TRY_AGAIN
} from 'src/lib/messages';
import { removeNewlines } from 'src/lib/removeNewlines';
import slugify from 'src/lib/server/slugify';
import { validateCommonPostProps } from 'src/lib/server/validations';
import type { PostFormError } from 'src/lib/types/PostFormError';
import { useProtectedRoute } from 'src/lib/useProtectedRoute';

export const actions: Actions = {
	async default(event) {
		const { session, supabaseClient } = await useProtectedRoute(event);

		const formData = await event.request.formData();
		const title = formData.get('title')?.toString()?.trim() as string;
		const content = formData.get('content')?.toString()?.trim() as string;
		const textContent = formData.get('text-content')?.toString()?.trim() as string;
		const postId = formData.get('post-id')?.toString()?.trim() as string;

		let topics: string[];
		try {
			topics = JSON.parse(formData.get('topics') as string);

			if (topics.length > MAX_NUMBER_OF_TOPICS) {
				throw error400({
					message: MSG_API_TOPICS_EXCEEDED
				});
			}
		} catch (e) {
			throw error400({ message: MSG_API_INVALID_TOPIC });
		}

		if (!postId) {
			throw error400({ message: MSG_API_ID_MISSING });
		}

		const result: PostFormError = validateCommonPostProps({ content, textContent, title });

		if (result.contentEmpty || result.titleEmpty) {
			return invalid(400, result);
		}

		const { data, error } = await supabaseClient
			.from('post_sharings')
			.select('slug, author_id')
			.match({ id: postId });

		if (error) {
			throw error500({ message: MSG_SERVER_ERROR });
		}

		if (data.length === 0) {
			return invalid(400, { message: 'id not found' });
		}

		if (data[0].author_id !== session.user.id) {
			throw error500({ message: MSG_API_PERMISSION_DENIED });
		}

		const oldSlug = data[0].slug;
		let newSlug = slugify(title);

		if (newSlug.length === 0) {
			newSlug = Date.now().toString();
		} else if (oldSlug !== newSlug) {
			const { error: countError, data: duplicatedTitleCount } = await supabaseClient
				.rpc('post_sharings_count_duplicated_slug', {
					_author_id: session.user.id,
					_slug: newSlug
				})
				.single();

			if (countError) {
				result.serverError = true;
				result.userFriendlyMessage = MSG_SERVER_ERROR_TRY_AGAIN;
				return invalid(500, result);
			}

			if (duplicatedTitleCount > 0) {
				newSlug = `${newSlug}--${duplicatedTitleCount + 1}`;
			}
		}

		const { error: insertError } = await supabaseClient
			.from('post_sharings')
			.update({
				slug: newSlug,
				text_content: removeNewlines(textContent),
				date_last_updated: new Date().toISOString(),
				title,
				content,
				topics
			})
			.match({ id: postId });

		if (insertError) {
			result.serverError = true;
			result.userFriendlyMessage = MSG_SERVER_ERROR_TRY_AGAIN;
			return invalid(500, result);
		}

		const { error: getUsernameError, data: userProfile } = await supabaseClient
			.from('profiles')
			.select('username')
			.match({ id: session.user.id })
			.single();

		if (getUsernameError || !userProfile) {
			result.serverError = true;
			result.userFriendlyMessage = MSG_SERVER_ERROR_TRY_AGAIN;
			return invalid(500, result);
		}

		throw redirect(303, `/chia-se/${userProfile.username}/${newSlug}`);
	}
};

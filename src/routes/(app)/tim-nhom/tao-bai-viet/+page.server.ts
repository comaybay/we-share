import { invalid, redirect, type Actions } from '@sveltejs/kit';
import { MAX_NUMBER_OF_TOPICS } from 'src/lib/constants';
import { ErrorType, getUserFriendlyMessage } from 'src/lib/server/errorExtraction';
import slugify from 'src/lib/server/slugify';
import type { PostSubmitionError } from 'src/lib/types/PostSubmitionError';
import { useProtectedRoute } from 'src/lib/useProtectedRoute';

export const actions: Actions = {
	async default(event) {
		const { session, supabaseClient } = await useProtectedRoute(event);

		const formData = await event.request.formData();
		const title = formData.get('title')?.toString()?.trim() as string;
		const content = formData.get('content')?.toString()?.trim() as string;
		const contentText = formData.get('text-content')?.toString()?.trim() as string;
		const courseCode = formData.get('course-code')?.toString()?.trim() as string;
		let neededSkills: string[];
		try {
			neededSkills = JSON.parse(formData.get('needed-skills') as string);

			if (neededSkills.length > MAX_NUMBER_OF_TOPICS) {
				return invalid(400, {
					message: `number of skills must not be larger than ${MAX_NUMBER_OF_TOPICS}`
				});
			}
		} catch (e) {
			return invalid(400, { message: 'invalid skills' });
		}

		const result: FindTeamPostSubmitionError = {};

		if (!title) {
			result.titleEmpty = true;
		}

		if (!courseCode) {
			result.courseCodeEmpty = true;
		}

		if (!contentText || !content) {
			result.contentEmpty = true;
		}

		if (result.contentEmpty || result.titleEmpty) {
			return invalid(400, result);
		}

		const date = new Date().toISOString();
		let slug = slugify(title);

		if (slug.length === 0) {
			slug = Date.now().toString();
		} else {
			const { error: countError, data: duplicatedTitleCount } = await supabaseClient
				.rpc('post_teams_count_duplicated_slug', {
					_author_id: session.user.id,
					_slug: slug
				})
				.single();

			if (countError || duplicatedTitleCount === null) {
				result.serverError = true;
				result.userFriendlyMessage = getUserFriendlyMessage(ErrorType.ServerError);
				return invalid(500, result);
			}

			if (duplicatedTitleCount && duplicatedTitleCount > 0) {
				slug = `${slug}--${duplicatedTitleCount + 1}`;
			}
		}

		const { error: insertError } = await supabaseClient.from('post_teams').insert({
			date_created: date,
			slug,
			text_content: contentText,
			author_id: session.user.id,
			title,
			content,
			needed_skills: neededSkills,
			course_code: courseCode
		});

		if (insertError) {
			result.serverError = true;
			result.userFriendlyMessage = getUserFriendlyMessage(ErrorType.ServerError);
			return invalid(500, result);
		}

		const { error: getUsernameError, data: userProfile } = await supabaseClient
			.from('profiles')
			.select('username')
			.match({ id: session.user.id })
			.single();

		if (getUsernameError || !userProfile) {
			result.serverError = true;
			result.userFriendlyMessage = getUserFriendlyMessage(ErrorType.ServerError);
			return invalid(500, result);
		}

		throw redirect(303, `/tim-nhom/${userProfile.username}/${slug}`);
	}
};

type FindTeamPostSubmitionError = PostSubmitionError & {
	courseCodeEmpty?: boolean;
};

import { invalid, redirect, type Actions } from '@sveltejs/kit';
import { MAX_NUMBER_OF_TOPICS } from 'src/lib/constants';
import { ErrorType, getUserFriendlyMessage } from 'src/lib/server/errorExtraction';
import slugify from 'src/lib/server/slugify';
import { validateCommonPostProps } from 'src/lib/server/validations';
import type { FindTeamPostFormError } from 'src/lib/types/FindTeamPostFormError';
import { useProtectedRoute } from 'src/lib/useProtectedRoute';

export const actions: Actions = {
	async default(event) {
		const { session, supabaseClient } = await useProtectedRoute(event);

		const formData = await event.request.formData();
		const title = formData.get('title')?.toString()?.trim() as string;
		const content = formData.get('content')?.toString()?.trim() as string;
		const textContent = formData.get('text-content')?.toString()?.trim() as string;
		const courseCode = formData.get('course-code')?.toString()?.trim() as string;
		const teamSize = parseInt(formData.get('team-size')?.toString()?.trim() as string);

		if (isNaN(teamSize)) {
			return invalid(400, { message: 'invalid team size' });
		}

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

		const result: FindTeamPostFormError = validateCommonPostProps({ content, textContent, title });

		if (!courseCode) {
			result.courseCodeEmpty = true;
		}

		if (result.contentEmpty || result.titleEmpty || result.courseCodeEmpty) {
			return invalid(400, result);
		}

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

		const { error: insertError, data: postData } = await supabaseClient
			.from('post_teams')
			.insert({
				slug,
				text_content: textContent,
				author_id: session.user.id,
				title,
				content,
				needed_skills: neededSkills,
				course_code: courseCode,
				team_size: teamSize
			})
			.select()
			.single();

		if (insertError) {
			result.serverError = true;
			result.userFriendlyMessage = getUserFriendlyMessage(ErrorType.ServerError);
			return invalid(500, result);
		}

		await supabaseClient.from('post_team_members').insert({
			member_id: session.user.id,
			post_team_id: postData.id
		});

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

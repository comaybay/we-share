import { invalid, redirect, type Actions } from '@sveltejs/kit';
import { MAX_NUMBER_OF_TOPICS } from 'src/lib/constants';
import { error500 } from 'src/lib/errors';
import {
	MSG_API_PERMISSION_DENIED,
	MSG_SERVER_ERROR,
	MSG_SERVER_ERROR_TRY_AGAIN
} from 'src/lib/messages';
import { removeNewlines } from 'src/lib/removeNewlines';
import slugify from 'src/lib/server/slugify';
import { validateCommonPostProps } from 'src/lib/server/validations';
import type { FindTeamPostFormError } from 'src/lib/types/FindTeamPostFormError';
import type { ForeignTableCount } from 'src/lib/types/supabase/ForeignTableCount';
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
		const postId = formData.get('post-id')?.toString()?.trim() as string;

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

		const result: EditFindTeamPostFormError = validateCommonPostProps({
			content,
			textContent,
			title
		});

		if (!courseCode) {
			result.courseCodeEmpty = true;
		}

		if (result.contentEmpty || result.titleEmpty || result.courseCodeEmpty) {
			return invalid(400, result);
		}

		const { data, error } = await supabaseClient
			.from('post_teams')
			.select('slug, author_id, member_count:profiles!post_team_members(count)')
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

		if ((data[0].member_count as ForeignTableCount)[0].count > teamSize) {
			result.teamSizeSmallerThanMemberCount = true;
			return invalid(400, result);
		}

		const oldSlug = data[0].slug;
		let newSlug = slugify(title);

		if (newSlug.length === 0) {
			newSlug = Date.now().toString();
		} else if (oldSlug !== newSlug) {
			const { error: countError, data: duplicatedTitleCount } = await supabaseClient
				.rpc('post_teams_count_duplicated_slug', {
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
			.from('post_teams')
			.update({
				slug: newSlug,
				text_content: removeNewlines(textContent),
				date_last_updated: new Date().toISOString(),
				needed_skills: neededSkills,
				course_code: courseCode,
				team_size: teamSize,
				title,
				content
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

		throw redirect(303, `/tim-nhom/${userProfile.username}/${newSlug}`);
	}
};

type EditFindTeamPostFormError = FindTeamPostFormError & {
	teamSizeSmallerThanMemberCount?: true;
};

/* eslint-disable @typescript-eslint/no-non-null-assertion */
import redirectHome from '$lib/server/redirectHome';
import { validEmail, validPassword, validUsername } from '$lib/server/validations';
import { saveSession } from '$lib/supabase-auth/server';
import { convertToUserFriendlyMessage } from '$lib/supabase/convertToUserFriendlyMessage';
import { supabaseClient } from '$lib/supabase/supabaseClient';
import { invalid, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	if (locals.user) {
		throw redirectHome();
	}
};

export const actions: Actions = {
	async default({ request, cookies }) {
		const formData = await request.formData();

		const username = (formData.get('username') as string).trim();
		const password = (formData.get('password') as string).trim();
		const email = (formData.get('email') as string).trim();
		const profilename = (formData.get('profilename') as string).trim();
		const quote = (formData.get('quote') as string).trim();

		const result: SignInError = {};

		//common mistakes
		if (!username) {
			result.usernameMissing = true;
		} else if (!validUsername(username)) {
			result.usernameInvalid = true;
		}

		if (!password) {
			result.passwordMissing = true;
		} else if (!validPassword(password)) {
			result.passwordInvalid = true;
		}

		if (!email) {
			result.emailMissing = true;
		} else if (!validEmail(email)) {
			result.emailInvalid = true;
		}

		if (
			result.emailMissing ||
			result.passwordMissing ||
			result.usernameMissing ||
			result.usernameInvalid ||
			result.emailInvalid
		) {
			return invalid(400, result);
		}

		//validations that require database access
		const { error: errorGetSameName, count: sameUsernameCount } = await supabaseClient
			.from('profiles')
			.select('username', { count: 'exact', head: true })
			.match({ username });

		if (errorGetSameName) {
			result.userFriendlyMessage = convertToUserFriendlyMessage({ status: 500, message: '' });
			return invalid(500, result);
		}

		if (sameUsernameCount! > 0) {
			result.userNameAlreadyExists = true;
			return invalid(400, result);
		}

		const { user, error, session } = await supabaseClient.auth.signUp({ email, password });
		if (error) {
			console.log(error);
			result.userFriendlyMessage = convertToUserFriendlyMessage(error);

			if (error?.status === 400) {
				result.invalidCredentials = true;
				return invalid(400, result);
			}

			result.serverError = true;
			return invalid(500, result);
		}

		await supabaseClient
			.from('profiles')
			.update({
				username,
				name: profilename.length > 0 ? profilename : username,
				quote: quote.length > 0 ? quote : null
			})
			.match({ id: user!.id });

		saveSession(cookies, session!);

		throw redirect(303, '/');
	}
};

export type SignInError = {
	emailMissing?: true;
	emailInvalid?: true;
	usernameMissing?: true;
	passwordMissing?: true;
	invalidCredentials?: true;
	serverError?: true;
	userNameAlreadyExists?: true;
	usernameInvalid?: true;
	passwordInvalid?: true;

	// only exists when there's a specific server side error
	userFriendlyMessage?: string;
};

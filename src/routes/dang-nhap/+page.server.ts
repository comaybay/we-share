/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { saveSession } from '$lib/supabase-auth/server';
import { supabaseClient } from '$lib/supabase/supabaseClient';
import { invalid } from '@sveltejs/kit';
import { ErrorType, extractError, getUserFriendlyMessage } from 'src/lib/server/errorExtraction';
import redirectHome from 'src/lib/server/redirectHome';
import { validEmail, validPassword, validUsername } from 'src/lib/server/validations';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	if (locals.user) {
		throw redirectHome();
	}
};

export const actions: Actions = {
	async default({ request, cookies }) {
		const formData = await request.formData();

		const usernameOrEmail = (formData.get('username-or-email') as string).trim();
		const password = (formData.get('password') as string).trim();

		const signInError: SignInError = {};

		let isEmail = false;

		if (!usernameOrEmail) {
			signInError.usernameOrEmailMissing = true;
		} else if (!validUsername(usernameOrEmail) && !validEmail(usernameOrEmail)) {
			signInError.usernameOrEmailInvalid = true;
		} else {
			isEmail = !validUsername(usernameOrEmail);
		}

		if (!password) {
			signInError.passwordMissing = true;
		} else if (!validPassword(password)) {
			signInError.passwordInvalid = true;
		}

		if (
			signInError.usernameOrEmailMissing ||
			signInError.usernameOrEmailInvalid ||
			signInError.passwordMissing ||
			signInError.passwordInvalid
		) {
			return invalid(400, signInError);
		}

		let email = '';
		if (isEmail) {
			email = usernameOrEmail;
		} else {
			const username = usernameOrEmail;
			const result = await getEmailFromUsernanme(username);

			if (result.error) {
				signInError.userFriendlyMessage = getUserFriendlyMessage(ErrorType.ServerError);
				return invalid(500, signInError);
			}

			if (result.email) {
				email = result.email;
			} else {
				signInError.usernameNotExist = true;
				return invalid(500, signInError);
			}
		}

		const {
			error,
			data: { session }
		} = await supabaseClient.auth.signInWithPassword({ email, password });

		if (error) {
			const { errorType, userFriendlyMessage } = extractError(error);
			signInError.userFriendlyMessage = userFriendlyMessage;

			if (errorType === ErrorType.InValidLoginCredentials) {
				signInError.invalidCredentials = true;
				return invalid(400, signInError);
			}

			signInError.serverError = true;
			return invalid(500, signInError);
		}

		saveSession(cookies, session!);

		throw redirectHome();
	}
};

async function getEmailFromUsernanme(username: string) {
	const { data, error } = await supabaseClient
		.from('profiles')
		.select('username, email')
		.match({ username });

	const email = data && data?.length > 0 ? (data[0].email as string) : null;
	return { email, error };
}

export type SignInError = {
	usernameOrEmailMissing?: true;
	usernameOrEmailInvalid?: true;
	passwordMissing?: true;
	passwordInvalid?: true;
	usernameNotExist?: true;
	loginFailed?: true;
	invalidCredentials?: true;
	serverError?: true;

	// only exists when there's a specific server side error
	userFriendlyMessage?: string;
};

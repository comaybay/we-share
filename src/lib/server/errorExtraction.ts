import {
	AuthApiError,
	AuthInvalidCredentialsError,
	AuthRetryableFetchError
} from '@supabase/supabase-js';
import { MSG_SERVER_ERROR_TRY_AGAIN } from '../messages';

export function getUserFriendlyMessage(errorType: ErrorType) {
	return (errorPatterns.find(ep => errorType === ep.errorType) ?? serverErrorPattern)
		.userFriendlyMessage;
}

/**
 * extract information from error, if couldn't extract error, default to server error information
 */
export function extractError(error: Error) {
	const { errorType, userFriendlyMessage } =
		errorPatterns.find(ep => {
			if (error instanceof ep.errorClass) {
				return ep.errorMessage ? error.message === ep.errorMessage : true;
			}
			return false;
		}) ?? serverErrorPattern;

	return { errorType, userFriendlyMessage };
}

export enum ErrorType {
	ServerError,
	InValidLoginCredentials,
	UserAlreadyRegistered
}

const serverErrorPattern: ErrorPattern = {
	errorType: ErrorType.ServerError,
	errorClass: AuthRetryableFetchError,
	errorMessage: null,
	userFriendlyMessage: MSG_SERVER_ERROR_TRY_AGAIN
};

const errorPatterns: Array<ErrorPattern> = [
	serverErrorPattern,
	{
		errorType: ErrorType.InValidLoginCredentials,
		errorClass: AuthInvalidCredentialsError,
		errorMessage: null,
		userFriendlyMessage: 'Tên tài khoản hoặc mật khẩu không chính xác'
	},
	{
		errorType: ErrorType.UserAlreadyRegistered,
		errorClass: AuthApiError,
		errorMessage: 'User already registered',
		userFriendlyMessage: 'Email này đã được sử dụng bởi một tài khoản khác'
	}
];

interface ErrorPattern {
	errorType: ErrorType;
	errorClass: ErrorClass;
	errorMessage: string | null;
	userFriendlyMessage: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ErrorClass = new (...args: any[]) => Error;

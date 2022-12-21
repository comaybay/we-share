import type { PostFormError } from './PostFormError';

export type FindTeamPostFormError = PostFormError & {
	courseCodeEmpty?: boolean;
};

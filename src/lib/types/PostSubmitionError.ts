export type PostSubmitionError = {
	titleEmpty?: true;
	contentEmpty?: true;
	serverError?: true;
	userFriendlyMessage?: string;
};

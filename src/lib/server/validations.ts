export const validUsername = (username: string) => /^[a-zA-Z0-9_]{4,15}$/.test(username);

export const validPassword = (password: string) => /^[a-zA-Z0-9_]{6,50}$/.test(password);

export const validEmail = (email: string) => /(?=^.{5,254}$)^\S+@\S+\.\S+$/.test(email);

export function validateCommonPostProps({ content, textContent, title }: PostProps) {
	const result: ValidationResult = {};

	if (!title) {
		result.titleEmpty = true;
	}

	if (!textContent || !content) {
		result.contentEmpty = true;
	}

	return result;
}

interface ValidationResult {
	titleEmpty?: true;
	contentEmpty?: true;
}

interface PostProps {
	title?: string;
	content?: string;
	textContent?: string;
}

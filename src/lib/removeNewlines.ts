export function removeNewlines(text: string) {
	return text.replace(/\r?\n|\r/g, '');
}

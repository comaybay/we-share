export function isString(input: unknown): input is string {
	return typeof input === 'string';
}

export function isNumber(input: unknown): input is number {
	return typeof input === 'number';
}

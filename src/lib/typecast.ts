import { isNumber, isString } from './typecheck';

export function parseIntOrDefault(input: unknown, defaultVal: number) {
	if (isNumber(input)) {
		return Math.trunc(input);
	}

	if (isString(input)) {
		const num = parseInt(input);
		return isNaN(num) ? defaultVal : num;
	}

	return defaultVal;
}

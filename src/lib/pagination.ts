/**
 *
 * @param page page is 1-indexed
 */
export function getPaginationRange(page: number, limit: number) {
	return { from: limit * (page - 1), to: limit * page - 1 };
}

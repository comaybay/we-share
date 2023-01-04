export type PostSortOption = 'newest' | 'top';

export function validPostOption(o: unknown): o is PostSortOption {
	return o === 'newest' || o === 'top';
}

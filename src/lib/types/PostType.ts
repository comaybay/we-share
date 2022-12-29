export type PostType = 'question' | 'sharing' | 'team';

export function validPostType(postType: unknown): postType is PostType {
	return postType === 'question' || postType === 'sharing' || postType === 'team';
}

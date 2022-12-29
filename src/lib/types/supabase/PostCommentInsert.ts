import { isNumber, isString } from '../../typecheck';
export interface PostCommentInsert {
	content: string;
	textContent: string;
	authorId: string;
	postId: number;
	parentCommentId: number | null;
	topLevelCommentId: number | null;
}

export function validPostCommentInsert(
	input: Partial<PostCommentInsert>
): input is PostCommentInsert {
	const { content, textContent, authorId, parentCommentId, postId, topLevelCommentId } = input;
	return (
		isString(content) &&
		isString(textContent) &&
		isString(authorId) &&
		(parentCommentId === null || isNumber(parentCommentId)) &&
		(topLevelCommentId === null || isNumber(topLevelCommentId)) &&
		isNumber(postId)
	);
}

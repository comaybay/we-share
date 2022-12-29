import type { PostComment } from './PostComment';

export interface PostTopLevelComment
	extends Omit<PostComment, 'parentCommentId' | 'topLevelCommentId' | 'parentCommentAuthor'> {
	replyCount: number;
}

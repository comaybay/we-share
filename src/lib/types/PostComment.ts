import type { PostCommentInsert } from './supabase/PostCommentInsert';

export interface PostComment
	extends Omit<PostCommentInsert, 'authorId' | 'textContent' | 'postId'> {
	id: number;
	postId: number;
	author: {
		id: string;
		username: string;
	};
	dateCreated: Date;
	dateLastUpdated: Date | null;
	starCount: number | null;
	starred: boolean | null;
	parentCommentAuthor: {
		id: string;
		username: string;
	} | null;
}

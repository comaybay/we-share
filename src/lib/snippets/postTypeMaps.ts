export const postStarsTableByPostType = {
	question: 'post_question_stars',
	sharing: 'post_sharing_stars',
	team: 'post_team_stars'
} as const;

export const postCommentsTableByPostType = {
	question: 'post_question_comments',
	sharing: 'post_sharing_comments',
	team: 'post_team_comments'
} as const;

export const postCommentStarsTableByPostType = {
	question: 'post_question_comment_stars',
	sharing: 'post_sharing_comment_stars',
	team: 'post_team_comment_stars'
} as const;

export const postCommentsAuthorFKByPostType = {
	question: 'post_question_comments_author_id_fkey',
	sharing: 'post_sharing_comments_author_id_fkey',
	team: 'post_team_comments_author_id_fkey'
} as const;

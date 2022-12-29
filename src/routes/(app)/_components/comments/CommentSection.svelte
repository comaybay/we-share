<script lang="ts">
	import { POST_COMMENT_MAX_LENGTH } from 'src/lib/constants';
	import { supabaseClient } from 'src/lib/db';
	import { commentEditorConfig } from 'src/lib/editors/commentEditorConfig';
	import { MSG_SERVER_ERROR_TRY_AGAIN } from 'src/lib/messages';
	import { insertTopLevelComment } from 'src/lib/snippets/insertTopLevelComment';
	import type { PostTopLevelComment } from 'src/lib/types/PostTopLevelComment';
	import type { PostType } from 'src/lib/types/PostType';
	import type { PostCommentInsert } from 'src/lib/types/supabase/PostCommentInsert';
	import SortNewestButton from 'src/routes/(app)/_components/posts/SortNewestButton.svelte';
	import SortTopButton from 'src/routes/(app)/_components/posts/SortTopButton.svelte';
	import AuthorizeView from 'src/routes/(app)/_components/views/AuthorizeView.svelte';
	import ErrorText from '../ErrorText.svelte';
	import CommentForm from './CommentForm.svelte';
	import TopLevelComment from './TopLevelComment.svelte';

	/** commentCount includes replies to comments*/
	export let postType: Exclude<PostType, 'question'>;
	export let commentCount: number;
	export let comments: PostTopLevelComment[];
	export let postId: number;
	export let serverError = false;

	let submittedComments: PostTopLevelComment[] = [];

	async function onSubmitComment(e: CustomEvent<PostCommentInsert>) {
		serverError = false;
		const { model, error } = await insertTopLevelComment(postType, e.detail, supabaseClient);

		if (error) {
			serverError = true;
			return;
		}

		submittedComments = [model, ...submittedComments];
	}
</script>

<div>
	<div class="relative flex items-center mb-3">
		<slot name="starbutton" />
		<span class="mx-2 text-lg">{commentCount} bình luận</span>
		<SortNewestButton />
		<SortTopButton />
	</div>
	<AuthorizeView>
		<CommentForm
			{postId}
			editorConfig={commentEditorConfig}
			contentLimit={POST_COMMENT_MAX_LENGTH}
			parentCommentId={null}
			topLevelCommentId={null}
			on:submit={onSubmitComment}
		/>
		{#if serverError}
			<ErrorText>{MSG_SERVER_ERROR_TRY_AGAIN}</ErrorText>
		{/if}
	</AuthorizeView>

	{#each submittedComments as comment}
		<TopLevelComment {comment} {postType} />
	{/each}
	{#each comments as comment}
		<TopLevelComment {comment} {postType} />
	{/each}
</div>

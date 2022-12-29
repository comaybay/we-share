<script lang="ts">
	import { POST_QUESTION_COMMENT_MAX_LENGTH } from 'src/lib/constants';
	import { supabaseClient } from 'src/lib/db';
	import { answerEditorConfig } from 'src/lib/editors/answerEditorConfig';
	import { MSG_SERVER_ERROR_TRY_AGAIN } from 'src/lib/messages';
	import { insertTopLevelComment } from 'src/lib/snippets/insertTopLevelComment';
	import type { PostTopLevelComment } from 'src/lib/types/PostTopLevelComment';
	import type { PostCommentInsert } from 'src/lib/types/supabase/PostCommentInsert';
	import CommentForm from 'src/routes/(app)/_components/comments/CommentForm.svelte';
	import ErrorText from 'src/routes/(app)/_components/ErrorText.svelte';
	import SortNewestButton from 'src/routes/(app)/_components/posts/SortNewestButton.svelte';
	import SortTopButton from 'src/routes/(app)/_components/posts/SortTopButton.svelte';
	import AuthorizeView from 'src/routes/(app)/_components/views/AuthorizeView.svelte';
	import TopLevelComment from './QuestionTopLevelComment.svelte';

	export let comments: PostTopLevelComment[];
	export let postId: number;
	export let serverError = false;

	let submittedComments: PostTopLevelComment[] = [];

	async function onSubmitComment(e: CustomEvent<PostCommentInsert>) {
		serverError = false;
		const { model, error } = await insertTopLevelComment('question', e.detail, supabaseClient);

		if (error) {
			serverError = true;
			return;
		}

		submittedComments = [model, ...submittedComments];
	}
</script>

<div>
	<div class="flex items-center mb-3">
		<slot name="starbutton" />
		<span class="mx-2 text-lg">{comments.length + submittedComments.length} câu trả lời</span>
		<SortNewestButton />
		<SortTopButton />
	</div>
	<AuthorizeView>
		<CommentForm
			{postId}
			editorConfig={answerEditorConfig}
			contentLimit={POST_QUESTION_COMMENT_MAX_LENGTH}
			parentCommentId={null}
			topLevelCommentId={null}
			on:submit={onSubmitComment}
		/>
		{#if serverError}
			<ErrorText>{MSG_SERVER_ERROR_TRY_AGAIN}</ErrorText>
		{/if}
	</AuthorizeView>

	{#each submittedComments as comment}
		<TopLevelComment {comment} />
	{/each}
	{#each comments as comment}
		<TopLevelComment {comment} />
	{/each}
</div>

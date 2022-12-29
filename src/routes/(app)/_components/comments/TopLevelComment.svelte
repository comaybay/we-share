<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { POST_REPLY_MAX_LENGTH } from 'src/lib/constants';
	import { supabaseClient } from 'src/lib/db';
	import { toRelativeTime } from 'src/lib/i18n/toRelativeTime';
	import generateLoginPath from 'src/lib/login/generateLoginPath';
	import { MSG_SERVER_ERROR_TRY_AGAIN } from 'src/lib/messages';
	import { getTopLevelCommentReplies } from 'src/lib/snippets/getTopLevelCommentReplies';
	import { insertComment } from 'src/lib/snippets/insertComment';
	import type { PostComment } from 'src/lib/types/PostComment';
	import type { PostTopLevelComment } from 'src/lib/types/PostTopLevelComment';
	import type { PostType } from 'src/lib/types/PostType';
	import type { PostCommentInsert } from 'src/lib/types/supabase/PostCommentInsert';
	import CommentForm from 'src/routes/(app)/_components/comments/CommentForm.svelte';
	import AuthorNavLink from 'src/routes/(app)/_components/posts/AuthorNavLink.svelte';
	import RenderContent from 'src/routes/(app)/_components/posts/detail/RenderContent.svelte';
	import ButtonLink from 'src/routes/_components/buttons/ButtonLink.svelte';
	import UserProfilePicture from 'src/routes/_components/UserProfilePicture.svelte';
	import StarIcon from '../icons/StarIcon.svelte';
	import Reply from './Reply.svelte';

	export let comment: PostTopLevelComment;
	export let postType: Exclude<PostType, 'question'>;

	let replies: PostComment[] = [];
	let submittedReplies: PostComment[] = [];

	let loading = false;
	let serverError = false;
	let showEditor = false;
	let showReply = false;

	$: user = $page.data.session?.user;

	async function onClickStar() {
		if (comment.starCount === null) {
			return;
		}

		loading = true;

		if (!user) {
			await goto(generateLoginPath($page.url.pathname));
			return;
		}

		let success = false;
		if (comment.starred) {
			const { error } = await supabaseClient.from('post_sharing_comment_stars').delete().match({
				comment_id: comment.id,
				user_id: user.id
			});
			success = error === null;
		} else {
			const { error } = await supabaseClient
				.from('post_sharing_comment_stars')
				.insert([{ comment_id: comment.id, user_id: user.id }]);
			success = error === null;
		}

		if (success) {
			comment.starred = !comment.starred;
			comment.starCount += comment.starred ? 1 : -1;
		}
		loading = false;
	}

	async function onClickReplies() {
		submittedReplies = [];
		showReply = !showReply;

		if (!showReply) {
			replies = [];
			return;
		}

		serverError = false;

		const userId = user?.id ?? null;
		const result = await getTopLevelCommentReplies(postType, comment.id, userId, supabaseClient);

		if (result.error) {
			serverError = true;
			return;
		}

		replies = result.replies;
	}

	async function onClickReply() {
		if (user) {
			showEditor = !showEditor;
		} else {
			await goto(generateLoginPath($page.url.pathname));
		}
	}

	async function onSubmitReply(e: CustomEvent<PostCommentInsert>) {
		serverError = false;
		const { model, error } = await insertComment(postType, e.detail, supabaseClient);

		if (error) {
			serverError = true;
			return;
		}

		replies = [...replies, model];
		submittedReplies = [...submittedReplies, model];
		showEditor = false;
	}
</script>

<div class="pt-4 pb-1 px-2 border-b border-pri-light">
	<div class="flex items-start gap-1">
		<div class="h-12 w-12">
			<UserProfilePicture />
		</div>
		<div class="grow">
			<AuthorNavLink authorUsername={comment.author.username} />
			<span class="text-sm text-pri-light">{toRelativeTime(comment.dateCreated)}</span>
			<div class="flex gap-2 items-start -mt-4 -mb-3">
				<RenderContent content={comment.content} />
			</div>
			<div class="flex gap-2">
				{#if comment.starred !== null}
					<div class="text-sec-base flex items-center gap-0.5">
						<button on:click={onClickStar}>
							<StarIcon
								solid={comment.starred}
								classname="-mt-0.5 w-6 h-6 {loading
									? 'text-sec-loading scale-90'
									: 'hover:text-sec-hover'} transition-all duration-25"
							/>
						</button>
						<span>{comment.starCount}</span>
					</div>
				{/if}
				<ButtonLink on:click={onClickReply}><div class="py-1">Trả lời</div></ButtonLink>
			</div>
			{#if showEditor}
				<CommentForm
					editorPlaceholder="Bình luận..."
					contentLimit={POST_REPLY_MAX_LENGTH}
					postId={comment.postId}
					parentCommentId={comment.id}
					topLevelCommentId={comment.id}
					on:submit={onSubmitReply}
				/>
			{/if}
			{#if serverError}
				<p class="text-sec-base">{MSG_SERVER_ERROR_TRY_AGAIN}</p>
			{/if}
			<div class="ml-2">
				{#if comment.replyCount > 0}
					<ButtonLink on:click={onClickReplies}>
						<div class="flex items-center gap-2 py-1">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="w-6 h-6 {replies.length
									? '-rotate-180'
									: ''} duration-150 transition-transform"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M19.5 8.25l-7.5 7.5-7.5-7.5"
								/>
							</svg>
							<span>{comment.replyCount} bình luận con</span>
						</div>
					</ButtonLink>
				{/if}
				{#if showReply}
					{#each replies as reply}
						<Reply comment={reply} on:submitreply={onSubmitReply} />
					{/each}
				{/if}
				{#if !showReply && submittedReplies}
					{#each submittedReplies as reply}
						<Reply comment={reply} on:submitreply={onSubmitReply} />
					{/each}
				{/if}
			</div>
		</div>
	</div>
</div>

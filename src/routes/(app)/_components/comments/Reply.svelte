<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { POST_REPLY_MAX_LENGTH } from 'src/lib/constants';
	import { supabaseClient } from 'src/lib/db';
	import { toRelativeTime } from 'src/lib/i18n/toRelativeTime';
	import generateLoginPath from 'src/lib/login/generateLoginPath';
	import type { PostComment } from 'src/lib/types/PostComment';
	import type { PostCommentInsert } from 'src/lib/types/supabase/PostCommentInsert';
	import AuthorNavLink from 'src/routes/(app)/_components/posts/AuthorNavLink.svelte';
	import RenderContent from 'src/routes/(app)/_components/posts/detail/RenderContent.svelte';
	import ButtonLink from 'src/routes/_components/buttons/ButtonLink.svelte';
	import UserProfilePicture from 'src/routes/_components/UserProfilePicture.svelte';
	import { createEventDispatcher } from 'svelte';
	import StarIcon from '../icons/StarIcon.svelte';
	import CommentForm from './CommentForm.svelte';

	export let comment: PostComment;

	let loading = false;
	let showEditor = false;
	$: user = $page.data.session?.user;

	async function onClickStar() {
		loading = true;

		if (!user) {
			await goto(generateLoginPath($page.url.pathname));
			return;
		}

		let success = false;
		if (comment.starred) {
			const { error } = await supabaseClient.from('post_question_comment_stars').delete().match({
				comment_id: comment.id,
				user_id: user.id
			});
			success = error === null;
		} else {
			const { error } = await supabaseClient
				.from('post_question_comment_stars')
				.insert([{ comment_id: comment.id, user_id: user.id }]);
			success = error === null;
		}

		if (success) {
			comment.starred = !comment.starred;
			comment.starCount += comment.starred ? 1 : -1;
		}
		loading = false;
	}

	async function onClickReply() {
		if (user) {
			showEditor = !showEditor;
		} else {
			await goto(generateLoginPath($page.url.pathname));
		}
	}

	const dispatch = createEventDispatcher<{ submitreply: PostCommentInsert }>();
	function onSubmitReply(e: CustomEvent<PostCommentInsert>) {
		dispatch('submitreply', e.detail);
		showEditor = false;
	}
</script>

<div class="pt-4 px-2 w-full">
	<div class="flex items-start gap-1">
		<div class="h-12 w-12">
			<UserProfilePicture />
		</div>
		<div class="grow">
			<AuthorNavLink authorUsername={comment.author.username} />
			{#if comment.parentCommentAuthor && comment.parentCommentId !== comment.topLevelCommentId}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-5 h-5 inline-block"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
					/>
				</svg>

				<a
					href="/nguoi-dung/{comment.parentCommentAuthor.username}"
					class="font-semibold text-qua-base hover:text-qua-hover"
				>
					{comment.parentCommentAuthor.username}
				</a>
			{/if}
			<span class="text-sm text-pri-light">{toRelativeTime(comment.dateCreated)}</span>
			<div class="-mt-4 -mb-3">
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
					topLevelCommentId={comment.topLevelCommentId}
					on:submit={onSubmitReply}
				/>
			{/if}
		</div>
	</div>
</div>

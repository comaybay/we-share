<script lang="ts">
	import { page } from '$app/stores';
	import { commentEditorConfig } from 'src/lib/editors/commentEditorConfig';
	import type { PostCommentInsert } from 'src/lib/types/supabase/PostCommentInsert';
	import Button from 'src/routes/_components/buttons/Button.svelte';
	import { createEventDispatcher } from 'svelte';
	import CommentEditor from './CommentEditor.svelte';

	export let postId: number;
	export let parentCommentId: number | null;
	export let topLevelCommentId: number | null;
	export let contentLimit: number;
	export let editorPlaceholder: string | undefined = undefined;
	export let editorConfig = commentEditorConfig;

	let content = '';
	let textContent = '';
	let submitting = false;

	$: textLimitReached = textContent.length > contentLimit;
	$: textEmpty = textContent.length === 0;

	const dispatch = createEventDispatcher<{ submit: PostCommentInsert }>();

	async function onSubmit() {
		if (!$page.data.session) {
			console.error('cannot post comment if not authenticated');
			return;
		}

		const comment = {
			authorId: $page.data.session.user.id,
			content,
			textContent,
			parentCommentId,
			topLevelCommentId,
			postId
		};

		dispatch('submit', comment);
		content = '';
	}
</script>

<CommentEditor
	config={editorConfig}
	placeholder={editorPlaceholder}
	bind:value={content}
	bind:text={textContent}
/>

<div class="mt-2 flex gap-2 justify-between">
	<div>
		<span class:text-sec-base={textLimitReached}>
			{textContent.length} / {contentLimit}
		</span>
		{#if textLimitReached}
			<span class="ml-2 text-sec-base font-bold">
				Số lượng ký tự đã vượt quá giới hạn cho phép
			</span>
		{/if}
	</div>

	<Button on:click={onSubmit} loading={submitting} disabled={textEmpty || textLimitReached}>
		<span class="px-12">Đăng</span>
	</Button>
</div>

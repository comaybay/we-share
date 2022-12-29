<script lang="ts">
	import CommentIcon from 'src/routes/(app)/_components/icons/CommentIcon.svelte';
	import ViewIcon from 'src/routes/(app)/_components/icons/ViewIcon.svelte';
	import type { PageData } from '../$types';
	import QuestionStarButton from '../../../_components/QuestionStarButton.svelte';

	export let post: PageData['post'];
</script>

<div class="bg-paper rounded-full p-4">
	<div class="flex text-sec-base justify-center items-center">
		<QuestionStarButton
			postId={post.id}
			bind:starCount={post.starCount}
			bind:starred={post.starred}
		/>
	</div>
	<div class="flex gap-x-2 border-t mt-0.5 pt-0.5 border-pri-base px-2">
		<div class="flex items-center gap-x-0.5">
			<span>{post.commentCount}</span><CommentIcon />
		</div>
		<div class="flex items-center gap-x-0.5">
			<span>{post.viewCount}</span><ViewIcon />
		</div>
	</div>
</div>

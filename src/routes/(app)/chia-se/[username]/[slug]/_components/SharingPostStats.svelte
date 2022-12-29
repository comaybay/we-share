<script lang="ts">
	import CommentIcon from 'src/routes/(app)/_components/icons/CommentIcon.svelte';
	import ViewIcon from 'src/routes/(app)/_components/icons/ViewIcon.svelte';
	import type { PageData } from '../$types';
	import SharingPostStarButton from '../../../_components/SharingPostStarButton.svelte';

	export let post: PageData['post'];
</script>

<div class="bg-paper rounded-full p-4 ">
	<SharingPostStarButton
		postId={post.id}
		bind:starred={post.starred}
		bind:starCount={post.starCount}
	/>
	<div class="flex justify-center gap-x-2 px-2 mt-0.5 pt-0.5 border-t border-pri-base">
		<div class="flex items-center gap-x-0.5">
			<span>{post.commentCount}</span><CommentIcon />
		</div>
		<div class="flex items-center gap-x-0.5">
			<span>{post.viewCount}</span><ViewIcon />
		</div>
	</div>
</div>

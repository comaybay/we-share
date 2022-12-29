<script lang="ts">
	import CommentIcon from 'src/routes/(app)/_components/icons/CommentIcon.svelte';
	import MemberIcon from 'src/routes/(app)/_components/icons/MemberIcon.svelte';
	import ViewIcon from 'src/routes/(app)/_components/icons/ViewIcon.svelte';
	import type { PageData } from '../$types';

	export let post: PageData['post'];
</script>

<div class="p-4 bg-paper rounded-full">
	<p class="text-center text-2xl text-tert-base">{post.courseCode}</p>
	<div class="flex justify-center gap-x-2 mt-0.5 pt-0.5 border-t border-pri-base">
		<div class="flex items-center gap-x-0.5">
			<span>{post.commentCount}</span><CommentIcon />
		</div>
		<div class="flex items-center gap-x-0.5">
			<span>{post.viewCount}</span><ViewIcon />
		</div>
		<div class="flex items-center gap-x-0.5">
			<span>{post.members.length}/{post.teamSize}</span><MemberIcon />
		</div>
	</div>
</div>

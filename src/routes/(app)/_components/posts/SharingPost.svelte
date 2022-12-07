<script lang="ts">
	import { toRelativeTime } from 'src/lib/i18n/toRelativeTime';
	import CommentIcon from 'src/routes/(app)/_components/icons/CommentIcon.svelte';
	import UserProfilePicture from 'src/routes/_components/UserProfilePicture.svelte';
	import type { PageData } from '../../chia-se/$types';
	import ViewIcon from '../icons/ViewIcon.svelte';
	import YellowStarcon from '../icons/YellowStarcon.svelte';

	export let post: PageData['posts'][number];
</script>

<div class="py-4 px-6 border-b border-pri-base">
	<div class="flex gap-x-4">
		<div class="flex flex-col items-center text-quin-base">
			<div class="w-16 h-16 text-pri-base">
				<UserProfilePicture />
			</div>
			<span class="text-4xl">{post.starCount}</span>
			<button>
				<YellowStarcon />
			</button>
		</div>
		<div>
			<h3 class="text-2xl text-tert-base line-clamp-2">
				<a href={`chia-se/${post.authorUsername}/${post.slug}`}>{post.title}</a>
			</h3>
			<a class="hover:text-pri-hover" href={`nguoi-dung/${post.authorUsername}`}>
				{post.authorUsername}
			</a>
			<span>hỏi {toRelativeTime(post.dateCreated)}</span>
			{#if post.dateLastUpdated}
				<span class="italic">(cập nhật {toRelativeTime(post.dateLastUpdated)})</span>
			{/if}
			<div class="flex gap-x-2">
				<div class="flex items-center gap-x-0.5">
					<span>{post.commentCount}</span><CommentIcon />
				</div>
				<div class="flex items-center gap-x-0.5">
					<span>{post.viewCount}</span><ViewIcon />
				</div>
			</div>

			<div class="mt-3 w-full flex flex-wrap gap-2">
				{#each post.topics as topic}
					<a
						href="hoi-dap?topic={encodeURIComponent(topic)}"
						class="min-w-0 truncate px-2.5 rounded-full border border-pri-light bg-paper hover:bg-pri-light hover:text-paper transition-colors duration-25"
					>
						{topic}
					</a>
				{/each}
			</div>
		</div>
	</div>
</div>

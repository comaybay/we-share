<script lang="ts">
	import { toRelativeTime } from 'src/lib/i18n/toRelativeTime';
	import CommentIcon from 'src/routes/(app)/_components/icons/CommentIcon.svelte';
	import type { PageData } from '../$types';
	import HeartIcon from '../../_components/icons/HeartIcon.svelte';
	import StarIcon from '../../_components/icons/StarIcon.svelte';
	import ViewIcon from '../../_components/icons/ViewIcon.svelte';

	export let question: PageData['questions'][number];
</script>

<div class="py-4 px-6 border-b border-pri-base">
	<div class="flex gap-x-4">
		<div class="flex flex-col items-center text-sec-base">
			<span class="text-4xl">{question.starCount}</span>
			<button>
				<StarIcon />
			</button>
			<button class="mt-3 text-qua-base">
				<HeartIcon />
			</button>
		</div>
		<div>
			<h3 class="text-2xl text-tert-base line-clamp-2">
				<a href={`hoi-dap/${question.authorUsername}/${question.slug}`}>{question.title}</a>
			</h3>
			<a class="hover:text-pri-hover" href={`nguoi-dung/${question.authorUsername}`}>
				{question.authorUsername}
			</a>
			<span>hỏi {toRelativeTime(question.dateCreated)}</span>
			{#if question.dateLastUpdated}
				<span class="italic">(cập nhật {toRelativeTime(question.dateLastUpdated)})</span>
			{/if}
			<div class="flex gap-x-2">
				<div class="flex items-center gap-x-0.5">
					<span>{question.commentCount}</span><CommentIcon />
				</div>
				<div class="flex items-center gap-x-0.5">
					<span>{question.viewCount}</span><ViewIcon />
				</div>
			</div>

			<div class="mt-3 w-full flex flex-wrap gap-2">
				{#each question.topics as topic}
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

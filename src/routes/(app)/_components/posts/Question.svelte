<script lang="ts">
	import { toRelativeTime } from 'src/lib/i18n/toRelativeTime';
	import CommentIcon from 'src/routes/(app)/_components/icons/CommentIcon.svelte';
	import type { PageData } from '../../hoi-dap/$types';
	import HeartIcon from '../icons/HeartIcon.svelte';
	import StarIcon from '../icons/StarIcon.svelte';
	import ViewIcon from '../icons/ViewIcon.svelte';
	import PostHeaderTopicContainer from './PostHeaderTopicContainer.svelte';

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

			<PostHeaderTopicContainer baseHref="hoi-dap" topics={question.topics} />
		</div>
	</div>
</div>

<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { supabaseClient } from 'src/lib/db';
	import { toRelativeTime } from 'src/lib/i18n/toRelativeTime';
	import generateLoginPath from 'src/lib/login/generateLoginPath';
	import CommentIcon from 'src/routes/(app)/_components/icons/CommentIcon.svelte';
	import type { PageData } from '../../hoi-dap/$types';
	import HeartIcon from '../icons/HeartIcon.svelte';
	import StarIcon from '../icons/StarIcon.svelte';
	import ViewIcon from '../icons/ViewIcon.svelte';
	import PostHeaderTopicContainer from './PostHeaderTopicContainer.svelte';

	export let question: PageData['questions'][number];
	let loading = false;

	async function onClickedStar() {
		loading = true;
		const user = $page.data.session?.user;

		if (!user) {
			await goto(generateLoginPath($page.url.pathname));
			return;
		}

		let success = false;
		if (question.starred) {
			const { error } = await supabaseClient.from('post_question_stars').delete().match({
				post_id: question.id,
				user_id: user.id
			});
			success = error === null;
		} else {
			const { error } = await supabaseClient
				.from('post_question_stars')
				.insert([{ post_id: question.id, user_id: user.id }]);
			success = error === null;
		}

		if (success) {
			question.starred = !question.starred;
			question.starCount += question.starred ? 1 : -1;
		}
		loading = false;
	}
</script>

<div class="py-4 px-6 border-b border-pri-base">
	<div class="flex gap-x-4">
		<div class="flex flex-col items-center text-sec-base">
			<span class="text-4xl">{question.starCount}</span>
			<button
				on:click={onClickedStar}
				class="{loading
					? 'text-sec-loading scale-90 hover:rotate-6 '
					: 'text-sec-base hover:text-sec-hover '} transition-transform duration-25"
			>
				<StarIcon solid={question.starred} />
			</button>
			<div class="mt-1 {question.hasFavoritedAnswer ? 'text-qua-base' : 'text-qua-loading'}">
				<HeartIcon solid={question.hasFavoritedAnswer} />
			</div>
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

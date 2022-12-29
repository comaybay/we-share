<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { supabaseClient } from 'src/lib/db';
	import { toRelativeTime } from 'src/lib/i18n/toRelativeTime';
	import generateLoginPath from 'src/lib/login/generateLoginPath';
	import CommentIcon from 'src/routes/(app)/_components/icons/CommentIcon.svelte';
	import type { PageData } from '../../../$types';
	import StarIcon from '../../icons/StarIcon.svelte';
	import ViewIcon from '../../icons/ViewIcon.svelte';
	import AuthorNavLink from '../AuthorNavLink.svelte';
	import Title from './Title.svelte';

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

<div class="pt-4 pb-2 px-4 border-b border-pri-base">
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
		</div>
		<div>
			<Title mini href={`hoi-dap/${question.authorUsername}/${question.slug}`}>
				{question.title}
			</Title>
			<div class="flex gap-x-2 flex-wrap">
				<div>
					<AuthorNavLink authorUsername={question.authorUsername} />
					<span>hỏi {toRelativeTime(question.dateCreated)}</span>
				</div>

				{#if question.dateLastUpdated}
					<span class="italic">(đã qua chỉnh sửa)</span>
				{/if}
				<div class="flex items-center gap-x-0.5">
					<span>{question.commentCount}</span><CommentIcon />
				</div>
				<div class="flex items-center gap-x-0.5">
					<span>{question.viewCount}</span><ViewIcon />
				</div>
			</div>
		</div>
	</div>
</div>

<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from 'src/routes/_components/buttons/Button.svelte';
	import Head from 'src/routes/_components/Head.svelte';
	import { onMount } from 'svelte';
	import CreateSharingPost from '../_components/icons/CreateSharingPostIcon.svelte';
	import LoadingIndicator from '../_components/LoadingIndicator.svelte';
	import TopicContainer from '../_components/posts/detail/TopicContainer.svelte';
	import SharingPost from '../_components/posts/headlines/SharingPost.svelte';
	import SortNewestButton from '../_components/posts/SortNewestButton.svelte';
	import SortTopButton from '../_components/posts/SortTopButton.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let loading = true;
	onMount(() => (loading = false));

	$: url = $page.url;

	let topics: string[] = [];
	$: {
		if (data.posts) {
			topics = [];
			//get 1 topic of each question, not including duplicates
			const questionWithTopics = data.posts.filter(q => q.topics.length > 0);
			for (const question of questionWithTopics) {
				const topic = question.topics.find(t => !topics.includes(t));
				if (topic) {
					topics.push(topic);
				}
			}
		}
	}

	let newestQuestionsActive = false;
	let topQuestionsActive = false;
	$: {
		const sortSrder = url.searchParams.get('order');
		topQuestionsActive = sortSrder !== null && sortSrder === 'top';
		newestQuestionsActive = sortSrder === null || sortSrder === 'newest';
	}

	async function onClickNewestQuestions() {
		if (!newestQuestionsActive) {
			url.searchParams.set('order', 'newest');
			updateData();
		}
	}

	async function onClickTopQuestions() {
		if (!topQuestionsActive) {
			url.searchParams.set('order', 'top');
			updateData();
		}
	}

	async function updateData() {
		loading = true;
		await goto(url.href, { keepfocus: true, noscroll: true });
		await invalidate('sharingposts:get');
		loading = false;
	}
</script>

<Head
	title="Chia sẻ"
	description="Xem những bài viết chia sẻ bổ ích từ cộng đồng WeShare. Bạn có kiến thức thú vị muốn chia sẻ cho mọi người? hãy tạo bài viết trên WeShare!"
/>

<div class="flex flex-col lg:flex-row-reverse gap-x-16 px-4 md:px-28 justify-between">
	<div class="flex flex-col shrink-0 min-w-[330px] mb-4 lg:mb-0">
		<a href="/chia-se/tao-bai-viet">
			<Button block>
				<div class="w-full flex gap-x-2 justify-center items-center px-14 py-1">
					<CreateSharingPost />
					<b>TẠO BÀI VIẾT</b>
				</div>
			</Button>
		</a>
		<div class="mt-4 border border-pri-base">
			<p class="py-2 px-4 text-xl font-sans font-thin bg-pri-base text-paper">Chủ đề</p>
			<div class="px-4 py-3">
				<TopicContainer baseHref="/chia-se" {topics} />
			</div>
		</div>
	</div>
	<div class="grow">
		<SortNewestButton active={newestQuestionsActive} on:click={onClickNewestQuestions} />
		<SortTopButton active={topQuestionsActive} on:click={onClickTopQuestions} />
		{#if !loading}
			{#each data.posts as post}
				<SharingPost {post} />
			{/each}
		{:else}
			<LoadingIndicator />
		{/if}
	</div>
</div>

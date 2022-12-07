<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from 'src/routes/_components/buttons/Button.svelte';
	import { onMount } from 'svelte';
	import LoadingIndicator from '../_components/LoadingIndicator.svelte';
	import TopicContainer from '../_components/postDetail/TopicContainer.svelte';
	import NewestPostsButton from '../_components/posts/NewestPostsButton.svelte';
	import SharingPost from '../_components/posts/SharingPost.svelte';
	import TopPostsButton from '../_components/posts/TopPostsButton.svelte';
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
		newestQuestionsActive = sortSrder !== null && sortSrder === 'newest';
		topQuestionsActive = sortSrder !== null && sortSrder === 'top';
	}

	async function onClickNewestQuestions() {
		if (!newestQuestionsActive) {
			url.searchParams.set('order', 'newest');
			url = url;
			updateData();
		}
	}

	async function onClickTopQuestions() {
		if (!topQuestionsActive) {
			url.searchParams.set('order', 'top');
			url = url;
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

<div class="flex flex-col lg:flex-row-reverse gap-x-16 px-4 md:px-28 justify-between">
	<div class="flex flex-col shrink-0 min-w-[330px] mb-4 lg:mb-0">
		<a href="/chia-se/tao-bai-viet">
			<Button block>
				<div class="w-full flex gap-x-2 justify-center items-center px-14">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						class="w-6 h-6"
					>
						<path
							fill-rule="evenodd"
							d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 003 3h15a3 3 0 01-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125zM12 9.75a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H12zm-.75-2.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5H12a.75.75 0 01-.75-.75zM6 12.75a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5H6zm-.75 3.75a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5H6a.75.75 0 01-.75-.75zM6 6.75a.75.75 0 00-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 00.75-.75v-3A.75.75 0 009 6.75H6z"
							clip-rule="evenodd"
						/>
						<path d="M18.75 6.75h1.875c.621 0 1.125.504 1.125 1.125V18a1.5 1.5 0 01-3 0V6.75z" />
					</svg>
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
		<NewestPostsButton active={newestQuestionsActive} on:click={onClickNewestQuestions} />
		<TopPostsButton active={topQuestionsActive} on:click={onClickTopQuestions} />
		{#if !loading}
			{#each data.posts as post}
				<SharingPost {post} />
			{/each}
		{:else}
			<LoadingIndicator />
		{/if}
	</div>
</div>

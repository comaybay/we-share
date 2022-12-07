<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from 'src/routes/_components/buttons/Button.svelte';
	import { onMount } from 'svelte';
	import LoadingIndicator from '../_components/LoadingIndicator.svelte';
	import TopicContainer from '../_components/postDetail/TopicContainer.svelte';
	import NewestPostsButton from '../_components/posts/NewestPostsButton.svelte';
	import Question from '../_components/posts/Question.svelte';
	import TopPostsButton from '../_components/posts/TopPostsButton.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let loading = true;
	onMount(() => (loading = false));

	let questions: PageData['questions'];

	$: questions = data.questions;
	$: url = $page.url;

	let topics: string[] = [];
	$: {
		if (questions) {
			topics = [];
			//get 1 topic of each question, not including duplicates
			const questionWithTopics = questions.filter(q => q.topics.length > 0);
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
		await invalidate('questions:get');
		loading = false;
	}
</script>

<div class="flex flex-col lg:flex-row-reverse gap-x-16 px-4 md:px-28 justify-between">
	<div class="flex flex-col shrink-0 min-w-[330px] mb-4 lg:mb-0">
		<a href="/hoi-dap/dat-cau-hoi">
			<Button block>
				<div class="w-full flex gap-x-2 justify-center items-center px-14">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						class="w-6 h-6"
					>
						<path
							d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z"
						/>
						<path
							d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z"
						/>
					</svg>

					<b>ĐẶT CÂU HỎI</b>
				</div>
			</Button>
		</a>
		<div class="mt-4 border border-pri-base">
			<p class="py-2 px-4 text-xl font-sans font-thin bg-pri-base text-paper">Chủ đề</p>
			<div class="px-4 py-3">
				<TopicContainer baseHref="/hoi-dap" {topics} />
			</div>
		</div>
	</div>
	<div class="grow">
		<NewestPostsButton active={newestQuestionsActive} on:click={onClickNewestQuestions} />
		<TopPostsButton active={topQuestionsActive} on:click={onClickTopQuestions} />
		{#if !loading}
			{#each questions as question}
				<Question {question} />
			{/each}
		{:else}
			<LoadingIndicator />
		{/if}
	</div>
</div>

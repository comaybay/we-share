<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from 'src/routes/_components/buttons/Button.svelte';
	import Head from 'src/routes/_components/Head.svelte';
	import { onMount } from 'svelte';
	import AskQuestionIcon from '../_components/icons/AskQuestionIcon.svelte';
	import LoadingIndicator from '../_components/LoadingIndicator.svelte';
	import TopicContainer from '../_components/posts/detail/TopicContainer.svelte';
	import Question from '../_components/posts/headlines/Question.svelte';
	import SortNewestButton from '../_components/posts/SortNewestButton.svelte';
	import SortTopButton from '../_components/posts/SortTopButton.svelte';
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
		newestQuestionsActive = sortSrder === null || sortSrder === 'newest';
		topQuestionsActive = sortSrder !== null && sortSrder === 'top';
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
		await invalidate('questions:get');
		loading = false;
	}
</script>

<Head
	title="H???i ????p"
	description="Xem nh???ng c??u h???i v?? nh???ng c??u tr??? l???i t??? c???ng ?????ng WeShare. B???n c?? c??u h???i c???n ???????c gi???i ????p? h??y ?????t c??u h???i tr??n WeShare!"
/>

<div class="flex flex-col lg:flex-row-reverse gap-x-16 px-4 md:px-28 justify-between">
	<div class="flex flex-col shrink-0 lg:w-[380px] mb-4 lg:mb-0">
		<a href="/hoi-dap/dat-cau-hoi">
			<Button block>
				<div class="w-full flex gap-x-2 justify-center items-center px-14 py-1">
					<AskQuestionIcon />
					<b>?????T C??U H???I</b>
				</div>
			</Button>
		</a>
		<div class="mt-4 border border-pri-base">
			<p class="py-2 px-4 text-xl font-sans font-thin bg-pri-base text-paper">Ch??? ?????</p>
			<div class="px-4 py-3">
				<TopicContainer baseHref="/hoi-dap" {topics} />
			</div>
		</div>
	</div>
	<div>
		<SortNewestButton active={newestQuestionsActive} on:click={onClickNewestQuestions} />
		<SortTopButton active={topQuestionsActive} on:click={onClickTopQuestions} />
		{#if !loading}
			{#each questions as question}
				<Question {question} />
			{/each}
		{:else}
			<LoadingIndicator />
		{/if}
	</div>
</div>

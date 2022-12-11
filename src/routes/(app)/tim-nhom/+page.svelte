<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from 'src/routes/_components/buttons/Button.svelte';
	import { onMount } from 'svelte';
	import TeamIcon from '../_components/icons/TeamIcon.svelte';
	import LoadingIndicator from '../_components/LoadingIndicator.svelte';
	import TopicContainer from '../_components/postDetail/TopicContainer.svelte';
	import FindTeamPost from '../_components/posts/FindTeamPost.svelte';
	import NewestPostsButton from '../_components/posts/NewestPostsButton.svelte';
	import TopPostsButton from '../_components/posts/TopPostsButton.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let loading = true;
	onMount(() => (loading = false));

	$: url = $page.url;

	let skills: string[] = [];
	$: {
		if (data.posts) {
			skills = [];
			//get 1 topic of each post, not including duplicates
			const questionWithTopics = data.posts.filter(p => p.neededSkills.length > 0);
			for (const post of questionWithTopics) {
				const skill = post.neededSkills.find(t => !skills.includes(t));
				if (skill) {
					skills.push(skill);
				}
			}
		}
	}

	let newestPostsActive = false;
	let topPostsActive = false;
	$: {
		const sortSrder = url.searchParams.get('order');
		newestPostsActive = sortSrder !== null && sortSrder === 'newest';
		topPostsActive = sortSrder !== null && sortSrder === 'top';
	}

	async function onClickNewestQuestions() {
		if (!newestPostsActive) {
			url.searchParams.set('order', 'newest');
			url = url;
			updateData();
		}
	}

	async function onClickTopQuestions() {
		if (!topPostsActive) {
			url.searchParams.set('order', 'top');
			url = url;
			updateData();
		}
	}

	async function updateData() {
		loading = true;
		await goto(url.href, { keepfocus: true, noscroll: true });
		await invalidate('findteamposts:get');
		loading = false;
	}
</script>

<div class="flex flex-col lg:flex-row-reverse gap-x-16 px-4 md:px-28 justify-between">
	<div class="flex flex-col shrink-0 min-w-[330px] mb-4 lg:mb-0">
		<a href="/tim-nhom/tao-bai-viet">
			<Button block>
				<div class="w-full flex gap-x-2 justify-center items-center px-14">
					<TeamIcon />
					<b>ĐĂNG BÀI TÌM NHÓM</b>
				</div>
			</Button>
		</a>
		<div class="mt-4 border border-pri-base">
			<p class="py-2 px-4 text-xl font-sans font-thin bg-pri-base text-paper">Chủ đề</p>
			<div class="px-4 py-3">
				<TopicContainer baseHref="/tim-nhom" topics={skills} />
			</div>
		</div>
	</div>
	<div class="grow">
		<NewestPostsButton active={newestPostsActive} on:click={onClickNewestQuestions} />
		<TopPostsButton active={topPostsActive} on:click={onClickTopQuestions} />
		{#if !loading}
			{#each data.posts as post}
				<FindTeamPost {post} />
			{/each}
		{:else}
			<LoadingIndicator />
		{/if}
	</div>
</div>

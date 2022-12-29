<script lang="ts">
	import UserProfilePicture from 'src/routes/_components/UserProfilePicture.svelte';
	import Bookmark from '../../_components/icons/Bookmark.svelte';
	import HeartIcon from '../../_components/icons/HeartIcon.svelte';
	import QuoteIcon from '../../_components/icons/QuoteIcon.svelte';
	import StarIcon from '../../_components/icons/StarIcon.svelte';
	import YellowStarIcon from '../../_components/icons/YellowStarIcon.svelte';
	import type { PageData } from './$types';
	import StatItem from './_components/StatItem.svelte';

	export let data: PageData;
	$: user = data.user;
	$: stats = data.stats;
</script>

<div class="flex flex-col md:flex-row items-center md:items-start mx-4 justify-center">
	<UserProfilePicture classname="shrink-0 w-60 h-60" />
	<div class="flex flex-col items-center md:block">
		<h1 class="text-3xl">{user.name}</h1>
		<h2 class="-mt-1 text-xl text-pri-light">{user.username}</h2>
		{#if user.quote}
			<blockquote class="mt-2 w-fit italic font-semibold">
				<QuoteIcon classname="w-6 h-6 text-pri-light" />
				<p class="mx-4 font-thin">
					{user.quote}
				</p>
				<QuoteIcon classname="ml-auto w-6 h-6 text-pri-light rotate-180" />
			</blockquote>
		{/if}
		<div class="mt-4 text-xl grid grid-cols-2 md:flex md:flex-wrap gap-8">
			<StatItem title="Sao hỏi đáp">
				<div class="flex items-center text-sec-base">
					<span>{stats.questionStarCount + stats.questionCommentStarCount}</span>
					<StarIcon classname="-mt-0.5 w-7 h-7" solid />
				</div>
			</StatItem>

			<StatItem title="Câu trả lời yêu thích">
				<div class="flex items-center text-qua-base">
					<span>{stats.favoriteAnswerCount}</span>
					<HeartIcon classname="-mt-0.5 w-7 h-7" solid />
				</div>
			</StatItem>

			<StatItem title="Sao chia sẻ">
				<div class="flex gap-2">
					<div class="flex items-center text-quin-base">
						<span>{stats.sharingStarCount}</span>
						<YellowStarIcon classname="-mt-0.5 p-0.5 w-7 h-7" solid />
					</div>
					<div class="flex items-center text-sec-base">
						<span>{stats.sharingCommentStarCount}</span>
						<StarIcon classname="-mt-0.5 w-7 h-7" solid />
					</div>
				</div>
			</StatItem>

			<StatItem title="Được bookmark">
				<div class="flex items-center text-pri-base">
					<span>{stats.favoriteAnswerCount}</span>
					<Bookmark classname="w-6 h-6" solid />
				</div>
			</StatItem>
		</div>
	</div>
</div>

<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { supabaseClient } from 'src/lib/db';
	import { toRelativeTime } from 'src/lib/i18n/toRelativeTime';
	import generateLoginPath from 'src/lib/login/generateLoginPath';
	import CommentIcon from 'src/routes/(app)/_components/icons/CommentIcon.svelte';
	import UserProfilePicture from 'src/routes/_components/UserProfilePicture.svelte';
	import type { PageData } from '../../../chia-se/$types';
	import ViewIcon from '../../icons/ViewIcon.svelte';
	import YellowStarcon from '../../icons/YellowStarIcon.svelte';
	import AuthorNavLink from '../AuthorNavLink.svelte';
	import PostHeaderTopicContainer from '../PostHeaderTopicContainer.svelte';
	import Title from './Title.svelte';

	export let post: PageData['posts'][number];

	let loading = false;

	async function onClickedStar() {
		loading = true;
		const user = $page.data.session?.user;

		if (!user) {
			await goto(generateLoginPath($page.url.pathname));
			return;
		}

		let success = false;
		if (post.starred) {
			const { error } = await supabaseClient.from('post_sharing_stars').delete().match({
				post_id: post.id,
				user_id: user.id
			});
			success = error === null;
		} else {
			const { error } = await supabaseClient
				.from('post_sharing_stars')
				.insert([{ post_id: post.id, user_id: user.id }]);
			success = error === null;
		}

		if (success) {
			post.starred = !post.starred;
			post.starCount += post.starred ? 1 : -1;
		}
		loading = false;
	}
</script>

<div class="py-4 px-6 border-b border-pri-base">
	<div class="flex gap-x-4">
		<div class="flex flex-col items-center text-quin-base">
			<div class="w-14 h-14 text-pri-base">
				<UserProfilePicture />
			</div>
			<span class="text-4xl">{post.starCount}</span>
			<button
				on:click={onClickedStar}
				class="{loading
					? 'text-quin-loading scale-90 hover:rotate-6 '
					: 'text-quin-base hover:text-quin-hover '} transition-transform duration-25"
			>
				<YellowStarcon solid={post.starred} />
			</button>
		</div>
		<div class="min-w-0">
			<Title mini href={`chia-se/${post.authorUsername}/${post.slug}`}>{post.title}</Title>
			<AuthorNavLink authorUsername={post.authorUsername} />
			<span>đăng {toRelativeTime(post.dateCreated)}</span>
			{#if post.dateLastUpdated}
				<span class="italic">(cập nhật {toRelativeTime(post.dateLastUpdated)})</span>
			{/if}
			<div class="flex gap-x-2">
				<div class="flex items-center gap-x-0.5">
					<span>{post.commentCount}</span><CommentIcon />
				</div>
				<div class="flex items-center gap-x-0.5">
					<span>{post.viewCount}</span><ViewIcon />
				</div>
			</div>

			<PostHeaderTopicContainer baseHref="chia-se" topics={post.topics} />
		</div>
	</div>
</div>

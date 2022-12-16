<script lang="ts">
	import { toRelativeTime } from 'src/lib/i18n/toRelativeTime';
	import PostContent from 'src/routes/(app)/_components/posts/detail/PostContent.svelte';
	import PostTitle from 'src/routes/(app)/_components/posts/detail/PostTitle.svelte';
	import TopicContainer from 'src/routes/(app)/_components/posts/detail/TopicContainer.svelte';
	import UserProfilePicture from 'src/routes/_components/UserProfilePicture.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let post: PageData['post'] | null = null;
	$: {
		({ post } = data);
	}
</script>

<div class="flex flex-col md:flex-row justify-center mx-8 md:mx-6">
	{#if post}
		<div class="mt-2 md:mt-0 order-2 md:order-none">Placeholder</div>

		<div class="grow max-w-3xl min-w-0">
			<div class="md:px-8 md:py-4 mx-0 md:mx-6 md:border md:border-pri-light ">
				<a href="/nguoi-dung/{post.author.username}">
					<div class="inline-block w-12 h-12 mb-1">
						<UserProfilePicture />
					</div>
					<span class="font-bold">
						{post.author.username}
					</span>
				</a>
				<span>{toRelativeTime(post.dateCreated)}</span>
				<PostTitle>{post.title}</PostTitle>
				<div class="mt-4 mb-6">
					<PostContent content={post.content} />
				</div>

				<TopicContainer topics={post.neededSkills} baseHref="/tim-nhom" />
			</div>
		</div>
		<div class="order-3 md:order-none">
			<span class="text-lg text-sec-base">Thành viên:</span>
			{#each post.members as member}
				<a href="nguoi-dung/{member.username}" class="flex gap-0.5 items-center text-lg">
					<div class="h-10 w-10">
						<UserProfilePicture />
					</div>
					{member.username}
				</a>
			{/each}
		</div>
	{/if}
</div>

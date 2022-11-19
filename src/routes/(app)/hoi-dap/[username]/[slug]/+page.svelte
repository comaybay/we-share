<script lang="ts">
	import { toRelativeTime } from 'src/lib/i18n/toRelativeTime';
	import PostTitle from 'src/routes/(app)/_components/posts/PostTitle.svelte';
	import TopicContainer from 'src/routes/(app)/_components/posts/TopicContainer.svelte';
	import UserProfilePicture from 'src/routes/_components/UserProfilePicture.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let post: PageData['post'] | null = null;
	$: {
		({ post } = data);
	}
</script>

<div class="flex justify-center">
	{#if post}
		<div class="grow px-8 md:py-4 md:border md:border-pri-light max-w-3xl min-w-0">
			<a href="/nguoi-dung/{post.author.username}">
				<div class="inline-block w-12 h-12 mb-1">
					<UserProfilePicture />
				</div>
				<span class="font-bold">
					{post.author.username}
				</span>
			</a>
			<span>hỏi {toRelativeTime(post.dateCreated)}</span>
			<PostTitle>{post.title}</PostTitle>
			<div class="mt-4 mb-6">
				{@html post.content}
			</div>

			<TopicContainer topics={post.topics} baseHref="/hoi-dap" />
		</div>
	{/if}
</div>

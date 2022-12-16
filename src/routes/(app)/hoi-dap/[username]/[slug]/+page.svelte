<script lang="ts">
	import { goto } from '$app/navigation';
	import { supabaseClient } from 'src/lib/db';
	import { toRelativeTime } from 'src/lib/i18n/toRelativeTime';
	import PostAuthorView from 'src/routes/(app)/PostAuthorView.svelte';
	import { dialog } from 'src/routes/(app)/_components/dialogControl/dialogControl';
	import ErrorDialog from 'src/routes/(app)/_components/dialogs/ErrorDialog.svelte';
	import PostContent from 'src/routes/(app)/_components/posts/detail/PostContent.svelte';
	import PostSettingsSection from 'src/routes/(app)/_components/posts/detail/PostSettingsSection.svelte';
	import PostTitle from 'src/routes/(app)/_components/posts/detail/PostTitle.svelte';
	import TopicContainer from 'src/routes/(app)/_components/posts/detail/TopicContainer.svelte';
	import UserProfilePicture from 'src/routes/_components/UserProfilePicture.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let post: PageData['post'];
	$: post = data.post;

	async function deletePost() {
		const { error } = await supabaseClient.from('post_questions').delete().match({ id: post.id });

		if (!error) {
			goto('/hoi-dap');
			return;
		}

		dialog.setBody({ component: ErrorDialog, props: {} });
		dialog.open();
	}
</script>

<div class="flex justify-center">
	<div class="grow mx-0 md:mx-6 px-8 md:py-4 md:border md:border-pri-light max-w-3xl min-w-0">
		<div class="flex justify-between">
			<div>
				<a href="/nguoi-dung/{post.author.username}">
					<div class="inline-block w-12 h-12 mb-1">
						<UserProfilePicture />
					</div>
					<span class="font-bold">
						{post.author.username}
					</span>
				</a>
				<span>hỏi {toRelativeTime(post.dateCreated)}</span>
			</div>
			<PostAuthorView authorId={post.author.id}>
				<PostSettingsSection on:choosedelete={deletePost} />
			</PostAuthorView>
		</div>
		<PostTitle>{post.title}</PostTitle>
		<div class="mt-4 mb-6">
			<PostContent content={post.content} />
		</div>
		<TopicContainer topics={post.topics} baseHref="/hoi-dap" />
	</div>
</div>

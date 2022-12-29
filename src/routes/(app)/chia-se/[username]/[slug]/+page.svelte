<script lang="ts">
	import { goto } from '$app/navigation';
	import { supabaseClient } from 'src/lib/db';
	import CommentSection from 'src/routes/(app)/_components/comments/CommentSection.svelte';
	import { dialog } from 'src/routes/(app)/_components/dialogControl/dialogControl';
	import ErrorDialog from 'src/routes/(app)/_components/dialogs/ErrorDialog.svelte';
	import AuthorSection from 'src/routes/(app)/_components/posts/detail/AuthorSection.svelte';
	import LeftStickySection from 'src/routes/(app)/_components/posts/detail/LeftStickySection.svelte';
	import PostSettingsSection from 'src/routes/(app)/_components/posts/detail/PostSettingsSection.svelte';
	import PostTitle from 'src/routes/(app)/_components/posts/detail/PostTitle.svelte';
	import PostContent from 'src/routes/(app)/_components/posts/detail/RenderContent.svelte';
	import TopicContainer from 'src/routes/(app)/_components/posts/detail/TopicContainer.svelte';
	import PostAuthorView from 'src/routes/(app)/_components/views/PostAuthorView.svelte';
	import SharingPostStarButton from '../../_components/SharingPostStarButton.svelte';
	import type { PageData } from './$types';
	import SharingPostStats from './_components/SharingPostStats.svelte';

	export let data: PageData;

	let post: PageData['post'];
	$: post = data.post;

	async function deletePost() {
		const { error } = await supabaseClient.from('post_sharings').delete().match({ id: post.id });

		if (!error) {
			goto('/chia-se');
			return;
		}

		dialog.setBody({ component: ErrorDialog, props: {} });
		dialog.open();
	}
</script>

<div class="flex justify-center gap-4 mx-4">
	<div class="relative grow max-w-3xl min-w-0">
		<LeftStickySection>
			<SharingPostStats bind:post />
		</LeftStickySection>

		<div class="md:px-8 md:py-4 mb-4 md:border md:border-pri-light">
			<div class="flex justify-between">
				<AuthorSection
					username={post.author.username}
					postDateCreated={post.dateCreated}
					postDateLastUpdated={post.dateLastUpdated}
				/>
				<PostAuthorView authorId={post.author.id}>
					<PostSettingsSection
						editPostHref="/chia-se/chinh-sua/{post.id}"
						on:choosedelete={deletePost}
					/>
				</PostAuthorView>
			</div>

			<PostTitle>{post.title}</PostTitle>
			<div class="mt-4 mb-6">
				<PostContent content={post.content} />
			</div>

			<TopicContainer topics={post.topics} baseHref="/chia-se" />
		</div>

		<CommentSection
			postType="sharing"
			commentCount={post.commentCount}
			comments={data.comments}
			postId={post.id}
		>
			<div slot="starbutton" class="lg:hidden">
				<SharingPostStarButton
					postId={post.id}
					bind:starred={post.starred}
					bind:starCount={post.starCount}
				/>
			</div>
		</CommentSection>
	</div>
</div>

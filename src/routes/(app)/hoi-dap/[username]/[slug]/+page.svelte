<script lang="ts">
	import { goto } from '$app/navigation';
	import { supabaseClient } from 'src/lib/db';
	import { dialog } from 'src/routes/(app)/_components/dialogControl/dialogControl';
	import ErrorDialog from 'src/routes/(app)/_components/dialogs/ErrorDialog.svelte';
	import AuthorSection from 'src/routes/(app)/_components/posts/detail/AuthorSection.svelte';
	import LeftStickySection from 'src/routes/(app)/_components/posts/detail/LeftStickySection.svelte';
	import PostSettingsSection from 'src/routes/(app)/_components/posts/detail/PostSettingsSection.svelte';
	import PostTitle from 'src/routes/(app)/_components/posts/detail/PostTitle.svelte';
	import PostContent from 'src/routes/(app)/_components/posts/detail/RenderContent.svelte';
	import TopicContainer from 'src/routes/(app)/_components/posts/detail/TopicContainer.svelte';
	import PostAuthorView from 'src/routes/(app)/_components/views/PostAuthorView.svelte';
	import QuestionStarButton from '../../_components/QuestionStarButton.svelte';
	import type { PageData } from './$types';
	import AnswerSection from './_components/AnswerSection.svelte';
	import QuestionStats from './_components/QuestionStats.svelte';

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

<div class="mx-4 flex justify-center gap-4">
	<div class="relative grow max-w-3xl min-w-0">
		<LeftStickySection>
			<QuestionStats bind:post />
		</LeftStickySection>
		<div class="md:px-8 md:py-4 md:border md:border-pri-light mb-4">
			<div class="flex justify-between">
				<AuthorSection
					username={post.author.username}
					postDateCreated={post.dateCreated}
					postDateLastUpdated={post.dateLastUpdated}
				/>
				<PostAuthorView authorId={post.author.id}>
					<PostSettingsSection
						editPostHref="/hoi-dap/chinh-sua/{post.id}"
						on:choosedelete={deletePost}
					/>
				</PostAuthorView>
			</div>
			<PostTitle>{post.title}</PostTitle>
			<div class="mt-4 mb-6">
				<PostContent content={post.content} />
			</div>
			<TopicContainer topics={post.topics} baseHref="/hoi-dap" />
		</div>
		<AnswerSection postId={post.id} comments={data.comments}>
			<div slot="starbutton" class="lg:hidden">
				<QuestionStarButton
					postId={post.id}
					bind:starCount={post.starCount}
					bind:starred={post.starred}
				/>
			</div>
		</AnswerSection>
	</div>
</div>

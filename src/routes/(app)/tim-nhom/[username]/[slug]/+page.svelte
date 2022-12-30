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
	import RightStickySection from 'src/routes/(app)/_components/posts/detail/RightStickySection.svelte';
	import TopicContainer from 'src/routes/(app)/_components/posts/detail/TopicContainer.svelte';
	import PostAuthorView from 'src/routes/(app)/_components/views/PostAuthorView.svelte';
	import UserProfilePicture from 'src/routes/_components/UserProfilePicture.svelte';
	import type { PageData } from './$types';
	import FindTeamPostStats from './_components/FindTeamPostStats.svelte';

	export let data: PageData;

	let post: PageData['post'];
	$: post = data.post;

	async function deletePost() {
		const { error } = await supabaseClient.from('post_teams').delete().match({ id: post.id });

		if (!error) {
			goto('/tim-nhom');
			return;
		}

		dialog.setBody({ component: ErrorDialog, props: {} });
		dialog.open();
	}
</script>

<div class="flex flex-col md:flex-row justify-center mx-4">
	{#if post}
		<div class="relative grow max-w-3xl min-w-0">
			<LeftStickySection>
				<FindTeamPostStats {post} />
			</LeftStickySection>

			<RightStickySection>
				<div>
					<div class="text-lg text-sec-base">Thành viên:</div>
					{#each post.members as member}
						<a href="nguoi-dung/{member.username}" class="flex gap-0.5 items-center text-lg">
							<div class="h-10 w-10">
								<UserProfilePicture />
							</div>
							{member.username}
						</a>
					{/each}
				</div>
			</RightStickySection>

			<div class="md:px-8 md:py-4 mb-4 md:border md:border-pri-light">
				<div class="flex justify-between">
					<AuthorSection
						username={post.author.username}
						postDateCreated={post.dateCreated}
						postDateLastUpdated={post.dateLastUpdated}
					/>
					<PostAuthorView authorId={post.author.id}>
						<PostSettingsSection
							editPostHref="/tim-nhom/chinh-sua/{post.id}"
							on:choosedelete={deletePost}
						/>
					</PostAuthorView>
				</div>

				<PostTitle>{post.title}</PostTitle>
				<div class="mt-4 mb-6">
					<PostContent content={post.content} />
				</div>

				<TopicContainer topics={post.neededSkills} baseHref="/tim-nhom" />
			</div>

			<CommentSection
				postType="team"
				commentCount={post.commentCount}
				comments={data.comments}
				postId={post.id}
			/>
		</div>
	{/if}
</div>

<script lang="ts">
	import { toRelativeTime } from 'src/lib/i18n/toRelativeTime';
	import CommentIcon from 'src/routes/(app)/_components/icons/CommentIcon.svelte';
	import type { PageData } from '../../../$types';
	import MemberIcon from '../../icons/MemberIcon.svelte';
	import ViewIcon from '../../icons/ViewIcon.svelte';
	import AuthorNavLink from '../AuthorNavLink.svelte';
	import Title from './Title.svelte';

	export let post: PageData['findTeamPosts'][number];

	$: isTeamFull = post.teamMemberCount === post.teamSize;
</script>

<div class="pt-4 pb-2 px-4 border-b border-pri-base">
	<div class="flex justify-between gap-x-4">
		<div>
			<Title mini href={`tim-nhom/${post.authorUsername}/${post.slug}`}
				><span class="line-clamp-2">{post.title}</span></Title
			>
			<AuthorNavLink authorUsername={post.authorUsername} />
			<span>đăng {toRelativeTime(post.dateCreated)}</span>
			{#if post.dateLastUpdated}
				<span class="italic">(đẫ qua chỉnh sửa)</span>
			{/if}
			<div class="flex gap-x-2">
				<div class="flex items-center gap-x-0.5">
					<span>{post.commentCount}</span><CommentIcon />
				</div>
				<div class="flex items-center gap-x-0.5">
					<span>{post.viewCount}</span><ViewIcon />
				</div>
				<div class="flex items-center">
					<span>
						{post.teamMemberCount}/{post.teamSize}
					</span>
					<MemberIcon />
				</div>
				<div
					class="min-w-0 truncate px-2.5 rounded-full border {isTeamFull
						? 'border-qua-base text-qua-base'
						: 'border-sec-base text-sec-base'}"
				>
					{isTeamFull ? 'Đủ thành viên' : 'Thiếu thành viên'}
				</div>
			</div>
		</div>
	</div>
</div>

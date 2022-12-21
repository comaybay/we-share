<script lang="ts">
	import { toRelativeTime } from 'src/lib/i18n/toRelativeTime';
	import UserProfilePicture from 'src/routes/_components/UserProfilePicture.svelte';
	import AuthorNavLink from '../AuthorNavLink.svelte';

	export let username: string;
	export let postDateCreated: Date;
	export let postDateLastUpdated: Date | null;
</script>

<div class="flex items-center mb-1">
	<a href="/nguoi-dung/{username}">
		<div class="inline-block w-12 h-12">
			<UserProfilePicture />
		</div>
	</a>
	<div>
		<AuthorNavLink authorUsername={username}>
			{username}
		</AuthorNavLink>
		<span>đăng {toRelativeTime(postDateCreated)}</span>
		{#if postDateLastUpdated}
			<span class="italic">(cập nhật {toRelativeTime(postDateLastUpdated)})</span>
		{/if}
	</div>
</div>

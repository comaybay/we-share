<script lang="ts">
	import type UserProfile from '$lib/types/UserProfile';
	import WeShareIcon from '../WeShareIcon.svelte';
	import NavLink from './NavLink.svelte';
	import UserMenuButton from './UserMenuButton.svelte';

	export let userProfile: UserProfile | null;
</script>

<header class="relative z-20 flex px-4 items-center border-b border-pri-base h-16 bg-paper">
	<a href="/" class="ml-4 flex items-center flex-1">
		<WeShareIcon />
		<span class="text-3xl tracking-[0.07em] text-pri-base">WeShare</span>
	</a>

	<nav class="self-stretch flex justify-center flex-1">
		<NavLink href="/hoi-dap">Hỏi đáp</NavLink>
		<NavLink href="/chia-se">Chia sẻ</NavLink>
		<NavLink href="/tim-nhom">Tìm nhóm</NavLink>
	</nav>

	<div class="flex-1">
		{#if userProfile}
			<UserMenuButton {userProfile} />
		{:else}
			<button class="block ml-auto"><a href="/dang-nhap">Đăng nhập</a></button>
		{/if}
	</div>
</header>

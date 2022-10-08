<script lang="ts">
	import clickoutside from '$lib/actions/clickoutside';
	import type UserProfile from '$lib/types/UserProfile';
	import { quadInOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import UserMenuNavLink from './UserMenuNavLink.svelte';

	export let userProfile: UserProfile;
	let showMenu = false;
</script>

<div class="relative w-fit ml-auto">
	<button
		use:clickoutside={() => (showMenu = false)}
		on:click={() => (showMenu = !showMenu)}
		class="relative z-10 max-w-[265px] flex items-center py-1 px-4 bg-paper hover:bg-pri-lighter text-left"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1"
			stroke="currentColor"
			class="w-14 h-14 shrink-0"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
			/>
		</svg>
		<div class="overflow-hidden">
			<p class="text-lg truncate">{userProfile.profilename}</p>
			<p class="text-sm truncate">@{userProfile.username}</p>
		</div>
	</button>
	{#if showMenu}
		<nav
			transition:fly={{ y: -250, duration: 250, easing: quadInOut, opacity: 1 }}
			class="-z-10 absolute border rounded-b-xl border-pri-base py-2 w-full min-w-fit right-0 whitespace-nowrap"
		>
			<UserMenuNavLink href="/nguoi-dung/{userProfile.username}">Trang cá nhân</UserMenuNavLink>
			<div class="hover:bg-pri-lighter">
				<form method="post" action="api/logout">
					<button class="text-left block w-full px-4 py-2">Đăng xuất</button>
				</form>
			</div>
		</nav>
	{/if}
</div>

<script lang="ts">
	import type UserProfile from '$lib/types/UserProfile';
	import ButtonOutline from 'src/routes/_components/ButtonOutline.svelte';
	import WeShareIcon from '../../_components/WeShareIcon.svelte';
	import NavLink from './header/NavLink.svelte';
	import UserMenuButton from './header/UserMenuButton.svelte';

	export let userProfile: UserProfile | null;
</script>

<div class="fixed w-full">
	<header class="relative z-auto flex px-4 items-center border-b border-pri-base h-16 bg-paper">
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
				<div class="w-fit ml-auto">
					<ButtonOutline>
						<div class="">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1"
								stroke="currentColor"
								class="w-8 h-8 inline-block"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
								/>
							</svg>
							<a class="align-middle text-lg uppercase" href="/dang-nhap">Đăng nhập</a>
						</div>
					</ButtonOutline>
				</div>
			{/if}
		</div>
	</header>
</div>
<!-- Header's height -->
<div class="h-16" />

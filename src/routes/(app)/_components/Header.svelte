<script lang="ts">
	import { userProfile } from 'src/lib/stores/userProfile';
	import ButtonOutline from 'src/routes/_components/ButtonOutline.svelte';
	import WeShareIcon from '../../_components/WeShareIcon.svelte';
	import MobileNavigation from './header/MobileNavigation.svelte';
	import NavLink from './header/NavLink.svelte';
	import UserMenuButton from './header/UserMenuButton.svelte';
	import UserProfilePicture from './UserProfilePicture.svelte';
</script>

<div class="fixed w-full">
	<header class="relative z-auto flex px-4 items-center border-b border-pri-base h-16 bg-paper">
		<div class="flex-1">
			<a href="/" class="px-4 inline-flex items-center">
				<WeShareIcon />
				<span class="text-3xl tracking-[0.07em] text-pri-base">WeShare</span>
			</a>
		</div>

		<nav class="self-stretch hidden md:flex justify-center flex-1">
			<NavLink href="/hoi-dap">Hỏi đáp</NavLink>
			<NavLink href="/chia-se">Chia sẻ</NavLink>
			<NavLink href="/tim-nhom">Tìm nhóm</NavLink>
		</nav>

		<div class="hidden md:block flex-1">
			{#if $userProfile}
				<UserMenuButton userProfile={$userProfile} />
			{:else}
				<div class="w-fit ml-auto">
					<a href="/dang-nhap">
						<ButtonOutline>
							<div class="">
								<UserProfilePicture />
								<span class="align-middle text-lg uppercase">Đăng nhập</span>
							</div>
						</ButtonOutline>
					</a>
				</div>
			{/if}
		</div>

		<MobileNavigation />
	</header>
</div>
<!-- Header's height -->
<div class="h-16" />

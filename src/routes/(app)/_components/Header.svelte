<script lang="ts">
	import { userProfile } from 'src/lib/stores/userProfile';
	import ButtonOutline from 'src/routes/_components/buttons/ButtonOutline.svelte';
	import UserProfilePicture from '../../_components/UserProfilePicture.svelte';
	import WeShareIcon from '../../_components/WeShareIcon.svelte';
	import MobileNavigation from './header/MobileNavigation.svelte';
	import NavLink from './header/NavLink.svelte';
	import UserMenuButton from './header/UserMenuButton.svelte';
</script>

<div class="fixed w-full z-10">
	<header class="relative z-auto flex px-4 items-center border-b border-pri-base h-16 bg-paper">
		<div class="flex-1">
			<a href="/" class="px-4 inline-flex items-center">
				<div class="text-sec-base">
					<WeShareIcon />
				</div>
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
							<div class="inline-block w-8 h-8">
								<UserProfilePicture />
							</div>
							<span class="align-middle text-lg uppercase">Đăng nhập</span>
						</ButtonOutline>
					</a>
				</div>
			{/if}
		</div>

		<MobileNavigation />
	</header>
</div>

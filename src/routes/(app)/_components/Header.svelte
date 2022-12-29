<script lang="ts">
	import { navigating, page } from '$app/stores';
	import ButtonOutline from 'src/routes/_components/buttons/ButtonOutline.svelte';
	import { cubicIn, cubicOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	import { fade, type TransitionConfig } from 'svelte/transition';
	import UserProfilePicture from '../../_components/UserProfilePicture.svelte';
	import WeShareIcon from '../../_components/WeShareIcon.svelte';
	import MobileNavigation from './header/MobileNavigation.svelte';
	import NavLink from './header/NavLink.svelte';
	import UserMenuButton from './header/UserMenuButton.svelte';

	$: userProfile = $page.data.userProfile;
	const fast = tweened(1, {
		duration: 300,
		easing: cubicIn
	});

	function progress(node: HTMLElement): TransitionConfig {
		let setTweened = false;
		return {
			duration: 8000,
			tick: t => {
				if ($navigating) {
					let eased = cubicOut(t);
					node.style.width = `${eased * 90}%`;
					return;
				}

				if (!setTweened) {
					$fast = cubicOut(t);
					fast.set(1);
					setTweened = true;
				}

				node.style.width = `${$fast * 100}%`;
			}
		};
	}
</script>

<div class="fixed w-full z-10">
	<header
		class="relative z-auto flex px-4 justify-between items-center border-b border-pri-base h-16 bg-paper"
	>
		<div>
			<a href="/" class="px-4 inline-flex items-center">
				<div class="text-sec-base">
					<WeShareIcon />
				</div>
				<span class="text-3xl tracking-[0.07em] text-pri-base">WeShare</span>
			</a>
		</div>

		<nav class="self-stretch hidden md:flex justify-center">
			<NavLink href="/hoi-dap">Hỏi đáp</NavLink>
			<NavLink href="/chia-se">Chia sẻ</NavLink>
			<NavLink href="/tim-nhom">Tìm nhóm</NavLink>
		</nav>

		<div class="hidden md:block">
			{#if userProfile}
				<UserMenuButton {userProfile} />
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
	{#if $navigating}
		<div
			class="absolute z-10 bottom-0 border-t-2 border-sec-base bg-sec-base"
			in:progress
			out:fade
		/>
	{/if}
</div>

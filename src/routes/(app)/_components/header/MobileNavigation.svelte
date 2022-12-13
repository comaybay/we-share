<script lang="ts">
	import { page } from '$app/stores';
	import clickoutside from 'src/lib/actions/clickoutside';
	import { onMount } from 'svelte';
	import MobileNavLink from './MobileNavLink.svelte';

	$: userProfile = $page.data.userProfile;

	let active = false;
	let mounted = false;

	$: if (mounted) {
		if (active) {
			document.body.classList.add('overflow-hidden');
		} else {
			document.body.classList.remove('overflow-hidden');
		}
	}

	onMount(() => {
		mounted = true;
		return () => document.body.classList.remove('overflow-hidden');
	});

	function onClickOutside() {
		//close only when all other events are handled
		setTimeout(() => (active = false), 0);
	}
</script>

<div class="h-full md:hidden">
	<div class="relative h-full flex items-center">
		<button
			class="p-2 rounded-full hover:bg-pri-lighter {active ? 'bg-pri-lighter' : ''}"
			on:click={() => (active = !active)}
			use:clickoutside={onClickOutside}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-8 h-8"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
				/>
			</svg>
		</button>
	</div>

	{#if active}
		<div class="absolute -z-10 left-0 w-full h-screen bg-black opacity-30" />
		<div class="absolute -z-10 left-0 w-full bg-paper whitespace-nowrap shadow-xl">
			{#if userProfile}
				<MobileNavLink href="/nguoi-dung/{userProfile.username}">Trang cá nhân</MobileNavLink>
			{/if}
			<MobileNavLink href="/hoi-dap">Hỏi đáp</MobileNavLink>
			<MobileNavLink href="/chia-se">Chia sẻ</MobileNavLink>
			<MobileNavLink href="/tim-nhom">Tìm nhóm</MobileNavLink>
			{#if userProfile}
				<div class="hover:bg-pri-lighter ">
					<div class="mx-8 border-b border-pri-base" />
					<form method="post" action="api/logout">
						<button class="block w-full px-4 py-3 text-center text-2xl">Đăng xuất</button>
					</form>
				</div>
			{:else}
				<MobileNavLink href="/dang-nhap">Đăng nhập</MobileNavLink>
			{/if}
		</div>
	{/if}
</div>

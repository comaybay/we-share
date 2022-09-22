<script>
	import NavLink from './NavLink.svelte';
</script>

<header class="flex justify-between px-8 items-center border-b border-pri-base h-full">
	<a href="/" class="flex items-center">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="w-9 h-9 rotate-180 stroke-sec-base"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
			/>
		</svg>
		<span class="text-3xl tracking-[0.07em] text-pri-base">WeShare</span>
	</a>
	<nav class="flex self-stretch">
		<NavLink href="/hoi-dap">Hỏi đáp</NavLink>
		<NavLink href="/chia-se">Chia sẻ</NavLink>
		<NavLink href="/tim-nhom">Tìm nhóm</NavLink>
	</nav>

	<!-- TODO: display user info here -->
	<a href="/" class="flex items-center py-1">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1"
			stroke="currentColor"
			class="w-14 h-14"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
			/>
		</svg>
		<span>
			<p class="text-xl">Nguyen Van A</p>
			<p class="text-sm">@user_lain</p>
		</span>
	</a>
</header>

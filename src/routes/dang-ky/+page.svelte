<script lang="ts">
	import { enhance } from '$app/forms';
	import InputTextWithLabel from '../components/InputTextWithLabel.svelte';
	import WeShareLogoBig from '../components/WeShareLogoBig.svelte';

	let username = '';
	let password = '';
	let reenterPassword = '';
	let email = '';
	let profilename = '';
	let quote = '';
</script>

<div class="relative">
	<div class="absolute top-0 -z-10 h-full w-full flex flex-col space-y-12 justify-center">
		{#each new Array(7) as _}
			<div class="border-b-2 border-pri-light" />
		{/each}
	</div>
	<div class="absolute -z-10 h-full ml-20 border-r-2 border-sec-base" />
	<div class="w-full min-h-screen flex flex-wrap lg:space-x-20 justify-center items-center">
		<div class="self-start mt-10 md:mt-20 mx-4 lg:mx-0">
			<WeShareLogoBig />
		</div>
		<form
			use:enhance
			method="POST"
			class="shrink w-[29rem] h-fit my-6 px-8 pb-6 border border-pri-light rounded-sm bg-paper mx-2"
		>
			<h3 class="text-center text-3xl my-6">Đăng ký</h3>
			<div class="flex flex-col space-y-4">
				<InputTextWithLabel
					labelText="Tên tài khoản"
					name="username"
					bind:value={username}
					required
				/>
				<InputTextWithLabel
					labelText="Mật khẩu"
					name="password"
					type="password"
					bind:value={password}
					required
				/>
				<InputTextWithLabel
					labelText="Nhập lại mật khẩu"
					name="reenter-password"
					type="password"
					bind:value={reenterPassword}
					required
				/>
				<InputTextWithLabel
					labelText="Email"
					name="email"
					type="email"
					bind:value={email}
					required
				/>
				<InputTextWithLabel
					labelText="Tên hiển thị của bạn"
					name="profilename"
					bind:value={profilename}
				/>
				<InputTextWithLabel labelText="Danh ngôn của bạn" name="quote" bind:value={quote} />
			</div>
			<button
				class="mt-8 block ml-auto rounded-sm px-10 py-2 bg-sec-base text-pri-lighter font-medium"
			>
				Đăng ký</button
			>
		</form>
	</div>
</div>

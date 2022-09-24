<script>
	import { enhance } from '$app/forms';
	import InputWithLabel from '../components/InputWithLabel.svelte';
	import WeShareLogoBig from '../components/WeShareLogoBig.svelte';
</script>

<div class="absolute -z-10 h-full ml-20 border-r-2 border-sec-base" />
<div class="relative flex">
	<div class="absolute top-0 -z-10 mt-16 h-full w-full flex flex-col space-y-12 justify-center">
		{#each new Array(7) as _}
			<div class="border-b-2 border-pri-light" />
		{/each}
	</div>
	<div class="w-full flex space-x-20 justify-center mt-20">
		<WeShareLogoBig />
		<form
			use:enhance
			method="POST"
			class="w-[29rem] px-8 pb-6 border border-pri-light rounded-sm bg-paper"
		>
			<h3 class="text-center text-3xl my-6">Đăng ký</h3>
			<div class="flex flex-col space-y-4">
				<InputWithLabel labelText="Tên tài khoản" inputName="username" />
				<InputWithLabel labelText="Mật khẩu" inputName="password" />
				<InputWithLabel labelText="Email" inputName="username" />
				<InputWithLabel labelText="Họ và tên" inputName="username" />
				<InputWithLabel labelText="Danh ngôn của bạn" inputName="username" />
			</div>
			<button
				class="mt-8 block ml-auto rounded-sm px-10 py-1 bg-sec-base text-pri-lighter font-medium"
				>Đăng ký</button
			>
		</form>
	</div>
</div>

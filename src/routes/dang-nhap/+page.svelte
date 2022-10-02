<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '../_components/Button.svelte';
	import InputTextWithLabel from '../_components/InputTextWithLabel.svelte';
	import Link from '../_components/Link.svelte';
	import WeShareLogoBig from '../_components/WeShareLogoBig.svelte';
	import type { ActionData } from './$types';

	let usernameOrEmail = '';
	let password = '';

	export let form: ActionData | null;
</script>

<div class="absolute -z-10 h-full ml-20 border-r-2 border-sec-base" />
<div class="relative flex flex-col items-center">
	<div class="absolute top-0 -z-10 mt-24 h-full w-full flex flex-col space-y-12 justify-center">
		{#each new Array(6) as _}
			<div class="border-b-2 border-pri-light" />
		{/each}
	</div>
	<div class="mt-20">
		<WeShareLogoBig />
	</div>
	<div class="w-full flex space-x-20 justify-center mt-10">
		<form
			use:enhance
			method="POST"
			class="w-[29rem] px-8 pb-6 border border-pri-light rounded-sm bg-paper"
		>
			<h3 class="text-center text-3xl my-6">Đăng nhập</h3>
			<div class="flex flex-col space-y-4">
				<div>
					<InputTextWithLabel
						bind:value={usernameOrEmail}
						labelText="Tên tài khoản hoặc email"
						name="username-or-email"
						type="text"
						minlength={4}
						maxlength={254}
					/>
					{#if form?.usernameOrEmailMissing}
						<p class="text-sec-base">*Mục này là bắt buộc</p>
					{:else if form?.usernameOrEmailInvalid}
						<p class="text-sec-base">*Tên tài khoản hoặc email không hợp lệ</p>
					{:else if form?.usernameNotExist}
						<p class="text-sec-base">*Tên tài khoản không tồn tại</p>
					{/if}
				</div>

				<div>
					<InputTextWithLabel
						bind:value={password}
						labelText="Mật khẩu"
						name="password"
						type="password"
						minlength={6}
						maxlength={50}
					/>
					{#if form?.passwordMissing}
						<p class="text-sec-base">*Mục này là bắt buộc</p>
					{:else if form?.passwordInvalid}
						<p class="text-sec-base">*Mật khẩu không hợp lệ</p>
					{/if}
				</div>
			</div>

			<div class="mt-8 flex justify-end space-x-2">
				{#if form?.userFriendlyMessage}
					<p class="mr-auto font-semibold text-sec-base">*{form.userFriendlyMessage}</p>
				{/if}
				<div class="shrink-0 w-fit ml-auto">
					<Button><span class="mx-4">Đăng nhập</span></Button>
				</div>
			</div>

			<div class="mt-8 block w-fit mx-auto">
				<Link href="/dang-ky">Chưa có tài khoản? đăng ký!</Link>
			</div>
		</form>
	</div>
</div>

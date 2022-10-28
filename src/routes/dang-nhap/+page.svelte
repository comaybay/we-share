<script lang="ts">
	import { applyAction, enhance, type SubmitFunction } from '$app/forms';
	import Button from '../_components/Button.svelte';
	import InputTextWithLabel from '../_components/InputTextWithLabel.svelte';
	import Link from '../_components/Link.svelte';
	import WeShareLogoBig from '../_components/WeShareLogoBig.svelte';
	import type { ActionData } from './$types';

	export let form: ActionData | null;

	let usernameOrEmail = '';
	let password = '';
	let loading = false;

	const handleSubmit: SubmitFunction = () => {
		loading = true;

		if (form) {
			form.userFriendlyMessage = '';
		}

		return async ({ result }) => {
			await applyAction(result);

			if (result.type !== 'redirect') {
				loading = false;
			}
		};
	};
</script>

<div class="relative">
	<div class="absolute -z-10 pt-32 h-full w-full flex flex-col space-y-12 justify-center">
		{#each new Array(6) as _}
			<div class="border-b-2 border-pri-light" />
		{/each}
	</div>
	<div class="absolute -z-10 h-full ml-20 border-r-2 border-sec-base" />

	<div class="p-4 min-h-screen flex flex-col justify-center">
		<WeShareLogoBig />
		<div class="flex justify-center">
			<form
				use:enhance={handleSubmit}
				method="POST"
				class="shrink mt-10 w-[29rem] min-w-[22rem] px-8 pb-6 border border-pri-light rounded-sm bg-paper"
			>
				<h3 class="text-center text-3xl my-6">Đăng nhập</h3>
				<div class="flex flex-col space-y-4">
					<div>
						<InputTextWithLabel
							bind:value={usernameOrEmail}
							autocomplete="username"
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
							autocomplete="current-password"
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
						<Button {loading}><span class="mx-4">Đăng nhập</span></Button>
					</div>
				</div>

				<div class="mt-8 block w-fit mx-auto">
					<Link href="/dang-ky">Chưa có tài khoản? đăng ký!</Link>
				</div>
			</form>
		</div>
	</div>
</div>

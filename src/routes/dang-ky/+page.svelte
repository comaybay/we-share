<script lang="ts">
	import { applyAction, enhance, type SubmitFunction } from '$app/forms';
	import Button from '../_components/Button.svelte';
	import InputTextWithLabel from '../_components/InputTextWithLabel.svelte';
	import Link from '../_components/Link.svelte';
	import WeShareLogoBig from '../_components/WeShareLogoBig.svelte';
	import type { ActionData } from './$types';

	let loading = false;
	export let form: ActionData | null;

	const handleSubmit: SubmitFunction = () => {
		pressedOnce = true;
		loading = true;

		if (form) {
			form.userFriendlyMessage = '';
		}

		return async ({ result }) => {
			loading = false;
			await applyAction(result);
		};
	};

	let username = '';
	let password = '';
	let reenterPassword = '';
	let email = '';
	let profilename = '';
	let quote = '';

	let pressedOnce = false;
</script>

<div class="relative">
	<div
		class="absolute -z-10 h-full w-full flex flex-col pt-20 lg:pt-0 space-y-16 lg:space-y-12 justify-center"
	>
		{#each new Array(7) as _}
			<div class="border-b-2 border-pri-light" />
		{/each}
	</div>
	<div class="absolute -z-10 h-full ml-20 border-r-2 border-sec-base" />
	<div
		class="p-4 min-h-screen min-w-fit flex flex-col lg:flex-row lg:space-x-20 justify-center items-center"
	>
		<div class="m-4 lg:-translate-y-52">
			<WeShareLogoBig />
		</div>
		<form
			use:enhance={handleSubmit}
			method="POST"
			class="shrink w-[29rem] min-w-[22rem] h-fit px-8 pb-6 border border-pri-light rounded-sm bg-paper"
		>
			<h3 class="text-center text-3xl my-6">Đăng ký</h3>
			<div class="flex flex-col space-y-4">
				<div>
					<InputTextWithLabel
						labelText="Tên tài khoản"
						name="username"
						bind:value={username}
						required
						minlength={4}
						maxlength={15}
					/>
					{#if form?.usernameMissing}
						<p class="text-sec-base">*Mục này là bắt buộc</p>
					{:else if form?.userNameAlreadyExists}
						<p class="text-sec-base">*Tên tài khoản này đã tồn tại</p>
					{:else if form?.usernameInvalid}
						<p class="text-sec-base">
							*Tên tài khoản không hợp lệ (chỉ nhận ký tự không dấu hoặc số, không nhận dấu cách hay
							ký tự đặc biệt trừ dấu "_", trong khoảng 6-15 ký tự)
						</p>
					{/if}
				</div>

				<div>
					<InputTextWithLabel
						labelText="Mật khẩu"
						name="password"
						type="password"
						bind:value={password}
						required
						minlength={6}
						maxlength={50}
					/>
					{#if form?.passwordMissing}
						<p class="text-sec-base">*Mục này là bắt buộc</p>
					{/if}
					{#if form?.passwordInvalid}
						<p class="text-sec-base">
							*Mật khẩu không hợp lệ (không chứa ký tự đặc biệt, mật khẩu trong khoảng 6-50 ký tự)
						</p>
					{/if}
				</div>

				<div>
					<InputTextWithLabel
						labelText="Nhập lại mật khẩu"
						name="reenter-password"
						type="password"
						bind:value={reenterPassword}
						required
						minlength={6}
						maxlength={50}
					/>
					{#if password != reenterPassword && pressedOnce}
						<p class="text-sec-base">*Mật khẩu nhập lại không đúng</p>
					{/if}
				</div>

				<div>
					<InputTextWithLabel
						labelText="Email"
						name="email"
						type="email"
						bind:value={email}
						required
						minlength={5}
						maxlength={254}
					/>
					{#if form?.emailMissing}
						<p class="text-sec-base">*Mục này là bắt buộc</p>
					{:else if form?.emailInvalid}
						<p class="text-sec-base">*Email không hợp lệ</p>
					{/if}
				</div>

				<InputTextWithLabel
					labelText="Tên hiển thị của bạn"
					name="profilename"
					bind:value={profilename}
				/>

				<InputTextWithLabel labelText="Danh ngôn của bạn" name="quote" bind:value={quote} />
			</div>
			<div class="mt-8 flex justify-end space-x-2">
				{#if form?.userFriendlyMessage}
					<p class="mr-auto font-semibold text-sec-base">*{form.userFriendlyMessage}</p>
				{/if}
				<div class="shrink-0">
					<Button {loading}><span class="px-4">Đăng ký</span></Button>
				</div>
			</div>
			<div class="mt-8 w-fit mx-auto">
				<Link href="/dang-nhap">Đã có tài khoản? đăng nhập!</Link>
			</div>
		</form>
	</div>
</div>

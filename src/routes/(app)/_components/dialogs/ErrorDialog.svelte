<script lang="ts">
	import ButtonText from 'src/routes/_components/buttons/ButtonText.svelte';
	import { dialog } from '../dialogControl/dialogControl';
	import ErrorIcon from '../icons/ErrorIcon.svelte';

	export let message: string = 'Đã có lỗi xảy ra, vui lòng thử lại.';
	export let onOk: (e: MouseEvent) => void = dialog.close;
</script>

<div>
	<ErrorIcon className="mx-auto h-16 text-sec-base" />
	<span>{message}</span>

	<div class="border-t border-pri-light pt-2 mt-3 flex justify-end gap-2">
		<ButtonText on:click={onOk}><div class="h-full font-bold">Ok</div></ButtonText>
	</div>
</div>

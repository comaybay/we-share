<script lang="ts">
	import Button from 'src/routes/_components/buttons/Button.svelte';
	import ButtonText from 'src/routes/_components/buttons/ButtonText.svelte';
	import WarningIcon from '../icons/WarningIcon.svelte';

	export let message: string;
	export let onConfirm: (e: MouseEvent) => void;
	export let onCancel: (e: MouseEvent) => void;
</script>

<div>
	<WarningIcon className="mx-auto h-16 text-sec-base" />
	<span>{message}</span>

	<div class="border-t border-pri-light pt-2 mt-3 flex justify-end gap-2">
		<ButtonText on:click={onCancel}><div class="h-full font-bold">Hủy</div></ButtonText>
		<Button on:click={onConfirm}><span class="font-bold">Xóa</span></Button>
	</div>
</div>

<script lang="ts">
	import { page } from '$app/stores';
	import ButtonText from 'src/routes/_components/buttons/ButtonText.svelte';
	import { createEventDispatcher } from 'svelte';
	import { dialog } from '../../dialogControl/dialogControl';
	import DeleteDialog from '../../dialogs/DeleteDialog.svelte';
	import EditIcon from '../../icons/EditIcon.svelte';
	import TrashIcon from '../../icons/TrashIcon.svelte';

	const dispatch = createEventDispatcher();

	function showDeleteDialog() {
		dialog.setBody({
			component: DeleteDialog,
			props: {
				message: 'Bạn có chắc là muốn xóa bài viết này?',
				onCancel: () => dialog.close(),
				onConfirm: () => {
					dialog.close();
					dispatch('choosedelete');
				}
			}
		});
		dialog.open();
	}
</script>

<div>
	<a href="{$page.url.pathname}/chinh-sua">
		<ButtonText>
			<div class="flex items-center gap-1">
				<EditIcon />
				Chỉnh sửa
			</div>
		</ButtonText>
	</a>
	<ButtonText on:click={showDeleteDialog}>
		<div class="flex items-center gap-1">
			<TrashIcon />
			Xóa bài viết
		</div>
	</ButtonText>
</div>

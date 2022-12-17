<script lang="ts">
	import { POST_SHARING_MAX_LENGTH } from 'src/lib/constants';
	import EditPostForm from 'src/routes/(app)/_components/posts/forms/EditPostForm.svelte';
	import NewPostHeader from '../../../_components/posts/forms/NewPostHeader.svelte';
	import type { ActionData, PageData } from './$types';

	export let form: ActionData;
	export let data: PageData;

	const { content, id, title, topics } = data.post;
</script>

<NewPostHeader>Chỉnh sửa bài viết chia sẻ</NewPostHeader>

<div class="mx-auto px-8 max-w-6xl">
	<EditPostForm
		postId={id}
		{title}
		{content}
		{topics}
		formError={form}
		postContentMaxLength={POST_SHARING_MAX_LENGTH}
	/>
</div>

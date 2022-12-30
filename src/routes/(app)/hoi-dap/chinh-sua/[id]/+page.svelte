<script lang="ts">
	import { POST_SHARING_MAX_LENGTH } from 'src/lib/constants';
	import EditPostForm from 'src/routes/(app)/_components/posts/forms/EditPostForm.svelte';
	import Head from 'src/routes/_components/Head.svelte';
	import NewPostHeader from '../../../_components/posts/forms/NewPostHeader.svelte';
	import type { ActionData, PageData } from './$types';

	export let form: ActionData;
	export let data: PageData;

	const { content, id, title, topics } = data.post;
</script>

<Head title="Chỉnh sửa câu hỏi" noindex />

<NewPostHeader>Chỉnh sửa câu hỏi</NewPostHeader>

<div class="px-8">
	<div class="mx-auto max-w-3xl">
		<EditPostForm
			postId={id}
			{title}
			{content}
			{topics}
			formError={form}
			postContentMaxLength={POST_SHARING_MAX_LENGTH}
		/>
	</div>
</div>

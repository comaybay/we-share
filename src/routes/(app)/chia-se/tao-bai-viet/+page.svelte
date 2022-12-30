<script lang="ts">
	import { POST_SHARING_MAX_LENGTH } from 'src/lib/constants';
	import PostForm from 'src/routes/(app)/_components/posts/forms/NewPostForm.svelte';
	import NewPostHeader from '../../_components/posts/forms/NewPostHeader.svelte';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<NewPostHeader>Tạo bài viết chia sẻ</NewPostHeader>

<div class="px-8">
	<div class="mx-auto max-w-3xl">
		<PostForm formError={form} postContentMaxLength={POST_SHARING_MAX_LENGTH} />
	</div>
</div>

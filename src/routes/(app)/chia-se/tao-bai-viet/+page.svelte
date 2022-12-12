<script lang="ts">
	import { POST_SHARING_MAX_LENGTH } from 'src/lib/constants';
	import PostForm from 'src/routes/(app)/_components/newPost/PostForm.svelte';
	import NewPostHeader from '../../_components/newPost/NewPostHeader.svelte';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<NewPostHeader>Tạo bài viết chia sẻ</NewPostHeader>

<div class="mx-auto px-8 max-w-6xl">
	<PostForm postError={form} postContentMaxLength={POST_SHARING_MAX_LENGTH} />
</div>

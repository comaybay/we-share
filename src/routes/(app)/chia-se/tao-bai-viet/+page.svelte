<script lang="ts">
	import PostForm from 'src/routes/(app)/_components/newPost/PostForm.svelte';
	import NewPostHeader from '../../_components/newPost/NewPostHeader.svelte';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;
</script>

<NewPostHeader>Tạo bài viết chia sẻ</NewPostHeader>

<div class="mx-auto px-8 max-w-6xl">
	<PostForm postError={form} />
</div>

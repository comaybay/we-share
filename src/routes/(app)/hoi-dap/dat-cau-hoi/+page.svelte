<script lang="ts">
	import { POST_QUESTION_MAX_LENGTH } from 'src/lib/constants';
	import PostForm from 'src/routes/(app)/_components/posts/new/PostForm.svelte';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<h1 class="mx-auto mb-8 w-fit text-center text-sec-hover text-4xl">
	<span>Đặt câu hỏi</span>
	<div class="mt-2 border-b-2 border-sec-base -mx-6" />
</h1>

<div class="mx-auto px-8 max-w-6xl">
	<PostForm postError={form} postContentMaxLength={POST_QUESTION_MAX_LENGTH} />
</div>

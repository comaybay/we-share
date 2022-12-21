<script lang="ts">
	import { POST_QUESTION_MAX_LENGTH } from 'src/lib/constants';
	import PostForm from 'src/routes/(app)/_components/posts/forms/NewPostForm.svelte';
	import NewPostHeader from '../../_components/posts/forms/NewPostHeader.svelte';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<NewPostHeader>Đặt câu hỏi</NewPostHeader>

<div class="mx-auto px-8 max-w-6xl">
	<PostForm formError={form} postContentMaxLength={POST_QUESTION_MAX_LENGTH} />
</div>

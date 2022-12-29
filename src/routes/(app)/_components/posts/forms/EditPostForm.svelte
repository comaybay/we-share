<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { MAX_NUMBER_OF_TOPICS, MAX_TOPIC_LENGTH } from 'src/lib/constants';
	import type { PostFormError } from 'src/lib/types/PostFormError';
	import { userFriendlyMessage } from 'src/lib/userFriendlyMessage';
	import PostEditor from 'src/routes/(app)/_components/posts/forms/PostEditor.svelte';
	import { flip } from 'svelte/animate';
	import Button from '../../../../_components/buttons/Button.svelte';
	import InputTitle from './InputTitle.svelte';

	export let formError: PostFormError | null;
	export let postContentMaxLength: number;

	export let postId: number;
	export let title = '';
	export let content = '';
	export let topics: string[] = [];
	let textContent = '';

	let inputTopic = '';

	let submitting = false;

	$: tagLimitReached = topics.length >= MAX_NUMBER_OF_TOPICS;
	$: contentTooLong = textContent.length > postContentMaxLength;

	function addTopic() {
		const newTopic = inputTopic.trim();
		if (!newTopic) {
			return;
		}

		if (!topics.includes(newTopic)) {
			topics.push(newTopic);
			topics = topics;
		}

		inputTopic = '';
	}

	function removeTopic(index: number) {
		topics.splice(index, 1);
		topics = topics;
	}
</script>

<form
	method="post"
	use:enhance={({ data }) => {
		submitting = true;
		//add aditional values to the form data
		data.append('post-id', postId.toString());
		data.append('topics', JSON.stringify(topics));
		data.append('content', content);
		data.append('text-content', textContent);

		return async ({ result }) => {
			await applyAction(result);
			submitting = false;
		};
	}}
>
	<InputTitle {title} disabled={submitting} />
	{#if formError?.titleEmpty}
		<p class="text-sec-base">
			*{userFriendlyMessage.titleEmpty}
		</p>
	{/if}

	<div class="mt-4">
		<PostEditor
			placeholder="Nội dung"
			disabled={submitting}
			bind:text={textContent}
			bind:value={content}
		/>
	</div>

	<div class="mt-2">
		<span class:text-sec-base={contentTooLong}>
			{textContent.length} / {postContentMaxLength}
		</span>
		{#if contentTooLong}
			<span class={contentTooLong ? 'ml-2 text-sec-base font-bold' : ''}>
				Số lượng ký tự đã vượt quá giới hạn cho phép
			</span>
		{/if}
		{#if formError?.contentEmpty}
			<p class="text-sec-base">
				*{userFriendlyMessage.contentEmpty}
			</p>
		{/if}
	</div>

	<div class="mt-4 flex flex-wrap gap-2">
		{#if !tagLimitReached}
			<div
				class="topic-box flex items-center w-fit rounded-full border border-pri-light 
    hover:enabled:border-pri-base focus-within:border-tert-base hover:enabled:focus-within:border-tert-base"
			>
				<input
					minlength={3}
					maxlength={MAX_TOPIC_LENGTH}
					type="text"
					class="pl-4 pr-2 rounded-full w-32 border-none focus:outline-none resize-x"
					placeholder="Chủ đề"
					disabled={submitting}
					bind:value={inputTopic}
				/>

				<button
					disabled={submitting}
					type="button"
					on:click={addTopic}
					class="shrink-0 w-10 h-10 rounded-full text-pri-base hover:enabled:bg-pri-lighter disabled:text-pri-light"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="currentColor"
						class="h-full w-full p-3"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
					</svg>
				</button>
			</div>

			{#if topics.length > 0}
				<div class="mx-4 border-l border-tert-base" />
			{/if}
		{/if}

		{#each topics as topic, i (topic)}
			<div
				class="flex items-center rounded-full border border-pri-light bg-paper min-w-0"
				animate:flip={{ duration: 600 }}
			>
				<span class="pl-4 pr-2 truncate">{topic}</span>
				<button on:click={() => removeTopic(i)} class="w-10 h-10 rounded-full hover:bg-pri-lighter">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="currentColor"
						class="h-full w-full p-3"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
		{/each}
	</div>

	<div class="flex justify-between mt-4">
		<p class="text-sec-base font-semibold">
			{#if formError?.userFriendlyMessage}
				*{formError.userFriendlyMessage}
			{/if}
		</p>
		<Button loading={submitting} disabled={contentTooLong}><span class="px-12">Đăng</span></Button>
	</div>
</form>

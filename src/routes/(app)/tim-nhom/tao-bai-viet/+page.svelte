<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import {
		MAX_NUMBER_OF_TOPICS,
		POST_QUESTION_MAX_LENGTH,
		POST_TEAM_MAX_LENGTH,
		TOPIC_MAX_LENGTH
	} from 'src/lib/constants';
	import { userFriendlyMessage } from 'src/lib/userFriendlyMessage';
	import PostEditor from 'src/routes/(app)/_components/newPost/PostEditor.svelte';
	import { flip } from 'svelte/animate';
	import Button from '../../../_components/buttons/Button.svelte';
	import InputTitle from '../../_components/newPost/InputTitle.svelte';
	import NewPostHeader from '../../_components/newPost/NewPostHeader.svelte';
	import type { ActionData } from './$types';

	export let form: ActionData;

	$: postError = form;

	let courseCode = '';
	let title = '';
	let content = '';
	let textContent = '';

	let inputTopic = '';
	let neededSkills: string[] = [];

	let submitting = false;

	$: skillLimitReached = neededSkills.length >= MAX_NUMBER_OF_TOPICS;
	$: contentTooLong = textContent.length > POST_QUESTION_MAX_LENGTH;

	function addNeededSkills() {
		const newSkill = inputTopic.trim();
		if (!newSkill) {
			return;
		}

		if (!neededSkills.includes(newSkill)) {
			neededSkills.push(newSkill);
			neededSkills = neededSkills;
		}

		inputTopic = '';
	}

	function removeNeededSkill(index: number) {
		neededSkills.splice(index, 1);
		neededSkills = neededSkills;
	}
</script>

<NewPostHeader>Tạo bài viết tìm nhóm</NewPostHeader>

<div class="mx-auto px-8 max-w-6xl">
	<form
		method="post"
		use:enhance={({ data }) => {
			submitting = true;
			//add aditional values to the form data
			data.append('needed-skills', JSON.stringify(neededSkills));
			data.append('content', content);
			data.append('text-content', textContent);

			return async ({ result }) => {
				await applyAction(result);
				submitting = false;
			};
		}}
	>
		<input
			disabled={submitting}
			required
			name="course-code"
			minlength={1}
			maxlength={255}
			bind:value={courseCode}
			type="text"
			class="rounded-sm w-full"
			placeholder="Mã lớp"
		/>
		{#if postError?.courseCodeEmpty}
			<p class="text-sec-base">*Mã lớp không được để trống</p>
		{/if}

		<div class="mt-4">
			<InputTitle {title} disabled={submitting} />
			{#if postError?.titleEmpty}
				<p class="text-sec-base">
					*{userFriendlyMessage.titleEmpty}
				</p>
			{/if}
		</div>

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
				{textContent.length} / {POST_TEAM_MAX_LENGTH}
			</span>
			{#if contentTooLong}
				<span class={contentTooLong ? 'ml-2 text-sec-base font-bold' : ''}>
					Số lượng ký tự đã vượt quá giới hạn cho phép
				</span>
			{/if}
			{#if postError?.contentEmpty}
				<p class="text-sec-base">
					*{userFriendlyMessage.contentEmpty}
				</p>
			{/if}
		</div>

		<div class="mt-4 flex flex-wrap gap-2">
			{#if !skillLimitReached}
				<div
					class="topic-box flex items-center w-fit rounded-full border border-pri-light 
    hover:enabled:border-pri-base focus-within:border-tert-base hover:enabled:focus-within:border-tert-base"
				>
					<input
						minlength={3}
						maxlength={TOPIC_MAX_LENGTH}
						type="text"
						class="pl-4 pr-2 rounded-full w-36 border-none focus:outline-none resize-x"
						placeholder="Kỹ năng cần tìm"
						disabled={submitting}
						bind:value={inputTopic}
					/>

					<button
						disabled={submitting}
						type="button"
						on:click={addNeededSkills}
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

				{#if neededSkills.length > 0}
					<div class="mx-4 border-l border-tert-base" />
				{/if}
			{/if}

			{#each neededSkills as topic, i (topic)}
				<div
					class="flex items-center rounded-full border border-pri-light bg-paper min-w-0"
					animate:flip={{ duration: 600 }}
				>
					<span class="pl-4 pr-2 truncate">{topic}</span>
					<button
						on:click={() => removeNeededSkill(i)}
						class="w-10 h-10 rounded-full hover:bg-pri-lighter"
					>
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
				{#if postError?.userFriendlyMessage}
					*{postError.userFriendlyMessage}
				{/if}
			</p>
			<Button loading={submitting} disabled={contentTooLong}><span class="px-12">Đăng</span></Button
			>
		</div>
	</form>
</div>

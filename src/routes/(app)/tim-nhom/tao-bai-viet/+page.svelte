<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import {
		MAX_COURSE_CODE_LENGTH,
		MAX_NUMBER_OF_TOPICS,
		MAX_TEAM_SIZE,
		MAX_TOPIC_LENGTH,
		MIN_COURSE_CODE_LENGTH,
		MIN_TEAM_SIZE,
		MIN_TOPIC_LENGTH,
		POST_QUESTION_MAX_LENGTH,
		POST_TEAM_MAX_LENGTH
	} from 'src/lib/constants';
	import { userFriendlyMessage } from 'src/lib/userFriendlyMessage';
	import PostEditor from 'src/routes/(app)/_components/posts/forms/PostEditor.svelte';
	import { flip } from 'svelte/animate';
	import Button from '../../../_components/buttons/Button.svelte';
	import InputTitle from '../../_components/posts/forms/InputTitle.svelte';
	import NewPostHeader from '../../_components/posts/forms/NewPostHeader.svelte';
	import type { ActionData } from './$types';

	export let form: ActionData;

	$: postError = form;

	let courseCode = '';
	let title = '';
	let content = '';
	let textContent = '';
	let teamSize: number | null = null;

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
		<div class="flex gap-2">
			<div>
				<div class="flex items-center gap-1">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"
						/>
					</svg>
					<p><span class="text-sec-base">*</span>Mã lớp:</p>
				</div>
				<input
					disabled={submitting}
					required
					name="course-code"
					minlength={MIN_COURSE_CODE_LENGTH}
					maxlength={MAX_COURSE_CODE_LENGTH}
					bind:value={courseCode}
					type="text"
					class="mt-1 rounded-sm"
					placeholder="Mã lớp"
				/>
			</div>
			<div>
				<div class="flex items-center gap-1">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
						/>
					</svg>
					<p><span class="text-sec-base">*</span>Số lượng thành viên:</p>
				</div>
				<input
					disabled={submitting}
					required
					name="team-size"
					min={MIN_TEAM_SIZE}
					max={MAX_TEAM_SIZE}
					type="number"
					bind:value={teamSize}
					on:change={() => (teamSize = teamSize ? parseInt(teamSize.toString()) : null)}
					class="mt-1 rounded-sm w-full"
					placeholder="từ 2-100 thành viên"
				/>
			</div>
		</div>

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
						minlength={MIN_TOPIC_LENGTH}
						maxlength={MAX_TOPIC_LENGTH}
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

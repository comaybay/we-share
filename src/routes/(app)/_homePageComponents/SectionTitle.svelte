<script lang="ts">
	export let href: string;
</script>

<a {href}>
	<h3 class="group text-2xl hover:text-pri-hover">
		<slot name="first" />
		<span class="text-sec-base group-hover:text-current">-</span>
		<slot name="second" />
	</h3>
</a>

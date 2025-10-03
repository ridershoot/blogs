<template>
	<!-- 要加data-fancybox="gallery" 和 :data-caption="alt" 才能使用fancybox -->
	<img class="app-image" :src="src" :alt="alt" :data-caption="alt" data-fancybox="gallery" />
</template>
<script setup lang="ts">
	const { src, alt } = defineProps<{
		src: string;
		alt: string;
	}>();
</script>
<style scoped lang="scss">
	.app-image {
		width: 100%;
		margin-left: 0;
		margin-right: 0;
		cursor: pointer;
	}
</style>

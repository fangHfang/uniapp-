<template>
	<view class="page">
		<!-- 为了页面在浏览器里能直接看，就做了这个Index 转到list.nvue 页面-->
		<list />
	</view>
</template>

<script>
	import list from './list.nvue'
	export default {
		name: 'verification',
		components: {list},
		data() {
			return {
			}
		},
		onLoad() {},
		mounted() {
		},
		methods: {
			}
	}
</script>

<style lang="scss">
	.page{
		height:100vh;
		overflow: hidden;
	}
	
	
</style>

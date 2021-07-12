<template>
	<view class="page">
		<uni-nav-bar title="功能更新" left-icon="back" backgroundColor="#ed6d00" color="#fff" @clickLeft="toBack"></uni-nav-bar>
		<view class="function-content">{{content}}</view>
	</view>
</template>

<script>
	export default {
		name: 'updateDetail',
		components: {},
		data() {
			return {
				id:null,
				content:'更新了若干内容。'
			}
		},
		onLoad(option) {
			this.id=option.id
		},
		methods: {
			/**
			 * 返回上一级页面
			 */
			toBack(){
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>

<style lang="scss">
	.page{
		height: 100vh;
		background-color: #fff;
		.function-content{
			color: #1C1C1C;
			font-size: 13px;
			padding: 12px 10px;
		}
	}
</style>

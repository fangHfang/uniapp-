<template>
	<view class="page">
		<uni-nav-bar title="关于我们" left-icon="back" backgroundColor="#ed6d00" color="#fff" @clickLeft="toBack"></uni-nav-bar>
		<view class="logo-box flex a-center j-center">
			<image src="../../../../static/image/my/logo.png" mode="widthFix"></image>
		</view>
		<view class="edition flex a-center j-center">{{edition}}</view>
		<button type="primary" plain="true" class="btn flex a-center j-center" @click="update">功能更新</button>
	</view>
</template>

<script>
	export default {
		name: 'aboutUs',
		components: {},
		data() {
			return {
				edition:'V1.0.1'
			}
		},
		onLoad() {},
		methods: {
			/**
			 * 返回上一级页面
			 */
			toBack(){
				uni.navigateBack({
					delta: 1
				})
			},
			/**
			 * 点击查看功能更新列表页
			 */
			update(){
				uni.navigateTo({
					url:'./update-list/updateList'
				})
			}
		}
	}
</script>

<style lang="scss">
	.page{
		height: 100vh;
		background-color: #fff;
	}
	.logo-box{
		width: 100%;
		margin-top: 129px;
		margin-bottom: 30px;
		image{
			width: 176px;
		}
	}
	.edition{
		color: #1C1C1C;
		font-weight: bold;
		margin-bottom: 126px;
	}
	.btn{
		width: 130px;
		height: 45px;
		color: #ed6d00 !important;
		font-size: 20px;
		border: 1px solid #ed6d00 !important;
		border-radius: 3px !important;
	}
</style>

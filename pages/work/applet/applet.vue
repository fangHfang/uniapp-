<template>
	<view class="page">
		<uni-nav-bar fixed statusBar id="tab" title="车主小程序码" color="#fff" left-icon="back"
			@clickLeft="navBack"></uni-nav-bar>
		<view class="content-box">
			<image class="img" src="../../../static/image/work/anxinpao.png" mode="aspectFill"></image>
		</view>
		<button class="buttom-btn" @click="saveImgs">保存图片</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				systemInfo: uni.getSystemInfoSync()
			}
		},
		computed: {
			//安全区域
			safeArea() {
				return this.systemInfo.safeAreaInsets
			}
		},
		//路由传值
		onLoad(option) {},
		onUnload() {

		},
		mounted() {},
		methods: {
			/**
			 * 保存图片
			 */
			saveImgs(){
				uni.saveImageToPhotosAlbum({
					filePath: require('../../../static/image/work/anxinpao.png'),
					success(response) {
						console.log(response)
						uni.showToast({
							title: "保存成功",
							icon: "success"
						});
					},
					fail(err) {
						console.log(err)
						uni.showToast({
							title: "保存失败，请稍后重试",
							icon: "none"
						});
					}
				});

			},
			/**
			 * 返回上一页
			 */
			navBack() {
				uni.navigateBack({
					delta: 1
				});
			},
		}
	}
</script>
<style lang="scss" scoped>
	.page {
		background-color: #fff;
		min-height: 100vh;
	}
	.content-box{
		margin:80rpx 30rpx 120rpx;
		border-radius:20rpx;
		padding:20rpx;
		display: flex;
		justify-content: center;
		.img{
			width:70vw;
			height:70vw;
		}
	}
	.buttom-btn{
		width: calc(100% - 40rpx);
		height: 40px;
		line-height: 40px;
		text-align: center;
		border-radius: 20px;
		background-color: $uni-color-primary;
		color: #fff;
	}
</style>

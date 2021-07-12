<template>
	<view class="page">
		<uni-nav-bar fixed statusBar id="tab" title="轮胎上传图片范例" backgroundColor="#FD5022" color="#fff" left-icon="back"
			@clickLeft="navBack"></uni-nav-bar>
		<view class="content-box">
			<view class="content-card" v-for="(item,index) in imgList" :key="index" :class="item.mark">
				<view class="title">{{item.name}}</view>
				<view class="img-box">
					<image class="img" :src="item.img" mode="aspectFill" @click="preview(item.img)"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				systemInfo: uni.getSystemInfoSync(),
				imgList: [{
						name: '鼓包对应内里照',
						mark:'zleft',
						img: require('../../../../static/image/work/renew/tyre1.png')
					},
					{
						name: '胎侧鼓包位置照',
						mark:'zright',
						img: require('../../../../static/image/work/renew/tyre2.png')
					},
					{
						name: '鼓包轮胎规格照',
						mark:'zleft',
						img: require('../../../../static/image/work/renew/tyre3.png')
					},
					{
						name: '鼓包轮胎周期照',
						mark:'zright',
						img: require('../../../../static/image/work/renew/tyre4.png')
					},
					{
						name: '现场照',
						mark:'zleft last',
						img: require('../../../../static/image/work/renew/tyre5.png')
					},
					{
						name: '行驶证',
						mark:'zright last',
						img: require('../../../../static/image/work/renew/tyre6.png')
					}
				]
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
			 * 预览
			 * @param {Object} url
			 */
			preview(url) {
				if (url) {
					uni.previewImage({
						urls: [url]
					});
				}
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
		background-color: #f2f2f2;
		min-height: 100vh;
	}
	.content-box{
		margin:30rpx;
		background-color: #fff;
		border-radius:20rpx;
		padding:20rpx;
		display:flex;
		justify-content: space-between;
		align-items: flex-start;
		flex-wrap: wrap;
		.content-card{
			width:50%;
			overflow: hidden;
			padding-bottom:30rpx;
			margin-top:20rpx;
			border-bottom:1px solid #eee;
			&.zright{
				padding-left:5px;
				box-sizing: border-box;
			}
			&.last{
				border:none;
			}
			.title{
				font-size:30rpx;
				margin-bottom:15rpx;
			}
			.img-box{
				width:calc(50vw - 31px);
				height:26vw;
				border-radius: 16rpx;
				overflow: hidden;
				.img{
					width:calc(50vw - 31px);
					height:100%;
					border-radius:16rpx;
				}
			}
		}
	}
</style>

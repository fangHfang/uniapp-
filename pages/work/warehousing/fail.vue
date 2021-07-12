<template>
	<view class="page">
		<uni-nav-bar title="商品详情" left-icon="back" backgroundColor="#ed6d00" color="#fff" @clickLeft="toBack"></uni-nav-bar>
		<view class="img-box">
			<image class="img" src="../../../static/image/work/tiaoma.png" mode="aspectFit"></image>
		</view>
		<view class="describe">
			<text class="text">扫码无效</text>
			<text class="text">{{message}}</text>
		</view>
		<view class="fixed-buttom-box">
			<button class=" flex a-center j-center fixed-buttom-btn" :style="`border-radius:${systemInfo.windowWidth/2}px`"
			 @click="reScan">继续扫码</button>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'warehousingFail',
		components: {},
		data() {
			return {
				systemInfo: uni.getSystemInfoSync(),
				message: '',
				msgList: [{
						code: 1,
						content: '仅支持对玛吉斯商品扫码！'
					},
					{
						code: 2,
						content: '请在门店定位范围内操作！'
					},
					{
						code: 3,
						content: '请不要重复扫描！'
					},
					{
						code: 4,
						content: '条码未登记请联系经销商！'
					},
					{
						code: 5,
						content: '扫码门店和经销商不匹配！'
					}
				]
			}
		},
		onLoad(option) {
			// this.message=option.code
			this.message = this.msgList.find(x => x.code === 1).content
		},
		methods: {
			/**
			 * 重新扫码
			 */
			reScan(){
				
				// 如果直接返回到扫码页面，会卡死
				// uni.navigateBack({
				// 	delta: 1
				// })
				
				const obj = {
					name:'扫码入库',
					dec:'请对条码进行核销',
					api:'',
					rightIconUrl:'/pages/work/warehousing/list',
					confirmTo:'/pages/work/warehousing/detail',
					failTo:'/pages/work/warehousing/fail'
				}
				uni.navigateTo({
					url:`/pages/work/com/barcode?name=${obj.name}&dec=${obj.dec}&api=${obj.api}&&rightIconUrl=${obj.rightIconUrl}&confirmTo=${obj.confirmTo}&failTo=${obj.failTo}`
				})
			}
		}
	}
</script>

<style lang="scss">
	.page {
		min-height: 100vh;
		background-color: #F2F2F2;
	}

	.describe {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;

		.text {
			color: $uni-color-primary;
			font-size: $uni-font-size-base;
			margin-bottom: $uni-spacing-col-base;
		}
	}

	.img-box {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100vw;
		height: 300px;
		margin-top:50px;

		.img {
			width: 380rpx;
			height: 230rpx;
		}
	}
</style>

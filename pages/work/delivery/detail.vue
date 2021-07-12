<template>
	<view class="page">
		<uni-nav-bar fixed statusBar title="安心跑订单" left-icon="back" backgroundColor="#ed6d00" color="#fff" @clickLeft="toBack"></uni-nav-bar>
		<view class="order-box-view">
			<view class="text-primary">订单号：{{carInfo.warehouseOutNo}}</view>
			<view class="text-normal">开单人：{{carInfo.operatingName}}</view>
		</view>
		<view class="order-detail-box">
			<image class="eq-img" src="../../../static/image/work/anxinpao.png">
				<text class="text-gray">车主使用微信扫描此码可进入”车主小程序“</text>
		</view>

		<uni-section title="车辆信息"></uni-section>
		<uni-list class="list-box">
			<uni-list-item :border="false">
				<template slot="body">
					<view class="right-content" style="margin-left:0;">
						<view class="item">
							<text class="text-gray">车牌号：</text>
							<text class="text-normal">{{carInfo.carNumber}}</text>
						</view>
						<view class="item">
							<text class="text-gray">车架号：</text>
							<text class="text-normal">{{carInfo.carFrameNumber}}</text>
						</view>
						<view class="item">
							<text class="text-gray">车&nbsp;&nbsp;&nbsp;型：</text>
							<text class="text-normal">{{carInfo.carModel}}</text>
						</view>
						<view class="item">
							<text class="text-gray">车主手机号：</text>
							<text class="text-normal">{{carInfo.mobile}}</text>
						</view>
						<view class="item">
							<text class="text-gray">近2年所获安心跑：</text>
							<text class="text-normal">{{carInfo.recentCount || '--'}}次</text>
						</view>
					</view>
				</template>
			</uni-list-item>
		</uni-list>

		<uni-section title="商品信息" :subTitle="carInfo.totalQuantity>0 && `共（${carInfo.totalQuantity}）件`" subTitleColor="#ed6d00"></uni-section>
		<uni-list class="list-box">
			<uni-list-item :border="false" v-for="(item,index) in goodsInfo" :key="index">
				<template slot="body">
					<image class="image-box" :src="item.itemImageUrl"></image>
					<view class="right-content">
						<view class="item">
							<text class="text-gray">条码编码：</text>
							<text class="text-normal">{{item.itemBarCode}}</text>
						</view>
						<view class="item">
							<text class="text-gray">花纹规格：</text>
							<text class="text-normal">{{item.itemSpecDetail}}</text>
						</view>
						<view class="item">
							<text class="text-gray">周&nbsp;&nbsp;&nbsp;期：</text>
							<text class="text-normal">{{item.period}}</text>
						</view>
						<view class="item">
							<text class="text-gray">安心跑：</text>
							<text class="text-primary">{{['','可换新','审核中','已通过','未通过','已换新'][item.runAtEaseStatus]}}</text>
							<uni-icons v-if="item.runAtEaseStatus===4" class="tips-icon" type="info-filled" color="#ed6d00" size="18"></uni-icons>
						</view>
						<view class="item" v-if="item.runAtEaseStatus!==4">
							<text class="text-gray">安心跑服务编号：</text>
							<text class="text-normal">{{item.warehouseOutDetailNo}}</text>
						</view>
						<view class="item" v-if="item.runAtEaseStatus!==4">
							<text class="text-gray">安心跑有效期至：</text>
							<text class="text-normal">{{item.endTime}}</text>
						</view>
					</view>
				</template>
			</uni-list-item>
		</uni-list>
	</view>
</template>

<script>
	import order from '@/api/ease/order.js'
	export default {
		name: 'warehousingList',
		components: {},
		data() {
			return {
				systemInfo: uni.getSystemInfoSync(),
				// 车辆信息
				carInfo: {},
				// 商品信息
				goodsInfo: []
			}
		},
		//路由传值
		onLoad(option) {
			this.warehouseOutNo = option.warehouseOutNo || ''
			if (this.warehouseOutNo) {
				this.orderNoDetail(this.warehouseOutNo)
			}
		},
		methods: {
			/**
			 * 查询订单详情
			 */
			orderNoDetail(warehouseOutNo, mark) {
				let postData = {
					warehouseOutNo
				}
				uni.showLoading({
					title: '加载中···'
				})
				order.getEaseOrderDetail(postData).then((res) => {
					if (res.code === 200) {
						this.carInfo = res.data
						console.log(this.carInfo,'this.carInfo')
						this.goodsInfo = res.data.detailList || []
					} else {
						uni.showToast({
							icon: "none",
							title: res.msg
						})
					}
					uni.hideLoading()
				}).catch((err) => {
					uni.hideLoading()
					uni.showToast({
						icon: "none",
						title: err.msg
					})
				})
			},
			/**
			 * 返回上一级页面
			 */
			toBack() {
				uni.navigateBack({
					delta: 2
				})
			},
		}
	}
</script>

<style lang="scss">
	.page {
		height: calc(100vh - 20rpx;
		);
		padding-bottom: 20rpx;
		overflow-y: auto;
		background-color: #F2F2F2;
		position: absolute;
		z-index: 999;

		.row {
			flex-direction: row;

			.text-normal {
				font-size: 32rpx;
				width: 40%;
				text-align: center;
			}
		}
	}

	.text-primary {
		color: $uni-color-primary;
		font-size: 26rpx
	}

	.ellipsis-x {
		flex:0 0 50%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.ellipsis-y {
		flex:0 0 49%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.order-box-view{
		padding:20rpx;
	}
	.text-gray {
		color: $uni-text-color-grey;
		font-size: 26rpx
	}

	.text-normal {
		font-size: 26rpx;
		color: #333;
	}

	.order-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 10rpx 20rpx 10rpx;
		height: 50rpx;
	}

	.order-detail-box {
		width: calc(100vw - 40rpx);
		margin-left: 20rpx;
		padding-bottom: 20rpx;
		background-color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;

		.eq-img {
			width: 300rpx;
			height: calc(300rpx / 1.213);
			padding-bottom: 10rpx;
		}

		.text-gray {
			font-size: 24rpx
		}
	}

	.list-box {
		width: calc(100vw - 40rpx);
		margin-left: 20rpx;
		border-radius: 12rpx;
		overflow: hidden;

		.item {
			display: flex;
			margin-bottom: 15rpx;

			.tips-icon {
				margin-left: 10rpx;
			}

			.text-normal {
				max-width: calc(100% - 100rpx);
				font-size: 24rpx;
				word-break: break-all;
			}

			.text-gray {
				font-size: 24rpx
			}
		}

		.image-box {
			width: 150rpx;
			height: 150rpx;
			border-width: 1rpx;
			border-color: #eee;
			border-style: solid;
			border-radius: 12rpx;
			padding: 20rpx;
		}

		.right-content {
			flex: 1;
			margin-left: 20rpx;
		}
	}
</style>

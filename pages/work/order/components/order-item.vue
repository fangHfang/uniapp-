<template>
	<view class="order-list">
		<view :id="'order-item-' + item.warehouseOutNo + orderIndex" class="order-li" v-for="(item,orderIndex) in list" :key="'order-item-' +  item.warehouseOutNo + orderIndex">
			<view class="item-date">{{item.warehouseOutTime}}</view>
			<view class="item-bg">
				<view class="order-no-status flex j-space-between">
					<view class="order-no">订单编号：{{item.warehouseOutNo}}</view>
					<!-- 1-已激活,2-待审核,3-已拒绝-->
					<view class="order-status invalid" v-if="item.warehouseOutStatus === 0">暂存</view>
					<view class="order-status wait-receiving-goods" v-else-if="item.warehouseOutStatus === 2">待审核</view>
					<view class="order-status compulsory-receipt" v-else-if="item.warehouseOutStatus === 3">已拒绝</view>
					<view class="order-status done-receiving-goods" v-else-if="item.warehouseOutStatus === 1">已激活</view>
					<view class="order-status invalid" v-else-if="item.warehouseOutStatus === 4">已作废</view>
					<view class="order-status done" v-else-if="item.warehouseOutStatus === 5">已完成</view>
				</view>
				<!-- 车主信息 -->
				<view class="order-name-number flex a-center" @click="$emit('toDetail',item)">
					<view class="item-icon flex a-center j-center">
						<icon class="iconfont cheliang" type=""></icon>
					</view>
					<view class="item-vehicle">
						<view class="item-vehicle-num flex a-center">
							<view class="item-vehicle-name">车牌号:</view>
							<view class="order-name">{{item.carNumber}}</view>
						</view>
						<view class="item-vehicle-num flex a-center">
							<view class="item-vehicle-name">车主手机号:</view>
							<view class="order-name">{{item.mobile}}</view>
						</view>
						<view class="item-vehicle-num flex a-center">
							<view class="item-vehicle-name">车架号:</view>
							<view class="order-name">{{item.carFrameNumber}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderNo: '',
			}
		},
		props: {
			// 请求数据
			list: {
				type: Array,
				default () {
					return []
				}
			},
			// 当前tab的下标 (除了支付宝小程序必须在这里定义, 其他平台都可不用写, 因为已在MescrollMoreItemMixin定义)
			index: {
				type: Number,
				default () {
					return 0
				}
			},
		},
		mounted() {},
		methods: {}
	}
</script>
<style lang="scss" scoped>
	// 社区列表
	.order-list {
		padding-bottom: 20rpx;
		.order-li {
			display: flex;
			flex-direction: column;
			border-bottom: 1px solid #eee;
			position: relative;
			box-shadow: 0px 6rpx 26rpx 0px rgba(123, 71, 46, 0.05);
			// 订单日期
			.item-date {
				font-size: 26rpx;
				padding: 20rpx;
			}
			// 订单信息
			.item-bg {
				background: #fff;
				padding-bottom: 10rpx;
			}

			// 订单号，订单状态
			.order-no-status {
				padding: 20rpx;
				align-items: center;
				border-bottom: 1rpx solid #F2F2F2;

				// 订单号
				.order-no {
					font-size: 26rpx;
					font-weight: 600;
					display: block;
					white-space: nowrap;
					flex:0 0 calc(100% - 70px);
					overflow: hidden;
					text-overflow: ellipsis;
					align-items: center;
				}

				// 订单状态
				.order-status {
					width: 120rpx;
					height: 50rpx;
					color: #fff;
					font-size: 26rpx;
					font-weight: bold;
					border-radius: 5rpx;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}

			// 车主信息
			.order-name-number {
				width: calc(100% - 40rpx);
				padding: 40rpx 20rpx;

				.item-icon {
					width: 76rpx;
					height: 76rpx;
					color: #fff;
					background: #F35337;
					border-radius: 10rpx;
					margin-right: 20rpx;

					.iconfont {
						font-size: 50rpx;
					}
				}

				.item-vehicle {
					width: calc(100% - 96rpx);
				}

				.item-vehicle-name {
					width: 168rpx;
					color: #616161;
					font-size: 24rpx;
					font-weight: bold;
				}

				.item-vehicle-num {
					margin-bottom: 20rpx;
				}

				.item-vehicle-num:nth-last-of-type(1) {
					margin-bottom: 0;
				}

				// 订单名称
				.order-name {
					width: 80%;
					font-size: 24rpx;
					font-weight: bold;
					color: #252527;
					overflow: hidden;
					-webkit-line-clamp: 1;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-box-orient: vertical;
				}

				// 订单数量
				.order-number {
					font-size: 24rpx;
					font-weight: bold;
					color: #252527;
				}
			}
		}
	}
	// 待审核
	.wait-receiving-goods {
		background: #FFBA00 !important;
		border-color: #FFBA00 !important;
	}
	// 已作废
	.invalid {
		background: #BCBCBC !important;
		border-color: #BCBCBC !important;
	}
	// 已激活
	.done-receiving-goods {
		background: #00C82A !important;
	}
	// 已激活
	.done-receiving-goods {
		background: #00C82A !important;
	}
	// 已拒绝
	.compulsory-receipt {
		background: #E80000 !important;
	}
	// 已完成
	.done {
		background: #006DE8 !important;
	}
</style>

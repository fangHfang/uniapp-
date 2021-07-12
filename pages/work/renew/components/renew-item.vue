<template>
	<view>
		<view class="renew-list" v-if="status===99">
			<view :id="'renew-item-' + item.warehouseOutNo + renewIndex" class="renew-li" v-for="(item,renewIndex) in list" :key="'renew-item-' +  item.renewNo + renewIndex">
				<view class="item-date">{{item.warehouseOutTime}}</view>
				<view class="item-bg">
					<view class="renew-no-status flex j-space-between">
						<view class="renew-no">订单编号:&nbsp;{{item.warehouseOutNo}}</view>
						<!-- 0-可换新,1-审核中,2-未通过,3-已通过,4-已换新 -->
						<view class="renew-status wait-pay" @click="toCreate(item)">可换新</view>
					</view>
					<!-- 车主信息 -->
					<view class="renew-name-number flex a-center" @click="$emit('toDetail',item)">
						<view class="item-icon flex a-center j-center">
							<icon class="iconfont cheliang" type=""></icon>
						</view>
						<view class="item-vehicle">
							<view class="item-vehicle-num flex a-center">
								<view class="item-vehicle-name">车牌号:</view>
								<view class="renew-name">{{item.carNumber}}</view>
							</view>
							<view class="item-vehicle-num flex a-center">
								<view class="item-vehicle-name">车主手机号:</view>
								<view class="renew-name">{{item.mobile}}</view>
							</view>
							<view class="item-vehicle-num flex a-center">
								<view class="item-vehicle-name">车架号:</view>
								<view class="renew-name">{{item.carFrameNumber}}</view>
							</view>
						</view>
					</view>
					<!-- 订单详情 -->
					<view class="item-detail" v-for="(detailItem,detailIndex) in item.detailList" :key="detailIndex">
						<view class="item-vehicle">
							<view class="item-vehicle-num flex a-center">
								<view class="item-vehicle-name">规格明细:</view>
								<view class="renew-num">{{detailItem.itemSpecDetail}}</view>
							</view>
							<view class="item-vehicle-num flex a-center">
								<view class="item-vehicle-name">条码:</view>
								<view class="renew-num">{{detailItem.itemBarCode}}</view>
							</view>
							<view class="item-vehicle-num flex a-center">
								<view class="item-vehicle-name">周期:</view>
								<view class="renew-num">{{detailItem.period}}</view>
							</view>
						</view>
						<view class="detail-state flex j-end">
							<!-- 1-可换新,2-审核中,4-未通过,3-已通过,5-已换新 -->
							<view class="renew-status wait-receiving-goods" v-if="detailItem.runAtEaseStatus === 2">待审核</view>
							<view class="renew-status compulsory-receipt" v-else-if="detailItem.runAtEaseStatus === 4">未通过</view>
							<view class="renew-status wait-pay" v-else-if="detailItem.runAtEaseStatus === 1">可换新</view>
							<view class="renew-status done-receiving-goods" v-else-if="detailItem.runAtEaseStatus === 3">已通过</view>
							<view class="renew-status renewed" v-else-if="detailItem.runAtEaseStatus === 5">已换新</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="renew-list" v-else>
			<view :id="'renew-item-' + item.renewNo + renewIndex" class="renew-li" v-for="(item,renewIndex) in list" :key="'renew-item-' +  item.renewNo + renewIndex">
				<view class="item-date">{{item.renewTime}}</view>
				<view class="item-bg">
					<view class="renew-no-status flex j-space-between">
						<view class="renew-no">订单编号:&nbsp;{{item.renewNo}}</view>
						<view class="renew-status compulsory-receipt" @click="toReapplyRenew(item)" v-if="item.renewStatus === 1">未通过</view>
						<view class="renew-status wait-receiving-goods" v-else-if="item.renewStatus === 0">待审核</view>
						<view class="renew-status done-receiving-goods" v-else-if="item.renewStatus === 2">已通过</view>
						<view class="renew-status renewed" v-else-if="item.renewStatus === 3">已换新</view>
					</view>
					<!-- 车主信息 -->
					<view class="renew-name-number flex a-center" @click="$emit('toDetail',item)">
						<view class="item-icon flex a-center j-center">
							<icon class="iconfont cheliang" type=""></icon>
						</view>
						<view class="item-vehicle">
							<view class="item-vehicle-num flex a-center">
								<view class="item-vehicle-name">车牌号:</view>
								<view class="renew-name">{{item.vehicleOwnerCarNumber}}</view>
							</view>
							<view class="item-vehicle-num flex a-center">
								<view class="item-vehicle-name">车主手机号:</view>
								<view class="renew-name">{{item.vehicleOwnerMobile}}</view>
							</view>
							<view class="item-vehicle-num flex a-center">
								<view class="item-vehicle-name">车架号:</view>
								<view class="renew-name">{{item.vehicleOwnerCarFrameNumber}}</view>
							</view>
						</view>
					</view>
					<!-- 订单详情 -->
					<view class="item-detail" v-for="(detailItem,detailIndex) in item.renewDetailList" :key="detailIndex">
						<view class="item-vehicle">
							<view class="item-vehicle-num flex a-center">
								<view class="item-vehicle-name">规格明细:</view>
								<view class="renew-num">{{detailItem.itemSpecDetail}}</view>
							</view>
							<view class="item-vehicle-num flex a-center">
								<view class="item-vehicle-name">条码:</view>
								<view class="renew-num">{{detailItem.itemBarCode}}</view>
							</view>
							<view class="item-vehicle-num flex a-center">
								<view class="item-vehicle-name">周期:</view>
								<view class="renew-num">{{detailItem.period}}</view>
							</view>
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
				renewNo: '',
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
			//可换新调用安心跑订单
			status:{
				type: Number,
				default () {
					return 99
				}
			}
		},
		mounted() {},
		methods: {
			/**
			 * 填写安心跑资料
			 */
			toCreate(item){
				uni.navigateTo({
					url: "/pages/work/renew/run-ease/renew-ease?mark=apply&warehouseOutNo=" + item.warehouseOutNo
				})
			},
			/**
			 * 重新申请安心跑资料
			 */
			toReapplyRenew(item){
				uni.navigateTo({
					url: "/pages/work/renew/run-ease/renew-ease?mark=reapply&renewNo=" + item.renewNo
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	// 社区列表
	.renew-list {
		padding-bottom: 20rpx;
		.renew-li {
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
			.renew-no-status {
				padding: 20rpx;
				align-items: center;
				border-bottom: 1px solid #F2F2F2;

				// 订单号
				.renew-no {
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
				.renew-status {
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
			.renew-name-number {
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
				}

				.item-vehicle-num {
					margin-bottom: 20rpx;
				}

				.item-vehicle-num:nth-last-of-type(1) {
					margin-bottom: 0;
				}

				// 订单名称
				.renew-name {
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
				.renew-number {
					font-size: 24rpx;
					font-weight: bold;
					color: #252527;
				}
			}
			// 订单详情
			.item-detail {
				padding: 34rpx 70rpx;
				margin: 0 30rpx 20rpx;
				border-radius: 20rpx;
				background: #F2F2F2;
				border: 1px solid #E5E5E5;
				position: relative;

				.item-vehicle-num {
					margin-bottom: 20rpx;
				}

				.item-vehicle-num:nth-last-of-type(1) {
					margin-bottom: 0;
				}

				.item-vehicle-name {
					width: 168rpx;
					font-weight: bold;
					font-size: 26rpx;
				}

				.renew-num {
					color: #616161;
					max-width:72%;
					word-break: break-all;
					font-size: 26rpx;
				}
				.detail-state {
					position: absolute;
					top: 12rpx;
					right: 12rpx;
				
					.renew-status {
						width: 92rpx;
						height: 40rpx;
						color: #fff;
						font-size: 24rpx;
						border-radius: 5rpx;
						display: flex;
						align-items: center;
						justify-content: center;
					}
				}
			}
		}
	}
	// 可换新
	.wait-pay {
		background: #ed6d00 !important;
		border-color: #ed6d00 !important;
	}
	// 待审核
	.wait-receiving-goods {
		background: #FFBA00 !important;
		border-color: #FFBA00 !important;
	}
	// 已换新
	.renewed {
		background: #006DE8 !important;
		border-color: #006DE8 !important;
	}
	// 已通过
	.done-receiving-goods {
		background: #00C82A !important;
	}
	// 未通过
	.compulsory-receipt {
		background: #E80000 !important;
	}
</style>

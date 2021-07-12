<template>
	<view class="page">
		<uni-nav-bar id="navbar" title="订单详情" backgroundColor="#ed6d00" color="#fff" left-icon="back"
			@clickLeft="navBack"></uni-nav-bar>
		<mescroll-uni ref="mescrollRef" @init="mescrollInit" class="mescroll-uni" :top="pageOptions.mescrollTop"
			:bottom="pageOptions.mescrollBottom" :up="upOption" safearea @down="downCallback">
			<!-- 订单信息 -->
			<view class="item-title">订单信息</view>
			<view class="item-bg">
				<view class="order-no-status flex j-space-between">
					<view class="order-no">订单编号：{{detailData.warehouseOutNo}}</view>
					<view class="order-status invalid" v-if="detailData.warehouseOutStatus === 0">安心跑暂存</view>
					<view class="order-status done-receiving-goods" v-else-if="detailData.warehouseOutStatus === 1">
						安心跑已激活</view>
					<view class="order-status wait-receiving-goods" v-else-if="detailData.warehouseOutStatus === 2">
						安心跑待审核</view>
					<view class="order-status compulsory-receipt" v-else-if="detailData.warehouseOutStatus === 3">安心跑已拒绝
					</view>
					<view class="order-status invalid" v-else-if="detailData.warehouseOutStatus === 4">安心跑已作废</view>
					<view class="order-status done" v-else-if="detailData.warehouseOutStatus === 5">安心跑已完成</view>
				</view>
				<view class="order-name-number flex a-center">
					<view class="item-icon flex a-center j-center">
						<icon class="iconfont dingdan" type=""></icon>
					</view>
					<view class="item-vehicle">
						<view class="item-vehicle-num flex a-center">
							<view class="item-vehicle-name">车主手机号:</view>
							<view class="order-name">{{detailData.mobile}}</view>
						</view>
						<view class="item-vehicle-num flex a-center">
							<view class="item-vehicle-name">下单时间:</view>
							<view class="order-name">{{detailData.warehouseOutTime}}</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 车辆信息 -->
			<view class="item-title">车辆信息</view>
			<view class="item-bg">
				<view class="order-no-status flex j-space-between">
					<view class="order-no">车牌号:&nbsp;{{detailData.carNumber}}</view>
				</view>
				<view class="order-name-number flex a-center">
					<view class="item-icon flex a-center j-center">
						<icon class="iconfont cheliang" type=""></icon>
					</view>
					<view class="item-vehicle">
						<view class="item-vehicle-num flex a-center">
							<view class="item-vehicle-name">车架号:</view>
							<view class="order-name">{{detailData.carFrameNumber}}</view>
						</view>
						<view class="item-vehicle-num flex a-center">
							<view class="item-vehicle-name">车型:</view>
							<view class="order-name">{{detailData.carModel}}</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 订单明细 -->
			<view style="overflow: hidden;">
				<view class="item-title">订单明细</view>
				<view class="item-bg" style="padding: 30rpx;margin-bottom:10px;" v-for="(x,y) in detailData.detailList"
					:key="y">
					<view class="item-detail">
						<view class="item-vehicle">
							<view class="item-vehicle-num flex a-center">
								<view class="item-vehicle-name">规格明细:</view>
								<view class="order-num">{{x.itemSpecDetail}}</view>
							</view>
							<view class="item-vehicle-num flex a-center">
								<view class="item-vehicle-name">条码:</view>
								<view class="order-num">{{x.itemBarCode}}</view>
							</view>
							<view class="item-vehicle-num flex a-center">
								<view class="item-vehicle-name">周期:</view>
								<view class="order-num">{{x.period}}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</mescroll-uni>
		<view v-if="detailData.warehouseOutStatus <3 && invalidShow" class="page-bottom" id="bottomBox"
			@click="confirm">
			<view class="buttom-btn">作废订单</view>
			<view class="buttom-tag flex a-center j-center">提示：请仔细核对订单，安心跑订单只能当天作废，次日订单不予作废。</view>
		</view>
		<view v-else-if="detailData.warehouseOutStatus === 3" id="bottomBox" class="page-bottom flex a-center"
			@click="toRunEase">
			<view class="buttom-btn">重新申请</view>
		</view>

		<uni-popup ref="dialogInvalidPopup" type="dialog">
			<uni-popup-dialog confirmText="是" closeText="否" mode="base" title="" content="该订单是否需要作废？" :duration="2000"
				:before-close="true" @close="closeInvalid" @confirm="confirmInvalid"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import order from '@/api/ease/order.js'
	export default {
		data() {
			return {
				systemInfo: uni.getSystemInfoSync(),
				// 0-可换新,1-审核中,2-未通过,3-已通过,4-已换新
				order: {
					status: 2
				},
				invalidShow: false,
				searchData: {
					orderNo: '',
				},
				detailData: {},
				upOption: {
					use: false,
					empty: {
						use: false
					}
				},
				// 下拉刷新组件实例
				mescroll: null,
				// 页面配置
				pageOptions: {
					// 适配刘海屏
					mescrollTop: 40,
					mescrollBottom: 70,
				},
			}
		},
		computed: {
			//安全区域
			safeArea() {
				return this.systemInfo.safeAreaInsets
			}
		},
		//路由传值
		onLoad(option) {
			const {
				orderNo
			} = option;
			this.searchData.orderNo = orderNo;
		},
		onUnload() {

		},
		mounted() {
			this.countTopBar()
		},
		methods: {
			/**
			 * 返回上一页
			 */
			navBack() {
				uni.navigateBack({
					delta: 1
				});
			},
			closeInvalid(done) {
				done()
			},
			confirmInvalid(done) {
				let postData = {
					warehouseOutNo: this.searchData.orderNo
				}
				order.invalidEaseOrder(postData).then((res) => {
					if (res.code === 200) {
						uni.showToast({
							icon: "success",
							title: res.msg
						})
						done()
						setTimeout(() => {
							uni.redirectTo({
								url: '/pages/work/order/list/order-list'
							})
						}, 800)
					} else {
						uni.showToast({
							icon: "none",
							title: res.msg
						})
					}
				}).catch((err) => {
					uni.showToast({
						icon: "none",
						title: err.msg
					})
				})
			},
			/**
			 * 作废订单
			 */
			confirm() {
				this.$refs.dialogInvalidPopup.open();
			},
			/**
			 * 计算顶部DOM元素节点
			 */
			async countTopBar() {
				const searchBarHeight = await this.$getComponentsDom('#navbar');
				const bottomBox = await this.$getComponentsDom('#bottomBox');
				this.pageOptions.mescrollTop = searchBarHeight.height + 'px'
				this.pageOptions.mescrollBottom = bottomBox && bottomBox.height + 'px'
			},
			/**
			 * 分页查询订单详情
			 */
			orderNoDetail() {
				let postData = {
					warehouseOutNo: this.searchData.orderNo
				}
				uni.showLoading({
					title: '加载中···'
				})
				order.getEaseOrderDetail(postData).then((res) => {
					if (res.code === 200) {
						this.detailData = res.data
						let curDay = (new Date()).getDate()
						let detailDay = (res.data.warehouseOutTime || '').substring(8, 10)
						if (curDay === parseInt(detailDay)) {
							this.invalidShow = true
						} else {
							this.invalidShow = false
						}
						//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
						setTimeout(() => {
							this.mescroll.endSuccess();
						}, 300)
					} else {
						uni.showToast({
							icon: "none",
							title: res.msg
						})
					}
					setTimeout(() => {
						this.countTopBar()
					}, 100)
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
			 * 下拉刷新回调
			 */
			async downCallback() {
				// 先触发查询
				this.orderNoDetail()
			},
			/**
			 * 重新申请啊
			 */
			toRunEase() {
				uni.navigateTo({
					url: "/pages/work/delivery/index?warehouseOutNo=" + this.searchData.orderNo + '&mark=reapply'
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	.page {
		background-color: #f2f2f2;
		height: 100vh;
	}

	.mescroll-uni {
		height: calc(100% - 88rpx - 2rpx - var(--status-bar-height));
	}

	.item-title {
		color: #333;
		font-size: 26rpx;
		padding: 20rpx;
	}

	// 订单信息
	.item-bg {
		background: #fff;
		// padding-bottom: 10rpx;
	}

	// 订单号，订单状态
	.order-no-status {
		padding: 20rpx 0;
		border-bottom: 1px solid #F2F2F2;
		align-items: center;

		// 订单号
		.order-no {
			padding-left: 20rpx;
			font-size: 26rpx;
			font-weight: 600;
			// color: #666666;
			display: block;
			box-sizing: border-box;
			white-space: nowrap;
			flex: 0 0 calc(100% - 110px);
			overflow: hidden;
			text-overflow: ellipsis;
			align-items: center;
		}

		// 订单状态
		.order-status {
			width: 200rpx;
			height: 50rpx;
			color: #fff;
			font-size: 26rpx;
			font-weight: 400;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 25rpx 0 0 25rpx;
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

	// 订单详情
	.item-detail {
		padding: 30rpx 60rpx;
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
			flex: 0 0 168rpx;
			font-weight: bold;
			font-size: 26rpx;
		}

		.order-num {
			color: #616161;
			word-break: break-all;
			font-size: 26rpx;
		}

		.detail-state {
			position: absolute;
			top: 12rpx;
			right: 12rpx;

			.order-status {
				width: 92rpx;
				height: 40rpx;
				color: #fff;
				font-weight: 400;
				font-size: 24rpx;
				border-radius: 5rpx;
				display: flex;
				align-items: center;
				justify-content: center;
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

	// 已拒绝
	.compulsory-receipt {
		background: #E80000 !important;
	}

	// 底部按钮
	.page-bottom {
		width: 100%;
		position: fixed;
		bottom: 0;
		padding: 10px 10px calc(20rpx + constant(safe-area-inset-bottom) / 2);
		padding: 10px 10px calc(20rpx + env(safe-area-inset-bottom) / 2);
		background-color: #f2f2f2;
		z-index: 9;
		font-size: $uni-font-size-base;
	}

	.buttom-btn {
		width: calc(100% - 40rpx);
		height: 40px;
		line-height: 40px;
		text-align: center;
		border-radius: 20px;
		background-color: $uni-color-primary;
		color: #fff;
	}

	.buttom-tag {
		width: calc(100% - 40rpx);
		height: 80rpx;
		color: #A6A6A6;
		font-size: 26rpx;
	}
</style>

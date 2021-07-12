<template>
	<view class="page">
		<uni-nav-bar id="tab" title="换新申请详情" backgroundColor="#ed6d00" color="#fff" left-icon="back" @clickLeft="navBack"></uni-nav-bar>
		<scroll-view class="scroll-view" scroll-y="true" :style="`height:${swiperHeight}`">
			<!-- 进度条 -->
			<view class="renew-steps">
				<uni-steps :options="stepsList" :active="activeIndex" :activeArr="activeArr" active-color=""></uni-steps>
			</view>
			<view class="renew-box">
				<!-- 审核状态 -->
				<view v-if="[0,3,4].includes(detailData.renewFlow)" class="renew-content renew-state flex a-center">
					<icon class="iconfont zhifuchenggong" type=""></icon>
					<text>等待审核</text>
				</view>
				<view v-if="detailData.renewFlow===2" class="renew-content renew-state flex a-center j-space-between">
					<view class="flex a-center">
						<uni-icons type="clear" style="color: #CE0000;" size="32"></uni-icons>
						<view class="mgl10">
							<view style="color: #666;">审批意见</view>
							<view>驳回</view>
						</view>
					</view>
					<text>图片不清晰</text>
				</view>
				<view v-if="[1,5,6].includes(detailData.renewFlow)" class="renew-content renew-state flex a-center">
					<uni-icons type="checkbox-filled" style="color: #00C82A;" size="32"></uni-icons>
					<view class="mgl10">
						<view style="color: #666;">审批意见</view>
						<view>同意</view>
					</view>
				</view>
				<!-- 订单信息 -->
				<view class="renew-content renew-order">
					<view class="renew-no-status flex j-space-between">
						<view class="renew-no">订单信息</view>
					</view>
					<view class="renew-name-number flex a-center j-space-between">
						<view class="item-vehicle">
							<view class="item-vehicle-num flex a-center">
								<view class="item-vehicle-name">门店名称</view>
								<view class="renew-name">{{detailData.storeName}}</view>
							</view>
							<view class="item-vehicle-num flex a-center">
								<view class="item-vehicle-name">关联订单</view>
								<view class="renew-name">{{detailData.warehouseOutNo}}</view>
							</view>
						</view>
						<view class="renew-icon flex a-center j-end">
							<icon class="iconfont right" type=""></icon>
						</view>
					</view>
					<view class="item-detail" v-for="(detailItem,detailIndex) in detailData.renewDetailList" :key="detailIndex">
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
				<!-- 服务单信息 -->
				<view class="renew-content renew-service">
					<view class="renew-no-status flex j-space-between">
						<view class="renew-no">服务单信息</view>
					</view>
					<view class="renew-name-number flex a-center j-space-between">
						<view class="item-vehicle">
							<view class="item-vehicle-num flex a-center">
								<view class="item-vehicle-name">理赔编号</view>
								<view class="renew-name">{{detailData.claimNo}}</view>
							</view>
							<view class="item-vehicle-num flex a-center">
								<view class="item-vehicle-name">申请时间</view>
								<view class="renew-name">{{detailData.renewTime}}</view>
							</view>
							<view class="item-vehicle-num flex a-center">
								<view class="item-vehicle-name">换新类型</view>
								<view class="renew-name">{{detailData.renewDescribe}}</view>
							</view>
						</view>
					</view>
				</view>
				<view v-if="[0,2].includes(detailData.renewStatus)" class="renew-title">扫码添加换新轮胎</view>
				<!-- 更换的商品信息 -->
				<view class="renew-content product-info" v-if="[0,2,3].includes(detailData.renewStatus) && renewOutInfoList.length>0">
					<view class="renew-no-status flex j-space-between">
						<view class="renew-no">更换的商品信息</view>
					</view>
					<view class="item-detail" v-for="(renew,i) in renewOutInfoList" :key="i">
						<view class="item-vehicle">
							<uni-swipe-action>
								<uni-swipe-action-item>
									<view class="flex a-center flex-column" style="padding: 34rpx 80rpx;">
										<view class="item-vehicle-num flex a-center">
											<view class="item-vehicle-name">规格明细:</view>
											<view class="renew-num">{{renew.itemSpecDetail}}</view>
										</view>
										<view class="item-vehicle-num flex a-center">
											<view class="item-vehicle-name">条码:</view>
											<view class="renew-num">{{renew.itemBarCode}}</view>
										</view>
										<view class="item-vehicle-num flex a-center">
											<view class="item-vehicle-name">周期:</view>
											<view class="renew-num">{{renew.period}}</view>
										</view>
									</view>
									<template v-slot:right>
										<view class="del flex a-center j-center" @click="removeNew(renew)"><text>删除</text></view>
									</template>
								</uni-swipe-action-item>
							</uni-swipe-action>

						</view>
					</view>
				</view>
				<view v-if="[0,2].includes(detailData.renewStatus)" class="renew-content scanCode flex a-center j-center flex-column">
					<view class="scan-text">扫码添加轮胎</view>
					<button class="scan-btn flex a-center j-center" type="default" @click="navToCode">
						<uni-icons type="scan"></uni-icons>
						扫码出库
					</button>
				</view>
			</view>
		</scroll-view>
		<view class="page-bottom" v-if="[0,2].includes(detailData.renewStatus)" id="pageBottom">
			<view class="buttom-btn" @click="confirm">确认提交</view>
			<view class="buttom-tag flex a-center j-center" @click="isChecked = !isChecked">
				<uni-icons :class="isChecked ? 'selected' : 'check-box'" :type="isChecked ? 'circle-filled' : 'circle'"></uni-icons>
				确认旧胎已回收并在旧胎上已标出故障位置及理赔编号
			</view>
		</view>
	</view>
</template>

<script>
	import renew from '@/api/ease/renew.js'
	export default {
		data() {
			return {
				systemInfo: uni.getSystemInfoSync(),
				searchData: {
					renewNo: "",
					renewStatus: "",
				},
				detailData: {},
				// 进度条内容
				stepsList: [],
				// 进度条步骤
				activeIndex: 0,
				activeArr: [],
				// 是否勾选回收旧胎
				isChecked: false,
				// 审批意见是否同意
				isAgree: false,
				// 可滚动区域高度
				swiperHeight: '100%',
			}
		},
		computed: {
			//安全区域
			safeArea() {
				return this.systemInfo.safeAreaInsets
			},
			renewOutInfoList() {
				return this.$store.state.work.renewOutInfoList
			},
		},
		//路由传值
		onLoad(option) {
			this.searchData = option;
			this.$store.commit('work/setRenewOutInfoList', [])
			this.renewNoDetail()
		},
		onUnload() {

		},
		mounted() {
			this.countBottomBar()
		},
		methods: {
			/**
			 * 计算底部DOM元素节点
			 */
			async countBottomBar() {
				let that = this
				const topHeight = await this.$getComponentsDom('#tab');
				const bottomHeight = await this.$getComponentsDom('#pageBottom') || {
					height: 100
				};
				this.swiperHeight = (that.systemInfo.windowHeight - topHeight.height - bottomHeight.height) + 'px'
			},

			/**
			 * 查询订单详情
			 */
			renewNoDetail() {
				let postData = {
					renewNo: this.searchData.renewNo
				}
				uni.showLoading({
					title: '加载中···'
				})
				renew.getRenewDetail(postData).then((res) => {
					if (res.code === 200) {
						this.detailData = res.data
						if (res.data.renewDetailList) {
							let oldList=res.data.renewDetailList.filter(x=>!x.renewDetailType)
							let newList=res.data.renewDetailList.filter(x=>x.renewDetailType)
							this.detailData.renewDetailList=oldList
							this.$store.commit('work/setRenewOutInfoList', newList)
						}
						let renewFlow = res.data.renewFlow
						//流程处理（0 提交申请 / 1 玛吉斯同意 / 2 玛吉斯驳回 / 3 门店换货，玛吉斯没有同意 / 
						// 4完成，玛吉斯没有同意 / 5 门店换货 玛吉斯同意 / 6 完成 ，玛吉斯同意） 
						if (renewFlow === 2) {
							this.stepsList = [{
								title: '提交申请'
							}, {
								title: '玛吉斯驳回'
							}]
							this.activeIndex = 1
							this.activeArr = [0, 1]
						} else {
							this.stepsList = [{
								title: '提交申请'
							}, {
								title: '玛吉斯同意'
							}, {
								title: '门店换货'
							}, {
								title: '完成'
							}]
							if (renewFlow === 1) {
								this.activeIndex = 1
								this.activeArr = [0, 1]
							} else if (renewFlow === 3) {
								this.activeIndex = 2
								this.activeArr = [0, 2]
							} else if (renewFlow === 4) {
								this.activeIndex = 3
								this.activeArr = [0, 2, 3]
							} else if (renewFlow === 5) {
								this.activeIndex = 2
								this.activeArr = [0, 1, 2]
							} else if (renewFlow === 6) {
								this.activeIndex = 3
								this.activeArr = [0, 1, 2, 3]
							}
						}
					} else {
						uni.showToast({
							icon: "none",
							title: res.msg
						})
					}
					setTimeout(()=>{
						this.countBottomBar()
					},100)
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
			 * 返回上一页
			 */
			navBack() {
				uni.navigateBack({
					delta: 1
				});
			},
			/**
			 * 移除添加
			 */
			removeNew(item) {
				this.$store.commit('work/deleteRenewOutInfoList', item.itemBarCode)
			},
			/**
			 * 确认提交
			 */
			confirm() {
				if (this.isChecked) {
					let postData = {
						"barCodeList": this.renewOutInfoList.map(x => x.itemBarCode),
						"renewNo": this.searchData.renewNo
					}
					uni.showLoading({
						title: '提交中···'
					})
					console.log(postData)
					renew.modifyRenewAddTyre(postData).then((res) => {
						if (res.code === 200) {
							uni.showToast({
								icon: "success",
								title: '提交成功'
							})
							setTimeout(() => {
								this.navBack()
							}, 1000)

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
				} else {
					uni.showToast({
						icon: "none",
						title: "请确认勾选回收旧胎",
					})
				}
			},
			/**
			 * 跳转扫码出库
			 */
			navToCode() {
				let obj = {
					name: '扫描轮胎条码',
					dec: '请对轮胎条码进行扫描',
					confirmTo: '/pages/work/renew/detail/renew-detail',
					mark: 'list'
				}
				uni.navigateTo({
					url: `/pages/work/com/barcode?name=${obj.name}&dec=${obj.dec}&confirmTo=${obj.confirmTo}&mark=${obj.mark}`
				})
			},
		}
	}
</script>
<style lang="scss" scoped>
	.page {
		background-color: #f2f2f2;
		height: 100vh;
		overflow: hidden;
	}

	.renew-steps {
		padding: 20rpx;
		background: #fff;

		/deep/ .uni-steps__row-line-item {
			height: auto;
		}
	}

	.renew-box {
		padding: 20rpx;

		.renew-content {
			margin-bottom: 20rpx;
			background: #fff;
			border-radius: 5rpx;
			box-shadow: 0px 6rpx 26rpx 0px rgba(123, 71, 46, 0.05);

			.renew-no-status {
				padding: 20rpx 0;
				border-bottom: 1px solid #F2F2F2;

				.renew-no {
					padding-left: 20rpx;
					font-size: 26rpx;
					color: #7C7C7C;
					display: flex;
					align-items: center;
				}
			}

			.renew-name-number {
				width: calc(100% - 40rpx);
				padding: 20rpx;
				background: #fff;
				color: $uni-text-color;

				.item-vehicle {
					width: calc(100% - 50rpx);
				}

				.renew-icon {
					width: 50rpx;
					height: 84rpx;
				}

				.item-vehicle-num {
					margin-bottom: 20rpx;
				}

				.item-vehicle-num:nth-last-of-type(1) {
					margin-bottom: 0;
				}

				.item-vehicle-name {
					width: 168rpx;
					font-size: 24rpx;
					font-weight: bold;
				}

				.renew-name {
					width: 80%;
					font-size: 24rpx;
					color: #616161;
					overflow: hidden;
					-webkit-line-clamp: 1;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-box-orient: vertical;
				}
			}
		}

		.renew-state {
			color: #333333;
			font-size: 26rpx;
			font-weight: bold;
			padding: 20rpx 30rpx;

			.iconfont {
				font-size: 60rpx;
				color: #EB741A;
				margin-right: 30rpx;
			}
		}

		// 订单详情
		.item-detail {
			padding: 20rpx;

			.item-vehicle {
				padding: 34rpx 70rpx;
				border-radius: 20rpx;
				background: #F2F2F2;
				border: 1px solid #E5E5E5;
				position: relative;
			}

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
				max-width: 72%;
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

		.renew-title {
			color: #7C7C7C;
			font-size: 26rpx;
			padding: 20rpx;
			padding-top: 0;
		}

		.product-info {
			.item-vehicle {
				padding: 0;
			}

			.item-vehicle-num {
				width: 100%;
			}

			.del {
				width: 90rpx;
				color: #fff;
				background: #CE0000;
				font-size: $uni-font-size-base;
				border-radius: 0 20rpx 20rpx 0;
			}
		}

		.scanCode {
			padding: 30rpx 50rpx;

			.scan-text {
				color: #7C7C7C;
				font-size: 30rpx;
				padding: 50rpx 0;
			}

			.scan-btn {
				width: 100%;
				height: 38px;
				color: #EB741A;
				background: #fff;
				font-size: $uni-font-size-base;
				font-weight: bold;
				border-radius: 40rpx;
				border: 1rpx solid #EB741A;

				.uni-icons {
					color: #EB741A !important;
					margin-right: 20rpx;
				}
			}
		}
	}

	.page-bottom {
		width: 100%;
		position: fixed;
		bottom: 0;
		padding: 10px 10px calc(20rpx + constant(safe-area-inset-bottom) / 2);
		padding: 10px 10px calc(20rpx + env(safe-area-inset-bottom) / 2);
		z-index: 9;
		font-size: $uni-font-size-base;
		background-color: #f2f2f2;
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

		.check-box {
			color: $uni-text-color-subsidiary !important;
			font-size: 32rpx !important;
			background: #fff;
			border-radius: 50%;
			margin-right: 10rpx;
		}

		.selected {
			color: $uni-color-primary !important;
			font-size: 32rpx !important;
			margin-right: 10rpx;
		}
	}

	.mgl10 {
		margin-left: 20rpx;
		font-size: 24rpx;
	}
</style>

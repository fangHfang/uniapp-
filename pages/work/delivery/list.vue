<template>
	<view class="page">
		<uni-nav-bar id="navBar" title="暂存出库单" rightText="清空" left-icon="back" backgroundColor="#ed6d00" color="#fff"
		 @clickLeft="toBack" @clickRight="clear"></uni-nav-bar>
		<view id="tipsBox" class="tips-box">
			<uni-icons class="tips-icon" type="info-filled" color="#ed6d00" size="18"></uni-icons>
			<text class="tips-text">暂存时间保留3天，过期删除</text>
		</view>
		<mescroll-uni ref="mescrollRef" @init="mescrollInit" class="mescroll-uni" :top="pageOptions.mescrollTop" :bottom="pageOptions.mescrollBottom"
		 safearea @down="downCallback" @up="upCallback" :up="pageOptions.upOption">
			<view class="list-item" v-for="(item,index) in pageData.result" :key="index">
				<view class="body-box">
					<view class="item-head">
						<text class="date">{{item.temporaryTime}}</text>
					</view>
					<uni-swipe-action>
						<uni-swipe-action-item>
							<view class="item-body" @click="rebackSubmit(item)">
								<text class="item-title">暂存单号：{{item.warehouseOutNo}}</text>
								<view class="order-item-box">
									<text class="sb-item-text">车主手机号：{{item.mobile}}</text>
									<text class="sb-item-text">车牌号：{{item.carNumber}}</text>
									<text class="sb-item-text">商品数量：{{item.totalQuantity}}</text>
									<text class="sb-item-text">暂存时间：{{item.temporaryTime}}</text>
								</view>
							</view>
							<template v-slot:right>
								<view class="del" @click="deleteOne(item)"><text>删除</text></view>
							</template>
						</uni-swipe-action-item>
					</uni-swipe-action>
				</view>
			</view>
		</mescroll-uni>
		<mescroll-empty v-if="pageData.result.length===0"></mescroll-empty>
		<uni-popup ref="dialogDel" type="dialog" :maskClick="false">
			<uni-popup-dialog title='提示' content="确定清空吗？" :before-close="true" @close="close" type="warn" @confirm="dialogConfirm"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import order from '@/api/ease/order.js'
	import MescrollEmpty from '@/components/mescroll-uni/components/mescroll-empty.vue';
	export default {
		name: 'deliveryList',
		components: {
			MescrollEmpty
		},
		data() {
			return {
				systemInfo: uni.getSystemInfoSync(),
				// 下拉刷新组件实例
				mescroll: null,
				// 页面配置
				pageOptions: {
					upOption: {
						auto: false,
						noMoreSize: 5,
						empty: {
							use: false
						}
					},
					// 适配刘海屏
					mescrollTop: 40,
					mescrollBottom: 0
				},
				// 列表数据
				pageData: {
					result: [],
					allPages: 2,
					pageNum: 1,
					pageSize: 10
				}
			}
		},
		onLoad() {},
		mounted() {
			this.countTopBar()
		},
		methods: {
			/**
			 * 计算顶部DOM元素节点
			 */
			async countTopBar() {
				const searchBarHeight = await this.$getComponentsDom('#tipsBox');
				this.pageOptions.mescrollTop = searchBarHeight.bottom + 'px'
			},

			/**
			 * 初始化回调方法
			 * @param {Object} mescroll
			 */
			mescrollInit(mescroll) {
				this.mescroll = mescroll
			},
			/**
			 * 返回上一级页面
			 */
			toBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			/**
			 * 点击取消按钮触发
			 * @param {Object} done
			 */
			close(done) {
				done()
			},
			
			/**
			 * 删除定位
			 * @param {Object} done
			 */
			dialogConfirm(done) {
				let postData = {
					clearFlag: true
				}
				order.deleteTempEaseOrder(postData).then((res) => {
					if (res.code === 200) {
						uni.showToast({
							icon: "success",
							title: '删除成功'
						})
						done()
						this.listRemoteDataByPage()
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
			 * 清空
			 */
			clear() {
				this.$refs.dialogDel.open()
			},
			/**
			 * 下拉刷新回调
			 */
			downCallback() {
				this.mescroll.resetUpScroll();
			},
			/**
			 * 上拉加载的回调: 
			 * 其中page.num:当前页 从1开始, 
			 * page.size:每页数据条数,默认10 
			 */
			async upCallback(page) {
				const that = this
				that.pageData.pageNum = page.num
				try {
					const res = await that.listRemoteDataByPage()
					setTimeout(() => {
						that.mescroll.endByPage(res.data.records.length, that.pageData.allPages)
					}, 300);
				} catch (error) {
					that.mescroll.endErr()
				}
			},
			/**
			 * 分页查询列表数据
			 */
			listRemoteDataByPage() {
				const that = this
				return new Promise((resolve, reject) => {
					let postData = {
						pageReq: {
							pageNum: that.pageData.pageNum,
							pageSize: that.pageData.pageSize,
						}
					}
					order.listTempOrderByPage(postData).then((res) => {
						if (res.code === 200) {
							that.pageData.result = that.pageData.pageNum === 1 ? res.data.records : [...that.pageData.result, ...res.data
								.records
							]
							that.pageData.allPages = res.data.pages
							resolve(res)
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
						reject(err)
					})
				})
			},
			/**
			 * 返回继续填写提交
			 * @param {Object} item
			 */
			rebackSubmit(item) {
				let that = this
				//返回并刷新
				let pages = getCurrentPages();
				let beforePage = pages[pages.length - 2]
				uni.navigateBack({
					delta: 1,
					success: function() {
						that.$store.commit('work/setOutInfoList', [])
						that.$store.commit('work/setCarMasterPhone', {})
						// #ifdef APP-PLUS
						beforePage.$vm.orderNoDetail(item.warehouseOutNo, 'temp')
						// #endif
						// #ifndef APP-PLUS
						beforePage.orderNoDetail(item.warehouseOutNo, 'temp')
						// #endif
					}
				});
			},
			/**
			 * 删除暂存订单
			 * @param {Object} item
			 */
			deleteOne(item) {
				let postData = {
					warehouseOutNo: item.warehouseOutNo,
					clearFlag: false
				}
				order.deleteTempEaseOrder(postData).then((res) => {
					if (res.code === 200) {
						uni.showToast({
							icon: "success",
							title: '删除成功'
						})
						this.listRemoteDataByPage()
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
			}
		}
	}
</script>

<style lang="scss">
	.mescroll-uni {
		padding-top: var(--status-bar-height);
	}

	.page {
		min-height: 100vh;
		overflow-y: hidden;
		background-color: #F2F2F2;
	}

	.tips-box {
		display: flex;
		flex-direction: row;
		width: calc(100vw - 40rpx);
		background-color: #fff;
		position: relative;
		padding: 20rpx;
		z-index: 90;

		.tips-icon {
			margin-right: 10rpx;
		}

		.tips-text {
			color: $uni-color-primary;
			font-size: 24rpx;
		}

	}

	.list-item {
		width: 100%;
		margin-top: 20rpx;

	}

	.body-box {
		width: 100%;

	}

	.item-head {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		width: 100%;

		.order-number {
			padding-bottom: 20rpx;
			color: $uni-color-primary;
			font-size: 24rpx;
		}

		.date {
			padding-bottom: 20rpx;
			color: $uni-text-color-grey;
			font-size: 24rpx;
			padding: 0 20rpx 20rpx;
		}
	}

	.item-body {
		border-bottom-width: 1rpx;
		border-bottom-color: #eee;
		border-bottom-style: solid;
		display: flex;
		flex-direction: column;
		background-color: #fff;
		padding: 20rpx 20rpx 30rpx;
		width: calc(100% - 40rpx);

		.item-title {
			color: $uni-color-primary;
			font-size: 24rpx;
			font-weight: 500;
			padding-top: 10rpx;
		}

		.order-item-box {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
		}

		.sb-item-text {
			color: #333;
			font-size: 24rpx;
			padding-top: 20rpx;
		}
	}

	.del {
		width: 160rpx;
		height: 100%;
		background-color: #E10000;
		display: flex;
		align-items: center;
		justify-content: center;

		text {
			color: #fff
		}
	}
</style>

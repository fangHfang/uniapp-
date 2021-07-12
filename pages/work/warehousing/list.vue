<template>
	<view class="page">
		<uni-nav-bar id="navBar" :title="title" left-icon="back" backgroundColor="#ed6d00" color="#fff" @clickLeft="toBack"></uni-nav-bar>
		<view id="filter" class="filter-box">
			<!-- <uni-search-bar class="search-bar" placeholder="商品名称/编码" :radius="20" type="" cancelButton="none" /> -->
			<view class="flex-calendar-box">
				<view @click="open" class="calendar-box">
					<text class="iconfont calendar"></text>
					<text class="calendar-text">{{searchData.startDate || '开始时间'}}</text>
					<text class="calendar-text">-</text>
					<text class="calendar-text">{{searchData.endDate || '结束时间'}}</text>
				</view>
				<text class="clear-text" @click="clearDate">清空筛选</text>
			</view>
		</view>
		<mescroll-uni ref="mescrollRef" @init="mescrollInit" class="mescroll-uni" :top="pageOptions.mescrollTop" :bottom="pageOptions.mescrollBottom"
		 safearea @down="downCallback" @up="upCallback">
			<view class="list-item" v-for="(item,index) in pageData.result" :key="index">
				<view class="slot-body">
					<view class="item-head">
						<text class="order-number">{{item.itemName}}</text>
						<text class="date">{{item.warehouseInDay}}</text>
					</view>
					<view class="item-body">
						<view class="item-title-box">
							<text class="item-title">{{item.scanCodeList[0].itemSpecDetail}}</text>
							<text class="item-number">{{item.warehouseInQuantity}}条</text>
						</view>
						<view class="sb-item-box" v-for="(items,indexs) in item.scanCodeList" :key="indexs">
							<icon class="iconfont barcode" style='font-size: 32rpx;color: #999999;' type=""></icon>
							<text class="sb-item-text">{{items.itemBarCode}}</text>
						</view>
					</view>
				</view>
			</view>
			<mescroll-empty v-if="pageData.result.length==0"></mescroll-empty>
		</mescroll-uni>
		<uni-calendar ref="calendar" :clear-date="calendarInfo.toClearDate" :date="calendarInfo.date" :insert="calendarInfo.insert"
		 :lunar="calendarInfo.lunar" :range="calendarInfo.range" @confirm="confirm" @close="close" />
	</view>
</template>

<script>
	import MescrollEmpty from '@/components/mescroll-uni/components/mescroll-empty.vue';
	import warehouse from '@/api/order/warehouse.js'
	import {
		dateFormat
	} from '@/common/utils/DateUtil'
	export default {
		name: 'warehousingList',
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
					// 适配刘海屏
					mescrollTop: 40,
					mescrollBottom: 20
				},
				// calendar info
				calendarInfo: {
					lunar: false,
					range: true,
					insert: false,
					selected: [],
					toClearDate: false,
				},
				// 查询条件
				searchData: {
					// 活动类型编码
					endDate: dateFormat('yyyy-MM-dd', new Date()),
					startDate: dateFormat('yyyy-MM-dd', new Date(new Date().getTime() - 3600 * 1000 * 24 * 30)),
					pageReq: {
						// 排序字段
						field: "",
						// 排序规则
						order: "",
						// 当前页码
						pageNum: 1,
						// 当前页面数据量
						pageSize: 10
					}
				},
				// 底部产品列表数据
				pageData: {
					result: []
				},
				title: '入库记录'
			}
		},
		onLoad(option) {
			this.title = option.title || '入库记录'
		},
		mounted() {
			this.countTopBar()
		},
		methods: {
			/**
			 * 计算顶部DOM元素节点
			 */
			async countTopBar() {
				const searchBarHeight = await this.$getComponentsDom('#filter');
				this.pageOptions.mescrollTop = searchBarHeight.bottom + 'px'
			},

			/**
			 * 打开日历筛选
			 * */
			open() {
				this.$refs.calendar.open()
			},
			/**
			 * 打开日历筛选
			 * */
			close() {
				console.log('弹窗关闭');
			},
			/**
			 * 清空日历选择
			 * */
			clearDate() {
				this.searchData.startDate = null
				this.searchData.endDate = null
				this.calendarInfo.toClearDate = true
				// 重新查询
				this.downCallback()
			},

			confirm(e) {
				this.searchData.startDate = e.range.before
				this.searchData.endDate = e.range.after ? e.range.after : e.range.before
				this.calendarInfo.toClearDate = false
				// 重新查询
				this.downCallback()
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
			 * 分页查询入库记录
			 */
			listWarehousingRecordByPage() {
				uni.showLoading({
					title: '加载中'
				});
				let payload = JSON.parse(JSON.stringify(this.searchData))
				if (payload.startDate) {
					payload.startDate += ' 00:00:00'
					payload.endDate += ' 23:59:59'
				}
				console.log(payload, 'payload')
				return new Promise((resole, reject) => {
					warehouse.listWarehouseByPage(payload).then(res => {
						uni.hideLoading();
						console.log(res.data, 'res.data')
						resole(res.data)
					}).catch((error) => {
						uni.hideLoading();
						reject(error.msg)
					});
				})
			},
			/**
			 * 下拉刷新回调
			 */
			async downCallback() {
				this.searchData.pageReq.pageNum = 1
				this.mescroll.setPageNum(1)
				// 先触发查询
				// this.listSeckillByPage()
				// 然后追加数据
				let curPageData = await this.listWarehousingRecordByPage()
				//设置列表数据
				this.pageData.result = curPageData.records;
				//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
				setTimeout(() => {
					this.mescroll.endSuccess(curPageData.records.length);
				}, 1000)
			},
			/**
			 * 上拉加载的回调: 
			 * 其中page.num:当前页 从1开始, 
			 * page.size:每页数据条数,默认10 
			 */
			async upCallback(page) {
				let startNum = page.num + 1
				if (startNum === this.searchData.pageReq.pageNum) {
					setTimeout(() => {
						this.mescroll.endByPage(this.pageData.result.length);
					}, 500)
					return
				}
				this.searchData.pageReq.pageNum = startNum
				// 然后追加数据
				let curPageData = await this.listWarehousingRecordByPage()
				//设置列表数据
				this.pageData.result = this.pageData.result.concat(curPageData.records); //追加新数据
				//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
				setTimeout(() => {
					this.mescroll.endByPage(curPageData.records.length);
				}, 1000)
			},
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

	.filter-box {
		display: flex;
		flex-direction: column;
		width: 100vw;
		background-color: #f2f2f2;
		position: relative;
		z-index: 90;

		.flex-calendar-box {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			padding: 20rpx;

			.calendar-box {
				display: flex;
				flex-direction: row;
				justify-content: center;
			}

			.calendar {
				text-align: center;
				color: #666;
				margin-left: 10rpx
			}

			.calendar-text {
				color: #666;
				font-size: 24rpx;
				margin-left: 10rpx;
				margin-right: 10rpx;
			}

			.clear-text {
				color: $uni-color-primary;
				font-size: 24rpx;
			}
		}
	}

	.list-item {
		width: calc(100vw - 80rpx);
		margin-left: 20rpx;
		margin-bottom: 20rpx;
		padding: 20rpx;
		background-color: #fff;
	}

	.slot-body {
		width: 100%;
	}

	.item-head {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		width: 100%;
		border-bottom-width: 1rpx;
		border-bottom-color: #eee;
		border-bottom-style: solid;

		.order-number {
			padding-bottom: 20rpx;
			color: $uni-color-primary;
			font-size: 24rpx;
		}

		.date {
			padding-bottom: 20rpx;
			color: $uni-text-color-grey;
			font-size: 24rpx;
		}
	}

	.item-body {
		display: flex;
		flex-direction: column;
		width: 100%;

		.item-title-box {
			display: flex;
			justify-content: space-between;
			padding-top: 20rpx;

			.item-title {
				color: #333;
				font-size: 28rpx;
				font-weight: 500;
				max-width: 85%;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}

			.item-number {
				color: $uni-color-primary;
				font-size: 28rpx;
				font-weight: 500;
			}
		}

		.sb-item-box {
			display: flex;
			flex-direction: row;
			align-items: center;
			margin-top: 10rpx;
		}

		.sb-item-text {
			color: $uni-text-color-grey;
			font-size: 24rpx;
			margin-left: 20rpx;
		}
	}
</style>

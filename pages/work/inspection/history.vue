<template>
	<view class="page">
		<uni-nav-bar id="navbar" title="店检历史" left-icon="back" backgroundColor="#ed6d00" color="#fff" @clickLeft="toBack" />
		<image src="@/static/image/work/bg@3x.png" mode="" class="bg-img"></image>
		<mescroll-uni ref="mescrollRef" @init="mescrollInit" class="mescroll-uni" :top="pageOptions.mescrollTop" :bottom="pageOptions.mescrollBottom"
		 :up="upOption" :down="downOption" safearea @down="downCallback">
			<view class="card-box">
				<view class="inspection-name flex a-center j-center">{{name}}</view>
				<view class="inspection-table">
					<view class="table flex a-center j-center">
						<t-table borderColor="#ff6b21">
							<t-tr font-size="15" color="#fff">
								<t-th align="center" style="min-width: 18%;">年月</t-th>
								<t-th align="center" style="min-width: 11%;">状态</t-th>
								<t-th align="center" style="min-width: 12%;">审核结果</t-th>
								<t-th align="center" style="min-width: 9%;">评分</t-th>
								<t-th align="center" style="min-width: 13%;">奖励</t-th>
								<t-th align="center" style="min-width: 11%;">操作</t-th>
							</t-tr>
							<t-tr font-size="12" align="right" v-for="(item,index) in tableList" :key="index">
								<view class="table-content flex a-center">
									<t-td align="center" class="table-content-td" style="min-width: calc(18% + 1upx);">{{ item.cycleTimeStr }}</t-td>
									<t-td align="center" class="table-content-td" style="min-width: 11%;">{{ ['未提交','已提交','未开始'][item.status] }}</t-td>
									<t-td align="center" class="table-content-td" style="min-width: 12%;">{{ ['待审核','合格','不合格','退回'][item.auditStatus] }}</t-td>
									<t-td align="center" class="table-content-td" style="min-width: 9%">{{ item.score || 0 }}</t-td>
									<t-td align="center" class="table-content-td" style="min-width: 13%;">
										<text v-if="item.rewardStatus === 1" class="operation" @click="lookReward(item)">查看</text>
										<text v-else>无</text>
									</t-td>
									<t-td align="center" class="table-content-td" style="min-width: calc(11% - 1upx);">
										<view class="operation-box">
											<text v-if="item.status===0 && !item.isCurrentMonth" class="operation"></text>
											<text v-if="item.status===0 && item.isCurrentMonth" class="operation" @click="detail(item)">参与</text>
											<text v-if="item.status===1" class="operation" @click="detail(item)">查看</text>
											<text v-if="item.status===2" class="operation"></text>
										</view>
									</t-td>
								</view>
							</t-tr>
						</t-table>
					</view>
				</view>
			</view>
		</mescroll-uni>
		<uni-popup ref="dialogPopup" type="dialog">
			<uni-popup-dialog class="reward-popup" :showCancel="false" mode="base" title="获得奖励" content="" :duration="2000" :before-close="true" @close="close" @confirm="close">
				<template slot="content">
					<view class="content">
						<view class="content-popup flex a-center">
							<view class="staff-name">优惠券</view>
							<view class="reward">{{reward.couponName + reward.couponCount}}</view>
						</view>
						<view class="content-popup flex a-center">
							<view class="staff-name">兑换点</view>
							<view class="reward">{{reward.exchangeName + reward.exchangeAmount}}</view>
						</view>
						<view class="content-popup flex a-center">
							<view class="staff-name">返利</view>
							<view class="reward">{{reward.rebateName + reward.rebateAmount}}</view>
						</view>
						<view class="content-popup flex a-center">
							<view class="staff-name">积分</view>
							<view class="reward">{{reward.integralName + reward.integralAmount}}</view>
						</view>
					</view>
				</template>
			</uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import inspection from '@/api/inspection/inspection.js'
	import tTable from '@/components/t-table/t-table.vue';
	import tTh from '@/components/t-table/t-th.vue';
	import tTr from '@/components/t-table/t-tr.vue';
	import tTd from '@/components/t-table/t-td.vue';
	export default {
		name: 'inspectionHistory',
		components: {
			tTable,
			tTh,
			tTr,
			tTd
		},
		data() {
			return {
				systemInfo: uni.getSystemInfoSync(),
				upOption: {
					use: false,
					empty: {
						use: false
					}
				},
				downOption: {
					textColor: '#ffffff'
				},
				// 下拉刷新组件实例
				mescroll: null,
				// 页面配置
				pageOptions: {
					// 适配刘海屏
					mescrollTop: 44,
					mescrollBottom: 0,
				},
				//店检编号
				inspectNo: '',
				name: '',
				tableList: [],
				reward: {}
			}
		},
		computed: {},
		onLoad(option) {
			this.inspectNo = option.inspectNo
			this.name = option.name
		},
		mounted() {
			this.countTopBar()
		},
		methods: {
			/**
			 * 返回上一页
			 */
			toBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			/**
			 * 计算顶部DOM元素节点
			 */
			async countTopBar() {
				const searchBarHeight = await this.$getComponentsDom('#navbar');
				this.pageOptions.mescrollTop = searchBarHeight.height + 'px'
			},
			/**
			 * 下拉刷新回调
			 */
			downCallback() {
				// 先触发查询
				this.listRemoteDataByPage()
			},
			/**
			 * 查询列表数据
			 */
			listRemoteDataByPage() {
				let postData = {
					inspectNo: this.inspectNo,
					"pageReq": {
						"pageNum": 1,
						"pageSize": 12
					}
				}
				uni.showLoading({
					title: '加载中···'
				})
				inspection.getInspectionTable(postData).then((res) => {
					if (res.code === 200) {
						let records = res.data.records
						let curMonth = (new Date()).getMonth() + 1
						let newRecords = records.map(x => {
							let month = parseInt(x.cycleTime.substring(5, 7)) || 1
							return {
								...x,
								isCurrentMonth: month === curMonth
							}
						})
						this.tableList = newRecords
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
			 * 查看
			 * @param {Object} item
			 */
			lookReward(item) {
				this.$refs.dialogPopup.open();
				this.reward = item.reward || {}
			},
			/**
			 * 查看详情
			 * @param {Object} id 详情id
			 */
			detail(item) {
				let auditNo=item.auditNo || ''
				uni.navigateTo({
					url: `/pages/work/inspection/detail?inspectNo=${item.inspectNo}&cycleNo=${item.cycleNo}&auditNo=${auditNo}`
				})
			},
			/**
			 * 点击取消按钮触发
			 * @param {Object} done
			 */
			close(done) {
				done()
			},
		}
	}
</script>

<style lang="scss">
	.page {
		background-color: #FFFFFF;
		position: relative;
		height: 100vh;
		overflow: hidden;
	}

	.card-box {
		position: relative;
		z-index: 1;

		.inspection-name {
			height: 44px;
			background-color: #fff;
		}
	}

	.bg-img {
		width: 100%;
		height: calc(100vh - 44px - var(--status-bar-height));
		position: absolute;
		top: calc(44px + var(--status-bar-height));
		left: 0;
		z-index: 0;
	}

	.inspection-table {
		position: relative;

		.table {
			width: calc(100% - 20px);
			padding: 10px;
			position: absolute;
			z-index: 1;

			.table-content {
				width: 100%;
				background: #fff;

				.table-content-td {
					color: #3C3C3C;
					font-size: 12px;
					min-height: 36px;
					padding: 0 7px;
					display: flex;
					align-items: center;
					justify-content: center;
					// border-right: 1upx solid #ff6b21;
					// border-top: 1upx solid #ff6b21;
				}

				.table-content-td:nth-of-type(1) {
					color: #fff;
					background: #ed6d00;
				}

				.table-content-td:nth-last-of-type(1) {
					border-right: none;
				}
			}

			.t-tr:nth-of-type(1) {
				height: 50px;
				background: #ed6d00;
			}

			.t-th {
				padding: 0 7px;
				display: flex;
				align-items: center;
				justify-content: center;
				border-width: 1upx;
			}

			.operation-box {
				width: 100%;
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
			}

			.operation {
				color: #ed6d00 !important;
				border-bottom: 1upx solid #ed6d00;
			}
		}
	}

	.uni-popup {
		/deep/ .uni-transition {
			.uni-popup-dialog {
				width: 84vw;
			}

			.uni-dialog-title {
				padding-bottom: 15px;

				.uni-popup__error {
					color: #1C1C1C;
					font-size: 19px;
				}
			}

			.uni-dialog-content {
				padding: 0;
				padding-bottom: 15px;
			}
		}

	}

	.content {
		width: calc(100% - 20px);
		padding: 25px 10px;
		border-top: 1px solid #ddd;
		border-bottom: 1px solid #ddd;

		.content-popup {
			height: 30px;
			color: #1C1C1C;
			font-size: 10px;
			border: 1upx solid rgba(204, 204, 204, .5);
			border-bottom: none;
		}

		.content-popup:nth-last-of-type(1) {
			border-bottom: 1upx solid rgba(204, 204, 204, .5);
		}

		.staff-name {
			width: 85px;
			height: 100%;
			color: #666666;
			padding: 0 10px;
			display: flex;
			align-items: center;
			background: rgba(204, 204, 204, .3);
		}

		.reward {
			height: 100%;
			color: #666666;
			padding: 0 10px;
			display: flex;
			align-items: center;
		}
	}

	.mb10 {
		margin-bottom: 10px;
	}
</style>

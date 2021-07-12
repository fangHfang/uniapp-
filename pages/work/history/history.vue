<template>
	<view class="page">
		<view id="header">
			<uni-nav-bar id="topBar" title="扫码历史" left-icon="back" backgroundColor="#ed6d00" color="#fff" @clickLeft="toBack"></uni-nav-bar>
			<view class="picker-box">
				<view class="test flex a-center j-center" @click="onShowDatePicker('range')">{{range[0]}} - {{range[1]}}</view>
				<view class="clear">清除筛选</view>
			</view>
		</view>
		<mescroll-uni ref="mescrollRef" @init="mescrollInit" :top="mescrollTop" :safearea="true" @down="downCallback"
			:up="upOption" @up="upCallback" :down="downOption">
			<view class="content">
				<view class="detail-list" v-for="(item,index) in detailList" :key="index">
					<view class="order flex a-center j-space-between">
						<view class="order-num">
							订单号：<text class="number-color">{{item.orderNum}}</text>
						</view>
						<view class="order-date">{{item.orderDate}}</view>
					</view>
					<view class="line"></view>
					<view class="content-order flex a-center j-space-between">
						<view class="order-name">{{item.orderName}}</view>
						<view :class="item.type ===2 ? 'negative' :item.type ===1? 'positive':''">
							{{['+','-',''][item.type-1]}}{{item.number}}</view>
					</view>
				</view>
			</view>
		</mescroll-uni>
		<mx-date-picker :show="showPicker" :type="type" :value="value" :show-tips="true" :begin-text="'开始日期'"
			:end-text="'结束日期'" :show-seconds="true" @confirm="onSelected" @cancel="onSelected" />
	</view>
</template>

<script>
	import MxDatePicker from "@/components/mx-datepicker/mx-datepicker.vue";
	import Wallet from '@/api/wallet/wallet.js'
	export default {
		name: 'integral',
		components: {
			MxDatePicker
		},
		data() {
			return {
				upOption: {
					auto: true,
					page: {
						size: 10
					}
				},
				downOption: {
					auto: false
				},
				mescrollTop: '243px',
				availableRebates: 1000,
				showPicker: false,
				range: [],
				type: 'rangetime',
				value: '',
				detailList: [],
				params: {}
			}
		},
		onLoad(option) {
			this.params.customerNo = option.customerNo
			this.params.debitNo = option.debitNo
			this.availableRebates = option.currentlyAvailableAmount
		},
		mounted() {},
		methods: {
			/**
			 * 获取明细列表
			 * @param {Object} num
			 */
			async getPageList(num) {
				let params = {
					...this.params,
					'page.num': num,
					'page.pageSize': this.upOption.page.size
				}
				if (this.range[0]) params.startTime = this.range[0]
				if (this.range[0] && this.range[1]) params.endTime = this.range[1]
				let res = await Wallet.integralPageDetail(this.$jsonFormat(params))
				if (res.code === 200) {
					return res.data
				} else {
					uni.showToast({
						title: '查询失败，请稍后再试',
						icon: 'none',
						duration: 2000
					});
					return null
				}
			},
			/**
			 * 返回上一级页面
			 */
			toBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			/**显示日期选择器
			 * @param {Object} type
			 */
			onShowDatePicker(type) {
				this.type = type;
				this.showPicker = true;
				this.value = this[type];
			},
			/**
			 * 选择日期
			 * @param {Object} e
			 */
			onSelected(e) {
				this.showPicker = false;
				if (e) {
					this[this.type] = e.value;
					this.downCallback()
				}
			},
			/**
			 * 格式化时间
			 * @param str 时间字符串
			 */
			formatTime(str) {
				str = str || "";
				return str.substring(0, 10) + " " + str.substring(11, 19);
			},
			async upCallback(page) {
				let data = await this.getPageList(page.num)
				if (data) {
					let curPageData = data.records.map(x => {
						return {
							orderNum: x.debitDetailNo,
							orderDate: this.formatTime(x.accountTime),
							orderName: x.typeDescription,
							number: x.amount,
							// 交易类型（1：调增，2：调减，3：不变）
							type: x.type
						}
					})
					this.detailList = this.detailList.concat(curPageData);
					this.mescroll.endSuccess(curPageData.length);
				}
			},
			async downCallback(page) {
				let data = await this.getPageList(1)
				if (data) {
					let curPageData = data.records.map(x => {
						return {
							orderNum: x.debitDetailNo,
							orderDate: this.formatTime(x.accountTime),
							orderName: x.typeDescription,
							number: x.amount,
							// 交易类型（1：调增，2：调减，3：不变）
							type: x.type
						}
					})
					this.detailList = curPageData
					this.mescroll.endSuccess(curPageData.length);
				}
			}
		}
	}
</script>

<style lang="scss">
	.page {
		height: 100vh;
		background-color: #F2F2F2;
		overflow: hidden;

		/deep/ .picker-modal {
			top: 60%;
			box-shadow: 0 1px 20px 10px rgba(0, 0, 0, 0.2);
		}
	}
	.picker-box{
		display:flex;
		justify-content: space-between;
		align-items: center;
		.clear{
			color:#ed6d00;
			font-size:12px;
			padding:0 10px;
		}
	}

	.test {
		flex:1;
		height: 30px;
		color: #1C1C1C;
		font-size: 13px;
		background-color: #EAEAEA;
		border: 1px solid #CCCCCC;
		border-radius: 3px;
		margin: 10px;
	}

	.content {
		width: calc(100% - 20px);
		padding: 0 10px;
		padding-bottom: 10px;

		.detail-list {
			margin-bottom: 10px;
			background-color: #fff;
			border-radius: 3px;
		}

		.detail-list:nth-last-of-type(1) {
			margin: 0;
		}

		.order {
			height: 39px;
			padding: 0 10px;

			.order-num {
				color: #1C1C1C;
				font-size: 12px;

				.number-color {
					color: #ed6d00;
				}
			}

			.order-date {
				color: #666666;
				font-size: 11px;
			}
		}

		.line {
			width: 100%;
			height: 1px;
			background-color: #CCCCCC;
		}

		.content-order {
			height: 49px;
			padding: 0 10px;
			font-size: 13px;

			.order-name {
				color: #1C1C1C;
			}

			.positive {
				color: #FF0000;
			}

			.negative {
				color: #0DC316;
			}
		}
	}
</style>

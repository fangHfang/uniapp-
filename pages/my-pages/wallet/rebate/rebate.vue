<template>
	<view class="page">
		<view  id='pageHeader' class="page-header">
			<view class="header">
				<uni-nav-bar title="" backgroundColor="rgba(0,0,0,0)" left-icon="back" color="#fff" @clickLeft="toBack"></uni-nav-bar>
				<view class="header-tab flex a-center j-center flex-column">
					<view class="available-title">可用返利</view>
					<view class="available-credit">{{availableRebates}}</view>
				</view>
			</view>
			<view class="tab flex a-center j-center">返利明细</view>
			<view class="test flex a-center j-center" @click="onShowDatePicker('range')">{{range[0]}} - {{range[1]}}</view>
		</view>
		<mescroll-uni 
			ref="mescrollRef" 
			:top="mescrollTop" 
			@init="mescrollInit" 
			:safearea="true" 
			@down="downCallback" 
			:up="upOption" 
			@up="upCallback" 
			:down="downOption">
			<view class="content">
				<view class="detail-list" v-for="(item,index) in detailList" :key="index">
					<view class="order flex a-center j-space-between">
						<view class="order-num">
							流水号：<text class="number-color">{{item.orderNum}}</text>
						</view>
						<view class="order-date">{{item.orderDate}}</view>
					</view>
					<view class="line"></view>
					<view class="content-order flex a-center j-space-between">
						<view class="order-name">{{item.orderName}}</view>
						<view :class="item.type ===2 ? 'negative' :item.type ===1? 'positive':''">{{['+','-',''][item.type-1]}}{{item.number}}</view>
					</view>
					<view class="content-order flex a-center j-space-between spec">
						<view class="order-name">备注</view>
						<view class="remarks">{{item.remarks || '暂无'}}</view>
					</view>
				</view>
			 </view>
		</mescroll-uni>
		<mx-date-picker :show="showPicker" :type="type" :value="value" :show-tips="true" :begin-text="'开始日期'" :end-text="'结束日期'" :show-seconds="true" @confirm="onSelected" @cancel="onSelected" />
	</view>
</template>

<script>
	import MxDatePicker from "@/components/mx-datepicker/mx-datepicker.vue";
	import Wallet from '@/api/wallet/wallet.js'
	export default {
		name: 'rebate',
		components: {
			MxDatePicker
		},
		data() {
			return {
				systemInfo:uni.getSystemInfoSync(),
				upOption: {
					auto: true,
					page: {
						size: 10
					}
				},
				downOption: {
					auto: false
				},
				mescrollTop: '0',
				availableRebates:1000,
				showPicker: false,
				range: [],
				type: 'rangetime',
				value: '',
				detailList:[],
				params: {}
			}
		},
		onLoad(option) {
			this.params.customerNo = option.customerNo
			this.params.debitNo = option.debitNo
			this.availableRebates=option.currentlyAvailableAmount
		},
		mounted() {
			this.countTopBar();
		},
		methods: {
			/**
			 * 计算顶部DOM元素节点
			 */
			async countTopBar(){
				let that = this
				const topHeight = await this.$getComponentsDom('#pageHeader');
				this.mescrollTop = topHeight.bottom + 'px'
			},
			
			/**
			 * 获取明细列表
			 * @param {Object} num
			 */
			async getPageList(num) {
				let params = {
					...this.params,
					'page.pageNum': num,
					'page.pageSize': this.upOption.page.size
				}
				if (this.range[0]) params.startTime = this.range[0]
				if (this.range[0] && this.range[1]) params.endTime = this.range[1]
				let res = await Wallet.rebatePageDetail(this.$jsonFormat(params))
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
			toBack(){
				uni.navigateBack({
					delta: 1
				})
			},
			/**显示日期选择器
			 * @param {Object} type
			 */
			onShowDatePicker(type){
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
				if(e) {
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
							remarks: x.remarks,
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
							// https://o2o-mall.coding.net/p/mjs-test/assignments/issues/3048/detail
							orderNum: x.debitDetailNo,
							orderDate: this.formatTime(x.accountTime),
							orderName: x.typeDescription,
							remarks: x.remarks,
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
	.page-header{
		position: fixed;
		top: 0;
		background-color: #F2F2F2;
	}
	.header {
		width: 100%;
		height: calc(130px + var(--status-bar-height));
		background: url('../../../../static/image/my/wallet/fanli-bg.png') no-repeat center;
		background-size:cover;
		/deep/ .uni-navbar--border{
			border: none;
			background: none !important;
		}
		/deep/ .uni-navbar__header{
			background: none !important;
		}
		.header-tab{
			width: 100%;
			height: calc(130px - var(--status-bar-height) - 45px);
			color: #fff;
			font-size: 20px;
			
			> view{
				margin-bottom: 5px;
			}
		}
	}
	.tab{
		width: 100%;
		height: 50px;
		color: #1C1C1C;
		background-color: #fff;
		font-size: 15px;
		border-bottom: 1px solid #EAEAEA;
	}
	.test{
		width: calc(100% - 20px);
		height: 30px;
		color: #1C1C1C;
		font-size: 13px;
		background-color: #EAEAEA;
		border: 1px solid #CCCCCC;
		border-radius: 3px;
		margin: 15px 10px;
	}
	.content{
		width: calc(100% - 20px);
		padding: 0 10px;
		padding-bottom: 10px;
		
		.detail-list{
			margin-bottom: 10px;
			background-color: #fff;
			border-radius: 3px;
		}
		.detail-list:nth-last-of-type(1){
			margin: 0;
		}
		.order{
			height: 39px;
			padding: 0 10px;
			.order-num{
				color: #1C1C1C;
				font-size: 12px;
				.number-color{
					color: #ed6d00;
				}
			}
			.order-date{
				color: #666666;
				font-size: 11px;
			}
		}
		.line{
			width: 100%;
			height: 1px;
			background-color: #CCCCCC;
		}
		.content-order{
			height: 30px;
			padding: 0 10px;
			font-size: 13px;
			&.spec{
				min-height:30px;
				height:auto;
				padding-bottom:5px;
			}
			.remarks{
				flex:1;
				max-width:calc(100vw - 120px);
				text-align: right;
				color:#666;
				word-break: break-all;
			}
			.order-name{
				color: #1C1C1C;
			}
			.positive{
				color: #FF0000;
			}
			.negative{
				color: #0DC316;
			}
		}
	}
</style>

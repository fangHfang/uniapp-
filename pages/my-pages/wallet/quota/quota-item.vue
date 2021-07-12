<template>
	<!--
	swiper中的transfrom会使fixed失效,此时用height="100%"固定高度;
	swiper中无法触发mescroll-mixins.js的onPageScroll和onReachBottom方法,只能用mescroll-uni,不能用mescroll-body
	-->
	<!-- ref动态生成: 字节跳动小程序编辑器不支持一个页面存在相同的ref (如不考虑字节跳动小程序可固定值为 ref="mescrollRef") -->
	<view>
		<view id="filter" class="filter-box">
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
		<mescroll-uni
			:ref="'mescrollRef'+index"
			class="mescroll-uni"
			@init="mescrollInit"
			:bottom="mescrollBottom"
			height="100%"
			:safearea="true"
			:down="downOption"
			@down="downCallback"
			:up="upOption"
			@up="upCallback">
			<view class="detail-list" v-for="(item,index) in pageData.result" :key="index">
				<view class="order flex a-center j-space-between">
					<view class="order-num">
						<block v-if="statusKey === 1">
							订单号:<text class="number-color">{{item.creditDetailNo}}</text>
						</block>
					</view>
					<view class="order-date">{{item.accountTime}}</view>
				</view>
				<view class="line"></view>
				<view class="content-order">
					<view class="content-name flex a-center j-space-between">
						<view class="order-name">{{item.typeDescription}}</view>
						<view v-if="item.type === 1" class="positive">+{{item.amount}}</view>
						<view v-if="item.type === 2" class="negative">-{{item.amount}}</view>
						<view v-if="item.type === 3">{{item.amount}}</view>
					</view>
					<view class="content-odd" v-if="statusKey === 1">支付单号：{{item.refNo}}</view>
					<view class="content-odd" v-else>操作人：{{item.userName}}</view>
				</view>
			</view>
			<mescroll-empty v-if="pageData.result.length==0"></mescroll-empty>
		</mescroll-uni>
		<uni-calendar ref="calendar" :clear-date="calendarInfo.toClearDate" :date="calendarInfo.date" :insert="calendarInfo.insert" :lunar="calendarInfo.lunar"  :range="calendarInfo.range" @confirm="confirm" @close="close" />
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import {dateFormat} from '@/common/utils/DateUtil'
	import wallet from '@/api/wallet/wallet.js'
	import MescrollEmpty from '@/components/mescroll-uni/components/mescroll-empty.vue';
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollMoreItemMixin from "@/components/mescroll-uni/mixins/mescroll-more-item.js"
	export default {
		name:"quotaItem",
		mixins: [MescrollMixin,MescrollMoreItemMixin], // 注意此处还需使用MescrollMoreItemMixin (必须写在MescrollMixin后面)
		components:{
			MescrollEmpty
		},
		data() {
			return {
				downOption:{
					auto:false, // 不自动加载
				},
				upOption:{
					auto:false, // 不自动加载
					noMoreSize: 1,
					empty: {
						tip: '暂无相关数据'
					}
				},
				// 列表数据
				pageData:{
					result:[]
				},
				mescrollBottom:0,
				searchData:{
					// 1：消费，2：还款
					type:"",
					endDate:dateFormat('yyyy-MM-dd',new Date()),
					startDate:dateFormat('yyyy-MM-dd',new Date(new Date().getTime() - 3600 * 1000 * 24 * 30)),
					'page.field':"",
					'page.order':"",
					'page.pageNum':1,
					'page.pageSize':10,
				},
				// 日历 info
				calendarInfo: {
					lunar: false,
					range: true,
					insert: false,
					selected: [],
					startDate:null,
					endDate:null,
					toClearDate:false,
				},
			}
		},
		props:{
			i: Number, // 每个tab页的专属下标 (除了支付宝小程序必须在这里定义, 其他平台都可不用写, 因为已在MescrollMoreItemMixin定义)
			index: { // 当前tab的下标 (除了支付宝小程序必须在这里定义, 其他平台都可不用写, 因为已在MescrollMoreItemMixin定义)
				type: Number,
				default(){
					return 0
				}
			},
			tabs: { // 为了请求数据,演示用,可根据自己的项目判断是否要传
				type: Array,
				default(){
					return []
				}
			},
			height:{
				type: Number,
				default:()=>'100%'
			},
			// 区分消费记录，还款记录
			statusKey:{
				type: Number,
				default:1
			}
		},
		watch:{
			height:{
				handler(){
					this.mescrollBottom = this.$props.height + 58 + 5 + 'px'
				}
			}
		},
		computed: {
			...mapState({
				// 白条
				whiteBarInfo: state => state.login.whiteBarInfo,
			}),
		},
		mounted() {
		},
		methods: {
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
			clearDate(){
				this.searchData.startDate = null
				this.searchData.endDate = null
				this.calendarInfo.startDate = null
				this.calendarInfo.endDate = null
				this.calendarInfo.toClearDate = true
				this.downCallback()
			},
			confirm(e) {
				this.searchData.startDate = e.range.before
				this.searchData.endDate = e.range.after ? e.range.after:e.range.before
				this.calendarInfo.startDate = e.range.before
				this.calendarInfo.endDate = e.range.after ? e.range.after:e.range.before
				this.calendarInfo.toClearDate = false
				this.downCallback()
			},
			//分页查询数据
			listWhiteBarQueryByPage(){
				let that = this
				let postData = JSON.parse(JSON.stringify(this.searchData))
				if(postData.startDate){
					postData['beginAccountTime'] = postData.startDate
					postData['endAccountTime'] = postData.endDate
				}
				postData.customerNo = this.whiteBarInfo.customerNo
				postData.creditNo = this.whiteBarInfo.creditNo
				postData.type = this.statusKey
				let payload = this.$jsonFormat(postData)
				return new Promise((resolve,reject)=>{
					wallet.listWhiteBarByPage(payload).then(res => {
						resolve(res.data)
					}).catch((error) => {
						this.$message.error("查询失败,请稍后重试");
						reject(error.msg)
					});
				})
			},
			/*下拉刷新的回调 */
			async downCallback(page) {
				this.searchData['page.pageNum'] = 1
				this.mescroll.setPageNum(1)
				// 先触发查询
				// this.listWhiteBarQueryByPage()
				// 然后追加数据
				let curPageData = await this.listWhiteBarQueryByPage()
				//设置列表数据
				this.pageData.result = curPageData.records;
				//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
				setTimeout(()=>{
					this.mescroll.endSuccess(curPageData.records.length);
				},1000)
			},
			/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
			async upCallback(page) {
				let startNum = page.num + 1
				if(startNum === this.searchData['page.pageNum']){
					 setTimeout(()=>{
						this.mescroll.endByPage(this.pageData.result.length);
					 },500)
					 return
				}
				this.searchData['page.pageNum'] = startNum
				// 然后追加数据
				let curPageData = await this.listWhiteBarQueryByPage()
				//设置列表数据
				this.pageData.result = this.pageData.result.concat(curPageData.records); //追加新数据
				//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
				setTimeout(()=>{
					this.mescroll.endByPage(curPageData.records.length);
				},1000)
			},
			//点击空布局按钮的回调
			emptyClick(){
				uni.showToast({
					title:'点击了按钮,具体逻辑自行实现'
				})
			},

		}
	}
</script>
<style lang="scss" scoped>
	.detail-list{
		margin-bottom: 10px;
		background-color: #fff;
		border-radius: 3px;
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
		height: 69px;
		padding: 0 10px;
		font-size: 13px;
		.content-name{
			height: 39px;
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
		.content-odd{
			color: #666666;
			font-size: 11px;
			margin-bottom: 14px;
		}
	}
	.filter-box{
		display: flex;
		flex-direction: column;
		width:100%;
		padding-top:20rpx;
		padding-bottom:20rpx;
		position: relative;
		z-index:90;
		.flex-calendar-box{
			border-radius:30rpx;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			padding:20rpx;
			.calendar-box{
				display: flex;
				flex-direction: row;
				justify-content: center;
			}
			.calendar{
				text-align: center;
				color:#666;
				margin-left:10rpx
			}
			.calendar-text{
				color:#666;
				font-size:24rpx;
				margin-left:10rpx;
				margin-right:10rpx;
			}
			.clear-text{
				color:$uni-color-primary;
				font-size:24rpx;
			}
		}
	}
</style>

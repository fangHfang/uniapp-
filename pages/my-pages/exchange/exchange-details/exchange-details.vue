<template>
	<view class="page">
		<view id="pageHeader" class="page-header">
			<view class="header">
				<uni-nav-bar title="" backgroundColor="rgba(0,0,0,0)" left-icon="back" color="#fff" @clickLeft="toBack"></uni-nav-bar>
				<view class="header-tab flex a-center j-center">
					<view class="quota-tab flex a-center j-center flex-column">
					</view>
					<view class="header-money flex a-center j-center flex-column">
						<view class="available-title">可用兑换点</view>
						<view class="available-credit">{{$filtersNum(exchangeDetail.amount || 0)}}</view>
					</view>
					<view class="quota-tab flex a-center"style="justify-content: flex-end;" @click="navToExpect">
						<!-- <view class="expect-title">预计兑换点</view> -->
					</view>
				</view>
			</view>
			<view class="tab flex a-center j-center">
				<v-tabs 
					v-model="tabIndex" 
					:tabs="tabs" 
					:scroll="false" 
					:lineScale="0.2" 
					activeColor="#ed6d00" 
					lineColor="#ed6d00"
					height="88rpx" 
					fontSize="32rpx" 
					lineHeight="4rpx" 
					@change="changeTab"></v-tabs>
			</view>
		</view>
		 <swiper
			:style="`height:${swiperHeight}`"
			:class="[tabIndex === 0 ? 'swiper-box' : 'swiper-box-height']"
			:current="tabIndex" 
			duration="300" 
			@change="swiperChange">
		   <swiper-item class="swiper-item ">
				<mescroll-uni 
					ref="mescrollRef"
					@init="mescrollImageInit" 
					:bottom="130"
					:safearea="true" 
					:down="downOption" 
					@down="imageDownCallback" 
					:up="imageUpOption">
					<view class="content" style="padding: 10px;">
						<view class="img-list" v-for="(item,index) in imgList" :key="index">
							<image :src="item" mode="scaleToFill"></image>
						</view>
					 </view>
				</mescroll-uni>
		   </swiper-item>
		   <swiper-item class="swiper-item ">
			   <view id="filter" class="filter-box">
					<view class="flex-calendar-box">
						<view @click="open" class="calendar-box">
							<text class="iconfont calendar"></text>
							<text class="calendar-text">{{searchData.createdFrom || '开始时间'}}</text>
							<text class="calendar-text">-</text>
							<text class="calendar-text">{{searchData.createdTo || '结束时间'}}</text>
						</view>
						<text class="clear-text" @click="clearDate">清空筛选</text>
					</view>
			   </view>
			   <mescroll-uni 
				ref="mescrollRef" 
				@init="mescrollInit" 
				:safearea="true"
				:top="116"
				:down="downOption" 
				@down="downCallback" 
				:up="upOption" 
				@up="upCallback">
				<view class="content">
					<view class="detail-list" v-for="(item,index) in exchangeList" :key="index">
						<view class="content-info flex a-center j-space-between">
							<view class="order-name">
								<text>单号：</text>
								<text>{{item.tradeNo}}</text>
							</view>
							<view class="order-date">{{item.created}}</view>
						</view>
						<view class="line"></view>
						<view class="content-order flex a-center j-space-between">
							<view>{{item.remark}}</view>
							<view class="exchange-num" :class="formatColor(item.tradeType)">{{formatSymbol(item.tradeType) + item.amount}}</view>
						</view>
					</view>
				 </view>
			   </mescroll-uni>
		   </swiper-item>
		 </swiper>
		<view v-if="tabIndex === 0" class="function-footer mescroll-safearea" @click="navToConfirm">
			<button type="primary" class="footer-btn">兑换商品</button>
		</view>
		<uni-calendar 
			ref="calendar" 
			:clear-date="calendarInfo.toClearDate" 
			:date="calendarInfo.date" 
			:insert="calendarInfo.insert" 
			:lunar="calendarInfo.lunar"  
			:range="calendarInfo.range" 
			@confirm="confirm" 
			@close="close" />
	</view>
	
</template>

<script>
	import {dateFormat} from '@/common/utils/DateUtil'
	import exchange from '@/api/user/exchange.js'	
	import vTabs from "@/components/v-tabs/v-tabs.vue";
	import MxDatePicker from "@/components/mx-datepicker/mx-datepicker.vue";
	export default {
		name: 'exchangeDetails',
		components: {
			vTabs,
			MxDatePicker
		},
		data() {
			return {
				systemInfo:uni.getSystemInfoSync(),
				imageUpOption:{
					use:false
				},
				downOption:{
					auto:true // 不自动加载 (mixin已处理第一个tab触发downCallback)
				},
				upOption:{
					auto:false, // 不自动加载
					page: {
						num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: 10 // 每页数据的数量
					},
					noMoreSize: 1, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					empty:{
						tip: '~ 空空如也 ~', // 提示
						// btnText: '去看看'
					},
					toTop:{
						src:""
					},
					textNoMore:"-- 已经到底了 --"
				},
				mescrollBottom:'65px',
				// 下拉刷新组件实例
				mescroll: null,
				// tabs
				tabs: ['兑换商品', '兑换点记录'],
				// tabs下标
				tabIndex: 0,
				showPicker: false,
				range: ['2021/01/01','2021/01/06'],
				type: 'rangetime',
				value: '',
				// 展示商品图片
				imgList:[],
				// 兑换点详情
				exchangeDetail:{},
				pointNum:'500',
				exchangeList: [],
				// 搜索条件 兑换点详情
				searchImageData:{
					ruleNo:''
				},
				// 兑换点记录
				searchData:{
					createdTo:dateFormat('yyyy-MM-dd',new Date()),
					createdFrom:dateFormat('yyyy-MM-dd',new Date(new Date().getTime() - 3600 * 1000 * 24 * 30)),
					page:{
						pageNum:1,
						pageSize:10
					},
					ruleNo:""
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
				mescrollImage:'',
				mescroll:'',
				swiperHeight:'100%',
				topHeight:'100%',
			}
		},
		onLoad(option) {
			const {ruleNo} = option
			this.searchImageData.ruleNo = ruleNo
			this.searchData.ruleNo = ruleNo
		},
		mounted() {
			this.countTopBar();
			// 查询兑换商品详情
			this.getExchangeDetail()
		},
		methods: {
			/**
			 * 计算顶部DOM元素节点
			 */
			async countTopBar(){
				let that = this
				const topHeight = await this.$getComponentsDom('#pageHeader');
				this.topHeight = topHeight.bottom + 'px'
				this.swiperHeight =  (that.systemInfo.windowHeight - topHeight.bottom) + 'px'
			},
			
			/**
			 * 初始化回调方法
			 * @param {Object} mescroll
			 */
			mescrollImageInit(mescroll) {
				this.mescrollImage = mescroll
			},
			/**
			 * 初始化回调方法
			 * @param {Object} mescroll
			 */
			mescrollInit(mescroll) {
				this.mescroll = mescroll
			},
			/**
			 * 查询兑换商品详情
			 */
			getExchangeDetail(){
				let postData = {
					ruleNo:this.searchImageData.ruleNo
				}
				let payload = this.$jsonFormat(postData)
				return new Promise((resole,reject)=>{
					exchange.getExchangeDetail(payload).then((res)=>{
						const {itemDescDTO} = res.data
						this.imgList =itemDescDTO ? itemDescDTO.imageUrl : []
						this.exchangeDetail = res.data
						resole()
					}).catch((err)=>{
						console.log(err,'err')
						reject()
					})
				})
				
			},
			
			/**
			 * 图片详情刷新
			 */
		    async imageDownCallback(){
				await this.getExchangeDetail()
				setTimeout(()=>{
					this.mescrollImage.endByPage(10);
				},1000)
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
			 * tab切换事件
			 */
			changeTab(index) {
				this.tabIndex = index;
			},
			/**
			 * swipe切换事件
			 * @param {Object} e
			 */
			swiperChange(e) {
				let {
					current
				} = e.target;
				this.tabIndex = current;
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
					//选择的值
					console.log('value => '+ e.value);
					//原始的Date对象
					console.log('date => ' + e.date);
				}
			},
			//分页查询数据
			listExchangeByPage(){
				let that = this
				let postData = JSON.parse(JSON.stringify(this.searchData))
				if(postData.createdFrom && postData.createdTo){
					postData.createdFrom = dateFormat('yyyy-MM-dd HH:mm:ss',new Date((postData.createdFrom + ' 00:00:00').replace(/-/g, "/")))
					postData.createdTo = dateFormat('yyyy-MM-dd HH:mm:ss',new Date((postData.createdTo + ' 23:59:59').replace(/-/g, "/")))
				}
				return new Promise((resolve,reject)=>{
					exchange.getExchangeDetailList(postData).then(res => {
						resolve(res.data)
					}).catch((error) => {
						this.$message.error("查询失败,请稍后重试");
						reject(error.msg)
					});
				})
			},
			/*下拉刷新的回调 */
			async downCallback(page) {
				this.searchData.page.pageNum = 1
				this.mescroll.setPageNum(1)
				// 先触发查询
				// this.listExchangeByPage()
				// 然后追加数据
				let curPageData = await this.listExchangeByPage()
				//设置列表数据
				this.exchangeList = curPageData.records;
				
				//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
				setTimeout(()=>{
					this.mescroll.endSuccess(curPageData.records.length);
				},1000)
			},
			/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
			async upCallback(page) {
				let startNum = page.num + 1
				if(startNum === this.searchData.page.pageNum){
					 setTimeout(()=>{
						this.mescroll.endByPage(this.exchangeList.length);
					 },500)
					 return
				}
				this.searchData.page.pageNum = startNum
				// 然后追加数据
				let curPageData = await this.listExchangeByPage()
				//设置列表数据
				this.exchangeList = this.exchangeList.concat(curPageData.records); //追加新数据
				//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
				setTimeout(()=>{
					this.mescroll.endByPage(curPageData.records.length);
				},1000)
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
			clearDate(){
				this.searchData.createdFrom = null
				this.searchData.createdTo = null
				this.calendarInfo.startDate = null
				this.calendarInfo.endDate = null
				this.calendarInfo.toClearDate = true
				this.downCallback()
			},
			/**
			 * 日期确认
			 * @param {Object} e
			 */
			confirm(e) {
				this.searchData.createdFrom = e.range.before
				this.searchData.createdTo = e.range.after ? e.range.after:e.range.before
				this.calendarInfo.startDate = e.range.before
				this.calendarInfo.endDate = e.range.after ? e.range.after:e.range.before
				this.calendarInfo.toClearDate = false
				this.downCallback()
			},
			/**
			 * 格式化日期
			 * 交易类型(0:不变,1:调增,2:调减)
			 */
			formatColor(type){
				let text = ''
				switch(type){
					case 1:
						text = 'red-color'
						break;
					case 2:
						text = 'green-color'
						break;
					default:
						break;
				}
				return text
			},
			
			/**
			 * 格式化日期
			 * 交易类型(0:不变,1:调增,2:调减)
			 */
			formatSymbol(type){
				let text = ''
				switch(type){
					case 1:
						text = '+'
						break;
					case 2:
						text = '-'
						break;
					default:
						break;
				}
				return text
			},
			
			 
			/**
			 * 跳转预计返利页面
			 */
			navToExpect(){
				// TODO
			},
			
			
			/**
			 * 跳转下单确认页面
			 */
			navToConfirm(){
				let data = {
					...this.exchangeDetail,
					itemQuantity:1
				}
				uni.navigateTo({
					url:"/pages/products/order/confirmExchange",
					success: function(res) {
						res.eventChannel.emit("sendParams", data);
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.page {
		height: 100vh;
		background-color: #F2F2F2;
		/deep/ .picker-modal{
			top: 60%;
		}
	}

	.high-zindex {
		position: relative;
		z-index: 102;
	}

	.con-container {
		height: calc(100% - var(--status-bar-height) - 45px);
		overflow: auto;
		width: 100%;
		/deep/ .mescroll-uni-content{
			background-color: #F2F2F2;
		}
		.product-list {
			padding: 10px 10px 0;
		}
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
			margin-top: -6px;
			.quota-tab,.header-money{
				width: calc((100% - 40px) / 3);
				> view{
					margin-bottom: 3px;
				}
			}
			.quota-tab{
				font-size: 15px;
				.quota-credit{
					font-size: 18px;
				}
			}
		}
	}
	.tab{
		width: 100%;
		height: 50px;
		color: #ed6d00;
		font-size: 20px;
	}
	.test{
		width: calc(100% - 20px);
		height: 30px;
		color: #1C1C1C;
		font-size: 13px;
		background-color: #EAEAEA;
		border: 1px solid #CCCCCC;
		border-radius: 3px;
		margin: 0 10px;
	}
	.content{
		width: calc(100% - 20px);
		padding: 0 10px 10px;
		background-color: #F2F2F2;
		.img-list{
			width: 100%;
			height: 200px;
			margin-bottom: 10px;
			border-radius: 3px;
			background-color: #fff;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.detail-list{
			margin-bottom: 10px;
			background-color: #fff;
			border-radius: 3px;
			.content-info{
				padding: 15px 10px;
			}
			
			.order-date{
				color: #666666;
				font-size: 12px;
			}
			.order-name{
				color: #1C1C1C;
				font-size: 13px;
			}
		}
		.detail-list:nth-last-of-type(1){
			margin: 0;
		}
		.line{
			height: 2rpx;
			width: 100%;
			background-color: #CCCCCC;
		}
		.content-order{
			padding: 15px 10px;
			// height: 49px;
			color: #1C1C1C;
			font-size: 13px;
			.exchange-num{
			}
		}
	}
	.function-footer{
		width: calc(100% - 20px);
		padding-top: 25rpx;
		padding-left: 20rpx;
		padding-right: 20rpx;
		padding-bottom: 25rpx;
		background-color: #fff;
		position: fixed;
		bottom: 0;
		border-top: 1rpx solid #B6B6B6;
		.footer-btn{
			height: 40px;
			color: #fff;
			font-size: 17px;
			background-color: #ed6d00;
			border: none;
			border-radius: 20px;
		}
	}
	/* 适配 iPhoneX */
	@supports (bottom: constant(safe-area-inset-bottom)) or (bottom: env(safe-area-inset-bottom)) {
		.mescroll-safearea {
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);
		}
	}
	// swpier
	.swiper-box{
		height: calc(100% - 79px);
	}
	.swiper-box-height{
		height: calc(100% - 45px - 50px - 35px);
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
	.red-color{
		color: #FF0000;
	}
	.green-color{
		color: #0DC316;
	}
	.expect-title{
		font-size: 26rpx;
		text-decoration: underline;
		color: #FFFFFF;
	}
</style>

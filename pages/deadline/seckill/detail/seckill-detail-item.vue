<template>
		<mescroll-uni
			:ref="'mescrollRef'+i"
			@init="mescrollInit"
			:bottom="mescrollBottom"
			safearea
			:up="upOption"
			:down="downOption"
			@down="downCallback"
			@up="upCallback"
			@emptyclick="emptyClick">
			<view class="seckill-list">
				<image :src="placardsUrl" mode=""></image>
					<text class="active-rule" @click="open()">活动规则</text>
					<view class="seckill-time-box">
						<text>{{name}}</text>
						<view class="time-item">
							<view class="time-type">{{calcShowType}}</view>
							<view class="time-time">{{calcShowTime}}</view>
						</view>
					</view>
				<view
					:id="'seckill-item-' + resultIndex + '-' + item.id"
					class="seckill-item one-item"
					:class="{'gray':(item.saleStock/item.stock) === 1}"
					v-for="(item,resultIndex) in pageData.result"
					:key="'seckill-item-' + resultIndex"
					@click="toProductDetail(item)">
					<image class="seckill-image" :src="item.itemImageUrl" alt="">
					<view class="seckill-info">
						<view class="seckill-info-top">
								<!-- 名称 -->
							<text class="seckill-name">{{item.itemName}}</text>
								<view class="seckill-tag-list">
									<view v-if="item.promotionRuleInfoDTO && item.promotionRuleInfoDTO.rbAmount && item.promotionRuleInfoDTO.rbRuleName">
										<text>可获{{ item.promotionRuleInfoDTO.rbAmount}}新玛元</text>
									</view>
									<view v-if="item.promotionRuleInfoDTO && item.promotionRuleInfoDTO.itAmount && item.promotionRuleInfoDTO.itRuleName">
										<text>可获{{ item.promotionRuleInfoDTO.itAmount}}积分</text>
									</view>
									<view v-if="item.promotionRuleInfoDTO && item.promotionRuleInfoDTO.epInfoDTO && item.promotionRuleInfoDTO.epInfoDTO.length > 0 && item.promotionRuleInfoDTO.epInfoDTO[0].amount && item.promotionRuleInfoDTO.epInfoDTO[0].ruleName">
										<text>可获{{ item.promotionRuleInfoDTO.epInfoDTO[0].amount}}兑换点</text>
									</view>
								</view>
						</view>
							<!-- 金额 -->
							<view class="seckill-price" v-if="isDiscountOnly">
								<text class="price">已优惠￥{{item.discountAmount}}</text>
							</view>
							<view class="seckill-price" v-else>
								<text class="price">￥{{item.amount}}</text>
								<text class="orgPrice">￥{{item.itemAmount}}</text>
							</view>
					</view>
					<!-- 右下角按钮 -->
					<view class="right-bottom-box" v-on:click.stop="toOrderDetail(item)" v-if="isStart">
						<text v-if="itemCountDisplayType === 0">仅剩{{item.displayStock - item.saleStock}}</text>
						<text v-if="itemCountDisplayType === 1">仅剩{{((item.displayStock - item.saleStock)/item.displayStock) * 100}}%</text>
						<view class="progress-bar-box">
							<view
								v-if="(item.saleStock/item.stock) !== 1"
								class="button"
								>
								马上抢
							</view>
								<!-- 进度条 -->
							<view class="progress-bar">
								<view :style="{
									width:((item.displayStock - item.saleStock)/item.displayStock) * 100 + '%'
								}"></view>
							</view>
						</view>
					</view>
					<view class="right-bottom-box" v-else>
						<view class="progress-bar-box">
							<view
								class="button remind"
								:class="{'reminded':isStart}"
								@tap.stop="remind(isStart,resultIndex)"
							>{{isStart ? '已设置提醒' : '提醒我'}}</view>
						</view>
					</view>
					<view
						class="sell-out"
						v-if="(item.saleStock/item.stock) === 1"
					>
						已售罄
					</view>
				</view>
				</view>
				<mescroll-empty v-if="pageData.result.length==0"></mescroll-empty>
				<yu-toast
					:message1="toastData.msg1"
					:message2="toastData.msg2"
					:duration="toastData.duration"
					verticalAlign="center"
					:backgroundColor="toastData.bgColor"
					:color="toastData.fontColor"
					ref="remind"
				></yu-toast>
		</mescroll-uni>
</template>

<script>
	import seckill from '@/api/deadline/seckill.js'
	import yuToast from '@/components/yu-toast/yu-toast'
	import MescrollEmpty from '@/components/mescroll-uni/components/mescroll-empty.vue';
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollMoreItemMixin from "@/components/mescroll-uni/mixins/mescroll-more-item.js"
	import permision from "@/common/utils/permission.js"
	export default {
		mixins: [MescrollMixin,MescrollMoreItemMixin], // 注意此处还需使用MescrollMoreItemMixin (必须写在MescrollMixin后面)
		components:{
			MescrollEmpty,
			yuToast
		},
		data() {
			return {
				downOption:{
				},
				upOption:{
					auto:true, // 不自动加载
					empty:{
						use : false
					},
					toTop: {
						src: require('@/static/image/home/top.png'),
						safearea:true
					},
				},
				// 列表数据
				pageData:{
					result:[]
				},
				mescrollBottom:20,
				// 查询条件
				searchData:{
					// 活动批次
					batchNo:'',
					// 活动编码
					promotionNo:"",
					// 排序字段
					'page.field':"",
					// 排序规则
					'page.order':"",
					// 当前页码
					'page.pageNum':1,
					// 当前页面数据量
					'page.pageSize':10,
				},
				// 消息提醒
				toastData:{
					msg1:'设置提醒成功!',
					msg2:'',
					duration:2000,
					bgColor:"#000000cc",
					fontColor:"#00B60D",
				},
				// 当前时间
				now:new Date(),
				// 倒计时
				setTime:""
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
			tabItem: { // 为了请求数据,演示用,可根据自己的项目判断是否要传
				type: Object,
				default(){
					return {}
				}
			},
			height:{
				type: String,
				default:()=>'100%'
			},
			// 活动名称
			name:{
				type: String,
				default:()=>'限时秒杀'
			},
			// 顶部图片
			placardsUrl:{
				type: String,
				default:()=>''
			},
			// 活动经销商关联关系
			dealerRelation:{
				type: Object,
				default:()=>{}
			},
			// 商品剩余数量显示规则(0:按数量显示,1:按百分比显示)
			itemCountDisplayType:{
				type: Number,
				default:()=> 0
			},
			isDiscountOnly:{
				type: Boolean,
				default:false
			}
		},
		computed:{
			/**
			 * 是否开始
			 */
			isStart(){
				let type = true
				if(new Date(this.tabItem.start.replace(/-/g, '/')).getTime() > this.now.getTime()){
					type = false
				}
				return type
			},
			/**
			 * 显示
			 * 距本场结束/距本场开始
			 */
			calcShowType(){
				let title = '距本场结束'
				if(new Date(this.tabItem.start.replace(/-/g, '/')).getTime() > this.now.getTime()){
					title = '距本场开始'
				}
				return title
			},

			/**
			 * 显示时间
			 */
			calcShowTime(){
				let time = ''
				if(permision.conversionDate(this.tabItem.start).getTime() > this.now.getTime()){
					// 距本场开始
					time = this.timedate(permision.conversionDate(this.tabItem.start),new Date())
				}else if(permision.conversionDate(this.tabItem.end).getTime() > this.now.getTime()){
					// 距本场结束
					time = this.timedate(permision.conversionDate(this.tabItem.end),new Date())
				}else{
					// 本场已结束，调用父页面
					this.$emit('formatData')
				}
				return time
			}
		},
		watch:{
		},
		mounted() {
			this.setTime = setInterval(()=>{
				this.now = new Date()
			},1000)
		},
		methods: {

			/**
			 * 分页查询特定时段下的产品
			 */
			listSeckillPorudctByPage(){
				uni.showLoading({
					title: '加载中'
				});
				let postData = {
					...this.searchData,
					batchNo:this.tabItem.batchNo,
					promotionNo:this.tabItem.promotionNo,
				}
				let payload = this.$jsonFormat(postData)
				return new Promise((resole,reject)=>{
					seckill.listDeadlineProductByPage(payload).then(res => {
						uni.hideLoading();
						resole(res.data)
					}).catch((error) => {
						uni.hideLoading();
						reject(error.msg)
					});
				})
			},

			/**
			 * 上拉加载的回调:
			 * 其中page.num:当前页 从1开始,
			 * page.size:每页数据条数,默认10
			 */
			async upCallback(page) {
				if(page.startNum === this.searchData['page.pageNum']){
					 setTimeout(()=>{
						this.mescroll.endByPage(this.pageData.result.length);
					 },500)
					 return
				}
				this.searchData['page.pageNum'] = page.startNum
				// 然后追加数据
				let curPageData = await this.listSeckillPorudctByPage()
				//设置列表数据
				this.pageData.result = this.pageData.result.concat(curPageData.records); //追加新数据
				//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
				setTimeout(()=>{
					this.mescroll.endByPage(curPageData.records.length);
				},1000)
			},

			/**
			 * 下拉刷新回调
			 */
			async downCallback(page) {
				this.searchData['page.pageNum'] = 1
				this.mescroll.setPageNum(1)
				// 先触发查询
				// this.listSeckillPorudctByPage()
				// 然后追加数据
				let curPageData = await this.listSeckillPorudctByPage()
				//设置列表数据
				this.pageData.result = curPageData.records; //追加新数据
				//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
				setTimeout(()=>{
					this.mescroll.endSuccess(curPageData.records.length);
				},1000)
			},

			//点击空布局按钮的回调
			emptyClick(){
				uni.showToast({
					title:'点击了按钮,具体逻辑自行实现'
				})
			},

			/**
			 * 提醒我
			 * @param {type} 是否提醒 1-未提醒，2-已提醒
			 * @param {index} 集合下标
			 */
			remind(type,index){
				if(type === 1){
					this.toastData = {
						msg1:'设置提醒成功!',
						msg2:'',
						duration:2000,
						bgColor:"#000000cc",
						fontColor:"#00B60D",
					}
					this.$refs.remind.show()
					this.pageData.result[index].type = 2
				}
			},

			/**
			 * 跳转产品详情页
			 */
			toProductDetail(row){
				// 判断该活动分类是否是进行中
				if(new Date(this.tabItem.start.replace(/-/g, "/")).getTime() > this.now.getTime()){
					this.toastData = {
						msg1:'活动还未开始',
						msg2:'去看看别的吧',
						duration:2000,
						bgColor:"#000000cc",
						fontColor:"#ed6d00",
					}
					this.$refs.remind.show()
					return
				}

				// promotionId-活动id
				// promotionNo-活动编码
				// itemNo-活动商品编码
				// batchNo-活动批次
				// 分类类型(0:秒杀活动,1:限时抢购活动,2:商品组合活动)
				const {id,promotionNo,batchNo,itemNo,stock,saleStock} = row
				// 判断该商品是否售空
				if((saleStock/stock) === 1){
					this.toastData = {
						msg1:'该商品已被抢完啦',
						msg2:'去看看别的吧',
						duration:2000,
						bgColor:"#000000cc",
						fontColor:"#ed6d00",
					}
					this.$refs.remind.show()
					return
				}
				let params = {
					batchNo,
					id,
					promotionNo,
					itemNo,
					activeType:0
				}
				let str = this.$jsonFormat(params)
				uni.navigateTo({
					url:'/pages/deadline/product/product-deadline-detail' + str + '&dealerRelation=' + JSON.stringify(this.dealerRelation)
				})
			},


			/**
			 * 立即购买
			 */
			toOrderDetail(row) {
				const productList = [];
				productList.push(row);
				const data = {
					activeProductList:productList,
					isCart:false,
					isActive:0,
					dealerRelation:JSON.stringify(this.dealerRelation)
				}
				uni.navigateTo({
					url: `/pages/products/order/confirm`,
					success: function(res) {
						res.eventChannel.emit("sendParams", data);
					}
				});
			},

			open(){
				// 打开父页面弹窗
				this.$emit('open')
			},

			//a为结束时间
			timedate(start,end) {
					let date1 = new Date(start);
					let date2 = new Date(end);
					let date3 = ((date1 - date2) / 1000).toFixed(0);
					return this.showTime(date3)
			 },
				//创建补0函数
				p(s) {
					let text = s
					if(s < 0){
						text = '00'
					}else if(s < 10){
						text = '0' + s
					}
					return text
				},
				//根据秒数得出时分秒
				showTime(val) {
						if (val < 60) {
								return '00:00:' + this.p(val);
						} else {
								let min_total = Math.floor(val / 60); // 分钟
								let sec = Math.floor(val % 60); // 余秒
								if (min_total < 60) {
										return '00:' + this.p(min_total) + ":" + this.p(sec);
								} else {
										let hour_total = Math.floor(min_total / 60); // 小时数
										let min = Math.floor(min_total % 60); // 余分钟
										return this.p(hour_total) + ":" + this.p(min) + ":" + this.p(sec);
								}
						}
				},
		}
	}
</script>
<style lang="scss" scoped>
	// 底部产品列表
	.seckill-list {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		>image{
			width: calc(100vw - 40rpx);
			height: calc((100vw - 40rpx) * 0.42);
			border-radius: 8rpx;
			margin: 0 auto;
		}
		// 规则
		.active-rule{
			position: absolute;
			right: 20rpx;
			top: 0rpx;
			margin: 20rpx;
			background: #ed6d00;
			padding: 7rpx 12rpx;
			opacity: 0.8;
			font-size: 20rpx;
			font-weight: 500;
			color: #FFFFFF;
			border-radius: 5px;
		}
		.seckill-time-box{
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 100%;
			padding: 20rpx;
			position: sticky;
			top: 0px;
			z-index: 2;
			background-color: #F9F9F9;
			>text{
				font-size: 26rpx;
				font-family: HYYaKuHeiW;
				font-weight: bold;
				font-style: italic;
				color: #1C1C1C;
			}
			.time-item{
				display: flex;
				align-items: center;
				border-radius: 4rpx;
				.time-type{
					font-size: 24rpx;
					font-weight: 500;
					color: #FFFFFF;
					background-color: #E10000;
					padding: 4rpx 12rpx;
					border-top-left-radius: 6rpx;
					border-bottom-left-radius: 6rpx;
				}
				.time-time{
					font-size: 24rpx;
					font-weight: 500;
					padding: 4rpx 17rpx;
					background-color: rgba(255,0,0,0.08);
					color: #E10000;
					border-top-right-radius: 6rpx;
					border-bottom-right-radius: 6rpx;
				}
			}
		}
		.seckill-item {
			background-color: #ffffff;
		}

		.seckill-info {
			padding: 25rpx;
			display: flex;
			flex-direction: column;
		}

		.seckill-info-top {
			display: flex;
			flex-direction: column;
		}

		// 名称
		.seckill-name {
			line-height: 28rpx;
			font-size: 26rpx;
			font-weight: bold;
			color: #1C1C1C;
			overflow: hidden;
			-webkit-line-clamp: 2;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-box-orient: vertical;
		}

		// 标签
		.seckill-tag-list{
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			margin-top: 4rpx;
			width: 100%;
			>view{
				margin-bottom: 4rpx;
				margin-right: 8rpx;
				>text{
					border: 1rpx solid #E10000;
					border-radius: 5rpx;
					font-size: 20rpx;
					font-family: PingFang SC;
					font-weight: 400;
					color: #E10000;
					padding: 0rpx 10rpx;
				}
			}
		}

		// 金额
		.seckill-price{
			display: flex;
			flex-direction: column;
			// 现价
			.price{
				line-height: 22rpx;
				font-size: 22rpx;
				font-weight: bold;
				color: #ed6d00;
			}
			// 原价
			.orgPrice{
				line-height: 16rpx;
				font-size: 16rpx;
				font-weight: 500;
				text-decoration: line-through;
				color: #CCCCCC;
			}
		}

		.right-bottom-box{
			position: absolute;
			right: 24rpx;
			bottom: 24rpx;
			display: flex;
			z-index: 10;
			>text{
				font-size: 20rpx;
				font-weight: 500;
				color: #666666;
				align-items: flex-end;
				display: flex;
				margin-right: 10rpx;
				position: relative;
				top: 10rpx;
			}
			.button{
				padding: 0px 24rpx;
				height: 50rpx;
				font-size: 24rpx;
				background: #E10000;
				border-radius: 25rpx;
				text-align: center;
				line-height: 50rpx;
				color: #fff;
				margin-bottom: 10rpx;
			}
			.progress-bar-box{
				display: flex;
				justify-content: flex-end;
				flex-direction: column;
			}
			.progress-bar{
				width: 130rpx;
				height: 10rpx;
				background: #FFDBDB;
				border-radius: 5rpx;
				overflow: hidden;
				>view{
					background-color: #E10000;
					height: 100%;
				}
			}
			// 提醒我
			.remind{
				background: #00B60D;
				margin-bottom: 0rpx;
			}
			// 已提醒
			.reminded{
				background: #CCCCCC;
			}
		}

		.sell-out{
			position: absolute;
			left: 0px;
			top: 40rpx;
			padding: 8rpx 20rpx 8rpx 8rpx;
			background: #666666;
			border-radius: 0px 5px 5px 0px;
			font-size: 24rpx;
			font-weight: 500;
			color: #CCCCCC;
		}

		// 一列样式
		.one-item {
			width: calc(100vw - 40rpx);
			margin:0 auto 20rpx;
			box-shadow: 0px 6px 26px 0px rgba(123, 71, 46, 0.05);
			border-radius: 5px;
			display: flex;
			position: relative;
			.seckill-image {
				height: calc(100vw / 3 - 50rpx);
				width: calc(100vw / 3 - 25rpx);
				padding: 25rpx 0 25rpx 25rpx;
			}

			.seckill-info {
				width: calc(66.6vw - 40rpx - 10rpx - 50rpx);
				justify-content: space-between;
			}
		}
	}
	// 已售罄
	.gray{
		.seckill-name{
			color: #CCCCCC;
		}
		.seckill-tag-list{
			>view{
				>text{
					border: 1rpx solid #CCCCCC;
					color: #CCCCCC;
				}
			}
		}
		.price{
			color: #CCCCCC!important;
		}
		.right-bottom-box{
			>text{
				color: #CCCCCC;
			}
		}
		.progress-bar{
			background-color: #CCCCCC!important;
		}
	}
</style>

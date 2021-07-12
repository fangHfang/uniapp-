<template>
	<!-- 
	swiper中的transfrom会使fixed失效,此时用height="100%"固定高度; 
	swiper中无法触发mescroll-mixins.js的onPageScroll和onReachBottom方法,只能用mescroll-uni,不能用mescroll-body
	-->
	<!-- ref动态生成: 字节跳动小程序编辑器不支持一个页面存在相同的ref (如不考虑字节跳动小程序可固定值为 ref="mescrollRef") -->
	<view >
		<view id="filter" class="filter-box">
			<view class="flex-calendar-box">
				<view @click="open" class="calendar-box">
					<text class="iconfont calendar"></text>
					<text class="calendar-text">{{calendarInfo.startDate || '开始时间'}}</text>
					<text class="calendar-text">-</text>
					<text class="calendar-text">{{calendarInfo.endDate || '结束时间'}}</text>
				</view>
				<text class="clear-text" @click="clearDate">清空筛选</text>
			</view>
		</view>
		 <mescroll-uni
		    :ref="'mescrollRef'+i"
			@init="mescrollInit"
			:top="mescrollTop" 
			safearea
			:up="upOption" 
			:down="downOption"
			@down="downCallback" 
			@up="upCallback"
			@emptyclick="emptyClick">
			
				<block 
					:id="'item-' + i + '-' + item.id" 
					v-for="(item,resultIndex) in pageData.result" 
					:key="'item-' + i + '-' + resultIndex"
					@click="$emit('toDetail',item)">
					<view class="list">
						<view class="flex a-center j-space-between w">
							<text class="store text-primary">{{item.store}}</text>
							<text class="date text-normal">{{item.date}}</text>
						</view>
						<view>
							<text class="text-gray">客户姓名：</text>
							<text class="text-normal">{{item.name}}</text>
						</view>
						<view>
							<text class="text-gray">客户电话：</text>
							<text class="text-normal">{{item.phone}}</text>
						</view>
						<view>
							<text class="text-gray">车牌号：</text>
							<text class="text-normal">{{item.carNum}}</text>
						</view>
						<view>
							<text class="text-gray">优惠券金额：</text>
							<text class="text-normal">{{item.couponPrice}}</text>
						</view>
					</view>
				</block>
		 </mescroll-uni>
		 <uni-calendar ref="calendar" :clear-date="calendarInfo.toClearDate" :date="calendarInfo.date" :insert="calendarInfo.insert" :lunar="calendarInfo.lunar"  :range="calendarInfo.range" @confirm="confirm" @close="close" />
	</view>
</template>

<script>
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollMoreItemMixin from "@/components/mescroll-uni/mixins/mescroll-more-item.js";
	export default {
		mixins: [MescrollMixin,MescrollMoreItemMixin], // 注意此处还需使用MescrollMoreItemMixin (必须写在MescrollMixin后面)
		data() {
			return {
				downOption:{
					auto:false // 不自动加载 (mixin已处理第一个tab触发downCallback)
				},
				upOption:{
					auto:false, // 不自动加载
					// page: {
					// 	num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
					// 	size: 10 // 每页数据的数量
					// },
					noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					empty:{
						tip: '~ 空空如也 ~', // 提示
						btnText: '去看看'
					},
					toTop:{
						src:""
					}
				},
				goods: [], //列表数据
				// 列表数据 0-咨询，1-社区
				pageData:{
					result:[]
				},
				mescrollTop:0,
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
			// 头部高度
			headHeight:{
				type: Number,
				default(){
					return 0
				}
			}
		},
		watch: {
		  headHeight:{ //深度监听，可监听到对象、数组的变化
		      handler (newV, oldV) {
						this.countTopBar()
		      },
		      deep:true
		     }
		},
		mounted() {
			
		},
		methods: {
			/**
       * 计算顶部DOM元素节点
       */
			async countTopBar(){
				const searchBarHeight = await this.$getComponentsDom('#filter');
				this.mescrollTop = searchBarHeight.bottom - this.headHeight + 'px'
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
				this.calendarInfo.startDate = null
				this.calendarInfo.endDate = null
				this.calendarInfo.toClearDate = true
			},
					
			confirm(e) {
				this.calendarInfo.startDate = e.range.before
				this.calendarInfo.endDate = e.range.after ? e.range.after:e.range.before
				this.calendarInfo.toClearDate = false
			},
			/*下拉刷新的回调 */
			downCallback() {
				let curPageData = [{
					"id": "1",
					"store":"玛吉斯宝山区门店",
					"name": "张三",
					"date":"2021-01-22",
					"phone":'13799290122',
					"carNum":"浙c98d20",
					"couponPrice":200
				},{
					"id": "2",
					"store":"玛吉斯宝山区门店",
					"name": "张三",
					"date":"2021-01-22",
					"phone":'13799290122',
					"carNum":"浙c98d20",
					"couponPrice":200
				},{
					"id": "3",
					"store":"玛吉斯宝山区门店",
					"name": "张三",
					"date":"2021-01-22",
					"phone":'13799290122',
					"carNum":"浙c98d20",
					"couponPrice":200
				},{
					"id": "4",
					"store":"玛吉斯宝山区门店",
					"name": "张三",
					"date":"2021-01-22",
					"phone":'13799290122',
					"carNum":"浙c98d20",
					"couponPrice":200
				},{
					"id": "5",
					"store":"玛吉斯宝山区门店",
					"name": "张三",
					"date":"2021-01-22",
					"phone":'13799290122',
					"carNum":"浙c98d20",
					"couponPrice":200
				},{
					"id": "6",
					"store":"玛吉斯宝山区门店",
					"name": "张三",
					"date":"2021-01-22",
					"phone":'13799290122',
					"carNum":"浙c98d20",
					"couponPrice":200
				},{
					"id": "7",
					"store":"玛吉斯宝山区门店",
					"name": "张三",
					"date":"2021-01-22",
					"phone":'13799290122',
					"carNum":"浙c98d20",
					"couponPrice":200
				},{
					"id": "8",
					"store":"玛吉斯宝山区门店",
					"name": "张三",
					"date":"2021-01-22",
					"phone":'13799290122',
					"carNum":"浙c98d20",
					"couponPrice":200
				},{
					"id": "9",
					"store":"玛吉斯宝山区门店",
					"name": "张三",
					"date":"2021-01-22",
					"phone":'13799290122',
					"carNum":"浙c98d20",
					"couponPrice":200
				},{
					"id": "10",
					"store":"玛吉斯宝山区门店",
					"name": "张三",
					"date":"2021-01-22",
					"phone":'13799290122',
					"carNum":"浙c98d20",
					"couponPrice":200
				}]
				this.pageData.result = curPageData
				setTimeout(() => {
					//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
					this.mescroll.endSuccess(curPageData.length);
				}, 1000)
				// 这里加载你想下拉刷新的数据, 比如刷新轮播数据
				// loadSwiper();
				// 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
				// this.mescroll.resetUpScroll()
			},
			/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
			upCallback(page) {
				//联网加载数据
				let keyword = this.tabs[this.i].name
				//联网加载数据
				setTimeout(() => {
					let curPageData = [{
					"id": "1",
					"store":"玛吉斯宝山区门店",
					"name": "张三",
					"date":"2021-01-22",
					"phone":'13799290122',
					"carNum":"浙c98d20",
					"couponPrice":200
				},{
					"id": "2",
					"store":"玛吉斯宝山区门店",
					"name": "张三",
					"date":"2021-01-22",
					"phone":'13799290122',
					"carNum":"浙c98d20",
					"couponPrice":200
				},{
					"id": "3",
					"store":"玛吉斯宝山区门店",
					"name": "张三",
					"date":"2021-01-22",
					"phone":'13799290122',
					"carNum":"浙c98d20",
					"couponPrice":200
				},{
					"id": "4",
					"store":"玛吉斯宝山区门店",
					"name": "张三",
					"date":"2021-01-22",
					"phone":'13799290122',
					"carNum":"浙c98d20",
					"couponPrice":200
				},{
					"id": "5",
					"store":"玛吉斯宝山区门店",
					"name": "张三",
					"date":"2021-01-22",
					"phone":'13799290122',
					"carNum":"浙c98d20",
					"couponPrice":200
				},{
					"id": "6",
					"store":"玛吉斯宝山区门店",
					"name": "张三",
					"date":"2021-01-22",
					"phone":'13799290122',
					"carNum":"浙c98d20",
					"couponPrice":200
				},{
					"id": "7",
					"store":"玛吉斯宝山区门店",
					"name": "张三",
					"date":"2021-01-22",
					"phone":'13799290122',
					"carNum":"浙c98d20",
					"couponPrice":200
				},{
					"id": "8",
					"store":"玛吉斯宝山区门店",
					"name": "张三",
					"date":"2021-01-22",
					"phone":'13799290122',
					"carNum":"浙c98d20",
					"couponPrice":200
				},{
					"id": "9",
					"store":"玛吉斯宝山区门店",
					"name": "张三",
					"date":"2021-01-22",
					"phone":'13799290122',
					"carNum":"浙c98d20",
					"couponPrice":200
				},{
					"id": "10",
					"store":"玛吉斯宝山区门店",
					"name": "张三",
					"date":"2021-01-22",
					"phone":'13799290122',
					"carNum":"浙c98d20",
					"couponPrice":200
				}]
				//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
					this.mescroll.endSuccess(curPageData.length);
					//设置列表数据
					this.pageData.result = this.pageData.result.concat(curPageData); //追加新数据
				}, 1000)
				// apiSearch(page.num, page.size, keyword).then(curPageData=>{
				// 	//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
				// 	this.mescroll.endSuccess(curPageData.length);
				// 	//设置列表数据
				// 	if(page.num == 1) this.goods = []; //如果是第一页需手动制空列表
				// 	this.goods=this.goods.concat(curPageData); //追加新数据
				// }).catch(()=>{
				// 	//联网失败, 结束加载
				// 	this.mescroll.endErr();
				// })
			},
			//点击空布局按钮的回调
			emptyClick(){
				uni.showToast({
					title:'点击了按钮,具体逻辑自行实现'
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	.list{
		background-color: #fff;
		width:calc(100% - 40rpx);
		padding:20rpx;
		margin-bottom:20rpx;
		.store{
			font-size:30rpx;
			padding-bottom:5rpx;
		}
		.date{
			font-size:24rpx;
		}
	}
	.filter-box{
		display: flex;
		flex-direction: column;
		width:100%;
		padding-top:20rpx;
		padding-bottom:20rpx;
		background-color: #f1f1f1;
		position: relative;
		z-index:90;
		.flex-calendar-box{
			border-radius:30rpx;
			background-color:#fff;
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

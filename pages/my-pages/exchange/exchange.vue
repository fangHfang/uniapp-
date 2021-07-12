<template>
	<view class="page">
		<uni-nav-bar class="high-zindex" title="兑换点统计" left-icon="back" backgroundColor="#ed6d00" color="#fff" @clickLeft="toBack"></uni-nav-bar>
		<view class="con-container">
			<view class="filter-box">
				<uni-search-bar 
					ref="searchBar"
					class="high-zindex" 
					radius="100" 
					placeholder="兑换礼品搜索"
					cancelButton="none"
					@focus='searchFocus'
					@confirm="search"
					@clear="clear"/>
			</view>
			<mescroll-uni 
				ref="mescrollRef" 
				@init="mescrollInit"
				:safearea="true" 
				:top="pageOptions.mescrollTop"
				:bottom="pageOptions.mescrollBottom"
				@down="downCallback" 
				:up="upOption" 
				@up="upCallback">
				<view class="content">
					<view 
						class="detail-list" 
						v-for="(item,index) in pageData.result" 
						:key="index"
						 @click="toExchangeDetail(item)">
						<view class="order flex a-center j-space-between">
							<view class="order-num">{{item.epRuleName}}</view>
							<icon class="iconfont right" type=""></icon>
						</view>
						<view class="line"></view>
						<view class="content-order flex a-center j-space-between">
							<view class="content-name flex a-center j-center flex-column">
								<view class="order-name">需要兑换点</view>
								<view class="need-num">{{item.exchangeAmount}}</view>
							</view>
							<view class="content-name flex a-center j-center flex-column">
								<view class="order-name">已有兑换点</view>
								<view class="exist-num">{{item.amount}}</view>
							</view>
						</view>
						<view class="line"></view>
						<view class="order flex a-center j-space-between">
							<view class="order-num">活动时间: {{item.exchangeStartTime.substring(0,10)}} ~ {{item.exchangeEndTime.substring(0,10)}}</view>
						</view>
					</view>
				</view>
				<mescroll-empty v-if="pageData.result.length==0"></mescroll-empty>
			</mescroll-uni>
		</view>
	</view>
</template>

<script>
	import MescrollEmpty from '@/components/mescroll-uni/components/mescroll-empty.vue';
	import exchange from '@/api/user/exchange.js'	
	export default {
		name: 'exchange',
		components: {MescrollEmpty},
		data() {
			return {
				upOption: {
					onScroll:true,
					auto:true,
					noMoreSize: 5,
					empty: {
						use: false
					},
					toTop: {
						src: require('@/static/image/home/top.png'),
						safearea:true
					},
				},
				// 下拉刷新组件实例
				mescroll: null,
				// 页面配置
				pageOptions: {
					// 适配刘海屏
					mescrollTop:0,
					mescrollBottom:0,
					// 橱窗配图
					url:'',
					// 页面名称
					name:"",
					// 分类类型(0:秒杀活动,1:限时抢购活动,2:商品组合活动)
					categoryType:0
				},
				// 底部产品列表数据
				pageData: {
					result: []
				},
				// 查询条件
				searchData:{
					// 兑换规则
					ruleName:"",
					// 当前页码
					pageNum:1,
					// 当前页面数据量
					pageSize:10,
				},
				// 是否光标置入搜索框
				isFocus:false
			}
		},
		mounted() {
			this.setRealMescrollPosition()
		},
		methods: {
			/**
			 * 返回上一级页面
			 */
			toBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			/**
			 * 设置实际的内容区域到顶部距离
			 */
			setRealMescrollPosition() {
				let statusHeight = uni.getSystemInfoSync().statusBarHeight
				this.pageOptions.mescrollTop = (statusHeight + 45 + 52) + 'px'
			},
			/**
			 * 分页查询订单数据
			 */
			listExchangelByPage(){
				uni.showLoading({
					title: '加载中'
				});
				let payload = this.$jsonFormat(this.searchData)
				return new Promise((resole,reject)=>{
					exchange.listExchangeByPage(payload).then(res => {
						uni.hideLoading();
						resole(res.data)
					}).catch((error) => {
						uni.hideLoading();
						reject(error.msg)
					});
				})
			},
			/**
			 * 初始化回调方法
			 * @param {Object} mescroll
			 */
			mescrollInit(mescroll) {
				this.mescroll = mescroll
			},
			/**
			 * 上拉加载的回调:
			 * 其中page.num:当前页 从1开始,
			 * page.size:每页数据条数,默认10
			 */
			async upCallback(page) {
				if(page.startNum === this.searchData.pageNum){
					 setTimeout(()=>{
						this.mescroll.endByPage(this.pageData.result.length);
					 },500)
					 return
				}
				this.searchData['page.pageNum'] = page.startNum
				// 然后追加数据
				let curPageData = await this.listExchangelByPage()
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
				this.searchData.pageNum = 1
				this.mescroll.setPageNum(1)
				// 先触发查询
				// this.listExchangelByPage()
				// 然后追加数据
				let curPageData = await this.listExchangelByPage()
				//设置列表数据
				this.pageData.result = curPageData.records;
				//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
				setTimeout(()=>{
					this.mescroll.endSuccess(curPageData.records.length);
				},1000)
			},
			
			/**
			 * 查看兑换详情
			 * @param {Object} id
			 */
			toExchangeDetail(row){
				const {epRuleNo} = row
				uni.navigateTo({
					url:'exchange-details/exchange-details?ruleNo=' + epRuleNo
				})
			},
			
			/**
			 * 搜索框焦点选中时 
			 */
			searchFocus(){
				this.isFocus = true
			},
			
			// 输入监听
			search(val){
				// 查询方法 val 是对象
				this.searchData.ruleName = val.value;
				this.downCallback()			
			},
			/**
			 * 清除搜索条件
			 */
			clear(){
				this.searchData.ruleName = '';
				this.downCallback()		
			},
			
			/**
			 * 滚动监听，隐藏键盘
			 */
			scroll(){
				if(this.isFocus){
					this.isFocus = false
					this.$refs['searchBar'].showRefs()
				}
			}
		}
	}
</script>

<style lang="scss">
	.page{
		height: 100vh;
	}
	.high-zindex {
		position: relative;
		z-index: 102;
	}

	.con-container {
		width: 100%;
		position: relative;
	}
	.mescroll-uni-warp /deep/ .mescroll-uni-fixed{
		background-color: #F2F2F2;
	}
	.content{
		width: calc(100% - 20px);
		height: 100%;
		padding: 10px;
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
			}
			.iconfont{
				color: #1C1C1C;
				font-size: 9px;
				opacity: 0.62;
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
				width: calc((100% - 60px) / 2);
				.order-name{
					color: #1C1C1C;
					margin-bottom: 5px;
				}
				.need-num{
					color: #ed6d00;
				}
				.exist-num{
					font-weight: bold;
				}
			}
		}
	}
</style>

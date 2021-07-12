<template>
	<view class="page" :style="`height:${systemInfo.windowHeight}px`">
		<uni-nav-bar id="navbar" title="退货管理" left-icon="back" backgroundColor="#ed6d00" color="#fff" @clickLeft="toBack" />
		<view class="card-box">
			<mescroll-uni
				ref="mescrollRef" 
				@init="mescrollInit" 
				class="mescroll-uni"
				:top="pageOptions.mescrollTop" 
				:bottom="pageOptions.mescrollBottom" 
				safearea
				@down="downCallback" 
				@up="upCallback">
				<view class="item-return" v-for="(item,index) in pageData.result" :key="index" @click="toDetail(item)">
					<view class="return-num flex">
						<view>退货单号：</view>
						<view>{{item.orderRefundNo}}</view>
					</view>
					<view class="mb10 flex">
						<view class="item-title">申请门店：</view>
						<view>{{item.storeName}}</view>
					</view>
					<view class="mb10 flex">
						<view class="item-title">申请时间：</view>
						<view>{{item.orderRefundApplyTime}}</view>
					</view>
					<view class="mb10 flex">
						<view class="item-title flex j-space-between">金<text class="space">额：</text></view>
						<view>￥{{item.orderRefundAmount}}</view>
					</view>
					<view class="mb10 flex">
						<view class="item-title flex j-space-between">玛<text class="space">元：</text></view>
						<view>{{item.orderRefundRebateAmount ? orderRefundRebateAmount : '0'}}</view>
					</view>
				</view>
				<mescroll-empty v-if="pageData.result.length==0"></mescroll-empty>
			</mescroll-uni>
		</view>
		<view class="page-bottom" :style="`height:${safeArea.bottom + 70}px`" @click="confirm">
			<text class="buttom-btn" :style="`margin-bottom:${safeArea.bottom}px`">新增退货</text>
		</view>
	</view>
</template>

<script>
	import refund from '@/api/order/refund.js'
	import MescrollEmpty from '@/components/mescroll-uni/components/mescroll-empty.vue';
	export default {
		name:'returnList',
		components:{
			MescrollEmpty
		},
		data() {
			return {
				systemInfo: uni.getSystemInfoSync(),
				// 底部产品列表数据
				pageData: {
					result: []
				},
				// 下拉刷新组件实例
				mescroll: null,
				// 页面配置
				pageOptions: {
					// 适配刘海屏
					mescrollTop:40,
					mescrollBottom:20,
				},
				// 查询条件
				searchData:{
					// 活动类型编码
					pageReq:{
						// 排序字段
						field:"",
						// 排序规则
						order:"",
						// 当前页码
						pageNum:1,
						// 当前页面数据量
						pageSize:10
					}
				},
			}
		},
		computed:{
			//安全区域
			safeArea(){
				return this.systemInfo.safeAreaInsets
			}
		},
		onShow() {
			// 每次进入列表页清空新增页的扫码退货记录
			this.$store.commit('work/setReturnCollection',[])
		},
		mounted() {
			this.countTopBar()
		},
		onShow(){
			// 用于新增后刷新列表页
			this.refreshAllOrder()
		},
		methods: {
			/**
			 * 计算顶部DOM元素节点
			 */
			async countTopBar(){
				const searchBarHeight = await this.$getComponentsDom('#navbar');
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
			 * 分页查询入库记录
			 */
			listRefundRecordByPage(){
				uni.showLoading({
					title: '加载中'
				});
				let payload = JSON.parse(JSON.stringify(this.searchData))
				return new Promise((resole,reject)=>{
					refund.listRefundByPage(payload).then(res => {
						uni.hideLoading();
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
				let curPageData = await this.listRefundRecordByPage()
				//设置列表数据
				this.pageData.result = curPageData.records;
				//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
				setTimeout(()=>{
					this.mescroll.endSuccess(curPageData.records.length);
				},1000)
			},
			/**
			 * 上拉加载的回调: 
			 * 其中page.num:当前页 从1开始, 
			 * page.size:每页数据条数,默认10 
			 */
			async upCallback(page) {
				if(page.startNum === this.searchData.pageReq.pageNum){
					 setTimeout(()=>{
						this.mescroll.endByPage(this.pageData.result.length);
					 },500)
					 return
				}
				this.searchData.pageReq.pageNum = page.startNum
				// 然后追加数据
				let curPageData = await this.listRefundRecordByPage()
				//设置列表数据
				this.pageData.result = this.pageData.result.concat(curPageData.records); //追加新数据
				//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
				setTimeout(()=>{
					this.mescroll.endByPage(curPageData.records.length);
				},1000)
			},
			
			/**
			 * 返回上一页
			 */
			toBack(){
				uni.navigateBack({
					delta: 1
				})
			},
			/**
			 * 查看详情
			 * @param {strinng} orderRefundNo 退货单编号
			 */
			toDetail(row){
				let param = this.$jsonFormat(row)
				uni.navigateTo({
					url:"/pages/work/return/detail" + param
				})
			},
			/**
			 * 新增退货
			 */
			confirm(){
				uni.navigateTo({
					url:"/pages/work/return/add"
				})
			},
			
			/**
			 * 用于新增后刷新列表状态
			 */
			refreshAllOrder(){
				if(this.mescroll){
					this.downCallback()
				}
			}
		}
	}
</script>

<style lang="scss">
	.page {
		background-color: #F2F2F2;
		position:relative;
		overflow:hidden;
	}
	.card-box {
		height: calc(100vh - 45px - 71px - var(--status-bar-height));
		color:$uni-text-color;
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		/* #endif */
		overflow-y: auto;
	}
	.item-return{
		color: #252527;
		font-size: 12px;
		font-weight: bold;
		padding: 15px 10px;
		background: #fff;
		border-bottom: 1rpx solid rgba(204,204,204,0.5);
		.return-num{
			color: #FF4322;
			margin-bottom: 13px;
		}
		.item-title{
			opacity: 0.8;
			font-weight: 400;
		}
		.space{
			text-indent: 2em;
		}
	}
	.item-return:nth-last-of-type(1){
		border: none;
	}
	.page-bottom{
		background-color: #fff;
		position:fixed;
		bottom: 0;
		left:0;
		right:0;
		padding:0 10px;
		border-top: 1rpx solid rgba(182,182,182,.5);
		z-index: 9;
	}
	.buttom-btn{
		height:40px;
		line-height: 40px;
		text-align: center;
		border-radius:20px;
		background-color: $uni-color-primary;
		color:#fff;
		position:absolute;
		top:15px;
		left:10px;
		right:10px;
		font-size: $uni-font-size-base;
	}
	.mb10{
		margin-bottom: 10px;
	}
</style>

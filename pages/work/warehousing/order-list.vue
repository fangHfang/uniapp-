<template>
	<view class="page">
		<uni-nav-bar id="navBar" title="订单扫码记录" left-icon="back" backgroundColor="#ed6d00" color="#fff" @clickLeft="toBack"></uni-nav-bar>
		<mescroll-uni
			ref="mescrollRef" 
			@init="mescrollInit" 
			class="mescroll-uni"
			:top="pageOptions.mescrollTop" 
			:bottom="pageOptions.mescrollBottom" 
			safearea
			@down="downCallback" 
			@up="upCallback">
			<view  class="list-item" v-for="(item,index) in pageData.result" :key="index">
				<view class="slot-body">
					<view  class="item-body">
						<view class="item-title-box">
							<text class="item-title">{{item.itemName}}</text>
						</view>
						<view class="sb-item-box">
							<icon class="iconfont barcode" style='font-size: 32rpx;color: #999999;' type=""></icon>
							<text class="sb-item-text">{{item.itemBarCode}}</text>
						</view>
					</view>
					<view  class="item-head">
						<text class="order-number"></text>
						<text class="date">{{item.scanCodeTime}}</text>
					</view>
				</view>
			</view>
			<mescroll-empty v-if="pageData.result.length==0"></mescroll-empty>
		</mescroll-uni>
	</view>
</template>

<script>
	// 订单专用入库记录
	import MescrollEmpty from '@/components/mescroll-uni/components/mescroll-empty.vue';
	import warehouse from '@/api/order/warehouse.js'
	import {dateFormat} from '@/common/utils/DateUtil'
	export default {
		name: 'warehousingList',
		components: {
			MescrollEmpty
		},
		data() {
			return {
				systemInfo:uni.getSystemInfoSync(),
				// 下拉刷新组件实例
				mescroll: null,
				// 页面配置
				pageOptions: {
					// 适配刘海屏
					mescrollTop:40,
					mescrollBottom:20
				},
				// 查询条件
				searchData:{
					// 订单编号
					orderNo:"",
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
				// 底部产品列表数据
				pageData: {
					result: []
				},
			}
		},
		onLoad(e) {
			const { orderNo } = e
			this.searchData.orderNo = orderNo
		},
		mounted() {
			this.countTopBar()
		},
		methods: {
			/**
       * 计算顶部DOM元素节点
       */
			async countTopBar(){
				const searchBarHeight = await this.$getComponentsDom('#navBar');
				this.pageOptions.mescrollTop = searchBarHeight.bottom + 10 + 'px'
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
			toBack(){
				uni.navigateBack({
					delta: 1
				})
			},

			/**
			 * 分页查询入库记录
			 */
			listWarehousingRecordByPage(){
				uni.showLoading({
					title: '加载中'
				});
				let payload = JSON.parse(JSON.stringify(this.searchData))
				return new Promise((resolve,reject)=>{
					warehouse.listWarehouseOrderNoByPage(payload).then(res => {
						uni.hideLoading();
						resolve(res.data)
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
				let startNum = page.num + 1
				if(startNum === this.searchData.pageReq.pageNum){
					 setTimeout(()=>{
						this.mescroll.endByPage(this.pageData.result.length);
					 },500)
					 return
				}
				this.searchData.pageReq.pageNum = startNum
				// 然后追加数据
				let curPageData = await this.listWarehousingRecordByPage()
				//设置列表数据
				this.pageData.result = this.pageData.result.concat(curPageData.records); //追加新数据
				//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
				setTimeout(()=>{
					this.mescroll.endByPage(curPageData.records.length);
				},1000)
			},
		}
	}
</script>

<style lang="scss">
	.mescroll-uni{
		padding-top: var(--status-bar-height);
	}
	.page{
		min-height: 100vh;
		overflow-y: hidden;
		background-color: #F2F2F2;
	}
	.filter-box{
		display: flex;
		flex-direction: column;
		width:100vw;
		background-color:#f2f2f2;
		position: relative;
		z-index:90;
		.flex-calendar-box{
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
	.list-item{
		width:calc(100vw - 80rpx);
		margin-left:20rpx;
		margin-bottom:20rpx;
		padding:20rpx;
		background-color: #fff;
	}
	.slot-body{
		width:100%;
	}
	.item-head{
		display: flex;
		flex-direction:row;
		justify-content: space-between;
		width:100%;
		border-top-width:1rpx;
		border-top-color:#eee;
		border-top-style: solid;
		margin-top: 10px;
		padding-top: 5px;
		.order-number{
			padding-bottom:20rpx;
			color:$uni-color-primary;
			font-size:24rpx;
		}
		.date{
			color:$uni-text-color-grey;
			font-size:24rpx;
		}
	}
	.item-body{
		width:100%;
		.item-title-box{
			display: flex;
			justify-content: space-between;
			.item-title{
				color:#333;
				font-size:28rpx;
				font-weight:500;
			}
		}
		
		.sb-item-box{
			display: flex;
			flex-direction:row;
			align-items: center;
			margin-top: 10rpx;
		}
		.sb-item-text{
			color:$uni-text-color-grey;
			font-size:24rpx;
			margin-left: 20rpx;
		}
	}
	
	
</style>

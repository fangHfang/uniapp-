<template>
	<view class="page" :style="`height:${systemInfo.windowHeight}px`">
		<uni-nav-bar id="navbar" title="退货管理" left-icon="back" backgroundColor="#ed6d00" color="#fff" @clickLeft="toBack"></uni-nav-bar>
		<view class="function-content">
			<view id="detailTitle" class="content-title">基本信息</view>
			<view id="detailBox" class="feedback">
				<view class="return-num flex a-center">
					<view>退货单号：</view>
					<view>{{administration.orderRefundNo}}</view>
				</view>
				<view class="mt10 flex">
					<view class="item-title">退货门店：</view>
					<view>{{administration.storeName}}</view>
				</view>
				<view class="mt10 flex">
					<view class="item-title">申请时间：</view>
					<view>{{administration.orderRefundApplyTime}}</view>
				</view>
				<view class="mt10 flex">
					<view class="item-title flex j-space-between">金<text class="space">额：</text></view>
					<view>￥{{administration.orderRefundAmount}}</view>
				</view>
				<view class="mt10 flex">
					<view class="item-title flex j-space-between">备<text class="space">注：</text></view>
					<view>{{administration.orderRefundMemo !== 'null' ? administration.orderRefundMemo : '无'}}</view>
				</view>
			</view>
			<view class="content-title">退货明细</view>
			<mescroll-uni
				ref="mescrollRef" 
				@init="mescrollInit" 
				class="mescroll-uni"
				:top="pageOptions.mescrollTop" 
				:bottom="pageOptions.mescrollBottom" 
				safearea
				@down="downCallback" 
				@up="upCallback">
				<view 
					class="feedback" 
					v-for="(item,index) in pageData.result" 
					:key="index" 
					style="padding: 15px 10px;margin-bottom: 10px;">
					<view class="flex">
						<view class="item-title flex j-space-between" style="width: 18%;">订<text>单</text><text>号：</text></view>
						<view>{{item.orderNo}}</view>
					</view>
					<view class="mt10 flex">
						<view class="item-title">花纹规格：</view>
						<view>{{item.itemSpecDetail}}</view>
					</view>
					<view class="mt10 flex">
						<view class="item-title flex j-space-between">条<text class="space">码：</text></view>
						<view>{{item.itemBarCode}}</view>
					</view>
					<view class="mt10 flex">
						<view class="item-title flex j-space-between">金<text class="space">额：</text></view>
						<view>￥{{item.refundAmount}}</view>
					</view>
				</view>
			</mescroll-uni>
			
		</view>
	</view>
</template>

<script>
	import refund from '@/api/order/refund.js'
	import MescrollEmpty from '@/components/mescroll-uni/components/mescroll-empty.vue';
	export default {
		name: 'returnDetail',
		components: {
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
				// 退货单信息
				administration:{
					// orderRefundNo:'1237982173',
					// storeName:'浦东新区陆家嘴门店',
					// orderRefundApplyTime:'2020-10-15 11:55:21',
					// money:'2000',
					// remarks:'这里是备注内容'
				},
				// 查询条件
				searchData:{
					orderRefundNo:'',
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
		onLoad(option) {
			const {orderRefundNo,storeName,orderRefundApplyTime,orderRefundAmount,orderRefundMemo} = option
			this.administration = {
				// 退货单号
				orderRefundNo,
				// 门店名称
				storeName,
				// 退换时间
				orderRefundApplyTime,
				// 退款金额
				orderRefundAmount,
				// 备注
				orderRefundMemo
			}
			this.searchData.orderRefundNo = orderRefundNo
		},
		mounted() {
			this.countTopBar()
		},
		methods: {
			/**
			 * 计算顶部DOM元素节点
			 */
			async countTopBar(){
				const searchBarHeight = await this.$getComponentsDom('#navbar');
				const detailTitle = await this.$getComponentsDom('#detailTitle');
				const detailBox = await this.$getComponentsDom('#detailBox');
				this.pageOptions.mescrollTop = searchBarHeight.bottom + detailTitle.bottom + (detailBox.bottom * 2) - 40 + 'rpx'
			},
			/**
			 * 分页查询入库记录
			 */
			listRefundRecordItemByPage(){
				uni.showLoading({
					title: '加载中'
				});
				let payload = JSON.parse(JSON.stringify(this.searchData))
				return new Promise((resole,reject)=>{
					refund.getRefundDetail(payload).then(res => {
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
				// this.listRefundRecordItemByPage()
				// 然后追加数据
				let curPageData = await this.listRefundRecordItemByPage()
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
				let curPageData = await this.listRefundRecordItemByPage()
				//设置列表数据
				this.pageData.result = this.pageData.result.concat(curPageData.records); //追加新数据
				//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
				setTimeout(()=>{
					this.mescroll.endByPage(curPageData.records.length);
				},1000)
			},
			/**
			 * 返回上一级页面
			 */
			toBack(){
				uni.navigateBack({
					delta: 1
				})
			},
		}
	}
</script>

<style lang="scss">
	.page{
		background-color: #FFFFFF;
		.function-content{
			color: #1C1C1C;
			font-size: 13px;
			padding: 0 10px;
			overflow: hidden;
			.content-title{
				color: #252527;
				padding: 15px 0;
				font-weight: bold;
			}
			.feedback{
				background: #fff;
				padding: 10px;
				padding-top: 0;
				border-radius: 3px;
				color: #252527;
				font-size: 12px;
				font-weight: bold;
				box-shadow: 0px 3px 15px 0px rgba(0, 0, 0, 0.05);
				.return-num{
					height: 48px;
					border-bottom: 1rpx solid rgba(204,204,204,0.5);
				}
				.item-title{
					opacity: 0.8;
					font-weight: 400;
				}
				.space{
					text-indent: 2em;
				}
			}
		}
	}
	.mt10{
		margin-top: 10px;
	}
</style>

<template>
	<view class="page">
		<uni-nav-bar
			id="navbar"
			title="订单详情"
			backgroundColor="#ed6d00"
			color="#fff"
			left-icon="back"
			@clickLeft="navBack"
		></uni-nav-bar>
		<mescroll-uni
			ref="mescrollRef" 
			@init="mescrollInit" 
			class="mescroll-uni"
			:top="pageOptions.mescrollTop" 
			:bottom="pageOptions.mescrollBottom" 
			safearea
			@down="downCallback" 
			@up="upCallback">
			<!-- 订单信息 -->
			<view class="item-title">订单信息</view>
			<view class="item-bg">
				<view class="renew-no-status flex j-space-between">
					<view class="renew-no">订单编号:&nbsp;{{tableData.renewNo}}</view>
					<view class="renew-status compulsory-receipt" v-if="tableData.renewStatus === '0'" @click="toRunEase">安心跑未激活</view>
					<view class="renew-status done-receiving-goods" v-else-if="tableData.renewStatus === '1'" @click="toRunEase">安心跑已激活</view>
				</view>
				<view class="renew-name-number flex a-center">
					<view class="item-icon flex a-center j-center">
						<icon class="iconfont dingdan" type=""></icon>
					</view>
					<view class="item-vehicle">
						<view class="item-vehicle-num flex a-center">
							<view class="item-vehicle-name">车主手机号:</view>
							<view class="renew-name">{{tableData.ownerPhone}}</view>
						</view>
						<view class="item-vehicle-num flex a-center">
							<view class="item-vehicle-name">下单时间:</view>
							<view class="renew-name">{{tableData.orderTime}}</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 车辆信息 -->
			<view class="item-title">车辆信息</view>
			<view class="item-bg">
				<view class="renew-no-status flex j-space-between">
					<view class="renew-no">车牌号:&nbsp;{{tableData.plateNo}}</view>
				</view>
				<view class="renew-name-number flex a-center">
					<view class="item-icon flex a-center j-center">
						<icon class="iconfont cheliang" type=""></icon>
					</view>
					<view class="item-vehicle">
						<view class="item-vehicle-num flex a-center">
							<view class="item-vehicle-name">车架号:</view>
							<view class="renew-name">{{tableData.frameNo}}</view>
						</view>
						<view class="item-vehicle-num flex a-center">
							<view class="item-vehicle-name">车型:</view>
							<view class="renew-name">{{tableData.model}}</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 订单明细 -->
			<view class="item-title">订单明细</view>
			<view class="item-bg" style="padding: 30rpx;">
				<view class="item-detail">
					<view class="item-vehicle">
						<view class="item-vehicle-num flex a-center">
							<view class="item-vehicle-name">规格明细:</view>
							<view class="renew-num">{{tableData.spec}}</view>
						</view>
						<view class="item-vehicle-num flex a-center">
							<view class="item-vehicle-name">条码:</view>
							<view class="renew-num">{{tableData.barCode}}</view>
						</view>
						<view class="item-vehicle-num flex a-center">
							<view class="item-vehicle-name">周期:</view>
							<view class="renew-num">{{tableData.cycle}}</view>
						</view>
					</view>
				</view>
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 0-可换新,1-审核中,2-未通过,3-已通过,4-已换新
				renew:{
					status:2
				},
				searchData:{
					renewNo:'',
				},
				tableData: {
					renewNo:"",
					renewStatus:"1",
					ownerPhone:"13852451254",
					orderTime:"2021-03-01 13:11:11",
					plateNo:"沪A·O8595",
					frameNo:"LKJ5214521252541",
					model:"日产 ",
					spec:"225/60 13   A17",
					barCode:"89555555222222",
					cycle:"55666"
				},
				// 下拉刷新组件实例
				mescroll: null,
				// 页面配置
				pageOptions: {
					// 适配刘海屏
					mescrollTop:40,
					mescrollBottom:0,
				},
			}
		},
		computed:{
		},
		//路由传值
		onLoad(option) {
		   const { renewNo } = option;
		   this.searchData.renewNo = renewNo;
		},
		onUnload(){
			
		},
		mounted(){
			this.countTopBar()
			this.renewNoDetail()
		},
		methods: {
			/**
			 * 返回上一页
			 */
			navBack(){
				uni.navigateBack({
					delta: 1
				});
			},
			/**
			 * 计算顶部DOM元素节点
			 */
			async countTopBar(){
				const searchBarHeight = await this.$getComponentsDom('#navbar');
				this.pageOptions.mescrollTop = searchBarHeight.height + 'px'
			},
			/**
			 * 分页查询订单详情
			 */
			renewNoDetail(){
				
			},
			/**
			 * 下拉刷新回调
			 */
			async downCallback() {
				this.mescroll.setPageNum(1)
				// 先触发查询
				// this.renewNoDetail()
				//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
				setTimeout(()=>{
					this.mescroll.endSuccess();
				},1000)
			},
			/**
			 * 上拉加载的回调: 
			 * 其中page.num:当前页 从1开始, 
			 * page.size:每页数据条数,默认10 
			 */
			async upCallback(page) {
				//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
				setTimeout(()=>{
					this.mescroll.endByPage();
				},1000)
			},
			/**
			 * 去填写安心跑资料
			 */
			toRunEase(){
				uni.navigateTo({
					url:"/pages/work/renew/run-ease/renew-ease?renewNo=" + this.searchData.renewNo
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	.page{
		background-color: #f2f2f2;
		height: 100vh;
	}
	.mescroll-uni{
		height: calc(100% - 88rpx - 2rpx - var(--status-bar-height));
	}
	.item-title {
		color: #333;
		font-size: 26rpx;
		padding: 20rpx;
	}
	// 订单信息
	.item-bg {
		background: #fff;
		// padding-bottom: 10rpx;
	}
	
	// 订单号，订单状态
	.renew-no-status {
		padding: 20rpx 0;
		border-bottom: 1px solid #F2F2F2;
	
		// 订单号
		.renew-no {
			padding-left: 20rpx;
			font-size: 26rpx;
			font-weight: 600;
			// color: #666666;
			display: flex;
			align-items: center;
		}
	
		// 订单状态
		.renew-status {
			width: 200rpx;
			height: 50rpx;
			color: #fff;
			font-size: 26rpx;
			font-weight: bold;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 25rpx 0 0 25rpx;
		}
	}
	
	// 车主信息
	.renew-name-number {
		width: calc(100% - 40rpx);
		padding: 40rpx 20rpx;
	
		.item-icon {
			width: 76rpx;
			height: 76rpx;
			color: #fff;
			background: #F35337;
			border-radius: 10rpx;
			margin-right: 20rpx;
	
			.iconfont {
				font-size: 50rpx;
			}
		}
	
		.item-vehicle {
			width: calc(100% - 96rpx);
		}
	
		.item-vehicle-name {
			width: 168rpx;
			color: #616161;
			font-size: 24rpx;
		}
	
		.item-vehicle-num {
			margin-bottom: 20rpx;
		}
	
		.item-vehicle-num:nth-last-of-type(1) {
			margin-bottom: 0;
		}
	
		// 订单名称
		.renew-name {
			width: 80%;
			font-size: 24rpx;
			font-weight: bold;
			color: #252527;
			overflow: hidden;
			-webkit-line-clamp: 1;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-box-orient: vertical;
		}
	
		// 订单数量
		.renew-number {
			font-size: 24rpx;
			font-weight: bold;
			color: #252527;
		}
	}
	// 订单详情
	.item-detail {
		padding: 34rpx 80rpx;
		border-radius: 20rpx;
		background: #F2F2F2;
		border: 1px solid #E5E5E5;
		position: relative;
	
		.item-vehicle-num {
			margin-bottom: 20rpx;
		}
	
		.item-vehicle-num:nth-last-of-type(1) {
			margin-bottom: 0;
		}
	
		.item-vehicle-name {
			width: 168rpx;
			font-weight: bold;
			font-size: 26rpx;
		}
	
		.renew-num {
			color: #616161;
			font-size: 26rpx;
		}
		.detail-state {
			position: absolute;
			top: 12rpx;
			right: 12rpx;
		
			.renew-status {
				width: 92rpx;
				height: 40rpx;
				color: #fff;
				font-size: 24rpx;
				border-radius: 5rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
	}
	// 可换新
	.wait-pay {
		background: #ed6d00 !important;
		border-color: #ed6d00 !important;
	}
	// 待审核
	.wait-receiving-goods {
		background: #FFBA00 !important;
		border-color: #FFBA00 !important;
	}
	// 已换新
	.renewed {
		background: #006DE8 !important;
		border-color: #006DE8 !important;
	}
	// 已通过
	.done-receiving-goods {
		background: #00C82A !important;
	}
	// 未通过
	.compulsory-receipt {
		background: #E80000 !important;
	}

</style>

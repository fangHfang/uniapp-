<template>
	<view class="page">
		<view class="bg-color"></view>
		<uni-nav-bar id="topBar" title="我的钱包" backgroundColor="transparent" :border="false" left-icon="back" color="#fff" @clickLeft="toBack"></uni-nav-bar>
		<view class="mescroll-box">
			<mescroll-uni
				ref="mescrollRef" 
				@init="mescrollInit" 
				class="mescroll-uni"
				:top="pageOptions.mescrollTop" 
				:bottom="pageOptions.mescrollBottom" 
				:down="downOption"
				:up="upOption"
				safearea
				@down="downCallback"
				>
				<view class="header">
					<view class="header-tab" @click="toQuota">
						<view class="header-money">
							<view class="available-credit">{{$filtersNum(whiteBarInfo.currentAmount || 0)}}</view>
							<!-- <view class="available-title">可用额度</view> -->
							<view class="available-title">暂未开放</view>
						</view>
						<view class="header-view-detail">
							<text>查看详情</text>
						</view>
						<view class="header-line"></view>
						<view class="header-quota flex a-center j-space-between">
							<view class="quota-tab flex a-center j-center flex-column">
								<text class="quota-title">信用额度</text>
								<text class="quota-credit">{{$filtersNum(whiteBarInfo.lineCredit || 0)}}</text>
								<uni-icons class="arrow" type="arrowright" size="14" color="#fff"></uni-icons>
							</view>
							<view class="tab-line"></view>
							<view class="quota-tab flex a-center j-center flex-column">
								<text class="quota-title">待还额度</text>
								<text class="quota-credit">{{$filtersNum(whiteBarInfo.debtAmount || 0)}}</text>
								<uni-icons class="arrow" type="arrowright" size="14" color="#fff"></uni-icons>
							</view>
						</view>
					</view>
				</view>
				<!-- 抵扣券,兑换券 -->
				<view class="footer" @click="toCoupon">
					<image src="../../../static/image/my/wallet/bg1.png" mode="widthFix"></image>
					<view class="coupons-content flex a-center j-space-between" style="padding: 0 10px 0 50px;">
						<view class="coupons flex a-center j-center">
							<view class="coupons-item flex a-center j-center flex-column">
								<view class="item-title">优惠券</view>
								<view class="item-credit">{{couponNumber || 0}}张</view>
							</view>
							<!-- <view class="coupons-item flex a-center j-center flex-column">
								<view class="item-title">兑换券</view>
								<view class="item-credit">{{exchangeNumber}}</view>
							</view> -->
						</view>
					</view>
				</view>
				<!-- 抵扣券,兑换券 -->
				<!-- 积分 -->
				<view class="welfare">
					<image src="../../../static/image/my/wallet/bg2.png" mode="widthFix"></image>
					<view class="coupons-content flex a-center j-space-between">
						<view class="coupons-item flex a-center j-center flex-column" @click="toIntegral">
							<view class="item-title">积分</view>
							<view class="item-credit">{{integralInfo.currentlyAvailableAmount || 0}}</view>
						</view>
					</view>
				</view>
				<!-- 积分 -->
				<!-- 返利 -->
				<view class="welfare">
					<image src="../../../static/image/my/wallet/bg3.png" mode="widthFix"></image>
					<view class="coupons-content flex a-center j-space-between">
						<view class="coupons-item flex a-center j-center flex-column" @click="toRebate">
							<view class="item-title">返利</view>
							<view class="item-credit">{{rebateInfo.currentlyAvailableAmount || 0}}</view>
						</view>
					</view>
				</view>
				<!-- 返利 -->
				<!-- 兑换点 -->
				<view class="welfare">
					<image src="../../../static/image/my/wallet/bg4.png" mode="widthFix"></image>
					<view class="coupons-content flex a-center j-space-between">
						<view class="coupons-item exchange-point flex a-center j-center" @click="exchangePoint">
							<view class="item-title">兑换点</view>
							<view class="tag-box">
								<view class="coupons-tag">
									<text>{{exchangeType > 99 ? 99 : exchangeType}}</text>
									<text v-if="exchangeType > 99" style="font-size:8px;position:relative;bottom:10rpx;">+</text>
									<text>类</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<!-- 积分 -->
			</mescroll-uni>
		</view>
		<yu-toast
			:message1="powerData.msg1"
			:message2="powerData.msg2"
			:duration="powerData.duration"
			verticalAlign="center"
			:backgroundColor="powerData.bgColor"
			:color="powerData.fontColor"
			ref="power"
		></yu-toast>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import yuToast from '@/components/yu-toast/yu-toast'
	import Wallet from '@/api/wallet/wallet.js'
	export default {
		name: 'wallet',
		components: {},
		data() {
			return {
				// 下拉刷新组件实例
				mescroll: null,
				// 下拉刷新配置项
				downOption:{
					textColor:'#fff'
				},
				upOption:{
					// 禁止分页加载
					use:false
				},
				// 页面配置
				pageOptions: {
					// 适配刘海屏
					mescrollTop:0,
					mescrollBottom:0,
				},
				// 权限提示
				powerData:{
					msg1:'您没有权限,',
					msg2:'请开通相应权限。',
					duration:2000,
					bgColor:"#000000cc",
					fontColor:"#ed6d00",
				},
			}
		},
		computed: {
			...mapState({
				// 积分
				integralInfo: state => state.login.integralInfo,
				// 返利(新玛元)
				rebateInfo: state => state.login.rebateInfo,
				// 白条
				whiteBarInfo: state => state.login.whiteBarInfo,
				// 兑换券数量
				exchangeNumber: state => state.login.exchangeNumber,
				// 抵扣券数量
				epStoreNumber: state => state.login.epStoreNumber,
				// 兑换点种类
				exchangeType: state => state.login.exchangeType,
				// 权限集合
				resourceList: state => state.login.resourceList,
				// 优惠券总数
				couponNumber: state => state.login.couponNumber,
			}),
		},
		mounted() {
			this.countTopBar();
		},
		methods: {
			/**
		   * 计算顶部DOM元素节点
		   */
			async countTopBar(){
				const searchBarHeight = await this.$getComponentsDom('#topBar');
				this.pageOptions.mescrollTop = searchBarHeight.bottom + 1 +'px'
				
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
			 * 打开查看可用额度
			 */
			toQuota() {
				// 信用额度详情权限-STOREAPPA060301
				if(!this.resourceList.some((item)=>{return item.resourceNo === 'STOREAPPA060301'})){
					this.$refs.power.show()
					return
				}
				uni.navigateTo({
					url: 'quota/quota'
				})
			},
			/**
			 * 打开查看可用返利
			 */
			toRebate() {
				// 返利明细权限-STOREAPPA060308
				if(!this.resourceList.some((item)=>{return item.resourceNo === 'STOREAPPA060308'})){
					this.$refs.power.show()
					return
				}
				const data=this.$jsonFormat(this.rebateInfo)
				uni.navigateTo({
					url: 'rebate/rebate?'+data
				})
			},
			/**
			 * 打开查看可用积分
			 */
			toIntegral() {
				// 积分明细权限-STOREAPPA060304
				if(!this.resourceList.some((item)=>{return item.resourceNo === 'STOREAPPA060304'})){
					this.$refs.power.show()
					return
				}
				const data=this.$jsonFormat(this.integralInfo)
				uni.navigateTo({
					url: 'integral/integral?'+data
				})
			},
			/**
			 * 打开兑换点页面
			 */
			exchangePoint() {
				// 兑换点列表权限-STOREAPPA060306
				if(!this.resourceList.some((item)=>{return item.resourceNo === 'STOREAPPA060306'})){
					this.$refs.power.show()
					return
				}
				uni.navigateTo({
					url: '/pages/my-pages/exchange/exchange'
				})
			},
			/**
			 * 打开优惠券管理页面
			 */
			toCoupon(){
				// 优惠券详情权限-STOREAPPA060302
				if(!this.resourceList.some((item)=>{return item.resourceNo === 'STOREAPPA060302'})){
					this.$refs.power.show()
					return
				}
				uni.navigateTo({
					url:'/pages/my-pages/coupon/coupon'
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
			 * 下拉刷新回调
			 */
			async downCallback(e) {
				this.$store.dispatch('login/updateUserInfo').then(()=>{
					this.mescroll.endSuccess();
				})
			},
		}
	}
</script>

<style lang="scss">
	.page {
		background-color: #F2F2F2;
		position: absolute;
		overflow-y:scroll;
		width:100%;
		z-index: 999;
	}
	.page::after{
		content:'';
		height:100vh;
	}
	// 背景图
	.bg-color{
		position: fixed;
		top:0;
		z-index: 0;
		width:100vw;
		height:30vh;
		background-color: $uni-color-primary;
	}

	.header {
		width: 100%;
		height: 247px;
		background: url('../../../static/image/my/wallet/bg.png') no-repeat center;
		background-size:cover;

		/deep/ .uni-navbar--border {
			border: none;
			background: none !important;
		}

		/deep/ .uni-navbar__header {
			background: none !important;
		}
	}

	.header-tab {
		color: #fff;
		padding: 20rpx 13px 0;

		.header-money {
			width: 100%;
			padding-bottom: 20px;
			text-align: center;

			.available-credit {
				font-size: 58rpx;
				padding: 2px 0;
			}

			.available-title {
				font-size: 17px;
			}
		}

		.header-view-detail{
			margin: 0rpx auto 30rpx;
			width: 160rpx;
			height: 60rpx;
			background: #F6F4F4;
			text-align: center;
			border-radius: 5rpx;
			>text{
				font-size: 26rpx;
				font-weight: bold;
				color: #ed6d00;
				line-height: 60rpx;
			}
		}

		.header-line {
			width: 100%;
			height: 1px;
			opacity: .4;
			background-color: #FFFFFF;
		}

		.header-quota {
			width: 100%;
			height: 92px;
			.quota-tab {
				width: calc(100% / 2);
				position: relative;
				.quota-title {
					font-size: 28rpx;
					margin-bottom: 10px;
				}

				.quota-credit {
					font-size: 38rpx;
				}
				.arrow{
					position: absolute;
					right:30rpx;
				}
			}

			.tab-line {
				width: 1px;
				height: 80px;
				opacity: .4;
				background-color: #fff;
			}
		}
	}


	.footer {
		margin-top: 20rpx;
		width: calc(100% - 20px);
		height: 181rpx;
		padding: 0 10px;
		position: relative;
		font-weight: 500;

		image {
			width: calc(100% - 20px);
			position: absolute;
			z-index: 0;
		}

		.coupons-content {
			width: calc(100% - 40px);
			height: 181rpx;
			padding: 0 10px;
			position: absolute;
			z-index: 2;
			color: #fff;
			font-size: 14px;

			.coupons-item {
				width: 60px;
				margin-right: 5px;
				font-weight: bold;

				.item-title {
					margin-bottom: 5px;
				}
			}
		}
	}

	.welfare {
		margin-top: 20rpx;
		width: calc(100% - 20px);
		height: 130rpx;
		padding: 0 10px;
		position: relative;
		font-weight: 500;

		image {
			width: calc(100% - 20px);
			position: absolute;
			z-index: 0;
		}

		.coupons-content {
			width: calc(100% - 20px);
			position: absolute;
			z-index: 2;
			height: 130rpx;
			color: #fff;

			.coupons-item {
				width: 100%;
				font-size: 40rpx;
				height: 100%;
				flex-direction: row;
				.item-title {
					width:40%;
					padding-left:40px;
				}
				.item-credit{
					width:40%;
					text-align: center;
				}
			}
			.coupons-right-item{
				width: 50%;
				opacity: .8;
				font-size: 24rpx;
				height: 100%;
				.item-title {
					margin-bottom: 5px;
				}
			}

			// 兑换点
			.exchange-point{
				.item-title{
					margin-bottom: 0px;
				}
				.tag-box{
					width:40%;
					text-align: center;
				}
				.coupons-tag{
					padding: 0rpx 15rpx;
					margin-left: 12rpx;
					display: inline-block;
					border: 2rpx solid #FFFFFF;
					border-radius: 20rpx 10rpx 10rpx 1rpx;
					>text{
						font-size: 24rpx;
						line-height: 24rpx;
					}
				}
			}

			
		}
	}
	.mescroll-box{
		height: calc(100vh - 88rpx - var(--status-bar-height));
		background: transparent;
	}
</style>

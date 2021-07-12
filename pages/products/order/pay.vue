<template>
	<view class="page">
		<uni-nav-bar fixed statusBar title="订单支付" left-icon="back" backgroundColor="#ed6d00" color="#fff" @clickLeft="toBack"></uni-nav-bar>
		<view class="order-detail-box">
			<text class="text-normal" style="color:#666">订单号：{{ orderInfo.orderNo }}</text>
			<text class="text-normal" style="margin:60rpx 0 0">应付金额</text>
			<view style="padding:20rpx 0;">
				<text class="text-primary" style="font-size:40rpx">￥</text>
				<text class="text-primary" style="font-size:80rpx;font-weight: 600;">{{orderInfo.payAmount}}</text>
			</view>
			<view class="flex a-center">
				<text class="text-green">付款剩余时间</text>
				<uni-countdown 
					@timeup='timUp' 
					:minute="minutes" 
					:second="seconds"
					:show-day="false" 
					:showHour="false" 
					splitorColor="#00B60D" 
					color="#00B60D" 
					backgroundColor="rgba(0,0,0,0)" 
					borderColor="rgba(0,0,0,0)"
				></uni-countdown>
			</view>
		</view>

		<uni-section title="请选择支付方式" ></uni-section>
		<uni-list class="list-box">
			<uni-list-item >
				<template slot="body">
					<view class="right-content">
						 <radio-group @change="radioChange">
							<label
							v-for="(item, index) in payChannel"
							:key="index"
							class="item flex a-center j-space-between"
							:style="(index+1) === payChannel.length && 'margin:0;padding:0;border:none'"
							>
								<view>
									<text class="iconfont" :class="pay.iconList[item.payChannelNo]"></text>
									<text class="text-normal">{{item.payChannelName}}</text>
								</view>
								<view>
									<radio :value="item.payChannelNo" :checked="index === pay.current" />
								</view>
							</label>
						</radio-group>
					</view>
				</template>
			</uni-list-item>
		</uni-list>
		<view class="fixed-buttom-box">
			<button
				class=" flex a-center j-center fixed-buttom-btn"
				:style="`border-radius:${systemInfo.windowWidth/2}px`"
				@click="toPay"
				>确认支付</button>
		</view>
		<uni-popup ref="dialog" type="dialog" >
			<uni-popup-dialog 
				:title='message.title' 
				:content="message.content" 
				confirmText="继续支付" 
				closeText="确认"
				:beforeClose="true"
				@close="close" 
				@confirm="dialogConfirm"></uni-popup-dialog>
		</uni-popup>
		<uni-popup ref="largePayDialog" type="dialog" >
			<view class="modal-box">
				<!-- 关闭按钮 -->
				<view class="dialog-close-button" @click="$refs.largePayDialog.close()">
					<icon class="iconfont cancel" style='color:#000;font-size: 36rpx;' type=""></icon>	
				</view>
				<view class="large-pay-box">
					<view class="large-pay-title">
						<text>提示</text>
					</view>
					<view class="pc-pay">
						<text>请于电脑端登录一下网址付款</text>
					</view>
					<view class="copy-text">
						<text>https://mall.maxxis.com.cn/store-admin/index.html</text>
						<text @click="copyPayUrl">复制</text>
					</view>
					<view class="line"></view>
					<view class="attention-box">
						<view>注意：</view>
						<view>1.此网址适用于公对公打款客户、大额支付客户</view>
						<view>2.如客户无需使用大额支付，流程照旧，在玛商发端支付即可</view>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	const lklPay = uni.requireNativePlugin('LKLPay');
	import { mapState } from 'vuex'
	import {dateFormat} from '@/common/utils/DateUtil'
	import { WX_APP_ID } from '@/static/base/system-constant'
	import order from '@/api/order/order.js'
	import request from '@/common/utils/request.js'
	export default {
		name: 'orderPay',
		components: {},
		data() {
			return {
				systemInfo:uni.getSystemInfoSync(),
				message:{
					title:'确认要放弃支付吗？',
					content:'未支付订单将自动关闭，请尽快支付～'
				},
				pay:{
					current:'',
					iconList:{
						// 微信支付
						'PAY_CHANNEL_WX':'weixinzhifu',
						// 微信小程序支付
						'PAY_CHANNEL_WX_MINI':'weixinzhifu',
						// 支付宝支付
						'PAY_CHANNEL_ALI':'zhifubao',
						// 银联支付
						'PAY_CHANNEL_UNION':"yunshanfu",
						// 白条支付
						'PAY_CHANNEL_WHITE_BAR':'yunshanfu',
						// 线下支付
						'PAY_CHANNEL_OFFLINE':'mendian',
						// 大额支付
						'PAY_CHANNEL_LARGE':'mendian'
					},
				},
				// 订单信息
				orderInfo:{},
				// 倒计时
				minutes:15,
				seconds:0,
				// 支付宝链接
				payUrl:""
			}
		},
		computed:{
			...mapState({
				// 积分
				payChannel: state => state.login.payChannel,
			}),
		},
		onLoad(options) {
			// 查询用户信息
			// this.$store.dispatch('login/updateUserInfo')
			// 创建订单传输过来的订单信息
			this.orderInfo = JSON.parse(options.orderInfo)
			this.minutes = this.orderInfo.isActivity ? 15 : 30
			if(this.orderInfo.orderStatus === '待付款'){
				this.timeSubtraction(dateFormat('yyyy-MM-dd HH:mm:ss',new Date()),this.orderInfo.payExpireTime)
			}
		},
		/**
		 * 监听物理返回键
		 */
		onBackPress(e){
			this.toBack()
			return true
		},
		methods: {
			
			/**
			 * 公共方法计算相差的年月日，时分秒
			 */
			timeSubtraction(beginTime,endTime) {
				let dateBegin = new Date(beginTime.replace(/-/g, "/"));
				let dateEnd = new Date(endTime.replace(/-/g, "/"));
				let dateDiff = dateEnd.getTime() - dateBegin.getTime();//时间差的毫秒数
				let dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));//计算出相差天数
				let leave1 = dateDiff % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
				let hours = Math.floor(leave1 / (3600 * 1000));//计算出小时数
				//计算相差分钟数
				let leave2 = leave1 % (3600 * 1000);   //计算小时数后剩余的毫秒数
				let minutes = Math.floor(leave2 / (60 * 1000)); //计算相差分钟数
				//计算相差秒数
				let leave3 = leave2 % (60 * 1000);     //计算分钟数后剩余的毫秒数
				let seconds = Math.round(leave3 / 1000);
				this.minutes = minutes;
				this.seconds = seconds;
			},
			
			/**
			 * 返回上一级页面
			 */
			toBack(){
				this.$refs.dialog.open()
			},
			/**
			 * 时间到了
			 * */
			timUp() {
				this.close()
			},

			/**
			 * radio 选择时间
			 * */
			radioChange: function(evt) {
				for (let i = 0; i < this.payChannel.length; i++) {
					if (this.payChannel[i].payChannelNo === evt.target.value) {
						this.pay.current = i;
						break;
					}
				}
			},

			/**
			 * 继续支付
			 */
			dialogConfirm() {
				this.$refs.dialog.close()
			},

			/**
			 * 取消
			 */
			close(){
				const { isActivity } = this.orderInfo;
				if(isActivity){
					uni.reLaunch({
					    url: '/pages/index/index'
					});
					// uni.reLaunch({
					// 	url:"/pages/my-pages/activity/list/activity-list"
					// })
				}else{
					// uni.reLaunch({
					//     url: '/pages/index/index'
					// });
					uni.reLaunch({
						url:"/pages/my-pages/order/list/order-list?tabIndex=1"
					})
				}
				
			},
			/**
			 * 确认支付
			 */
			toPay(){
				if(this.pay.current === ''){
					uni.showToast({
						title:'请选择支付方式',
						icon:'none'
					})
					return
				}
				let { payChannelNo } = this.payChannel[this.pay.current]
				let postData = {
					orderNo:this.orderInfo.orderNo,
					payChannel:payChannelNo,
				}
				// 区分不同支付方式
				switch(payChannelNo){
					// 微信支付
					case 'PAY_CHANNEL_WX':
						break;
					// 微信小程序支付
					case 'PAY_CHANNEL_WX_MINI':
						this.wxPay()
						break;
					// 支付宝支付	
					case 'PAY_CHANNEL_ALI':
						this.aliPay(postData)
						break;
					// 银联支付
					case 'PAY_CHANNEL_UNION':
						this.uionPay(postData)
						break;
					// 白条支付
					case 'PAY_CHANNEL_WHITE_BAR':
					// 线下支付	
					case 'PAY_CHANNEL_OFFLINE':
						this.payChannelConfirm(postData)
						break;
					// 大额支付	
					case 'PAY_CHANNEL_LARGE':
						this.largePay(postData)
						break;
				}
				
				
			},
			
			/**
			 * 白条支付 || 线下支付
			 */
			payChannelConfirm(postData){
				uni.showLoading({
					mask:true
				})
				order.payChannelConfirm(postData).then((res)=>{
					uni.hideLoading()
					uni.showToast({
						title:'支付成功!',
						icon:"success"
					})
					let orderInfo = {
						...this.orderInfo,
						status:true
					}
					setTimeout(()=>{
						uni.redirectTo({
							url:'/pages/products/order/result?orderInfo=' + JSON.stringify(orderInfo)
						})
					},2000)
				}).catch((err)=>{
					uni.hideLoading()
					uni.showToast({
						title:err.msg || err,
						icon:"none"
					})
				})
			},
			
			/**
			 * 微信小程序支付
			 */
			wxPay() {
				let token = request.getAccessToken()
				let launchParam = {
					// id: 'gh_598971d86bd6',
					id: 'gh_ef04035cdad4',
					path: '/pages/payTest?orderNo=' + this.orderInfo.orderNo + '&payChannel=PAY_CHANNEL_WX_MINI&token=' + token,
					type: 0  // 微信小程序版本类型可取值： 0-正式版； 1-测试版； 2-体验版。 默认值为0
				}
				// #ifdef APP-PLUS
				plus.share.getServices((res) => {
					let sweixin = res.find(i => i.id === 'weixin')
					if (sweixin) {
						sweixin.launchMiniProgram(launchParam);
						// 第三方支付跳转页面
						this.thirdPartyPay()
					}
				});
				//#endif
			},
			aliPay(postData){
				console.log(postData,'postData')
				uni.showLoading({
					mask:true
				})
				order.payChannelConfirm(postData).then((data)=>{
					const {payInfo} = data.data
					console.log(payInfo,'payInfo')
					uni.hideLoading()
					// 第三方支付跳转页面
					this.thirdPartyPay(()=>{
						//支付宝支付
						console.log('111111111')
						lklPay.pay({payData:payInfo},
							res=>{
								console.log("调用成功",JSON.stringify(res));
							},
							err=>{
								console.log("调用失败",JSON.stringify(res));
								uni.showToast({
									title:'调起支付宝失败',
									icon:"none"
								})
							}
						)
					})
					
				}).catch((err)=>{
					console.log(err,'err')
					uni.hideLoading()
					uni.showToast({
						title:err.msg || err,
						icon:"none"
					})
				})
			},
			
			 
			/**
			 * 第三方跳转页面
			 */
			thirdPartyPay(callBack){
				uni.redirectTo({
					url:"/pages/products/order/paying?orderInfo=" + JSON.stringify(this.orderInfo),
					complete:function(){
						callBack()
					}
				})
			},
			
			
			/**
			 * 银联支付
			 */
			uionPay(postData){
				uni.showLoading({
					mask:true
				})
				order.payChannelConfirm(postData).then((data)=>{
					const {payInfo} = data.data
					console.log(payInfo,'payInfo')
					uni.hideLoading()
					uni.redirectTo({
						url:"/pages/products/order/paying?orderInfo=" + JSON.stringify(this.orderInfo) + '&uionUrl=' + payInfo
					})
				}).catch((err)=>{
					console.log(err,'err')
					uni.hideLoading()
					uni.showToast({
						title:err.msg || err,
						icon:"none"
					})
				})
			},
			
			/**
			 * 大额支付
			 * 弹窗去pc支付
			 */
			largePay(){
				this.$refs.largePayDialog.open()
			},
			
			/**
			 * 复制大额支付链接
			 */
			copyPayUrl(){
				uni.setClipboardData({
				    data: 'https://mall.maxxis.com.cn/store-admin/index.html',
				    success: function () {
						uni.showToast({
							title:'复制成功！',
							icon:'none'
						})
				    }
				});
			}
		}
	}
</script>

<style lang="scss">
	.page{
		height: calc(100vh - 160rpx;);
		padding-bottom:160rpx;
		overflow-y: auto;
		background-color: #F2F2F2;
		position: absolute;
		z-index: 999;
		/deep/.uni-dialog-title-text{
			  font-size: 32rpx;
			  color: #333;
			  position: relative;
			  top: 40rpx;
		}
		/deep/.uni-dialog-content{
			padding-bottom:0;
			position: relative;
			top:-10rpx;
		}
		/deep/.uni-dialog-content-text{
			font-size:24rpx;
			color:#999;
			width:260rpx;
			text-align: center;
		}
	}
	.text-primary{
		color:$uni-color-primary;
		font-size:26rpx
	}
	.text-gray{
		color:$uni-text-color-grey;
		font-size:26rpx
	}
	.text-normal{
		font-size:26rpx;
		color:#333;
	}
	.text-green{
		color:#00B60D;
		font-size:26rpx
	}
	.order-detail-box{
		width:100%;
		padding:30rpx 0;
		background-color: #fff;
		display: flex;
		align-items: center;
		justify-content:center;
		flex-direction: column;
		/deep/.uni-countdown__number{width:auto;font-size: 28rpx;}

	}
	/deep/.uni-section{
		padding-bottom:20rpx;
	}
	.list-box{
		width:calc(100vw - 40rpx);
		margin-left:20rpx;
		border-radius:12rpx;
		overflow: hidden;
		.item{
			display: flex;
			margin-bottom:30rpx;
			border-bottom: 1px solid #eee;
			padding-bottom:30rpx;
			.tips-icon{
				margin-left:10rpx;
			}
			.text-normal{
				max-width:calc(100% - 100rpx);
				font-size:24rpx;
			}
			.text-gray{
				font-size:24rpx
			}
		}
		.right-content{
			flex:1;
			.iconfont{
				color:$uni-color-primary;
				font-size:32rpx;
				margin-right:20rpx;
			}
			/deep/.uni-radio-input-checked{
				background-color:$uni-color-primary !important;
				border-color:$uni-color-primary !important;
			}
		}
	}
	
	.modal-box{
		width: calc(100vw - 100rpx);
		background-color: #FFFFFF;
		border-radius: 16rpx;
		position: relative;
		.large-pay-box{
			text-align: center;
			padding: 30rpx 0px;
			.large-pay-title{
				text{
					font-size: 36rpx;
				}
			}
			.pc-pay{
				padding: 20rpx 0;
				color: #717171;
			}
			.copy-text{
				margin-bottom: 20rpx;
				>text:nth-child(1){
					color: #333333;
					font-size: 28rpx;
				}
				>text:nth-child(2){
					position: relative;
					left:20rpx;
					color: #ed6d00;
					padding: 20px 20px 20px 0px;
				}
			}
			.attention-box{
				color: #da5947;
				text-align: left;
				width: 210px;
				margin: auto;
				>view:nth-child(1){
					margin-top: 20rpx;
				}
				>view:nth-child(2),view:nth-child(3){
					margin-top: 20rpx;
					font-size: 24rpx;
				}
			}
		}
		.line{
			height: 2rpx;
			width: 100%;
			background-color: #CCCCCC;
		}
		.dialog-close-button{
			position: absolute;
		    top: 10rpx;
			right: 10rpx;
			padding: 10rpx;
		}
	}
</style>

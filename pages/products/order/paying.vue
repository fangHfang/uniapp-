<template>
	<view class="page">
		<uni-nav-bar fixed statusBar title="支付中..." left-icon="back" backgroundColor="#ed6d00" color="#fff" @clickLeft="toBack"></uni-nav-bar>
		<uni-popup
			ref="dialog"
			type="dialog"
			:mask-click="false">
			<uni-popup-dialog
				:title='message.title'
				:content="message.content"
				confirmText="是"
				closeText="否"
				:beforeClose="true"
				@close="checkPayStatus"
				@confirm="checkPayStatus"></uni-popup-dialog>
		</uni-popup>
		<web-view v-if="uionUrl" :src="uionUrl" @message="handleMessage"></web-view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import {dateFormat} from '@/common/utils/DateUtil'
	import order from '@/api/order/order.js'
	import request from '@/common/utils/request.js'
	export default {
		name: 'orderPay',
		components: {},
		data() {
			return {
				systemInfo:uni.getSystemInfoSync(),
				message:{
					title:'',
					content:'是否支付成功？'
				},
				// 订单信息
				orderInfo:{},
				// 倒计时
				minutes:15,
				seconds:0,
				// 是否支付
				isPay: false,
				// 银联链接
				uionUrl:"",

			}
		},
		computed:{
			...mapState({
				// 积分
				payChannel: state => state.login.payChannel,
			}),
		},
		onShow() {
			if(this.isPay){
				this.toBack()
			}
		},
		onLoad(options) {
		  // 创建订单传输过来的订单信息
		  const { orderInfo,uionUrl } = options
		  this.isPay = true
		  this.orderInfo = JSON.parse(options.orderInfo)
		  this.uionUrl = uionUrl
		  console.log(this.uionUrl,'this.uionUrl')
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
			 * 打开轮询弹窗
			 */
			toBack(){
				this.$refs.dialog && this.$refs.dialog.open()
			},

			/**
			 * 重新获取订单详情 检验是否支付完成
			 * 轮询五次
			 */
			async checkPayStatus() {
				this.$refs.dialog.close()
				uni.showLoading()
				let type = false
				for(let i = 0;i<5;i++){
					type = await this.getPayStatus()
					console.log(type,'支付结果')
					if(type){
						break
					}
				}
				let orderInfo = {
					...this.orderInfo,
					status:type
				}
				uni.hideLoading()
				uni.redirectTo({
					url:'/pages/products/order/result?orderInfo=' + JSON.stringify(orderInfo)
				})
			},

			/**
			 * 查询订单状态
			 */
			getPayStatus(){
				return new Promise((resolve, reject) => {
					order.getPayResultByOrderNo(this.orderInfo.orderNo).then(({ data }) => {
						resolve(data)
					}).catch((data) => {
						console.log(data,'data')
						// uni.showToast({ icon: 'none', title: data.msg })
						reject(false)
					})
				})
			},

			/**
			 * 监听h5 银联支付关闭webview
			 */
			handleMessage(e){
				this.uionUrl = ''
				this.toBack()
			}
		}
	}
</script>

<style lang="scss">
	.page{
		height: 100vh;
		overflow-y: auto;
		background-color: #FFFFFF;
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
			font-size:28rpx;
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
</style>

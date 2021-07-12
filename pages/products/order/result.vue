<template>
	<view class="page">
		<uni-nav-bar fixed statusBar title="订单支付" left-icon="back" backgroundColor="#ed6d00" color="#fff" @clickLeft="toBack"></uni-nav-bar>
		<view class="order-detail-box">
			<uni-icons v-if="orderInfo.status" type="checkbox-filled" color="#51b237" size="120"></uni-icons>
			<uni-icons v-else type="clear" color="#d92e20" size="120"></uni-icons>
			<text class="text-normal">{{orderInfo.status?'支付成功':'支付失败'}}</text>
		</view>
		<!-- 支付成功 -->
		<view v-if="orderInfo.status">
			<uni-list class="list-box" >
				<uni-list-item :border="false">
					<template slot="body">
						<view class="flex a-center j-center flex-column w">
							<text class="text-normal">订单金额</text>
							<view style="padding:20rpx 0;">
								<text class="text-primary" style="font-size:40rpx">￥</text>
								<text class="text-primary" style="font-size:80rpx;font-weight: 600;">{{orderInfo.payAmount}}</text>
							</view>
							<view class="flex a-center j-space-between w">
								<text class="text-normal">优惠券抵扣:{{ orderInfo.consumeCouponAmount.toFixed(2) || '--'}}</text>
								<text class="text-normal">新玛元抵扣:{{ orderInfo.consumeRebateAmount.toFixed(2) || '--'}}</text>
								<text class="text-primary">合计:{{orderInfo.payAmount.toFixed(2) || '--'}}</text>
							</view>
						</view>
					</template>
				</uni-list-item>
			</uni-list>
			<view style="margin-top:200rpx;text-align: center;">
				<text class="text-tips">商品正在出库中</text>
			</view>
			<view class="fixed-buttom-box">
				<button
					class=" flex a-center j-center fixed-buttom-btn line-btn"
					:style="`border-radius:${systemInfo.windowWidth/2}px;margin-right:10rpx;`"
					@click="toOrder"
					>查看订单</button>
				<button
					class=" flex a-center j-center fixed-buttom-btn"
					:style="`border-radius:${systemInfo.windowWidth/2}px;margin-left:10rpx;`"
					@click="toBuy"
					>继续购买</button>
			</view>
		</view>
		<view v-else>
			<view style="margin-top:200rpx;text-align: center;" @click="toOrder">
				<text class="text-tips">支付失败</text>
				<view class="back-box">
					<text  class="text-tips">返回</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'orderResult',
		components: {},
		data() {
			return {
				systemInfo:uni.getSystemInfoSync(),
				orderInfo:{}
			}
		},
		onLoad(options) {
			
			// 创建订单传输过来的订单信息
			this.orderInfo = JSON.parse(options.orderInfo)
		},
		mounted() {
		},
		methods: {
			/**
			 * 返回
			 */
			toBack(){
				uni.reLaunch({
				    url: '/pages/index/index'
				});
			},

			/**
			 * 查看订单
			 */
			toOrder(){
				// 区分跳转普通订单和活动订单
				if(this.orderInfo.isActivity){
					uni.reLaunch({
						url: '/pages/my-pages/activity/list/activity-list'
					});
				}else{
					uni.reLaunch({
						url: '/pages/my-pages/order/list/order-list?tabIndex=0'
					});
				}
			},

			/**
			 * 继续购买
			 */
			toBuy(){
				// 区分跳转普通订单和活动订单
				if(this.orderInfo.isActivity){
					uni.navigateBack({
						delta:2
					})
				}else{
					const obj = {
						"name": "mall",
						"id": 1
					}
					uni.reLaunch({
						url:`/pages/index/index?name=${obj.name}&id=${obj.id}`
					})
				}
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
	.text-tips{
		color:#999;
		font-size:32rpx;
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

	.list-box{
		width:100%;
		border-radius:12rpx;
		margin-top:20rpx;
		overflow: hidden;
		padding:20rpx 0;
	}
	.back-box{
		margin-top: 40rpx;
		>.text-tips{
			border: 2rpx solid #999;
			border-radius: 12rpx;
			padding: 10rpx;
		}
	}
</style>

<template>
	<view class="page">
		<uni-nav-bar fixed statusBar title="订单兑换" left-icon="back" backgroundColor="#ed6d00" color="#fff" @clickLeft="toBack"></uni-nav-bar>
		<view class="order-detail-box">
			<uni-icons v-if="status" type="checkbox-filled" color="#51b237" size="120"></uni-icons>
			<uni-icons v-else type="clear" color="#d92e20" size="120"></uni-icons>
			<text class="text-normal">{{status?'兑换成功':'兑换失败'}}</text>
		</view>
		<!-- 兑换成功 -->
		<view v-if="status">
			<uni-list class="list-box" >
				<uni-list-item :border="false">
					<template slot="body">
						<view class="flex a-center j-center flex-column w">
							<text class="text-normal">兑换点</text>
							<view style="padding:20rpx 0;">
								<text class="text-primary" style="font-size:80rpx;font-weight: 600;">{{orderInfo.consumeExchangeAmount}}</text>
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
			<view style="margin-top:200rpx;text-align: center;">
				<text class="text-tips">兑换失败</text>
				<view>
					<text  class="text-tips">订单已自动取消</text>
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
				// true 兑换成功、false 兑换失败
				status:true,
				orderInfo:{
					num:'47198374256325532',
					price:1600,
					couponPrice:50,
					maPrice:20,
				}
			}
		},
		onLoad(options) {
      // 创建订单传输过来的订单信息
      this.orderInfo = JSON.parse(options.orderInfo)
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
				uni.navigateBack({
					delta: 2
				})
			},

			/**
			 * 继续购买
			 */
			toBuy(){
				uni.navigateBack({
					delta: 3
				})
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
</style>

<template>
	<view class="order-list">
		<view 
			:id="'order-item-' + item.orderNo + orderIndex" 
			class="order-li" 
			v-for="(item,orderIndex) in list" 
			:key="'order-item-' +  item.orderNo + orderIndex"
			@click="$emit('toDetail',item)">
			<view class="order-no-status flex j-space-between">
				<text class="order-title">{{item.activityName}}</text>
				<!-- // 0-待付款,1-待收货,2-部分收货,3-已完成,4-强制收货,5-已退款,6-已关闭 -->
				<text class="order-status wait-receiving-goods" v-if="item.orderStatus === 1">待收货</text>
				<text class="order-status wait-receiving-goods" v-if="item.orderStatus === 2">部分收货</text>
				<text class="order-status wait-pay" v-else-if="item.orderStatus === 0">待付款</text>
				<text class="order-status cancelled" v-else-if="item.orderStatus === 6">已取消</text>
				<text class="order-status done-receiving-goods" v-else-if="item.orderStatus === 3">已完成</text>
				<text class="order-status compulsory-receipt" v-else-if="item.orderStatus === 4">强制收货</text>
				<text class="order-status qian-renminbi" v-else-if="item.orderStatus === 5">强制收货</text>
			</view>
			<template v-if="item.orderDescribe && item.orderDescribe.length > 0">
				<view
					v-for="(item,index) in item.orderDescribe.slice(0,2)"
					:key="'orderDescribe' + index"
					class="order-name-number flex j-space-between">
					<text class="order-name">{{item.itemName}}</text>
					<text class="order-number">x{{item.quantity}}</text>
				</view>
				<view
					v-if="item.orderDescribe.length > 2"
					class="order-name-number flex j-space-between">
					<text class="order-name">...</text>
					<text class="order-number"></text>
				</view>
			</template>
			<template v-else>
				<view
					class="order-name-number flex j-space-between">
					<text class="order-name"></text>
					<text class="order-number"></text>
				</view>
			</template>
			
			<view class="order-no-status flex a-center">
				<text class="order-no">订单号:{{item.orderNo}}</text>
			</view>
			<view class="order-price" >
				<!-- // 0-待付款,1-待收货,2-部分收货,3-已完成,4-强制收货,5-已退款,6-已关闭 -->
				<text>￥{{item.payAmount}}</text>
			</view>
			<view class="order-date">
				<text>{{item.orderTime}}</text>
			</view>
			<!-- <text @click.stop="open(item,1)" class="order-button wait-receiving-goods" v-if="item.orderStatus === 1 || item.orderStatus === 2">确认收货</text> -->
			<text @click.stop="open(item,2)" class="order-button cancelled" style="right:200rpx;"  v-if="item.orderStatus === 0">取消订单</text>
			<text @click.stop="open(item,3)" class="order-button wait-pay" v-if="item.orderStatus === 0">确认付款</text>
			<!-- <text class="order-button cancelled" v-if="item.orderStatus === 3">重新下单</text> -->
		</view>
	</view>
</template>

<script>
	import {dateFormat} from '@/common/utils/DateUtil'
	export default {
		data() {
			return {
			orderNo:'',
			}
		},
		props:{
			list: { // 为了请求数据,演示用,可根据自己的项目判断是否要传
				type: Array,
				default(){
					return []
				}
			}
		},
		mounted() {
		},
		methods: {
			/**
			 * 打开弹窗
			 * type:1-收货，2-取消订单,3-确认付款
			 */
			open(item,type){
				let dialogOptions = {}
				switch(type){
					case 1:
						dialogOptions = {
							type,
							item,
							showTextOne:false,
							textOne:"还有部分商品未扫码入库",
							textTwo:"是否确认收货？"
						}
						break;
					case 2:
						dialogOptions = {
							type,
							item,
							showTextOne:false,
							textOne:"",
							textTwo:"是否取消订单？"
						}
						break;
					case 3:
						let payExpireTime = new Date(item.cancelTime.replace(/-/g, "/"))
						let orderInfo = {
							...item,
							orderStatus:"待付款",
							payAmount:item.orderAmount,
							payExpireTime:dateFormat('yyyy-MM-dd HH:mm:ss',payExpireTime),
							consumeCouponAmount:item.consumeCouponAmount || 0,
							consumeRebateAmount:item.consumeRebateAmount || 0,
							isActivity:true
						}
						uni.navigateTo({
							url:'/pages/products/order/pay?orderInfo=' + JSON.stringify(orderInfo)
						})
						return
						break;
				}
				// 通过组件定义的ref调用uni-popup方法
				this.$emit('openDialog',dialogOptions)
			},
		}
	}
</script>
<style lang="scss" scoped>
	// 社区列表
	.order-list{
		.order-li {
			display: flex;
			flex-direction: column;
			background-color: #ffffff;
			padding: 20rpx 20rpx;
			border-bottom: 1px solid #eee;
			position: relative;
			// 订单号，订单状态
			.order-no-status{
				margin-bottom: 20rpx;
				.order-title{
					color: #252527;
					font-size: 24rpx;
					font-weight: bold;
				}
				// 订单号
				.order-no{
					font-size: 24rpx;
					font-weight: 500;
					color: #666666;
				}
				// 订单状态
				.order-status{
					font-size: 24rpx;
					font-weight: bold;
				}
			}
			// 订单名称 订单数量
			.order-name-number{
				margin-bottom: 10rpx;
				// 订单名称
				.order-name{
					width: 80%;
					font-size: 22rpx;
					color: #252527;
					overflow: hidden;
					-webkit-line-clamp: 1;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-box-orient: vertical;
				}
				// 订单数量
				.order-number{
					font-size: 24rpx;
					font-weight: bold;
					color: #252527;
				}
			}
			// 订单金额
			.order-price{
				margin-bottom: 20rpx;
				>text{
					font-size: 24rpx;
					font-weight: bold;
					color: #ed6d00;
				}
			}
			// 订单日期
			.order-date{
				>text{
					font-size: 22rpx;
					font-weight: 500;
					color: #CCCCCC;
				}
			}
			// 订单按钮
			.order-button{
				line-height: 26rpx;
				font-size: 26rpx;
				font-weight: 500;
				color: #ed6d00;
				padding: 12rpx 24rpx;
				border: 2rpx solid #ed6d00;
				border-radius: 5rpx;
				position: absolute;
				right: 20rpx;
				bottom:30rpx;
			}
		}
	}
	// 待付款
	.wait-pay{
		color: #ed6d00!important;
		border-color: #ed6d00!important;
	}
	// 待收货
	.wait-receiving-goods{
		color: #ED9700!important;
		border-color: #ED9700!important;
	}
	// 已取消
	.cancelled{
		color: #666666!important;
		border-color: #666666!important;
	}
	// 完成收货
	.done-receiving-goods{
		color: #0DC316!important;
	}
	// 强制收货
	.compulsory-receipt{
		color: #E80000!important;
	}
	// 已退款
	.qian-renminbi{
		color: #ed6d00;
	}
	// 社区列表
</style>

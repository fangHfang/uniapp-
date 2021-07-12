<template>
	<view class="order-list">
		<view 
			:id="'order-item-' + item.orderNo + orderIndex" 
			class="order-li" 
			v-for="(item,orderIndex) in list" 
			:key="'order-item-' +  item.orderNo + orderIndex"
			@click="$emit('toDetail',item)">
			<view class="order-no-status flex j-space-between">
				<text class="order-no">订单号:{{item.orderNo}}</text>
				<!-- 0 待发货、1 已发货 -->
				<text class="order-status wait-pay" v-if="item.orderReceiveStatus === '未发货'">待发货</text>
				<text class="order-status done-receiving-goods" v-else-if="item.orderReceiveStatus === '已发货'">已发货</text>
			</view>
			<template  v-if="item.nameAndQuantityRespList && item.nameAndQuantityRespList.length > 0">
				<view
					v-for="(item,index) in item.nameAndQuantityRespList.slice(0,2)"
					:key="'nameAndQuantityRespList-' + index"
					class="order-name-number flex j-space-between">
					<text class="order-name">{{item.itemName}}</text>
					<text class="order-number">x{{item.quantity}}</text>
				</view>
				<view
					v-if="item.nameAndQuantityRespList.length > 2"
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
			
			<view class="flex a-center j-space-between" style="margin-top: 18rpx;">
				<view class="order-price" >
					<!-- 0 待发货、1 已发货 -->
					<text>{{item.integrationAmount}}积分</text>
				</view>
				<view class="order-date">
					<text>{{item.orderTime}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
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
				margin-bottom: 40rpx;
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
		}
	}
	// 待付款
	.wait-pay{
		color: #ED9700!important;
		border-color: #ED9700!important;
	}
	// 待收货
	.wait-receiving-goods{
		color: #ed6d00!important;
		border-color: #ed6d00!important;
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
	// 社区列表
</style>

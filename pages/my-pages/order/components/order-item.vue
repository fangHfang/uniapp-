<template>
	<view class="order-list">
		<view 
			:id="'order-item-' + item.orderNo + orderIndex" 
			class="order-li" 
			v-for="(item,orderIndex) in list" 
			:key="'order-item-' +  item.orderNo + orderIndex"
			@click="$emit('toDetail',item)">
			<image v-if="item.orderCategory!==1 && item.activityName" class="mark-img" src="../../../../static/image/my/activityMark.png"></image>
			<view class="order-no-status flex j-space-between">
				<text class="order-no">订单号:{{item.orderNo}}</text>
				<!-- 0-待付款,1-待收货,2-部分收货,3-已完成,4-强制收货,5-已退款,6-已关闭 -->
				<text class="order-status wait-receiving-goods" v-if="item.orderStatus === 1">待收货</text>
				<text class="order-status wait-receiving-goods" v-if="item.orderStatus === 2">部分收货</text>
				<text class="order-status wait-pay" v-if="item.orderStatus === 0 && isShowPayBtn(item.orderTime,item.orderCategory)">待付款</text>
				<text class="order-status cancelled" v-if="item.orderStatus === 0 && !isShowPayBtn(item.orderTime,item.orderCategory)">已取消</text>
				<text class="order-status cancelled" v-if="item.orderStatus === 5">已退款</text>
				<text class="order-status cancelled" v-if="item.orderStatus === 6">已取消</text>
				<text class="order-status done-receiving-goods" v-if="item.orderStatus === 3">完成收货</text>
				<text class="order-status compulsory-receipt" v-if="item.orderStatus === 4">强制收货</text>
			</view>
			<view class="order-name big" v-if="item.orderCategory!==1 && item.activityName">{{item.activityName}}</view>
			<template v-if="item.nameAndQuantityRespList && item.nameAndQuantityRespList.length > 0">
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
			<template>
				<view
					class="order-name-number flex j-space-between">
					<text class="order-name"></text>
					<text class="order-number"></text>
				</view>
			</template>
			<view class="order-price" >
				<!-- 0-待付款,1-待收货,2-部分收货,3-已完成,4-强制收货,5-已退款,6-已关闭 -->
				<text>{{item.orderStatus === 0 ? "待付:" : ''}}￥{{$filtersNum(item.payAmount)}}</text>
			</view>
			<view class="order-date">
				<text>{{item.orderTime}}</text>
			</view>
			<view class="order-button-box">
				<!-- <text @click.stop="open(item,1)" class="order-button wait-receiving-goods" v-if="item.orderStatus === 1 || item.orderStatus === 2">确认收货</text> -->
				<text @click.stop="open(item,2)" v-show="isShowPayBtn(item.orderTime,item.orderCategory)" class="order-button cancelled" style="right:200rpx;"  v-if="item.orderStatus === 0">取消订单</text>
				<text @click.stop="open(item,3)" v-show="isShowPayBtn(item.orderTime,item.orderCategory)" class="order-button wait-pay" v-if="item.orderStatus === 0">确认付款</text>
			</view>
			<!-- https://o2o-mall.coding.net/p/mjs-test/bug-tracking/issues/1632/detail -->
			<!-- 开会说这个重新下单不要了 -->
			<!-- <text class="order-button cancelled" v-if="item.orderStatus === 6">重新下单</text> -->
		</view>
	</view>
</template>

<script>
	import {dateFormat} from '@/common/utils/DateUtil'
	export default {
		data() {
			return {
				orderNo:'',
				nowTime:new Date()
			}
		},
		props:{
			list: { // 为了请求数据,演示用,可根据自己的项目判断是否要传
				type: Array,
				default(){
					return []
				}
			},
			orderTabIndex:{
				type:Number,
				default(){
					return null
				}
			}
		},
		computed:{
			isShowPayBtn(){
				return function(orderTime,orderCategory){
					let type = false
					let min = orderCategory===1 ? 30 : 15
					let payExpireTime = new Date(new Date(orderTime.replace(/-/g, "/")).getTime() + 1000 * 60 * min)
					if(payExpireTime.getTime() > this.nowTime.getTime()){
						type = true
					}
					return type
				}
			}
		},
		mounted() {
			if(this.orderTabIndex === 0 || this.orderTabIndex == 1){
				this.setTime = setInterval(()=>{
					this.nowTime = new Date()
				},1000)
			}
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
						// 判断所有商品是否全部扫码，否则需要提示
						// 0-不需要扫码，1-未扫码，2-部分扫码，3-扫码完成
						let isShow = false
						if(item.orderScanCodeStatus === 1 || item.orderScanCodeStatus === 2){
							isShow = true
						}
						dialogOptions = {
							type,
							item,
							showTextOne:isShow,
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
						let payExpireTime = new Date(new Date(item.orderTime.replace(/-/g, "/")).getTime() + 1000 * 60 * 30)
						dialogOptions = {
							...item,
							type,
							orderStatus:"待付款",
							payAmount:item.payAmount,
							payExpireTime:dateFormat('yyyy-MM-dd HH:mm:ss',payExpireTime),
							consumeCouponAmount:item.consumeCouponAmount || 0,
							consumeRebateAmount:item.consumeRebateAmount || 0,
						}
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
			// 订单按钮
			.order-button-box{
				position: absolute;
				right: 20rpx;
				bottom:30rpx;
				display: flex;
			}
			.order-button{
				line-height: 26rpx;
				font-size: 26rpx;
				font-weight: 500;
				color: #ed6d00;
				padding: 12rpx 24rpx;
				border: 2rpx solid #ed6d00;
				border-radius: 5rpx;
				margin-left: 20rpx;
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
		z-index: 9;
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
	.order-name.big{
		width: 80%;
		font-size: 28rpx;
		font-weight: bold;
		margin-bottom:10px;
		color: #252527;
		overflow: hidden;
		-webkit-line-clamp: 1;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
	}
	.mark-img{
		position:absolute;
		top:0;
		left:20rpx;
		width:12px;
		height:12px;
		object-fit: contain;
	}
</style>

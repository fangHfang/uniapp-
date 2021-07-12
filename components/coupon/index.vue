<template>
	<view style="width: 100%;">
		<view class="coupon-content flex j-space-between"  @click="checkedCoupon(coupon.id)">
			<image v-if="!disabled" class="coupon-bg" src="../../static/image/coupon/coupon.png"></image>
			<image v-else class="coupon-bg" src="../../static/image/coupon/coupon-gray.png"></image>
			<view class="left-content flex a-center" :class="disabled && 'disabled'" >
				<view v-if="!disabled" class="check-box" :class="coupon.checked && 'checked'">
					<view class="pront"></view>
				</view>
				<view style="line-height: 1.2;">
					<!-- couponClass 优惠券类型(0:消费券,1:兑换券) -->
					<view v-if="coupon.couponClass === 0">
						<!-- 优惠类型(0:满减,1:折扣) -->
						<text class="text-primary price" v-if="coupon.discountType === 0">￥ {{coupon.discountAmount}}</text>
						<text class="text-primary price" v-else>{{coupon.discountAmount}}折</text>
						<text class="text-primary name">{{coupon.couponName}}</text>
					</view>
					<view v-else>
						<text class="text-primary name" style="margin-left: 0px;">{{coupon.couponName}}</text>
					</view>
					<!-- couponClass 优惠券类型(0:消费券,1:兑换券) -->
					<template v-if="coupon.couponClass === 0">
						<!-- orderLimitType 订单金额限制类型(0:不限制,1:限制)-->
						<text class="text-primary limitPrice" v-if="coupon.orderLimitType === 1">满{{coupon.orderLimitAmount}}可用</text>
						<view class="text-primary limitPrice" v-else>无门槛</view>
					</template>
					<template v-else>
						<view class="text-primary limitPrice">可兑换{{coupon.itemName}}</view>
					</template>
					<view>
						<text class="text-primary" style="margin-right:20rpx">有效时间</text>
						<template>
							<text class="text-primary date">{{coupon.startTime.substring(0,10)}}</text>
							<text class="text-primary">-</text>
							<text class="text-primary date">{{coupon.endTime.substring(0,10)}}</text>
						</template>
					</view>
				</view>
			</view>
			<view class="right-content">
				<text v-if="!disabled" class="isStackable-text">{{coupon.compositionLimit === 0 ? '可叠加':''}}</text>
				<text v-else class="invalid-text">已失效</text>
				<view class="coupon-mark-box">
					<!-- 优惠券类型(0:消费券,1:兑换券) -->
					<template v-if="coupon.couponClass === 0">
						<image v-if="!disabled" class="coupon-mark" src="../../static/image/coupon/mark.png"></image>
						<image v-else class="coupon-mark gray" src="../../static/image/coupon/mark-gray.png"></image>
					</template>
					<template v-else>
						<image v-if="!disabled" class="coupon-mark" src="../../static/image/coupon/exchange.png"></image>
						<image v-else class="coupon-mark gray" src="../../static/image/coupon/exchange-gray.png"></image>
					</template>
					
					<!-- <text class="mark-name" :class="{'gray':disabled}">消费券</text> -->
				</view>
				<view v-if="!disabled" class="toogle-box flex a-center" @tap.stop="toogleDec">
					<text class="text-primary">{{coupon.toogleDec ? '收起':'展开'}}</text>
					<uni-icons  class="tips-icon" :type="coupon.toogleDec ? 'arrowup':'arrowdown'" color="#ed6d00" size="12"></uni-icons>
				</view>
			</view>
		</view>
		<view v-if="coupon.toogleDec" class="dec-text">
			<view class="">卡券信息</view>
			<!-- 优惠券类型(0:消费券,1:兑换券) -->
			<template v-if="coupon.couponClass === 0">
				<view class="">1.{{couponType()}}</view>
				<view class="">2.{{coupon.compositionLimit === 0 ? '可叠加优惠券':'不可叠加优惠券'}}</view>
				<view class="" v-if="coupon.remark">3.优惠券备注:{{coupon.remark}}</view>
			</template>
			<template v-if="coupon.couponClass === 1">
				<view class="" v-if="coupon.remark">1.兑换券备注:{{coupon.remark}}</view>
			</template>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'coupon',
		components: {
		},
		props:{
			disabled:{
				type:Boolean,
				default:()=>false
			},
			coupon:{
				type: Object,
				default () {
					return {
						id:0,
						name:'',
						// 是否可叠加
						isStackable:true,
						limitPrice:0,
						price:0,
						startDate:'--',
						endDate:'--',
						// 是否展示描述信息
						toogleDec:false,
						dec:'--',
						// 是否长期有效
						receiveExpireType:1
					}
				}
			}
		},
		data() {
			return {
				
			}
		},
		computed:{
			
		},
		mounted() {
		},
		methods: {
			/**
			 * 显示隐藏优惠券描述信息
			 * */
			toogleDec(){
				this.coupon.toogleDec = !this.coupon.toogleDec
				this.$forceUpdate()
			},
			/**
			 * 选中优惠券
			 * */
			checkedCoupon(id){
				this.$emit('checkedCoupon',!this.coupon.checked)
			},
			
			/**
			 * 显示优惠券类型
			 * 限制类型(0:通用券,1:玛吉斯通用券,2:分类券,3:单品券)
			 */
			couponType(){
				let name = ''
				const { limitType,itemName} = this.coupon
				switch(limitType){
					case 0:
						name = '通用券';
						break;
					case 1:
						name = '玛吉斯通用券';
						break;
					case 2:
						name = '分类券';
						break;
					case 3:
						name = '单品券：' + itemName;
						break;
				}
				return name
			}
		}
	}
</script>

<style lang="scss">
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
	
	.coupon-content{
		position: relative;
		margin-top:20rpx;
		width:100%;
		
		.left-content{
			position: relative;
			z-index:10;
			padding-bottom:8rpx;
			padding-left:20rpx;
			align-items: center;
			min-height:calc((100vw - 20px) / 4.707);
		}
		.disabled{
			padding-left:60rpx;
			.text-primary{
				color:#999
			}
		}
		.coupon-bg{
			width:calc(100vw - 40rpx);
			height:calc((100vw - 40rpx) / 4.707);
			position: absolute;
			top:0;
			left:0;
		}
		.text-primary{
			font-size: 20rpx;
		}
		.price{
			font-size: 32rpx;
			font-weight: 600;
		}
		.name{
			margin-left:10rpx
		}
		.limitPrice{
			height: 20px;
			line-height: 20px;
		}
		.check-box{
			width:16px;
			height:16px;
			border-radius: 8px;
			position: relative;
			background-color:#fff;
			border:1px solid #fff;
			margin-right:20rpx;
		}
		.check-box.checked{
			border:1px solid $uni-color-primary;
			.pront{
				background-color: $uni-color-primary;
				width:10px;
				height:10px;
				border:1px solid $uni-color-primary;
				border-radius:5.5px;
				position: absolute;
				left:2px;
				top:2px;
			}
		}
		
		.right-content{
			position: relative;
			flex:1;
			left: 20rpx;
			.isStackable-text,.invalid-text{
				position: absolute;
				top:20rpx;
				font-size:32rpx;
				font-weight: 600;
				color: $uni-color-primary;
				right:130rpx;
			}
			.invalid-text{
				top:50rpx;
				color: #999;
			}
			.coupon-mark-box{
				.coupon-mark,.coupon-mark.gray{
					position: absolute;
					top:20rpx;
					right:16rpx;
					width:100rpx;
					height:calc(100rpx / 2.242);
				}
				.coupon-mark.gray{
					top:50rpx;
				}
				// .mark-name{
				// 	position: absolute;
				// 	top:26rpx;
				// 	right:26rpx;
				// 	font-size:20rpx;
				// 	color:#fff
				// }
				.mark-name.gray{
					top:56rpx;
				}
			}
		}
		.toogle-box{
			position:absolute;
			bottom:30rpx;
			right:50rpx;
			.text-primary{
				font-size:24rpx;
			}
			.tips-icon{
				margin-left:10rpx;
			}
		}
	}
	.dec-text{
		width: calc(100% - 22px);
		color: #666666;
		font-size: 10px;
		padding: 13px 10px;
		border: 1px solid rgba(253,80,34,.5);
		border-radius: 0px 0px 2.5px 2.5px;
	}
</style>

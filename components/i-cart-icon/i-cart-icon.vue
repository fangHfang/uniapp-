<template>
	<view class="i-cart-box" @tap="toShopCart">
		<uni-icons type="cart" color="#fff" size="22" />
		<view class="badge" />
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
	import {mapState} from 'vuex'
	import yuToast from '@/components/yu-toast/yu-toast'
	export default {
		name: 'iCartIcon',
		components: {},
		data() {
		  return {
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
				// 权限集合
				resourceList: state => state.login.resourceList
			}),
		},
		methods: {
			toShopCart() {
				// 购物车权限-STOREAPPA0402
				if(!this.resourceList.some((item)=>{return item.resourceNo === 'STOREAPPA0402'})){
					this.$refs.power.show()
					return
				}
				// 触发更新数量视图-商城tab
				this.$store.dispatch('app/setTriggerNumberMallTab')
				uni.navigateTo({
					url: '/pages/products/shopping-cart/shopping-cart'
				})
			}
		},
	}
</script>

<style lang="scss">
	.i-cart-box {
		position: fixed;
		bottom: 210rpx;
		bottom: calc(210rpx + constant(safe-area-inset-bottom));
		bottom: calc(210rpx + env(safe-area-inset-bottom));
		right: 10px;
		z-index: 105;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background-color: $uni-color-primary;
		box-shadow: 0 0 5px 2px rgba(0, 0, 0, .2);
		display: flex;
		align-items: center;
		justify-content: center;

		.badge {
			position: absolute;
			right: 4px;
			top: 8px;
			background-color: #f00;
			border: 2px solid #fff;
			width: 5px;
			height: 5px;
			border-radius: 50%;
		}
	}
</style>

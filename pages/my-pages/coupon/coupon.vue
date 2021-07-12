<template>
	<view class="page">
		<uni-nav-bar title="优惠券管理" backgroundColor="#ed6d00" color="#fff" left-icon="back" @clickLeft="toBack"></uni-nav-bar>
		<v-tabs 
			v-model="tabIndex" 
			:tabs="tabs" 
			:scroll="false" 
			:lineScale="0.2"
			activeColor="#ed6d00"
			lineColor="#ed6d00"
			height="88rpx"
			field="name"
			fontSize="32rpx"
			lineHeight="4rpx"
			@change="changeTab"></v-tabs>
		<swiper 
			class="swiper-box"
			:current="tabIndex" 
			duration="300" 
			@change="swiperChange">
		  <swiper-item 
				v-for="(item,index) in tabs" 
				:key="index"
				class="swiper-item ">
				<coupon-item 
					ref="couponItem" 
					:i="index" 
					:index="tabIndex" 
					:tabs="tabs"></coupon-item>
		  </swiper-item>
		</swiper>
	</view>
</template>

<script>
	import vTabs from "@/components/v-tabs/v-tabs.vue";
	import CouponItem from "./coupon-item.vue";
	export default {
		name: 'coupon',
		components: {
			vTabs,
			CouponItem
		},
		data() {
			return {
				// tabs
				// 优惠券状态(8:待激活，1:待使用，2:已过期，99:已使用)
				tabs: [
					{name:"待激活",couponStatus:8},
					{name:"待使用",couponStatus:1},
					{name:"已使用",couponStatus:99},
					{name:"已过期",couponStatus:2}
				],
				// tabs下标
				tabIndex: 0 
			}
		},
		onLoad() {},
		methods: {
			/**
			 * 返回上一级页面
			 */
			toBack(){
				uni.navigateBack({
					delta: 1
				})
			},
			/**
			 * tab切换事件
			 */
			changeTab(index) {
				this.tabIndex = index;
			},
			/**
			 * swipe切换事件
			 * @param {Object} e
			 */
			swiperChange(e) {
				let { current } = e.target;
				this.tabIndex = current;
			},
		}
	}
</script>

<style lang="scss" scoped>
	.v-tabs{
		border-bottom: 1px solid #CCCCCC;
	}
	.swiper-box{
		// background-color: #F2F2F2;
		height: calc(100vh - 88rpx - 88rpx - 2rpx - 2rpx - var(--status-bar-height));
	}
</style>

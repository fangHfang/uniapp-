<template>
	<view class="page">
		<view id="tab">
			<uni-nav-bar title="历史帖子" left-icon="back" backgroundColor="#ed6d00" color="#fff" @clickLeft="toBack"></uni-nav-bar>
			<view style="border-bottom:1px solid #eee">
				<v-tabs v-model="tabIndex" :tabs="tabs" :scroll="false" :lineScale="0.2" activeColor="#ed6d00" lineColor="#ed6d00"
				 height="80rpx" fontSize="32rpx" lineHeight="6rpx" @change="changeTab" field="name"></v-tabs>
			</view>
		</view>
		<swiper class="swiper-box" :current="tabIndex" duration="300" @change="swiperChange" :style="`height:${swiperHeight}`">
			<swiper-item v-for="(item,index) in tabs" :key="index" class="swiper-item ">
				<list-item ref="mescrollItem" :height='topHeight' :i="index" :index="tabIndex" :tabs="tabs" @toDetail="toDetail"></list-item>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import vTabs from "@/components/v-tabs/v-tabs.vue";
	import ListItem from "./list-item.vue";
	export default {
		name: 'community',
		components: {
			vTabs,
			ListItem
		},
		data() {
			return {
				systemInfo: uni.getSystemInfoSync(),
				// 下拉刷新组件实例
				mescroll: null,
				// tabs
				tabs: [{
					name: '已通过',
					status: 0
				}, {
					name: '未通过',
					status: 1
				}],
				// tabs下标
				tabIndex: 0,
				topHeight: '0px',
				swiperHeight: '100%'
			}
		},
		mounted() {
			this.countTopBar();
		},
		methods: {
			/**
			 * 计算顶部DOM元素节点
			 */
			async countTopBar() {
				let that = this
				const topHeight = await this.$getComponentsDom('#tab');
				this.topHeight = topHeight.bottom + 'px'
				this.swiperHeight = (that.systemInfo.windowHeight - topHeight.bottom) + 'px'
			},
			/**
			 * tab切换事件
			 */
			changeTab(index) {
				this.tabIndex = index;
			},
			/**
			 * 返回上一级页面
			 */
			toBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			/**
			 * swipe切换事件
			 * @param {Object} e
			 */
			swiperChange(e) {
				let {
					current
				} = e.target;
				this.tabIndex = current;
			}
		}
	}
</script>

<style lang="scss" scoped>
	// swpier
	.swiper-box {
		background-color: #F2F2F2;
	}
	// swpier
	// 发帖
	.post-box {
		position: fixed;
		right: 10rpx;
		bottom: 210rpx;
		bottom: calc(210rpx + constant(safe-area-inset-bottom));
		bottom: calc(210rpx + env(safe-area-inset-bottom));
		width: 62rpx;
		height: 62rpx;

		>image {
			width: 100%;
			height: 100%;
		}
	}

	// 发帖
	// 帮助
	.bangzhu-box {
		position: fixed;
		right: 10rpx;
		bottom: 135rpx;
		bottom: calc(135rpx + constant(safe-area-inset-bottom));
		bottom: calc(135rpx + env(safe-area-inset-bottom));
		width: 62rpx;
		height: 62rpx;

		>image {
			width: 100%;
			height: 100%;
		}
	}

	// 帮助
</style>

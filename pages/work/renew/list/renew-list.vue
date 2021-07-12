<template>
	<view class="page">
		<view id="tab">
			<uni-nav-bar title="换新申请" backgroundColor="#ed6d00" color="#fff" left-icon="back" @clickLeft="toBack"></uni-nav-bar>
			<!-- 搜索栏 -->
			<view class="flex search-box">
				<uni-search-bar class="search-bar" placeholder="请输入车牌号/手机号/订单号" :radius="20" clearButton="auto" cancelButton="none"
				 @confirm="toSearch" @input="input" @clear="toSearch" />
			</view>
			<v-tabs v-model="tabIndex" :tabs="tabs" :scroll="false" class="tab-box" bold field="name" badge="number" color="#666"
			 activeColor="#ed6d00" lineColor="#ed6d00" height="80rpx" fontSize="24rpx" lineHeight="8rpx" @change="changeTab"></v-tabs>
		</view>
		<swiper class="swiper-box" :style="`height:${swiperHeight}`" :current="tabIndex" duration="300" @change="swiperChange">
			<swiper-item v-for="(item,index) in tabs" :key="index" class="swiper-item ">
				<renew-list-item :ref="'mescrollItem'+index" :i="index" :height='topHeight' :index="tabIndex" :tabs="tabs"
				 :searchValue="searchValue"></renew-list-item>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import vTabs from "@/components/v-tabs/v-tabs.vue";
	import RenewListItem from "./renew-list-item.vue";
	export default {
		name: 'renewList',
		components: {
			vTabs,
			RenewListItem
		},
		data() {
			return {
				systemInfo: uni.getSystemInfoSync(),
				tabs: [{
						name: "可换新",
						status: 99
					},
					{
						name: "审核中",
						status: 0
					},
					{
						name: "未通过",
						status: 1
					},
					{
						name: "已通过",
						status: 2
					},
					{
						name: "已换新",
						status: 3
					},
				],
				// tabs下标
				tabIndex: 0,
				swiperHeight: '100%',
				topHeight: '100%',
				searchValue: ''
			}
		},
		onLoad(e) {
		},
		created() {

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
			 * swipe切换事件
			 * @param {Object} e
			 */
			swiperChange(e) {
				let {
					current
				} = e.target;
				this.tabIndex = current;
			},

			/**
			 * 搜索
			 */
			toSearch(res) {
				this.searchValue = res.value
				this.$refs['mescrollItem' + this.tabIndex][0].downCallback()
			},
			input(res) {
				this.searchValue = res.value
			},
			/**
			 * 返回上一级页面
			 */
			toBack() {
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {}

	// swpier
	.swiper-box {
		background-color: #F2F2F2;
	}

	.swiper-item {
		height: 100%;
		width: 100%;
	}

	// swpier
	// 搜索栏
	.search-box {}

	/deep/.search-bar {
		width: 100%;
		background-color: #FFFFFF;
		padding: 20rpx 20rpx 0 20rpx;

		>.uni-searchbar__box {
			justify-content: left;
			height: 68rpx;
			border-color: $uni-color-primary;

			>.uni-searchbar__text-placeholder {
				margin-left: 0px;
			}
		}
	}

	// 搜索栏
	.tab-box {
		border-bottom: 1px solid #eee;
	}
</style>

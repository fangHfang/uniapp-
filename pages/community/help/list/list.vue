<template>
	<view class="page">
		<uni-nav-bar id="topBar" title="帮助中心" left-icon="back" backgroundColor="#ed6d00" color="#fff" @clickLeft="toBack"></uni-nav-bar>
		<mescroll-uni :top="options.mescrollTop" :bottom="options.mescrollBottom" ref="mescrollRef" safearea height="100%"
		 @init="mescrollInit" :down="options.downOption" :up="options.upOption" @down="downCallback" @up="upCallback">
			<uni-list class="community-list">
				<uni-list-item showArrow :title="(resultIndex+1)+'、'+item.title" v-for="(item,resultIndex) in pageData.result" :key="'community-item-' + resultIndex"
				 @click="toDetail(item)" clickable/>
			</uni-list>
			<mescroll-empty v-if="pageData.result.length==0"></mescroll-empty>
		</mescroll-uni>
		<view class="fixed-bottom-box" id="bottomBox" @click="confirm">
			<view class="btn">提交反馈</view>
		</view>
	</view>
</template>

<script>
	import community from '@/api/community/community.js'
	import MescrollEmpty from '@/components/mescroll-uni/components/mescroll-empty.vue';
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollMoreItemMixin from "@/components/mescroll-uni/mixins/mescroll-more-item.js";
	export default {
		mixins: [MescrollMixin, MescrollMoreItemMixin],
		components: {
			MescrollEmpty
		},
		data() {
			return {
				options: {
					mescroll: '',
					// 下拉容器居顶部距离
					mescrollTop: 0,
					// 下拉容器居底部距离
					mescrollBottom: 0,
					downOption: {},
					upOption: {
						noMoreSize: 5,
						empty: {
							use: false
						}
					},
				},
				// 列表数据
				pageData: {
					result: [],
					allPages: 2,
					pageNum: 1,
					pageSize: 10
				},
				mescrollBottom: 0,
			}
		},
		mounted() {
			this.countTopBar()
		},
		methods: {
			/**
			 * 计算顶部DOM元素节点
			 */
			async countTopBar() {
				const topBar = await this.$getComponentsDom('#topBar');
				const bottomBox = await this.$getComponentsDom('#bottomBox');
				this.options.mescrollBottom = (topBar.height + bottomBox.height) + 'px'
			},
			/**
			 * 初始化回调方法
			 * @param {Object} mescroll
			 */
			mescrollInit(mescroll) {
				this.options.mescroll = mescroll
			},
			/**
			 * 返回上一级页面
			 */
			toBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			/*下拉刷新的回调 */
			downCallback() {
				this.options.mescroll.resetUpScroll();
			},
			/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
			async upCallback(page) {
				const that = this
				that.pageData.pageNum = page.num
				try {
					const res = await that.listRemoteDataByPage()
					setTimeout(() => {
						that.options.mescroll.endByPage(res.data.records.length, that.pageData.allPages)
					}, 300);
				} catch (error) {
					that.mescroll.endErr()
				}
			},
			/**
			 * 分页查询列表数据
			 */
			listRemoteDataByPage() {
				const that = this
				return new Promise((resolve, reject) => {
					let postData = {
						pageNum: that.pageData.pageNum,
						pageSize: that.pageData.pageSize
					}
					community.feedbackList(postData).then((res) => {
						if (res.code === 200) {
							let list = res.data.records.filter(x => x.status === 1)
							that.pageData.result = that.pageData.pageNum === 1 ? list : [...that.pageData.result, ...list]
							that.pageData.allPages = res.data.pages
							resolve(res)
						} else {
							uni.showToast({
								icon: "none",
								title: res.msg
							})
						}
					}).catch((err) => {
						uni.showToast({
							icon: "none",
							title: err.msg
						})
						reject(err)
					})

				})
			},
			/**
			 * 提交
			 */
			confirm() {
				uni.navigateTo({
					url: '/pages/community/help/add/add'
				})
			},
			/**
			 * 提交
			 */
			toDetail(item) {
				console.log(111)
				uni.navigateTo({
					url: '/pages/community/help/detail/detail?content=' + encodeURIComponent(item.content) + '&title=' + item.title + '&created=' + item
						.created
				})
			},
		}
	}
</script>
<style lang="scss" scoped>
	.page {
		height: 100vh;
		z-index: 1;
		overflow: hidden;
		position: relative;
		background-color: #F2F2F2;
	}

	// 社区列表
	.community-list {
		margin: 20rpx;
	}

	.fixed-bottom-box {
		width: 100%;
		background-color: #fff;
		position: fixed;
		bottom: 0;
		left: 0;
		box-sizing: border-box;
		padding: 20rpx 36rpx;
		padding-bottom: calc(20rpx + constant(safe-area-inset-bottom) / 2);
		padding-bottom: calc(20rpx + env(safe-area-inset-bottom) / 2);
		display: flex;
		justify-content: space-between;
		align-items: center;

		.btn {
			color: #fff;
			font-size: 36rpx;
			background-color: $uni-color-primary;
			width: 100%;
			margin: auto;
			border-radius: 50rpx;
			text-align: center;
			padding: 20rpx;
		}
	}

	// 社区列表
</style>

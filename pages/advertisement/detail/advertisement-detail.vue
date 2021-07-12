<template>
	<view class="page">
		<uni-nav-bar id="topBar" title="公告详情" left-icon="back" backgroundColor="#ed6d00" color="#fff" @clickLeft="toBack"></uni-nav-bar>

		<mescroll-uni :top="options.mescrollTop" :bottom="options.mescrollBottom" ref="mescrollRef" safearea height="100%"
		 @init="mescrollInit" :down="options.downOption" :up="options.upOption" @down="downCallback" style="background-color: #fff;">
			<view class="inner-container">
				<view class="detail">
					<view class="article-title flex a-center j-center">{{detail.title}}</view>
					<view class="article-date flex a-center j-center">{{detail.created}}</view>
					<view v-html="detail.noticeContent" class="article-html"></view>
				</view>
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
	import home from '@/api/home/home.js'
	export default {
		name: 'communityDetail',
		components: {},
		data() {
			return {
				// 页面前端参数
				options: {
					mescroll: '',
					// 下拉容器居顶部距离
					mescrollTop: 0,
					// 下拉容器居底部距离
					mescrollBottom: 0,
					downOption: {},
					upOption: {
						use:false
					},
				},
				// 分页数据
				pages: {
					num: 1,
					allPages: 1,
					size: 10
				},
				// 详情id
				noticeNo: 0,
				// 详情数据
				detail: {},
			}
		},
		onLoad(e) {
			this.noticeNo = e.noticeNo
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
				this.options.mescrollBottom = topBar.height + 'px'
			},
			/**
			 * 初始化回调方法
			 * @param {Object} mescroll
			 */
			mescrollInit(mescroll) {
				this.options.mescroll = mescroll
			},
			/**
			 * 下拉刷新
			 * */
			async downCallback() {
				this.getCommunityDetail()
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
			 * 根据id获取详情
			 */
			getCommunityDetail() {
				let postData = {
					noticeNo: this.noticeNo
				}
				uni.showLoading({
					title: '加载中···'
				})
				home.getNoticeById(this.$jsonFormat(postData)).then((res) => {
					if (res.code === 200) {
						this.detail = res.data
					} else {
						uni.showToast({
							icon: "none",
							title: res.msg
						})
					}
					this.options.mescroll.endDownScroll();
					uni.hideLoading()
				}).catch((err) => {
					uni.hideLoading()
					uni.showToast({
						icon: "none",
						title: err.msg
					})
				})
			}
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

	.detail {
		width: calc(100% - 20px);
		padding: 0 10px;
		background: #fff;
	}

	.article-title {
		color: #1C1C1C;
		font-size: 15px;
		font-weight: bold;
		padding-top: 25px;
		text-align: center;
	}

	.article-date {
		color: #666666;
		font-size: 10px;
		margin-top: 10px;
		margin-bottom: 20px;
	}

	.article-html {
		font-size: 24rpx;
		font-weight: 400;
		color: #1c1c1c;
		margin-bottom: 10rpx;
		width: 100%;
		text-overflow: ellipsis;
		word-break: break-all;

		/deep/span {
			font-size: 24rpx !important;
			color: #1c1c1c;
		}

		/deep/img {
			width: 100%;
			height: auto;
		}
	}
</style>

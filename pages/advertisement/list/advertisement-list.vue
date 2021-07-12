<template>
	<view class="page">
		<uni-nav-bar id="topBar" title="公告" left-icon="back" backgroundColor="#ed6d00" color="#fff" @clickLeft="toBack">
		</uni-nav-bar>
		<mescroll-uni :top="options.mescrollTop" :bottom="options.mescrollBottom" ref="mescrollRef" safearea
			height="100%" @init="mescrollInit" :down="options.downOption" :up="options.upOption" @down="downCallback"
			@up="upCallback">
			<uni-list class="community-list">
				<uni-list-item :ellipsis="1" v-for="(item,resultIndex) in pageData.result"
					:key="'community-item-' + resultIndex" :title="item.title" :note="item.pushTime" showArrow
					thumb="../../../static/image/community/avatar2.png" thumb-size="lg" @click="toDetail(item)"
					clickable>
					<view class="pot" v-if="item.readStatus===0"></view>
				</uni-list-item>
			</uni-list>
			<mescroll-empty v-if="pageData.result.length==0"></mescroll-empty>
		</mescroll-uni>
	</view>
</template>

<script>
	import home from '@/api/home/home.js'
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
						pageReq: {
							pageNum: that.pageData.pageNum,
							pageSize: that.pageData.pageSize
						}
					}
					home.getNoticeList(postData).then((res) => {
						if (res.code === 200) {
							let list = res.data.records.filter(x => x.status === 1)
							that.pageData.result = that.pageData.pageNum === 1 ? list : [...that.pageData
								.result, ...list
							]
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
			toDetail(item) {
				uni.navigateTo({
					url: '../detail/advertisement-detail?noticeNo=' + item.noticeNo
				})
			}
		}
	}
</script>

<style lang="scss">
	.page {
		height: 100vh;
		z-index: 1;
		overflow: hidden;
		position: relative;
		background-color: #F2F2F2;
	}

	.pot {
		position: absolute;
		top: 10px;
		right: 30px;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background-color: #ed6d00;
	}
</style>

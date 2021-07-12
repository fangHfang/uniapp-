<template>
	<mescroll-uni @init="mescrollInit" :bottom="mescrollBottom" height="100%" safearea :up="upOption"
	 :down="downOption" @down="downCallback" @up="upCallback">
		<orderItem :list="pageData.result" @toDetail="toDetail" :index="index"></orderItem>
		<mescroll-empty v-if="pageData.result.length==0"></mescroll-empty>
	</mescroll-uni>
</template>

<script>
	import order from '@/api/ease/order.js'
	import MescrollEmpty from '@/components/mescroll-uni/components/mescroll-empty.vue';
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollMoreItemMixin from "@/components/mescroll-uni/mixins/mescroll-more-item.js"
	import orderItem from "../components/order-item.vue"
	export default {
		// 注意此处还需使用MescrollMoreItemMixin (必须写在MescrollMixin后面)
		mixins: [MescrollMixin, MescrollMoreItemMixin],
		components: {
			orderItem,
			MescrollEmpty
		},
		data() {
			return {
				downOption: {},
				upOption: {
					auto: false,
					empty: {
						use: false
					}
				},
				mescrollBottom: 0,
				// 列表数据
				pageData: {
					result: [],
					allPages: 2,
					pageNum: 1,
					pageSize: 10
				}
			}
		},
		props: {
			// 每个tab页的专属下标 (除了支付宝小程序必须在这里定义, 其他平台都可不用写, 因为已在MescrollMoreItemMixin定义)
			i: Number,
			// 每个tab页的专属下标 (除了支付宝小程序必须在这里定义, 其他平台都可不用写, 因为已在MescrollMoreItemMixin定义)
			index: {
				type: Number,
				default () {
					return 0
				}
			},
			// 请求数据
			tabs: {
				type: Array,
				default () {
					return []
				}
			},
			height: {
				type: String,
				default: () => '100%'
			},
			searchValue: {
				type: String,
				default: ''
			}

		},
		computed: {
			status() {
				return this.tabs[this.index].status
			}
		},
		watch: {
			height: {
				handler() {
					this.mescrollBottom = this.$props.height
				}
			}
		},
		mounted() {},
		methods: {
			/*下拉刷新的回调 */
			downCallback() {
				this.mescroll.resetUpScroll();
			},
			/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
			async upCallback(page) {
				const that = this
				that.pageData.pageNum = page.num
				try {
					const res = await that.listRemoteDataByPage()
					setTimeout(() => {
						that.mescroll.endByPage(res.data.records.length, that.pageData.allPages)
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
							pageSize: that.pageData.pageSize,
						},
						warehouseOutSearchName: that.searchValue,
						status: that.status
					}
					order.listEaseOrderByPage(postData).then((res) => {
						if (res.code === 200) {
							that.pageData.result = that.pageData.pageNum === 1 ? res.data.records : [...that.pageData.result, ...res.data
								.records
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

			/**
			 * 跳转详情页
			 */
			toDetail(item) {
				uni.navigateTo({
					url: "/pages/work/order/detail/order-detail?orderNo=" + item.warehouseOutNo,
				})
			}
		}
	}
</script>
<style lang="scss" scoped>

</style>

<template>
	<view class="page">
		<uni-nav-bar id="navbar" title="店检管理" left-icon="back" backgroundColor="#ed6d00" color="#fff" @clickLeft="toBack" />
		<mescroll-uni ref="mescrollRef" @init="mescrollInit" class="mescroll-uni" :top="pageOptions.mescrollTop" :bottom="pageOptions.mescrollBottom"
		 :up="upOption" safearea @down="downCallback">
			<view class="card-box">
				<uni-collapse accordion="true" v-for="(item,index) in list" :key="index" :accordion="true">
					<uni-collapse-item class="inspection" :title="item.label" :showAnimation="true">
						<view class="item-inspection" v-for="(storeItem,storeIndex) in item.value" :key="storeIndex" @click="toHistory(storeItem)">
							{{storeItem.name}}
						</view>
					</uni-collapse-item>
				</uni-collapse>
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
	import inspection from '@/api/inspection/inspection.js'
	export default {
		name: 'inspectionList',
		data() {
			return {
				systemInfo: uni.getSystemInfoSync(),
				upOption: {
					use: false,
					empty: {
						use: false
					}
				},
				// 下拉刷新组件实例
				mescroll: null,
				// 页面配置
				pageOptions: {
					// 适配刘海屏
					mescrollTop: 44,
					mescrollBottom: 0,
				},
				list: []
			}
		},
		computed: {},
		mounted() {
			this.countTopBar()
		},
		methods: {
			/**
			 * 计算顶部DOM元素节点
			 */
			async countTopBar() {
				const searchBarHeight = await this.$getComponentsDom('#navbar');
				this.pageOptions.mescrollTop = searchBarHeight.height + 'px'
			},
			/**
			 * 下拉刷新回调
			 */
			downCallback() {
				// 先触发查询
				this.listRemoteDataByPage()
			},
			/**
			 * 查询列表数据
			 */
			listRemoteDataByPage() {
				let postData = {}
				uni.showLoading({
					title: '加载中···'
				})
				inspection.getInspectionList(postData).then((res) => {
					if (res.code === 200) {
						//后端这里返回了一个对象而不是数组，无语，自己封装吧(꒪⌓꒪)
						let list = []
						for (let key in res.data) {
							list.push({
								label: key,
								value: res.data[key]
							})
						}
						this.list = list
						//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
						setTimeout(() => {
							this.mescroll.endSuccess();
						}, 300)
					} else {
						uni.showToast({
							icon: "none",
							title: res.msg
						})
					}
					uni.hideLoading()
				}).catch((err) => {
					uni.hideLoading()
					uni.showToast({
						icon: "none",
						title: err.msg
					})
				})
			},
			/**
			 * 返回上一页
			 */
			toBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			/**
			 * 查看详情
			 * @param {Object} id 详情id
			 */
			toHistory(item) {
				uni.navigateTo({
					url: `/pages/work/inspection/history?inspectNo=${item.inspectNo}&name=${item.name}`
				})
			},
		}
	}
</script>

<style lang="scss">
	.page {
		background-color: #F2F2F2;
		position: relative;
		height: 100vh;
		overflow: hidden;
	}

	.inspection {
		.item-inspection {
			padding: 30upx;
			border-bottom: 1upx solid #ddd;
		}

		.item-inspection:nth-last-of-type(1) {
			border: none;
		}
	}

	.uni-collapse {
		/deep/ .uni-collapse-cell__title-text {
			color: #1C1C1C;
			font-size: 15px;
			font-weight: bold;
			text-align: center;
		}

		/deep/ .uni-collapse-cell__title:active {
			background: #fff;
		}

		/deep/ .uni-collapse-cell--open {
			background: #fff;
			border-bottom: 1upx solid #ddd;
		}

		/deep/ .uni-collapse-cell__content {
			color: #1C1C1C;
			font-size: 13px;
			text-align: center;
			background: #f1f1f1;
			border: none;
		}
	}
</style>

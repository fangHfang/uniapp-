<template>
	<!-- 
	swiper中的transfrom会使fixed失效,此时用height="100%"固定高度; 
	swiper中无法触发mescroll-mixins.js的onPageScroll和onReachBottom方法,只能用mescroll-uni,不能用mescroll-body
	-->
	<mescroll-uni :ref="'mescrollRef'+i" @init="mescrollInit" :bottom="mescrollBottom" height="100%" safearea :up="upOption"
	 :down="downOption" @down="downCallback" @up="upCallback">
		<view class="community-list">
			<view :id="'community-item-' + i + '-' + item.id" class="community-li" v-for="(item,resultIndex) in pageData.result"
			 :key="'community-item-' + i + '-' + resultIndex" @click="toDetail(item)">
				<text class="community-name">{{item.title}}</text>
				<view class="community-content" v-html="item.content"></view>
				<view class="community-name store">
					<text>{{item.storeName}}</text>
					<text :class="item.auditStatus===2?'reject button':'button'" v-if="!isPass">{{item.auditStatus===2?'驳回':'未审核'}}</text>
				</view>
				<view class="flex-item" style="padding-bottom: 30rpx;border-bottom: 1rpx solid #CCCCCC;" :style="{borderWidth:pageData.result.length === (resultIndex + 1) ? '0' : '1rpx' }">
					<text class="community-date">{{item.created}}</text>
					<view class="flex-item">
						<icon class="iconfont dianzan" style='color:#252527;font-size: 30rpx;' type=""></icon>
						<text class="community-comment">{{item.clickCount}}</text>
						<icon class="iconfont xiaoxi1" style='color:#252527;font-size: 35rpx;' type=""></icon>
						<text class="community-read">{{item.commentCount}}</text>
					</view>
				</view>
			</view>
		</view>
		<mescroll-empty v-if="pageData.result.length==0"></mescroll-empty>
	</mescroll-uni>
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
				downOption: {},
				upOption: {
					auto: false,
					noMoreSize: 5,
					empty: {
						use: false
					}
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
		props: {
			i: Number,
			index: {
				type: Number,
				default () {
					return 0
				}
			},
			tabs: { // 为了请求数据,演示用,可根据自己的项目判断是否要传
				type: Array,
				default () {
					return []
				}
			},
			height: {
				type: String,
				default: '0px'
			},
		},
		watch: {
			height: {
				handler() {
					this.mescrollBottom = this.$props.height
				}
			}
		},
		computed: {
			isPass() {
				return this.index === 0
			}
		},
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
						articleType: 1
					}
					if (this.isPass) {

						community.getAppQueryAuditHistoryList(postData).then((res) => {
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
					} else {
						community.getAppQueryUnAuditHistoryList(postData).then((res) => {
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
					}
				})
			},

			/**
			 * 跳转详情页
			 */
			toDetail(item) {
				if(this.isPass){	
					uni.navigateTo({
						url: '/pages/community/detail/communityDetail?articleNo=' + item.articleNo + '&title=' + item.title
					})
				}else{
					uni.navigateTo({
						url: '/pages/community/post/post?articleNo=' + item.articleNo + '&isPass=' + this.isPass +'&history=true&articleType=1'
					})
				}
			},
		}
	}
</script>
<style lang="scss" scoped>
	// 社区列表
	.community-list {
		padding: 20rpx;

		.community-li {
			display: flex;
			flex-direction: column;
			padding: 20rpx 20rpx 0;
			background-color: #ffffff;

			.community-name {
				font-size: 30rpx;
				font-weight: bold;
				color: #252527;
				margin-bottom: 20rpx;
				width: 100%;
				overflow: hidden;
				text-overflow: ellipsis;
				word-break: break-all;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				/* autoprefixer: ignore next */
				-webkit-box-orient: vertical;
				&.store{
					font-size:26rpx;
					margin:0;
					display:flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom:5px;
					.button{
						color:#fff;
						font-weight:400;
						width:60px;
						height:20px;
						font-size:22rpx;
						border-radius:3px;
						line-height: 20px;
						text-align: center;
						background-color: #999;
						&.reject{
							background-color: #ed6d00;
						}
					}
				}
			}

			.community-content {
				font-size: 24rpx;
				font-weight: 400;
				color: #1c1c1c;
				margin-bottom: 10rpx;
				width: 100%;
				max-height: 200px;
				overflow: hidden !important;
				text-overflow: ellipsis;
				word-break: break-all;
				display: -webkit-box;
				-webkit-line-clamp: 4;
				-webkit-box-orient: vertical;

				/deep/span {
					font-size: 24rpx !important;
					color: #1c1c1c;
				}

				/deep/img {
					width: 50%;
					height:auto;
					display: block;
					position:relative;
					object-fit: cover;
					object-position: top;
					max-height: calc(100vw - 40px);
				}

				/deep/image {
					width: 50%;
					height:auto;
					display: block;
					position:relative;
					object-fit: cover;
					object-position: top;
					max-height: calc(100vw - 40px);
				}
			}

			.community-img {
				width: 100%;
				border-radius: 5rpx;
				margin-bottom: 30rpx;
			}

			.flex-item {
				display: flex;
				justify-content: space-between;
				align-items: center;
			}

			.community-date {
				font-size: 20rpx;
				color: #252527;
			}

			.community-comment {
				font-size: 24rpx;
				font-weight: 500;
				color: #252527;
				margin-left: 16rpx;
				margin-right: 72rpx;
			}

			.community-read {
				font-size: 24rpx;
				font-weight: 500;
				color: #252527;
				margin-left: 16rpx;
				margin-right: 60rpx;
			}
		}
	}

	// 社区列表
</style>

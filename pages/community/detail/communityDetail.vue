<template>
	<view class="page">
		<uni-nav-bar id="topBar" :title="pageTitle" left-icon="back" backgroundColor="#ed6d00" color="#fff" @clickLeft="toBack"></uni-nav-bar>

		<mescroll-uni :top="options.mescrollTop" :bottom="options.mescrollBottom" ref="mescrollRef" safearea height="100%"
		 @init="mescrollInit" :down="options.downOption" :up="options.upOption" @down="downCallback" @up="upCallback">
			<view class="inner-container">
				<view class="detail">
					<view class="article-title flex a-center j-center">{{detail.title}}</view>
					<view class="article-date flex a-center j-center">{{detail.created}}</view>
					<view v-html="detail.content" class="article-html"></view>
					<view class="flex a-center j-center">
						<view class="agree flex a-center j-center flex-column" :class="[isAgree ? 'agree-bg':'']" @click="agree">
							<icon class="iconfont dianzan" type=""></icon>
							<view class="likes-num">{{detail.clickCount || ''}}</view>
						</view>
					</view>
				</view>
				<view class="comment-list">
					<view class="comment">评论列表</view>
					<view v-if="commentList.length > 0">
						<view class="comment-item" v-for="(item,index) in commentList" :key="index">
							<view class="flex a-center">
								<view class="item-img">
									<fr-image loading-ing-img="oblique-light" src="../../../static/image/community/avatar.png" mode="widthFix"></fr-image>
								</view>
								<view class="item-content flex a-center j-space-between">
									<view>
										<view class="item-name">
											{{item.userName}}
										</view>
										<view class="item-introduce">
											<text class="item-layer">{{item.floorNum}}楼</text>
											<text>{{item.dateStr}}</text>
										</view>
									</view>
									<view class="item-icon flex a-center j-center">
										<view class="like-icon flex a-center j-center flex-column" @click="giveThumbs(item)">
											<icon class="iconfont dianzan" :class="[item.clickStatus? 'agree-color' : '']" type=""></icon>
											<view v-if="item.clickCount > 0" class="likes-num">{{item.clickCount}}</view>
											<view v-else style="visibility: hidden;">1</view>
										</view>
										<view class="like-icon flex a-center j-center flex-column" @click="comment(item)">
											<icon class="iconfont xiaoxi1" type=""></icon>
											<view v-if="item.replyCount > 0" class="likes-num">{{item.replyCount}}</view>
											<view v-else style="visibility: hidden;">1</view>
										</view>
									</view>
								</view>
							</view>
							<view class="item-list">
								<view class="item-comment">{{item.content}}</view>
								<view v-if="item.replyCount > 0" class="item-look" @click="lookComment(index,item)">
									<text>共{{item.replyCount}}条评论</text>
									<icon class="iconfont" :class="[item.isLook? 'up' : 'down']" type=""></icon>
								</view>
								<view v-if="item.isLook" class="">
									<view v-for="(lookItem,lookIndex) in item.replys" :key="lookIndex" class="look-list" @click="comment(lookItem)">
										<text class="look-name">{{lookItem.userName}}</text>
										<text style="margin-right: 4px;">回复</text>
										<text class="look-name">{{lookItem.toUserName}}:</text>
										<text style="line-height: 18px;">{{lookItem.content}}</text>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view v-else class="no-comment">暂无评论...</view>
				</view>
			</view>
		</mescroll-uni>
		<view class="footer" id="bottomBox">
			<input :class="detail.openComment===0?'footer-inp disabled-inp':'footer-inp'" :focus="isfocus" adjust-position
			 confirm-hold v-model="message" type="text" value="" placeholder="我来说几句..." @confirm="confirmInp" confirm-type="done"
			 :disabled="detail.openComment===0" />
		</view>
	</view>
</template>

<script>
	import community from '@/api/community/community.js'
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
						noMoreSize: 5,
						empty: {
							use: false
						}
					},
				},
				// 分页数据
				pages: {
					num: 1,
					allPages: 1,
					size: 10
				},
				// 导航栏标题
				pageTitle: "标题",
				// 设置竖向滚动条位置
				scrollTop: 0,
				// 详情id
				articleNo: 0,
				// 详情数据
				detail: {},
				isAgree: false,
				commentList: [],
				isfocus: false,
				isComment: false,
				commentItem: {},
				message: '',
				prevMessage: ''
			}
		},
		onLoad(e) {
			// 将传入title赋给导航栏
			let {
				articleNo,
				title
			} = e
			this.pageTitle = title
			this.articleNo = articleNo
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
			 * 下拉刷新
			 * */
			async downCallback() {
				this.getCommunityDetail()
				// 重置列表为第一页 (自动执行 page.num=1, 再触发upCallback方法
				this.options.mescroll.resetUpScroll();
			},
			/**
			 * 上拉分页 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10
			 */
			async upCallback(page) {
				const that = this
				that.pages.num = page.num
				const res = await that.listCommentsByPage()
				setTimeout(() => {
					//联网成功的回调,隐藏下拉刷新的状态
					that.options.mescroll.endByPage(res.data.records.length, that.pages.allPages)
				}, 300);
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
					articleNo: this.articleNo
				}
				uni.showLoading({
					title: '加载中···'
				})
				community.getArticleDetail(postData).then((res) => {
					if (res.code === 200) {
						this.detail = res.data
						if (res.data.openComment === 0) {
							this.message = '该帖子已关闭评论功能！'
						}
						this.isAgree = res.data.clickStatus === 1
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
			 * 获取评论列表
			 */
			listCommentsByPage() {
				const that = this
				return new Promise((resolve, reject) => {
					let postData = {
						articleNo: that.articleNo,
						status: 1,
						request: {
							pageNum: that.pages.num,
							pageSize: that.pages.size
						}
					}
					community.getCommentByPage(postData).then((res) => {
						if (res.code === 200) {
							res.data.records.forEach(x => {
								x.isLook = false
								x.replys.sort((a, b) => b.id - a.id)
								x.replys = x.replys.filter(y => y.status === 1)
							})
							let enableComment = res.data.records.filter(x => x.status === 1)
							that.commentList = that.pages.num === 1 ? enableComment : [...that.commentList, ...enableComment]
							that.pages.allPages = res.data.pages
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
			 * 点赞
			 */
			agree() {
				let postData = {
					articleNo: this.articleNo,
					status: this.isAgree ? 0 : 1,
					// 操作类型： 0-评论点赞 1-文章点赞 2-文章收藏
					type: 1
				}
				community.doLikeOrCollect(postData).then((res) => {
					if (res.code === 200) {
						this.isAgree = !this.isAgree
						if (this.isAgree) {
							this.detail.clickCount = parseInt(this.detail.clickCount) + 1
						} else {
							this.detail.clickCount = parseInt(this.detail.clickCount) - 1
						}
						this.getCommunityDetail()
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
				})
			},
			/**
			 * 查看评论详情
			 * @param {Object} index 评论列表的索引
			 */
			lookComment(index, item) {
				if (index || index === 0) {
					this.commentList[index].isLook = !this.commentList[index].isLook
				}
				let postData = {
					"id": item.id,
					"request": {
						"pageNum": 1,
						"pageSize": 100
					}
				}
				community.getCommentByComment(postData).then((res) => {
					if (res.code === 200) {
						item.replys = res.data.records.filter(x => x.status === 1)
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
				})
			},
			/**
			 * 给某一条评论点赞
			 * @param {Object} index 评论列表的索引
			 */
			giveThumbs(item) {
				let postData = {
					articleNo: this.articleNo,
					status: item.clickStatus ? 0 : 1,
					toId: item.id,
					// 操作类型： 0-评论点赞 1-文章点赞 2-文章收藏
					type: 0
				}
				community.doLikeOrCollect(postData).then((res) => {
					if (res.code === 200) {
						item.clickStatus = !item.clickStatus
						if (item.clickStatus) {
							item.clickCount = parseInt(item.clickCount) + 1
						} else {
							item.clickCount = parseInt(item.clickCount) - 1
						}
						this.listCommentsByPage()
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
				})
			},
			/**
			 * 给某一条评论留言
			 * @param {Object} index 评论列表的索引
			 */
			comment(item) {
				this.isComment = true
				this.commentItem = item
				this.message = '@' + item.userName + '：'
				this.prevMessage = '@' + item.userName + '：'
				this.isfocus = true
			},
			/**
			 * 点击完成按钮时触发
			 * @param {Object} e---输入框的值
			 */
			confirmInp(e) {
				let postData = {}
				let content = e.detail.value
				if (!content.split(this.prevMessage)[1]) {
					this.isComment = false
					this.prevMessage = ''
				}
				if (this.isComment) {
					postData = {
						articleNo: this.articleNo,
						content: content.split(this.prevMessage)[1] ? content.split(this.prevMessage)[1] : content.split(this.prevMessage)[
							0],
						firstCommentId: this.commentItem.firstCommentId || this.commentItem.id,
						toId: this.commentItem.id
					}
				} else {
					postData = {
						articleNo: this.articleNo,
						content: content
					}
				}
				community.doCommentOrReply(postData).then((res) => {
					if (res.code === 200) {
						uni.showToast({
							icon: "success",
							title: '评论成功'
						})
						uni.hideKeyboard();
						this.message = ''
						this.prevMessage = ''
						this.isfocus = false
						if (this.isComment) {
							this.listCommentsByPage()
							this.lookComment('', this.commentItem)
						} else {
							this.listCommentsByPage()
						}
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

	.agree {
		width: 64px;
		height: 64px;
		border: 1px solid #FB4703;
		border-radius: 50%;
		margin: 25px 0;

		.iconfont {
			color: #666666;
			font-size: 22px;
		}
	}

	.likes-num {
		color: #666666;
		font-size: 12px;
	}

	.agree-bg {
		background: #FB4703;

		.iconfont {
			color: #fff;
		}

		.likes-num {
			color: #fff;
		}
	}

	.comment-list {
		padding: 18px 10px;
	}

	.comment {
		color: #1C1C1C;
		font-size: 13px;
		font-weight: bold;
	}

	.comment-item {
		margin-top: 25px;

		.item-img {
			width: 50px;
			height: 50px;
			border-radius: 50%;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.item-content {
			width: calc(100% - 60px);
			margin-left: 10px;

			.item-name {
				color: #1C1C1C;
				font-size: 15px;
				font-weight: bold;
			}

			.item-introduce {
				color: #666666;
				font-size: 11px;
				margin-top: 6px;

				.item-layer {
					margin-right: 20px;
				}
			}

			.item-icon {
				color: #666666;
				font-size: 12px;

				.like-icon {
					padding: 0 13px;
				}

				.like-icon:nth-of-type(2) {
					padding-right: 0;
				}

				.iconfont {
					font-size: 22px;
					margin-bottom: 6px;
				}
			}
		}
	}

	.item-list {
		width: calc(100% - 60px);
		margin-left: 60px;
		margin-top: 10px;

		.item-comment {
			color: #1C1C1C;
			font-size: 12px;
			line-height: 18px;
		}

		.item-look {
			color: #CCCCCC;
			font-size: 11px;
			display: flex;
			justify-content: flex-end;
			margin-top: 10px;
			margin-bottom: 15px;

			.iconfont {
				color: #666666;
				margin-left: 6px;
			}
		}
	}

	.look-list {
		color: #1C1C1C;
		font-size: 12px;
		margin-bottom: 10px;

		.look-name {
			color: #ed6d00;
			margin-right: 4px;
		}
	}

	.no-comment {
		color: #CCCCCC;
		font-size: 13px;
		font-weight: bold;
		padding: 31px 0;
		display: flex;
		justify-content: center;
	}

	.footer {
		width: 100%;
		background-color: #fff;
		position: fixed;
		bottom: 0;
		left: 0;
		border-top: 1px solid #ddd;
		box-sizing: border-box;
		padding: 20rpx;
		padding-bottom: calc(20rpx + constant(safe-area-inset-bottom) / 2);
		padding-bottom: calc(20rpx + env(safe-area-inset-bottom) / 2);
		display: flex;
		justify-content: space-between;
		align-items: center;

		.footer-inp {
			height: 38px;
			width: 100%;
			margin: auto;
			border: 1rpx solid #F35332;
			border-radius: 20px;
			padding: 0 16px;
			font-size: 13px;
		}

		.disabled-inp {
			border-color: #ddd;
			background-color: #f2f2f2;
			color: #999;
		}
	}

	.agree-color {
		color: #FB4703;
	}
</style>

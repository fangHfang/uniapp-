<template>
	<view class="page" :class="(!searchData.searchField || inputFocus)?'history':''">
		<uni-nav-bar color="#fff" background-color="#ed6d00" right-text="取消" @clickRight="toBack" class="i-nav-bar">
			<uni-search-bar ref="searchBar" isFocus class="search-box" radius="100" placeholder="商品名称/编码" clearButton="auto"
			 cancelButton="none" @confirm="search" @focus="handleFocus" @blur="handleBlur" @clear="clear" />
		</uni-nav-bar>
		<view class="placeholder-view"></view>
		<view class="scroll-box" v-show="!inputFocus">
			<mescroll-uni ref="mescrollRef" @init="mescrollInit" :top="mescrollTop" :bottom="mescrollBottom" :safearea="true"
			 :down="downOption" @down="downCallback" :up="upOption" @up="upCallback">
				<view class="product-list" :class="{'have-data':productList.length > 0}">
					<iProductItem  @addCart="cartAdd(item)" v-for="(item,index) in productList" :key="index" :productItem="item"></iProductItem>
				</view>
				<mescroll-empty v-if="productList.length==0"></mescroll-empty>
			</mescroll-uni>
		</view>
		<view class="history-box" v-show="inputFocus">
			<view class="h-header">
				<text class="title">历史搜索</text>
				<view class="operate">
					<uni-icons type="trash" color="#666" size="16" v-if="!canDelete" @tap="canDelete=true" />
					<view v-else>
						<text class="all-delete" @tap="allDelete">全部删除</text>
						<text class="cancel" @tap="cancel">取消</text>
					</view>
				</view>
			</view>
			<view class="tag-box">
				<view class="tag" v-for="(tag,i) in tags" :key="i" @tap="tagClick(i)">
					<text class="con">{{tag}}</text>
					<uni-icons type="closeempty" color="#666" size="14" v-if="canDelete" />
				</view>
			</view>
		</view>
		<uni-popup id="popup" ref="popup" type="center">
			<view class="popup-content">{{popMessage}}</view>
		</uni-popup>
	</view>
</template>

<script>
	import mall from '@/api/mall/mall.js'
	import iProductItem from '@/components/i-product-item/i-product-item.vue';
	import MescrollEmpty from '@/components/mescroll-uni/components/mescroll-empty.vue';
	export default {
		name: 'mall',
		components: {
			iProductItem,
			MescrollEmpty
		},
		data() {
			return {
				//上拉设置
				downOption: {
					auto: false
				},
				upOption: {
					auto: false,
					page: {
						size: 10
					},
					empty: {
						tip: '~ 暂无数据哦 ~',
						btnText: '去看看'
					}
				},
				//滚动位置
				mescrollTop: '44px',
				mescrollBottom: '0',
				//输入框焦点
				inputFocus: true,
				//历史数据是否可以删除
				canDelete: false,
				// 缓存key值
				stroageKey: "historyTags",
				//历史搜索列表
				tags: [],
				//列表数据
				productList: [],
				// 查询条件
				searchData: {
					// 搜索条件
					searchField: "",
					// 末级商品分类编码
					categoryNo: "",
					categoryType: '',
					anyCategoryNo: '',
					// 品牌编码
					brandNo: "",
					// 排序字段
					'pageReq.field': "",
					// 排序规则
					'pageReq.order': "",
					// 当前页码
					'pageReq.pageNum': 1,
					// 当前页面数据量
					'pageReq.pageSize': 10,
				},
				popMessage: '已成功加入购物车！',
			}
		},
		onLoad(e) {
			this.openToHome(e)
			// 通过本地storage存储历史搜索
			this.tags = uni.getStorageSync(this.stroageKey) || []
		},
		mounted() {
			this.setRealMescrollPosition()


		},
		methods: {
			/**
			 * 首页橱窗进入
			 */
			async openToHome(e) {
				const {
					anyCategoryNo,
					categoryNo,
					brandNo,
					categoryType
				} = e
				this.$nextTick(async () => {
					if (categoryNo || brandNo || anyCategoryNo) {
						this.inputFocus = false
						this.searchData.categoryNo = categoryNo || '';
						this.searchData.categoryType = categoryType || '';
						this.searchData.anyCategoryNo = anyCategoryNo || '';
						this.searchData.brandNo = brandNo || '';
						uni.showLoading()
						await this.downCallback()
						this.mescroll.scrollTo(0)
						uni.hideLoading()
					}
				})
			},

			/**
			 * 返回
			 */
			toBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			/**
			 * 设置实际的内容区域到顶部距离
			 */
			setRealMescrollPosition() {
				let statusHeight = uni.getSystemInfoSync().statusBarHeight
				// let statusHeight = uni.getSystemInfoSync().safeAreaInsets.top
				this.mescrollTop = (statusHeight + 44) + 'px'
			},

			/**
			 * 聚焦时
			 * @param {Object} e
			 */
			handleFocus(e) {
				this.inputFocus = true
				this.searchData.searchField = e.value
			},
			/**
			 * 失焦时
			 * @param {Object} e
			 */
			handleBlur(e) {
				this.searchData.searchField = e.value
			},
			/**
			 * 接收搜索结果
			 * @param {Object} e
			 */
			async search(e) {
				uni.showLoading()
				const {
					value
				} = e
				let tag = false,
					index = 0
				this.tags.map((item, tagsIndex) => {
					if (item === value) {
						tag = item
						index = tagsIndex
					}
				})
				if (tag) {
					this.tags.splice(index, 1)
					this.tags.unshift(tag)
				}
				this.searchData.searchField = value
				await this.downCallback()
				this.inputFocus = false
				this.mescroll.scrollTo(0)
				uni.hideLoading()
				this.tags.unshift(value)
				uni.setStorageSync(this.stroageKey, this.tags)
			},
			/**
			 * 分页查询产品数据
			 */
			listProductListByPage() {
				let postData = this.searchData
				if (!this.searchData.categoryNo) {
					delete postData.categoryNo
				}
				let payload = this.$jsonFormat(postData)
				return new Promise((resolve, reject) => {
					mall.listProductListByPage(payload).then(res => {
						res.data.records.map((item)=>{
							let tagList = []
							if(item.rebateRuleName && item.rebateRuleNo){
								tagList.push('可获' + item.rebateAmount + '新玛元')
							}
							if(item.inteRuleName && item.inteRuleNo){
								tagList.push('可获' + item.inteAmount + '积分')
							}
							item.tags = tagList
						})
						resolve(res.data)
					}).catch((err) => {
						console.log(err)
						reject(err)
					})
				})

			},
			/**
			 * 下拉刷新回调
			 */
			async downCallback(page) {
				this.searchData['pageReq.pageNum'] = 1
				this.mescroll.setPageNum(1)
				// 先触发查询
				// this.listProductListByPage()
				// 然后追加数据
				let curPageData = await this.listProductListByPage()
				//设置列表数据
				this.productList = curPageData.records;
				//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
				setTimeout(() => {
					this.mescroll.endSuccess(curPageData.records.length);
				}, 1000)
			},
			/**
			 * 上拉加载的回调:
			 * 其中page.num:当前页 从1开始,
			 * page.size:每页数据条数,默认10
			 */
			async upCallback(page) {
				let startNum = page.num + 1
				if (startNum === this.searchData['pageReq.pageNum']) {
					setTimeout(() => {
						this.mescroll.endByPage(this.productList.length);
					}, 500)
					return
				}
				this.searchData['pageReq.pageNum'] = startNum
				// 然后追加数据
				let curPageData = await this.listProductListByPage()
				//设置列表数据
				this.productList = this.productList.concat(curPageData.records); //追加新数据
				//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
				setTimeout(() => {
					this.mescroll.endByPage(curPageData.records.length);
				}, 1000)
			},
			/**
			 * 历史全部删除
			 */
			allDelete() {
				let that = this
				uni.showModal({
					title: '',
					content: '确认删除全部历史记录吗？',
					success(res) {
						if (res.confirm) {
							that.tags = []
							uni.setStorageSync(that.stroageKey, that.tags)
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			/**
			 * 取消
			 */
			cancel() {
				this.canDelete = false
			},
			/**
			 * 删除一条
			 * @param {Object} index
			 */
			deleteOne(index) {
				this.tags.splice(index, 1)
				uni.setStorageSync(this.stroageKey, this.tags)
			},

			/**
			 * 标签点击事件
			 */
			async tagClick(index) {
				if (this.canDelete) {
					// 触发删除
					this.deleteOne(index)
				} else {
					uni.showLoading()
					let tag = this.tags[index]
					// 触发搜索
					this.$refs.searchBar.setSearchVal(tag)
					this.searchData.searchField = tag
					await this.downCallback()
					this.inputFocus = false
					uni.hideLoading()
					this.tags.splice(index, 1)
					this.tags.unshift(tag)
				}
			},

			/**
			 * 清除事件
			 */
			clear() {
				this.inputFocus = true
			},
			
			/**
			 * 加入购物车
			 */
			cartAdd(productInfo){
				mall.cartAdd({itemNo:productInfo.subItemNo,itemQuantity:productInfo.currentNum || 1,isIntegralItem:false}).then(res =>{
					if(res.code === 200){
						this.popMessage = '已成功加入购物车！'
					    this.handleAddCart()
					}
				}).catch((err)=>{
					this.popMessage = err.msg
					this.handleAddCart()
				})
			},
			handleAddCart() {
				this.$refs.popup.open()
				setTimeout(() => {
					this.$refs.popup.close()
				}, 1000)
			},
		}
	}
</script>

<style lang="scss">
	.page {
		height: 100vh;
		background-color: $uni-bg-color-grey;

		&.history {
			background-color: #fff;
		}

		.search-box {
			background-color: $uni-color-primary;
			padding: 0;
			flex: 1;
		}

		.placeholder-view {
			display: none;
			height: 12px;
			margin-top: -2px;
			position: relative;
			z-index: 103;
			background-color: $uni-color-primary;
		}

		.scroll-box {
			.product-list {
				overflow: hidden;
				padding: 0;
				background-color: $uni-bg-color-grey;
			}

			.have-data {
				padding: 10px 10px 0;
			}
		}

		.history-box {
			.h-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 40px;
				padding: 0 10px;

				.title {
					font-weight: 600;
				}

				.operate {
					font-size: $uni-font-size-sm;

					.cancel {
						color: $uni-color-primary;
						margin-left: 10px;
					}
				}
			}

			.tag-box {
				display: flex;
				flex-wrap: wrap;
				align-items: flex-start;
				padding: 10px;

				.tag {
					padding: 2px 10px;
					background-color: #f0edf1;
					border-radius: 10px;
					font-size: $uni-font-size-sm;
					margin: 0 10px 10px 0;

					/deep/.uni-icons {
						padding-left: 5px;
						vertical-align: bottom;
					}
				}
			}
		}
	}

	/deep/ .uni-navbar__header-btns-left {
		width: 0 !important;
	}
	
	.popup-content {
		width: 70vw;
		height: 100px;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: rgba(0, 0, 0, 0.6);
		border-radius: 10px;
		color: $uni-color-primary;
	}
</style>

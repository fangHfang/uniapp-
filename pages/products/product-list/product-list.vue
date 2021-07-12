<template>
	<view class="page">
		<uni-nav-bar 
			left-icon="arrowleft" 
			:title="pageOptions.title" 
			@clickLeft="back" 
			backgroundColor="#ed6d00" 
			color="#fff" />
		<view class="con-container">
			<view id="filter-box" class="filter-box" @tap="toSearch">
				<uni-search-bar 
					class="high-zindex" 
					radius="100" 
					placeholder="商品名称/编码" 
					clearButton="auto" 
					cancelButton="none"
				 	@confirm="search"/>
			</view>
			<view class="scroll-box">
				<mescroll-uni 
					ref="mescrollRef" 
					@init="mescrollInit" 
					:top="pageOptions.mescrollTop" 
					:bottom="pageOptions.mescrollBottom" 
					:safearea="true"
				 	@down="downCallback" 
					:down="downOption" 
					:up="upOption" 
					@up="upCallback">
					<view class="product-list">
						<iProductItem  
							@addCart="cartAdd(item)"
							v-for="(item,index) in productList" 
							:key="index" 
							:productItem="item"
						></iProductItem>
						<mescroll-empty v-if="productList.length==0"></mescroll-empty>
					</view>
				</mescroll-uni>
			</view>
		</view>
		<iCartIcon/>
		<uni-popup id="popup" ref="popup" type="center">
			<view class="popup-content">{{pageOptions.popMessage}}</view>
		</uni-popup>
	</view>
</template>

<script>
	import mall from '@/api/mall/mall.js'
	import home from '@/api/home/home.js'
	import iProductItem from '@/components/i-product-item/i-product-item.vue';
	import iCartIcon from '@/components/i-cart-icon/i-cart-icon.vue';
	import MescrollEmpty from '@/components/mescroll-uni/components/mescroll-empty.vue';
	export default {
		name: 'mall',
		components: {
			iProductItem,
			iCartIcon,
			MescrollEmpty
		},
		data() {
			return {
				downOption:{
				  auto:false
				},
				upOption: {
					onScroll:true,
					auto:false,
					page: {
						size: 10
					},
					noMoreSize: 2,
					empty: {
						tip: '~ 暂无数据哦 ~',
						btnText: '去看看'
					}
				},
				// 页面设置
				pageOptions:{
					title: '全部商品',
					//筛选距离顶部距离
					filterDropdownTop: 44,
					mescrollTop: '96px',
					mescrollBottom: '0',
					popMessage: '已成功加入购物车！',
				},
				productList: [],
				// 查询条件
				searchInfo:{
					// 品牌编码
					brandNo:"",
					// 商品分类编码
					classNo:"",
					// 商品标签编号
					itemNo:"",
					// 橱窗编号
					displayNo:"",
					// 页面编号
					pictureNo:"",
					// 排序字段
					pageReq:{
						field:"",
						// 排序规则
						order:"",
						// 当前页码
						pageNum:1,
						// 当前页面数据量
						pageSize:10,
					}
				},
			}
		},
		onLoad(e){
			// 将首页橱窗-更多商品，参数放入查询条件中
			const { pictureNo,displayNo } = e
			this.searchInfo.displayNo = displayNo
			this.searchInfo.pictureNo = pictureNo
		},
		async mounted() {
			this.setRealMescrollPosition()
			uni.showLoading()
			await this.downCallback()
			uni.hideLoading()
    	},
		methods: {

			/**
			 * 返回
			 */
			back() {
				uni.navigateBack({
					delta: 1
				})
			},

			/**
			 * 加入购物车
			 */
			cartAdd(productInfo){
				mall.cartAdd({itemNo:productInfo.subItemNo,itemQuantity:productInfo.currentNum || 1}).then(res =>{
					if(res.code === 200){
						this.pageOptions.popMessage = '已成功加入购物车！'
						this.handleAddCart()
					}
				}).catch((err)=>{
					this.pageOptions.popMessage = err.msg
					this.handleAddCart()
				})
			},
			
			handleAddCart() {
				this.$refs.popup.open()
				setTimeout(() => {
					this.$refs.popup.close()
				}, 1000)
			},
			/**
			 * 设置实际的内容区域到顶部距离
			 */
			async setRealMescrollPosition() {
				const searchBarHeight = await this.$getComponentsDom('#filter-box');
				this.pageOptions.mescrollTop = searchBarHeight.bottom + 'px'
			},

			/**
			 * 接收菜单选中结果
			 * @param {Object} e
			 */
			confirm(e) {
				this.filterResult.valueArr = e.index;
				this.filterResult.labelArr = e.value;
				console.log(this.filterResult)
			},

			/**
			 * 分页查询产品数据
			 */
			listMoreProductDisplayByPage(){
				let postData = JSON.parse(JSON.stringify(this.searchInfo))
				return new Promise((resolve,reject)=>{
					home.MoreProductDisplayList(postData).then(res =>{
						resolve(res.data)
					}).catch((err)=>{
						console.log('橱窗更多商品查询报错：' + err)
						reject(err)
					})
				})
      		},

			async upCallback(page) {
				let startNum = page.num + 1
				if(startNum === this.searchInfo.pageReq.pageNum){
					setTimeout(()=>{
						this.mescroll.endByPage(this.productList.length);
					},500)
					return
				}
				this.searchInfo.pageReq.pageNum = startNum
				// 然后追加数据
				let curPageData = await this.listMoreProductDisplayByPage()
				//设置列表数据
				this.productList = this.productList.concat(curPageData.records); //追加新数据
				//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
				setTimeout(()=>{
					this.mescroll.endByPage(curPageData.records.length);
				},1000)
			},
			async downCallback(page){
				this.searchInfo.pageReq.pageNum = 1
				this.mescroll.setPageNum(1)
				// 先触发查询
				// this.listMoreProductDisplayByPage()
				// 然后追加数据
				let curPageData = await this.listMoreProductDisplayByPage()
				//设置列表数据
				this.productList = curPageData.records; 
				//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
				setTimeout(()=>{
					this.mescroll.endSuccess(curPageData.records.length);
				},1000)
      		},
			//点击空布局按钮的回调
			emptyClick() {
				uni.showToast({
					title: '点击了按钮,具体逻辑自行实现'
				})
			},
			// 滚动到指定位置,传数字 (单位px)
			scrollToY(y) {
				// this.mescroll.scrollTo(y) // 过渡动画时长默认300ms
				this.mescroll.scrollTo(y, 0) // 无过渡动画
			},
			// 滚动到指定view,传view的id
			scrollIntoView(viewId) {
				// this.mescroll.scrollTo(viewId) // 过渡动画时长默认300ms
				this.mescroll.scrollTo(viewId, 0) // 无过渡动画
			},
			/**
			 * 跳转搜索页
			 */
			toSearch(){
				uni.navigateTo({
					url:'/pages/products/product-search/product-search'
				})
			}
		}
	}
</script>

<style lang="scss">
	.page {
		padding-bottom:env(safe-area-inset-bottom);
		background-color: $uni-bg-color-grey;
	}

	.high-zindex {
		position: relative;
		z-index: 102;
	}

	.con-container {
		height: calc(100vh - var(--status-bar-height) - 45px);
		overflow: auto;
		width: 100%;
		.filter-box{
			position:relative;
			&::after{
				position:absolute;
				top:0;
				right:0;
				left:0;
				bottom:0;
				content:'';
				z-index:103;
				background:transparent;
			}
		}
		.scroll-box {
			height: calc(100% - 52px);
			background-color: $uni-bg-color-grey;

			.product-list {
				padding: 10px 10px 0;
			}
		}
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

<template>
	<view class="page">
		<uni-nav-bar
			class=""
			:title="pageOptions.name"
			backgroundColor="#ed6d00"
			color="#fff"
			left-icon="back"
			@clickLeft="navBack"
		></uni-nav-bar>
		<!-- 搜索栏 -->
		<view class="flex search-box">
			<uni-search-bar 
				ref="search-bar"
				class="search-bar" 
				placeholder="活动名称"  
				:radius="20" 
				type="" 
				clearButton="auto" 
				cancelButton="none"
				@focus='searchFocus'
				@confirm="search"
				@clear='clear'/>
		</view>
		<view class="mescroll-uni-box">
			<mescroll-uni
				ref="mescrollRef"
				class="mescroll-uni"
				@init="mescrollInit"
				safearea
				:top="pageOptions.mescrollTop"
				:bottom="pageOptions.mescrollBottom"
				@down="downCallback"
				:up="upOption"
				@up="upCallback">
				<view class="seckill-list">
					<image :src="pageOptions.url" mode=""></image>
					<view
						:id="'seckill-item-' + resultIndex + '-' + item.id"
						class="seckill-item one-item"
						:class="{'gary':item.promotionStatus == 2}"
						v-for="(item,resultIndex) in pageData.result"
						:key="'seckill-item-' + resultIndex"
						@click="navTo(item)">
						<!-- 0-未开始，1-进行中，2-已结束 -->
						<view class="seckill-item-tag" :class="['no-start','on-line','on-over'][item.promotionStatus]">
							{{['未开始','进行中','已结束'][item.promotionStatus]}}
						</view>
						<image class="seckill-image" :src="item.placardsUrl" alt="">
						<view class="seckill-info">
							<view class="seckill-info-top">
								<text class="seckill-name">{{item.promotionName}}</text>
								<text class="seckill-date">活动时间:{{item.startTime.substring(0,10) + '~' + item.endTime.substring(0,10)}}</text>
								<view class="seckill-brand">{{item.promotionDesc}}</view>
							</view>
							<text v-if="item.promotionStatus !== 2" class="seckill-button">参与活动</text>
						</view>
					</view>
					<mescroll-empty v-if="pageData.result.length==0"></mescroll-empty>
				</view>
			</mescroll-uni>
		</view>
	</view>
</template>

<script>
	import seckill from '@/api/deadline/seckill.js'
	import MescrollEmpty from '@/components/mescroll-uni/components/mescroll-empty.vue';
	export default {
		name: 'mall',
		components: {MescrollEmpty},
		data() {
			return {
				// 回到顶部按钮配置
				upOption: {
					onScroll:true,
					auto:false,
					page: {
						size: 10
					},
					noMoreSize: 4,
					// empty: {
						// tip: '~ 暂无数据哦 ~',
						// btnText: '去看看'
					// },
					toTop: {
						src: require('@/static/image/home/top.png'),
						safearea:true
					},
				},
				// 下拉刷新组件实例
				mescroll: null,
				// 页面配置
				pageOptions: {
					// 适配刘海屏
					mescrollTop:0,
					mescrollBottom:0,
					// 橱窗配图
					url:'',
					// 页面名称
					name:"",
					// 分类类型(0:秒杀活动,1:限时抢购活动,2:商品组合活动)
					categoryType:0
				},
				// 底部产品列表数据
				pageData: {
					result: []
				},
				// 查询条件
				searchData:{
					// 活动类型编码
					categoryNo:'',
					// 活动名称
					promotionName:"",
					// 排序字段
					'page.field':"",
					// 排序规则
					'page.order':"",
					// 当前页码
					'page.pageNum':1,
					// 当前页面数据量
					'page.pageSize':10,
				},
				// 是否光标置入搜索框
				isFocus:false
			}
		},
		onLoad(e){
			let {categoryNo} = e
			this.searchData.categoryNo = categoryNo
			let postData = {
				categoryNo:categoryNo
			}
			// 初始化调用接口，获取页面名称，橱窗图片
			this.getPageNameAndImage(postData)
		},
		mounted() {
			this.setRealMescrollPosition()
		},
		methods: {
			/**
			 * 设置实际的内容区域到顶部距离
			 */
			setRealMescrollPosition() {
				let statusHeight = uni.getSystemInfoSync().statusBarHeight
				this.pageOptions.mescrollTop = (statusHeight + 44 + 50) + 'px'
			},
			
			/**
			 * 获取页面名称，橱窗图片
			 */
			getPageNameAndImage(data){
				let payload = this.$jsonFormat(data)
				seckill.getPageNameAndImage(payload).then(res=>{
					const { categoryName,iconUrl,categoryType } = res.data
					this.pageOptions.name = categoryName
					this.pageOptions.url = iconUrl
					this.pageOptions.categoryType = categoryType
					this.downCallback()
				}).catch((err)=>{
					console.log('获取页面名称，橱窗图片失败:' + err)
				})
			},
			
			/**
			 * 分页查询订单数据
			 */
			listSeckillByPage(){
				uni.showLoading({
					title: '加载中'
				});
				let payload = this.$jsonFormat(this.searchData)
				return new Promise((resole,reject)=>{
					seckill.listActiveByPage(payload).then(res => {
						uni.hideLoading();
						resole(res.data)
					}).catch((error) => {
						uni.hideLoading();
						reject(error.msg)
					});
				})
			},

			/**
			 * 初始化回调方法
			 * @param {Object} mescroll
			 */
			mescrollInit(mescroll) {
				this.mescroll = mescroll
			},
			

			/**
			 * 上拉加载的回调:
			 * 其中page.num:当前页 从1开始,
			 * page.size:每页数据条数,默认10
			 */
			async upCallback(page) {
				if(page.startNum === this.searchData['page.pageNum']){
					 setTimeout(()=>{
						this.mescroll.endByPage(this.pageData.result.length);
					 },500)
					 return
				}
				this.searchData['page.pageNum'] = page.startNum
				// 然后追加数据
				let curPageData = await this.listSeckillByPage()
				//设置列表数据
				this.pageData.result = this.pageData.result.concat(curPageData.records); //追加新数据
				//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
				setTimeout(()=>{
					this.mescroll.endByPage(curPageData.records.length);
				},1000)
				
			},

			/**
			 * 下拉刷新回调
			 */
			async downCallback(page) {
				this.searchData['page.pageNum'] = 1
				this.mescroll.setPageNum(1)
				// 先触发查询
				// this.listSeckillByPage()
				// 然后追加数据
				let curPageData = await this.listSeckillByPage()
				//设置列表数据
				this.pageData.result = curPageData.records;
				//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
				setTimeout(()=>{
					this.mescroll.endSuccess(curPageData.records.length);
				},1000)
			},

			/**
			 * 跳转详情页
			 */
			navTo(row){
				// 判断当前活动状态 如果是已结束则提示弹窗return
				let {promotionNo,promotionName,promotionStatus} = row
				if(promotionStatus === 2){
					uni.showToast({
						title:"活动已结束",
						icon:"none"
					})
					return
				}
				let params = "?promotionNo=" + promotionNo + '&name=' + promotionName
				let url = ""
				// 分类类型(0:秒杀活动,1:限时抢购活动,2:商品组合活动)
				switch(this.pageOptions.categoryType){
					case 0:
						url = '/pages/deadline/seckill/detail/seckill-detail';
						break
					case 1:
						url = '/pages/deadline/seckill/other-detail/snap-up-detail';
						break
					case 2:
						url = '/pages/deadline/seckill/combination/combination-detail';
						break
					default:
						url = '/pages/deadline/seckill/detail/seckill-detail';
						break
				}
				uni.navigateTo({
					url:url + params
				})
			},

			/**
			 * 返回上一页
			 */
			navBack(){
				uni.navigateBack({
				    delta: 1
				});
			},
			
			/**
			 * 搜索框焦点选中时 
			 */
			searchFocus(){
				this.isFocus = true
			},
			
			/**
			 * 滚动监听，隐藏键盘
			 */
			scroll(){
				if(this.isFocus){
					this.isFocus = false
					this.$refs['search-bar'].showRefs()
				}
			},
			
			/**
			 * 分页查询产品数据
			 */
			async search(value){
				this.isFocus = false
				uni.showLoading()
				this.searchData.promotionName = value.value
				this.mescroll.scrollTo(0)
				await this.downCallback()
				uni.hideLoading()
			},
			
			/**
			 * 清空筛选
			 */
			async clear(){
				this.isFocus = false
				uni.showLoading()
				this.searchData.promotionName = ''
				this.mescroll.scrollTo(0)
				await this.downCallback()
				uni.hideLoading()
			},


		}
	}
</script>

<style lang="scss" scoped>
	.page{
		background-color: #F9F9F9;
		height: 100vh;
	}

	/deep/.search-bar {
		width: 100%;
		background-color: #FFFFFF;
		padding: 16rpx;

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

	.mescroll-uni-box{
		height: calc(90vh - 100rpx - 88rpx - 2rpx - var(--status-bar-height));
		/deep/.uni-scroll-view-content{
			height: calc(100% - 20rpx);
		}
	}
	// 底部产品列表
	.seckill-list {
		width: calc(100% - 40rpx);
		margin: 20rpx auto;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;

		>image{
			width: calc(100vw - 20rpx);
			height: calc((100vw - 20rpx) * 0.42);
			border-radius: 8rpx;
			margin-bottom: 20rpx;
		}
		.seckill-item {
			background-color: #ffffff;
			.seckill-item-tag{
				position: absolute;
				left: 0;
				top:0;
				z-index: 10;
				width: 120rpx;
				height: 50rpx;
				border-radius: 5rpx 0rpx 20rpx 0rpx;
				color: #ffffff;
				font-size: 24rpx;
				font-weight: 400;
				text-align: center;
				line-height: 52rpx;
			}
			// 未开始
			.no-start{
				background-image: linear-gradient(to right, #FF9600 0%, #FFD200 100%);
			}
			// 进行中
			.on-line{
				background-image: linear-gradient(to right, #00C82A 0%, #00EE8C 100%);
			}
			// 已结束
			.on-over{
				background-image: linear-gradient(to right, #a1a1a1 0%, #c1c1c1 100%);
			}

		}
		.seckill-info {
			padding: 25rpx;
			display: flex;
			flex-direction: column;
		}

		.seckill-info-top {
			display: flex;
			flex-direction: column;
		}

		// 名称
		.seckill-name {
			line-height: 28rpx;
			font-size: 26rpx;
			font-weight: bold;
			color: #1C1C1C;
			overflow: hidden;
			-webkit-line-clamp: 2;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-box-orient: vertical;
		}

		// 时间
		.seckill-date{
			line-height: 19rpx;
			font-size: 20rpx;
			font-weight: 400;
			color: #666666;
			margin-top: 19rpx;
			margin-bottom: 19rpx;
		}

		// 品牌
		.seckill-brand {
			line-height: 22rpx;
			font-size: 22rpx;
			font-weight: 400;
			height: 22rpx;
			color: #666666;
			overflow: hidden;
			-webkit-line-clamp: 1;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-box-orient: vertical;
		}

		// 价格
		.seckill-button {
			background-color: $uni-color-primary;
			border-radius: 5px;
			font-size: 26rpx;
			font-weight: bold;
			color: #FFFFFF;
			position: absolute;
			padding: 12rpx;
			right: 20rpx;
			bottom: 22rpx;
		}

		// 一列样式
		.one-item {
			width: calc(100vw - 40rpx);
			margin-bottom: 20rpx;
			box-shadow: 0px 6px 26px 0px rgba(123, 71, 46, 0.05);
			border-radius: 5px;
			display: flex;
			position: relative;
			.seckill-image {
				height: calc(100vw / 3 - 50rpx);
				width: calc(100vw / 3 - 25rpx);
				padding: 25rpx 0 25rpx 25rpx;
			}

			.seckill-info {
				width: calc(66.6vw - 40rpx - 10rpx - 50rpx);
				justify-content: space-between;
			}
		}

	}

	// 底部产品列表
	
	.gary{
		.seckill-info{
			.seckill-info-top{
				.seckill-name{
					color: #CCCCCC;
				}
				.seckill-date{
					color: #CCCCCC;
				}
				.seckill-brand{
					color: #CCCCCC;
				}
			}
		}
	}
</style>

<template>
	<view class="page">
		<uni-nav-bar
			class="nav-bar"
			title="自选商品"
			backgroundColor="#ed6d00"
			color="#fff"
			left-icon="back"
			@clickLeft="navBack"
		></uni-nav-bar>
		<view class="flex search-box">
			<uni-search-bar class="search-bar" placeholder="活动名称"  :radius="20" type="" cancelButton="none" />
		</view>
		<view class="carousel">
			<mescroll-uni
				:ref="'mescrollRef'+i"
				@init="mescrollInit"
				:top="pageOptions.mescrollTop"
				:bottom="pageOptions.mescrollBottom"
				safearea
				:up="upOption"
				:down="downOption"
				@down="downCallback"
				@emptyclick="emptyClick">
					<view class="seckill-list">
						<view
							:id="'seckill-item-' + resultIndex + '-' + item.id"
							class="seckill-item one-item"
							:class="{'gray':(item.saleStock/item.stock) === 1}"
							v-for="(item,resultIndex) in pageData.result"
							:key="'seckill-item-' + resultIndex">
								<view class="seckill-check">
									<view class="check-box" :class="item.isChecked?'selected':''" @click="checkChange(item,resultIndex)"></view>
								</view>
								<image class="seckill-image" :src="item.itemImageUrl" alt="">
								<view class="seckill-info">
									<view class="seckill-info-top">
										<text class="seckill-name">{{item.itemName}}</text>
										<view class="seckill-detail">
											<view class="left-detail">
												<text>品牌：{{item.itemBrand}}</text>
												<text>分类：{{item.itemCategoryBackend}}</text>
											</view>
											<view class="right-detail">
												<text>库存：{{(item.displayStock)}}</text>
												<text>规格：{{item.itemSpec}}</text>
											</view>
										</view>
										<view class="seckill-tag-list">
											<view v-if="item.promotionRuleInfoDTO && item.promotionRuleInfoDTO.rbAmount && item.promotionRuleInfoDTO.rbRuleName">
												<text>可获{{ item.promotionRuleInfoDTO.rbAmount}}新玛元</text>
											</view>
											<view v-if="item.promotionRuleInfoDTO && item.promotionRuleInfoDTO.itAmount && item.promotionRuleInfoDTO.itRuleName">
												<text>可获{{ item.promotionRuleInfoDTO.itAmount}}积分</text>
											</view>
											<view v-if="item.promotionRuleInfoDTO && item.promotionRuleInfoDTO.epInfoDTO && item.promotionRuleInfoDTO.epInfoDTO.length > 0 && item.promotionRuleInfoDTO.epInfoDTO[0].amount && item.promotionRuleInfoDTO.epInfoDTO[0].ruleName">
												<text>可获{{ item.promotionRuleInfoDTO.epInfoDTO[0].amount}}兑换点</text>
											</view>
										</view>
									</view>
									<view class="seckill-info-bottom">
										<view class="seckill-price" v-if="item.promotionDTO && item.promotionDTO.isDiscountOnly">
											<text>已优惠￥{{item.discountAmount}}</text>
										</view>
										<view class="seckill-price" v-else>
											<text>￥{{item.amount}}</text>
											<text>￥{{item.itemAmount}}</text>
										</view>
										<!-- 此处判断个人抢购量，为0不限制，否则上限是库存 -->
										<uni-number-box
											:value="item.currentNum"
											:min="1"
											:max="item.personalLimitCount === 0 ? 9999 : item.personalLimitCount"
											@change="(val)=>changeNumber(val,resultIndex)" />
									</view>
								</view>
								<view
									class="sell-out"
									v-if="(item.saleStock/item.stock) === 1"
								>
									已售罄
								</view>
						</view>
					</view>
					<mescroll-empty v-if="pageData.result.length==0"></mescroll-empty>
			</mescroll-uni>
			<!-- 底部操作菜单 -->
			<view class="page-bottom">
				<button type="primary" class=" action-btn buy-now-btn" @click="confirmSelect">确认选择</button>
			</view>
		</view>
		<yu-toast
			:message1="toastData.msg1"
			:message2="toastData.msg2"
			:duration="toastData.duration"
			verticalAlign="center"
			:backgroundColor="toastData.bgColor"
			:color="toastData.fontColor"
			ref="remind"
		></yu-toast>
	</view>
</template>

<script>
	import seckill from '@/api/deadline/seckill.js'
	import yuToast from '@/components/yu-toast/yu-toast'
	import MescrollEmpty from '@/components/mescroll-uni/components/mescroll-empty.vue';
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollMoreItemMixin from "@/components/mescroll-uni/mixins/mescroll-more-item.js"
	export default {
		// 自选商品
		mixins: [MescrollMixin,MescrollMoreItemMixin], // 注意此处还需使用MescrollMoreItemMixin (必须写在MescrollMixin后面)
		name: 'optional',
		components: {
			MescrollEmpty,
			yuToast
		},
		data() {
			return {
				downOption:{
				},
				// 不上拉加载
				upOption:{
					use:false,
					auto:false, // 不自动加载
					empty:{
						use : false
					},
					toTop: {
						src: require('@/static/image/home/top.png'),
						safearea:true
					},
				},
				// 页面配置
				pageOptions:{
					// 适配刘海屏
					mescrollTop:0,
					mescrollBottom:100,
					// 橱窗图片
					placardsUrl:'',
					// 结束时间
					endTime:"",
					// 开始时间
					startTime:"",
					// 活动名称
					promotionName:""
				},
				// 列表数据
				pageData:{
					result:[]
				},
				// 查询条件
				searchData:{
					// 商品名称
					itemName:'',
					// 活动编码
					promotionNo:"",
					// 排序字段
					'page.field':"",
					// 排序字段
					'page.order':"",
					// 排序字段
					'page.pageNum':1,
					// 排序字段
					'page.pageSize':10,
				},
				// 消息提醒
				toastData:{
					msg1:'设置提醒成功!',
					msg2:'',
					duration:2000,
					bgColor:"#000000cc",
					fontColor:"#00B60D",
				},
			}
		},
		onLoad(e){
			let {promotionNo} = e
			this.searchData.promotionNo = promotionNo
			// 查询自选商品
			this.getOptionalProductList()
		},
		mounted() {
			// 计算顶部高度
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
			 * 查询组合商品-自选
			 */
			getOptionalProductList(){
				let _this = this
				let payload = this.$jsonFormat(this.searchData)
				return new Promise((resole,reject)=>{
					seckill.listOptionalProductByPage(payload).then((res)=>{
						const {records} = res.data
						// 添加商品数量默认值
						records.map((item)=>{
							return{
								...item,
								currentNum:1,
								isChecked:false
							}
						})
						_this.pageData.result = records
						resole()
					}).catch((err)=>{
						reject(err)
					})
				})
			},

			/**
			 * 下拉刷新
			 */
			downCallback(){
				Promise.all([this.getOptionalProductList()]).then((res)=>{
					this.mescroll.endByPage(1);
				}).catch(()=>{
					this.mescroll.endByPage(1);
				})
			},

			//点击空布局按钮的回调
			emptyClick(){
				uni.showToast({
					title:'点击了按钮,具体逻辑自行实现'
				})
			},

			/**
			 * 跳转详情页
			 */
			navToDetail(row){
				const { stock,itemNo } = row
				// 有库存时跳转
				if(!stock){
					// return
				}
				uni.navigateTo({
					url:"/pages/deadline/product/product-deadline-detail?itemNo=" + itemNo
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
			openRule(){
			  // 通过组件定义的ref调用uni-方法
			  this.$refs.popup.open()
			},
			closeRule(){
				this.$refs.popup.close()
			},

			/**
			 * 增加/减少产品数量
			 */
			changeNumber(val,index){
				this.$set(this.pageData.result[index],'currentNum',JSON.parse(val))
			},
			/**
			 * 选中商品
			 */
			checkChange(row,index){
				const { isChecked,stock } = row
				// 没有库存不选中
				if(!stock){
					return
				}
				this.$set(this.pageData.result[index],'isChecked',!isChecked)
			},

			/**
			 * 确认选择
			 */
			confirmSelect(){
				let selectList = this.pageData.result.filter((item)=>{
					return item.isChecked
				})
				// 将 商品 存储在本地缓存中指定的 key 中
				uni.setStorageSync('activeProductList', selectList);
				uni.navigateBack({
					delta: 1
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.page{
		background-color: #F9F9F9;
		height: 100vh;
	}

	// 搜索栏
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


	.nav-bar{
		position: relative;
		z-index: 1;
	}
	/deep/.uni-navbar--border{
		border-bottom-width:0;
	}

	// 底部产品列表
	.carousel {
		height: calc(100vh - 100rpx - 88rpx - var(--status-bar-height));
		background: transparent;

		.image-wrapper {
			width: 100%;
			height: 100%;
		}

		.img {
			width: 100%;
			height: 100%;
		}
	}

	// 底部产品列表
	.seckill-list {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		padding-top: 20rpx;
		>view{
			margin: 0rpx auto 20rpx;
			box-shadow: 0px 6px 26px 0px rgba(123, 71, 46, 0.05);
		}
		// 活动信息盒子
		.seckill-item {
			background-color: #ffffff;
		}

		.seckill-info {
			padding: 25rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
		}

		.seckill-info-top {
			display: flex;
			flex-direction: column;
		}
		.seckill-info-bottom {
			display: flex;
			justify-content: space-between;
			.seckill-price{
				>text:nth-child(1){
					line-height: 22rpx;
					font-size: 22rpx;
					font-weight: bold;
					color: #ed6d00;
					margin-right: 10rpx;
				}
				>text:nth-child(2){
					font-size: 16rpx;
					font-weight: 500;
					text-decoration: line-through;
					color: #CCCCCC;
				}
			}
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

		// 信息
		.seckill-detail{
			display: flex;
			justify-content: space-between;
			.left-detail{
				width: 45%;
				display: flex;
				flex-direction: column;
			}
			.right-detail{
				width: 45%;
				display: flex;
				flex-direction: column;
			}
			text{
				margin-top: 10rpx;
				font-size: 20rpx;
				line-height: 20rpx;
				font-weight: 400;
				color: #666666;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
		}

		// 标签
		.seckill-tag-list{
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			margin-top: 4rpx;
			width: 100%;
			>view{
				margin-right: 10rpx;
				>text{
					border: 1rpx solid #E10000;
					border-radius: 5rpx;
					font-size: 20rpx;
					line-height: 20rpx;
					font-family: PingFang SC;
					font-weight: 400;
					color: #E10000;
					padding: 0rpx 10rpx;
				}
			}
		}

		.sell-out{
			position: absolute;
			left: 0px;
			top: 40rpx;
			padding: 8rpx 20rpx 8rpx 8rpx;
			background: #666666;
			border-radius: 0px 5px 5px 0px;
			font-size: 24rpx;
			font-weight: 500;
			color: #CCCCCC;
		}


		// 一列样式
		.one-item {
			width: calc(100vw - 40rpx);
			border-radius: 5px;
			display: flex;
			position: relative;

			.seckill-image {
				height: calc(100vw / 3 - 50rpx);
				width: calc(100vw / 3 - 25rpx);
				padding: 25rpx 0 25rpx 25rpx;
			}

			.seckill-info {
				width: calc(66.6vw - 40rpx - 10rpx - 50rpx - 60rpx);
				justify-content: space-between;
			}
			.seckill-check{
				width: 60rpx;
				display: flex;
				align-items: center;
				justify-content: flex-end;
			}
		}
	}

	/* 底部操作菜单 */
	.page-bottom {
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 99;
		display: flex;
		align-items: center;
		right:0;
		height: 100rpx;
		padding-bottom: env(safe-area-inset-bottom);
		background-color: #fff;
		box-shadow: 0 -1px 0 0 rgba(0,0,0,0.1);

		.action-btn {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 90%;
			height: 72rpx;
			border:1px solid $uni-color-primary;
			color: $uni-color-primary;
			font-size: $uni-font-size-base;
			padding: 0;
			border-radius: 72rpx;
			background-color: #fff;
			&.buy-now-btn{
				color: #fff;
				background-color: $uni-color-primary;
			}
		}
	}


	.modal-box{
		width: calc(100vw - 120rpx);
		height: calc((100vw - 120rpx) * 1.2);
		margin-bottom: 120rpx;
		background-image: url(../../../../static/image/deadline/snap-up-rule-dialog.png);
		background-size: 100%;
		>image{
			width: 100%;
			height: 100%;
		}
		.rule-box{
			.rule-title{
				width: 100%;
				text-align: center;
				padding-top: 53%;
				>text{
					font-size: 50rpx;
					font-family: HYYaKuHeiW;
					font-weight: bold;
					font-style: italic;
					color: #FEFEFE;
					line-height: 12rpx;
				}
			}
			.rule-content{
				display: flex;
				flex-direction: column;
				>text{
					font-size: 22rpx;
					color: #FEFEFE;
					line-height: 35rpx;
					width: calc(100% - 80rpx);
					margin: 20rpx auto 0;
				}
			}
		}
		.dialog-close-button{
			position: absolute;
			bottom: -40rpx;
			left: calc(50% - 22rpx - 30rpx);
			padding: 30rpx;
		}
	}

	.check-box {
			flex: 0 0 16px;
			width: 16px;
			height: 16px;
			border-radius: 50%;
			position: relative;
			border: 1rpx solid $uni-border-color;

			&.selected {
				border: 1px solid $uni-border-color-active;
			}

			&.selected::after {
				width: 10px;
				height: 10px;
				border-radius: 50%;
				background-color: $uni-border-color-active;
				content: '';
				position: absolute;
				top: 3px;
				left: 3px;
			}
		}
	// 已售罄
	.gray{
		.seckill-name{
			color: #CCCCCC;
		}
		.seckill-tag-list{
			>view{
				>text{
					border: 1rpx solid #CCCCCC;
					color: #CCCCCC;
				}
			}
		}
		.seckill-price{
			text{
				color: #CCCCCC!important;
			}
		}
		.left-detail{
			text{
				color: #CCCCCC!important;
			}
		}
		.right-detail{
			text{
				color: #CCCCCC!important;
			}
		}
		.right-bottom-box{
			>text{
				color: #CCCCCC;
			}
		}
		.seckill-check{
			.check-box{
				border: 1rpx solid #CCCCCC;
			}
		}
	}
	/deep/.uni-numbox__value{
		width: 40px;
	}
</style>

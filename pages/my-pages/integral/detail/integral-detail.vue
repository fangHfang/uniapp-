<template>
	<view class="page">
		<uni-nav-bar
			title="订单详情"
			backgroundColor="#ed6d00"
			color="#fff"
			left-icon="back"
			@clickLeft="navBack"
		></uni-nav-bar>
		<scroll-view class="scroll-view" scroll-y="true" >
			<!-- 顶部订单状态 -->
			<view class="top-order-status">
				<!-- 0 待发货、1 已发货 -->
				<view class="order-status" v-if="tableData.orderReceiveStatus === '未发货'">
					<icon class="iconfont zhifuchenggong" style='color:#ED9700;font-size: 58rpx;' type=""></icon>
					<text class="wait-receiving-goods">待发货</text>
				</view>
				<view class="order-status" v-if="tableData.orderReceiveStatus === '已发货'">
					<icon class="iconfont zheng-que" style='color:#0DC316;font-size: 58rpx;' type=""></icon>
					<text class="done-receiving-goods">已发货</text>
				</view>
			</view>
			<!-- 地址 -->
			<view class="address-box" @click="toAddressEdit">
				<icon class="iconfont dizhi" style='color:#ed6d00;font-size: 44rpx;' type=""></icon>
				<view class="address-info">
					<view class="address-user">
						<text class="user-name">{{tableData.receiveName}}</text>
						<text class="user-phone">{{tableData.receiveMobile}}</text>
						<icon v-if="tableData.orderReceiveStatus === '未发货'" class="iconfont qiehuan" type=""></icon>
				    </view>
					<text class="address-address">{{tableData.receiveAddress && tableData.receiveAddress.replace(/\//g, '')}}</text>
				</view>
			</view>
			<!-- 商品 -->
			<view class="product-box">
				<!-- 普通商品 -->
				<view class="normal-product-box">
					<view
						v-for="(product,productIndex) in productList"
						:key="'productList-' + productIndex"
					>
						<view class="product-item" :class="{'set-meal-box':product.packageItemList && product.packageItemList.length > 0}">
							<view class="product-image">
								<image :src="product.itemImageUrl" mode=""></image>
							</view>
							<view class="product-info">
								<view class="product-info-top">
									<text class="product-name" v-if="product.packageItemList && product.packageItemList.length > 0">{{tableData.orderItemNames}}</text>
									<text class="product-name" v-else>{{product.itemName}}</text>
									<template v-if="product.packageItemList && product.packageItemList.length > 0">
										<text class="product-brand" v-for="(detail,index) in product.packageItemList.slice(0,2)" :key="'packageItemList-' + index">{{detail.itemName}}</text>
										<text class="product-brand" v-if="product.packageItemList.length > 2">...</text>
									</template>
									<template v-else>
										<text class="product-brand">品牌: {{product.itemBrand}}</text>
										<text class="product-spc">规格: {{product.itemSpecDetail}}</text>
									</template>
									<text class="product-classify">分类：{{product.itemCategoryBackend}}</text>
								</view>
								<view class="product-price-number">
									<text class="product-price">{{product.itemPrice}}积分</text>
									<text class="product-number">x{{product.itemQuantity}}</text>
								</view>
							</view>
						</view>
						<template v-if="product.packageItemList">
							<view
								v-for="(packageItem,packageItemIndex) in product.packageItemList"
								:key="'packageItemList' + packageItemIndex">
								<view class="product-item">
									<view class="product-image">
										<image :src="packageItem.imageUrl" mode=""></image>
									</view>
									<view class="product-info">
										<view class="product-info-top">
											<text class="product-name" style="font-weight: 400;">{{packageItem.itemName}}</text>
											<text class="product-brand">品牌: {{packageItem.itemBrand}}</text>
											<text class="product-spc">规格: {{packageItem.itemSpecDetail}}</text>
											<text class="product-classify" style="margin-bottom: 0;">分类: {{packageItem.itemCategoryFrontend}}</text>
										</view>
										<view class="product-price-number">
											<text class="product-price"></text>
											<text class="product-number">x{{packageItem.itemQuantity}}</text>
										</view>
									</view>
								</view>
							</view>
						</template>
					</view>
				</view>
			</view>
			<!-- 订单信息 -->
			<view class="pay-info-box" v-if="tableData.tableData !== '取消'">
				<view class="pay-info-item">
					<view class="pay-info">
						<view class="pay-info-left">
							<text>订单号：</text>
							<text>下单时间：</text>
							<text style="line-height: 16px;margin-top: 5px;margin-bottom: 0px;">合计：</text>
						</view>
						<view class="pay-info-right">
							<text>{{tableData.orderNo}}</text>
							<text>{{tableData.orderTime}}</text>
							<text class="red" style="font-size: 16px;margin-top: 5px;margin-bottom: 0px;">{{tableData.consumeIntegrationAmount}}积分</text>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import integral from "@/api/mall/integral";
	export default {
		data() {
			return {
				productList:[],
				modal:{
					show:true,
					type:1
				},
				searchData:{
					orderNo:''
				},
				// 0 待发货、1 已发货 
				tableData: {
					orderStatus:0,
					receiveName:'张三',
					receiveMobile:'13817542451',
					receiveAddress:'上海市杨浦区国定路333号5号楼A区',
					orderNo:'1237982173',
					orderTime:'2021-01-01 12:22:11',
					orderAmount:'900'
				},
			}
		},
		mounted(){
		},
		//路由传值
		onLoad(option) {
		   const { orderNo } = option;
		   this.searchData.orderNo = orderNo;
		},
		onShow() {
			this.orderNoDetail()
		},
		methods: {
			//根据orderNo获取数据
			orderNoDetail(){
				integral.getIntegralOrderDetail(this.searchData).then(res => {
					this.tableData = res.data;
					this.productList = res.data.orderDetailList || []
				}).catch((err) => {
					uni.showToast({
						title:err.msg || err
					})
				});
			},
			/**
			 * 返回上一页
			 */
			navBack(){
				uni.navigateBack({
					delta: 1
				})
			},
			
			/**
			 * 前往收货地址页面
			 * */
			toAddressEdit(){
				if(this.tableData.orderReceiveStatus !== '未发货'){
					return
				}
				uni.navigateTo({
					url:'/pages/my-pages/address/list?integralOrderNo=' + this.tableData.orderNo
				})
			},
		}
	}
</script>
<style lang="scss" scoped>
	.page{
		background-color: #f2f2f2;
		height: 100vh;
	}
	.scroll-view{
		height: calc(100% - 88rpx - 2rpx - var(--status-bar-height))
	}
	// 顶部订单状态
	.top-order-status{
		width: 100vw;
		background-color: #FFFFFF;
		// 订单状态
		.order-status{
			padding: 40rpx;
			text-align: center;
			display: flex;
			align-items: center;
			justify-content: center;
			>text{
				margin-left: 25rpx;
				line-height: 38rpx;
				font-size: 40rpx;
				font-weight: bold;
				color: #ed6d00;
			}
			// 待发货
			.wait-receiving-goods{
				color: #ED9700!important;
			}
			// 已发货
			.done-receiving-goods{
				color: #0DC316!important;
			}
		}
	}
	// 顶部订单状态
	// 地址
	.address-box{
		margin: 20rpx;
		background-color: #FFFFFF;
		border-radius: 5rpx;
		padding: 20rpx;
		display: flex;
		align-items: center;
		.address-info{
			margin-left: 44rpx;
			.address-user{
				.user-name{
					font-size: 30rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: #1C1C1C;
				}
				.user-phone{
					margin-left: 35rpx;
					font-size: 26rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: #666666;
				}
				.iconfont{
					color: #FD5A2E;
					font-size: 28rpx;
					margin-left: 30rpx;
				}
			}
			.address-address{
				font-size: 26rpx;
				font-weight: 400;
				color: #1C1C1C;
			}
		}
	}
	// 地址
	// 产品
	.product-box{
		margin: 0 20rpx 20rpx;
		background-color: #FFFFFF;
		box-shadow: 0px 6rpx 26rpx 0px rgba(123, 71, 46, 0.05);
		border-radius: 5rpx;
		padding: 20rpx 20rpx;
		// 标题
		.proudct-box-title{
			line-height: 26rpx;
			font-size: 26rpx;
			font-weight: bold;
			color: #1C1C1C;
		}
		// 普通商品
		.normal-product{

		}
		// 产品
		.product-item{
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 30rpx;
			margin-top:30rpx;
			position: relative;
			// 图片
			.product-image{
				width: 22.6vw;
				height: 22.6vw;
				border: 1rpx solid #CCCCCC;
				border-radius: 8rpx;
				overflow: hidden;
				>image{
					width: 100%;
					height: 100%;
				}
			}
			// 右侧信息
			.product-info{
				width: calc(100vw - 28vw - 40rpx - 40rpx - 20rpx);
				.product-info-top{
					display: flex;
					flex-direction: column;
					// 名称
					.product-name{
						line-height: 30rpx;
						font-size: 26rpx;
						font-weight: bold;
						color: #1C1C1C;
						margin-bottom: 10rpx;
						overflow: hidden;
						-webkit-line-clamp: 2;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-box-orient: vertical;
					}
					// 品牌
					.product-brand{
						line-height: 28rpx;
						font-size: 20rpx;
						font-weight: 400;
						color: #666666;
						margin-bottom: 10rpx;
					}
					// 规格
					.product-spc{
						line-height: 28rpx;
						font-size: 20rpx;
						font-weight: 400;
						color: #666666;
						margin-bottom: 10rpx;
					}
					// 分类
					.product-classify{
						line-height: 28rpx;
						font-size: 20rpx;
						font-weight: 400;
						color: #666666;
						margin-bottom: 38rpx;
					}
				}
				// 底部价格和数量
				.product-price-number{
					display: flex;
					justify-content: space-between;
					// 价格
					.product-price{
						font-size: 26rpx;
						font-weight: bold;
						color: #ed6d00;
					}
					// 数量
					.product-number{
						font-size: 24rpx;
						font-weight: bold;
						color: #252527;
					}
				}
			}

		}
		.set-meal-box{
			padding-bottom: 30rpx;
			border-bottom: 1px solid #CCCCCC;
		}
	}
	// 产品
	// 支付信息
	.pay-info-box{
		margin: 0 20rpx 20rpx;
		padding: 20rpx 20rpx 10px;
		background-color: #FFFFFF;
		box-shadow: 0px 6rpx 26rpx 0px rgba(123, 71, 46, 0.05);
		border-radius: 5rpx;
		.pay-info-item{
			padding-top: 10rpx;
			.pay-item-title{
				line-height: 24rpx;
				font-size: 24rpx;
				font-weight: bold;
				color: #1C1C1C;
			}
			.pay-info{
				display: flex;
				justify-content: space-between;
				>view{
					display: flex;
					flex-direction: column;
					>text{
						line-height: 24rpx;
						font-size: 24rpx;
						font-weight: 400;
						color: #1C1C1C;
						margin-bottom: 20rpx;
					}
				}
				.pay-info-left{
					width: 16vw;
				}
				.pay-info-right{
					width: calc(100vw - 16vw - 40rpx - 40rpx - 20rpx);
				}
				.red{
					color: #FA4515;
					font-weight: bold;
				}
			}
		}
	}
</style>

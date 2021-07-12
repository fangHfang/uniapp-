<template>
	<view class="container page">
		<view class="carousel">
			<view class="swiper-wrap" v-if="productInfo.bannerPicture">
				<swiper class="swiper-box" @change="swiperChange" duration="400">
					<swiper-item class="swiper-item" v-for="(bannerPath,index) in productInfo.bannerPicture"
						:key="index">
						<view class="image-wrapper">
							<fr-image loading-ing-img="oblique-light" :src="bannerPath" class="img" mode="aspectFill">
							</fr-image>
						</view>
					</swiper-item>
				</swiper>
				<view class="swipe-dot">
					<text class="swiper-dot-item">{{ (swiperCurrent+1)+"/"+productInfo.bannerPicture.length }}</text>
				</view>
			</view>

		</view>

		<view class="introduce-section" :class="{'no-maxxis':productInfo.itemType === 2}">
			<text class="title">{{ productInfo.itemName }}</text>
			<view class="price-wrap">
				<view class="price-box back">
					<text class="price-tip">¥</text>
					<text class="price">{{ $filtersNum(productInfo.price || 0) }}</text>
					<text class="m-price">商品价格</text>
				</view>
				<view class="store" style="color:#FA4515;">{{formatStock()}}</view>
			</view>
			<view v-if="productInfo.itemType !== 2" class="price-wrap isPreferential"
				:class="{'noPreferential':!(productInfo.rebateRuleName && productInfo.rebateAmount) && !(productInfo.inteRuleName && productInfo.inteAmount)}">
				<view class="price-box" style="height: 40rpx;">
					<text class="price-tip">¥</text>
					<text class="price">{{ calcRebateAmount() }}</text>
					<text class="m-price">预估到手价</text>
				</view>
				<view class="store"></view>
			</view>
			<view class="integral-box">
				<view class="inte-row" v-if="productInfo.rebateRuleName && productInfo.rebateAmount">
					<uni-tag size="small" class="tag" :inverted="true" :text="productInfo.rebateRuleName"
						type="error" />
					<text>可获{{ productInfo.rebateAmount}}新玛元</text>
				</view>
				<view class="inte-row" v-if="productInfo.inteRuleName && productInfo.inteAmount">
					<uni-tag size="small" class="tag" :inverted="true" :text="productInfo.inteRuleName" type="error" />
					<text>可获{{ productInfo.inteAmount}}积分</text>
				</view>
				<view class="inte-row"
					v-if="productInfo.epInfo && productInfo.epInfo.length > 0 && productInfo.epInfo[0].ruleName && productInfo.epInfo[0].amount">
					<uni-tag size="small" class="tag" :inverted="true" :text="productInfo.epInfo[0].ruleName"
						type="error" />
					<text>可获{{ productInfo.epInfo[0].amount}}兑换点</text>
				</view>
			</view>
			<view class="bot-row" v-if="false">
				<text>销量: 108</text>
				<text>库存: 4690</text>
				<text>浏览量: 768</text>
			</view>
			<!-- <image
			  src="../../../static/image/deadline/deadline-product-info.png"
			  mode="aspectFit"
			></image> -->
		</view>

		<view class="sku-table" v-if="productInfo.itemType === 4">
			<view class="tr">
				<text class="td-label">分类</text>
				<text class="td-con">{{ productInfo.categoryName }}</text>
			</view>
			<view class="tr">
				<text class="td-label">套餐内商品</text>
				<text class="td-con">{{ productInfo.pkgRelationItemName }}</text>
			</view>
		</view>
		<view class="sku-table" v-else>
			<view class="tr">
				<text class="td-label">品牌</text>
				<text class="td-con">{{ productInfo.brandName }}</text>
			</view>
			<view class="tr">
				<text class="td-label">分类</text>
				<text class="td-con">{{ productInfo.categoryName }}</text>
			</view>
			<view class="tr">
				<text class="td-label">规格</text>
				<text class="td-con">{{ productInfo.specDetail }}</text>
			</view>
		</view>

		<view class="c-list" v-if="false">
			<view class="c-row b-b" @click="toggleSpec">
				<text class="tit">购买类型</text>
				<view class="con">
					<text class="selected-text" v-for="(sItem, sIndex) in specSelected" :key="sIndex">
						{{sItem.name}}
					</text>
				</view>
				<text class="yticon icon-you"></text>
			</view>
			<view class="c-row b-b">
				<text class="tit">优惠券</text>
				<text class="con t-r red">领取优惠券</text>
				<text class="yticon icon-you"></text>
			</view>
			<view class="c-row b-b">
				<text class="tit">促销活动</text>
				<view class="con-list">
					<text>新人首单送20元无门槛代金券</text>
					<text>订单满50减10</text>
					<text>订单满100减30</text>
					<text>单笔购买满两件免邮费</text>
				</view>
			</view>
			<view class="c-row b-b">
				<text class="tit">服务</text>
				<view class="bz-list con">
					<text>7天无理由退换货 ·</text>
					<text>假一赔十 ·</text>
				</view>
			</view>
		</view>

		<!-- 评价 -->
		<view class="eva-section" v-if="false">
			<view class="e-header">
				<text class="tit">评价</text>
				<text>(86)</text>
				<text class="tip">好评率 100%</text>
				<text class="yticon icon-you"></text>
			</view>
			<view class="eva-box">
				<fr-image loading-ing-img="oblique-light" class="portrait"
					src="http://img3.imgtn.bdimg.com/it/u=1150341365,1327279810&fm=26&gp=0.jpg" mode="aspectFill">
				</fr-image>
				<view class="right-con">
					<text class="name">Leo yo</text>
					<text class="con">商品收到了，79元两件，质量不错，试了一下有点瘦，但是加个外罩很漂亮，我很喜欢</text>
					<view class="bot">
						<text class="attr">购买类型：XL 红色</text>
						<text class="time">2019-04-01 19:21</text>
					</view>
				</view>
			</view>
		</view>

		<view class="detail-desc">
			<view class="d-header">
				<text>商品详情</text>
			</view>
			<rich-text :nodes="details"></rich-text>
		</view>

		<!-- 猜你喜欢 -->
		<!-- 产品列表 -->
		<!-- <view class="u-like">
			<view class="d-header">
				<text>~~~ 猜你喜欢 ~~~</text>
			</view>
			<view class="product-list">
				<view v-for="(item,index) in likeList" :key="'product-item-' + index" class="product-item two-item">
					<fr-image loading-ing-img="oblique-light" class="product-image" :src="item.goodImg" alt=""></fr-image>
						<view class="product-info">
							<view class="product-info-top">
								<text class="product-name">{{item.goodName}}</text>
								<text class="product-brand">品牌:{{item.brand}}</text>
							</view>
							<text class="product-price">￥{{item.goodPrice}}</text>
						</view>
				</view>
			</view>
		</view> -->

		<!-- 底部操作菜单 -->
		<view class="page-bottom" v-if="productInfo.itemType !== 4 && productInfo.stock == 0">
			<button type="primary" class=" action-btn buy-now-btn" style="width: 90%;" @click="reserve">预定商品</button>
		</view>
		<view class="page-bottom" v-else>
			<button type="primary" class=" action-btn add-cart-btn" @tap="handleAddCart">加入购物车</button>
			<button type="primary" class=" action-btn buy-now-btn" @click="buy">立即购买</button>
		</view>

		<!-- 购物车 -->
		<iCartIcon />

		<!-- 购物车弹框 -->
		<uni-popup ref="cartPopup" type="bottom">
			<view class="popup-content">
				<view class="popup-header">
					<text class="popup-title">加入购物车</text>
					<view class="popup-delete" @click="closeCartPop">
						<uni-icons type="close" color="#333" size="18"></uni-icons>
					</view>
				</view>
				<view class="cart-box">
					<iProductItem :isProductDetail="false" :productItem="productInfo"></iProductItem>
				</view>
				<button class="action-btn" @click="cartAdd">确定</button>
			</view>
		</uni-popup>
		<!-- 规格-模态层弹窗 -->
		<view class="popup spec" :class="specClass" @touchmove.stop.prevent="stopPrevent" @click="toggleSpec">
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer attr-content" @click.stop="stopPrevent">
				<view class="a-t">
					<fr-image loading-ing-img="oblique-light" src="../../../static/image/mall/detail.png"></fr-image>
					<view class="right-con">
						<text class="price">¥328.00</text>
						<text class="stock">库存：188件</text>
						<view class="selected">
							已选：
							<text class="selected-text" v-for="(sItem, sIndex) in specSelected" :key="sIndex">
								{{sItem.name}}
							</text>
						</view>
					</view>
				</view>
				<view v-for="(item,index) in specList" :key="index" class="attr-list">
					<text>{{item.name}}</text>
					<view class="item-list">
						<block v-for="(childItem, childIndex) in specChildList" :key="childIndex">
							<text v-if="childItem.pid === item.id" class="tit" :class="{selected: childItem.selected}"
								@click="selectSpec(childIndex, childItem.pid)">
								{{childItem.name}}
							</text>
						</block>
					</view>
				</view>
				<button class="btn" @click="toggleSpec">完成</button>
			</view>
		</view>
		<uni-popup id="popup" ref="popup" type="center">
			<view class="success-mag">{{popMessage}}</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import iProductItem from '@/components/i-product-item/i-product-item.vue';
	import iCartIcon from '@/components/i-cart-icon/i-cart-icon.vue';
	import mall from '@/api/mall/mall.js'
	import reserve from '@/api/product/reserve.js'
	export default {
		name: 'productDetail',
		components: {
			iProductItem,
			iCartIcon
		},
		data() {
			return {
				// 商品信息
				productInfo: {},
				swiperInfo: [],
				swiperCurrent: 0,
				// 类别
				category: '',
				//模态框内参数
				specClass: 'none',
				specSelected: [],
				specList: [{
						id: 1,
						name: '尺寸',
					},
					{
						id: 2,
						name: '颜色',
					},
				],
				specChildList: [{
						id: 1,
						pid: 1,
						name: 'XS',
					},
					{
						id: 2,
						pid: 1,
						name: 'S',
					},
					{
						id: 3,
						pid: 1,
						name: 'M',
					},
					{
						id: 4,
						pid: 1,
						name: 'L',
					},
					{
						id: 5,
						pid: 1,
						name: 'XL',
					},
					{
						id: 6,
						pid: 1,
						name: 'XXL',
					},
					{
						id: 7,
						pid: 2,
						name: '墨黑',
					},
					{
						id: 8,
						pid: 2,
						name: '深灰',
					},
					{
						id: 9,
						pid: 2,
						name: '暗灰',
					},
				],
				//内容详情
				details: `
					<div style="width:100%">
					</div>
				`,
				likeList: [],
				//购物车弹框
				cartItem: {},
				popMessage: '已成功加入购物车！',
				isPresellItem: false
			};
		},
		async onLoad(options) {
			let {
				subItemNo,
				itemNo,
				isPresellItem
			} = options
			// 根据不同传参调用不同接口
			// 普通商品
			if (subItemNo) {
				this.getProductItem(subItemNo)
			}
			// 首页橱窗
			if (itemNo) {
				this.getProductItemByItemNo(itemNo)
			}
			// 是否预定下单
			if (isPresellItem == 'true') {
				isPresellItem = true
			}

		},
		computed: {
			...mapState({
				// 积分
				integralInfo: state => state.login.integralInfo,
			}),
		},
		methods: {
			/**
			 * 获取商品详细信息
			 * @param subItemNo 商品编号
			 */
			getProductItem(subItemNo) {
				mall.getProductItem(subItemNo).then(res => {
					let data = res.data
					data.stock = data.stock ? JSON.parse(data.stock) : data.stock
					this.productInfo = data
					// 拼接商品详情标签
					let details = '<div style="width:100%"> \r\n'
					data.detailPicture && data.detailPicture.forEach(item => {
						details += '<img style="width:100%;display:block;" src=' + "\"" + item + "\"" +
							'/> \r\n'
					})
					details += '</div>'
					this.details = details
					// 拼接类别
					let category = ''
					data.itemCategoryDTOS.forEach(item => {
						category += item.categoryName + '\r'
					})
					this.category = category
				})
			},
			/**
			 * 获取商品详细信息
			 * @param subItemNo 商品编号
			 */
			getProductItemByItemNo(itemNo) {
				mall.getProductItemByItemNo(itemNo).then(res => {
					const data = res.data
					this.productInfo = data
					// 拼接商品详情标签
					let details = '<div style="width:100%"> \r\n'
					data.detailPicture && data.detailPicture.forEach(item => {
						details += '<img style="width:100%;display:block;" src=' + "\"" + item + "\"" +
							'/> \r\n'
						console.log(details)
					})
					details += '</div>'
					this.details = details
					// 拼接类别
					let category = ''
					data.itemCategoryDTOS.forEach(item => {
						category += item.categoryName + '\r'
					})
					this.category = category
				})
			},
			swiperChange(e) {
				this.swiperCurrent = e.detail.current
			},
			//规格弹窗开关
			toggleSpec() {
				if (this.specClass === 'show') {
					this.specClass = 'hide';
					setTimeout(() => {
						this.specClass = 'none';
					}, 250);
				} else if (this.specClass === 'none') {
					this.specClass = 'show';
				}
			},
			//选择规格
			selectSpec(index, pid) {
				let list = this.specChildList;
				list.forEach(item => {
					if (item.pid === pid) {
						this.$set(item, 'selected', false);
					}
				})

				this.$set(list[index], 'selected', true);
				//存储已选择
				this.specSelected = [];
				list.forEach(item => {
					if (item.selected === true) {
						this.specSelected.push(item);
					}
				})
			},
			/**
			 * 加入购物车
			 */
			handleAddCart() {
				this.$refs.cartPopup.open()
			},
			closeCartPop() {
				this.$refs.cartPopup.close()
			},
			/**
			 * 加入购物车
			 */
			cartAdd() {
				const productInfo = this.productInfo
				mall.cartAdd({
					itemNo: productInfo.subItemNo,
					itemQuantity: productInfo.currentNum || 1,
					isIntegralItem: false
				}).then(res => {
					if (res.code === 200) {
						this.popMessage = '已成功加入购物车！'
						this.$refs.popup.open()
						this.closeCartPop()
						setTimeout(() => {
							this.$refs.popup.close()
						}, 1000)
					}
				}).catch((err) => {
					this.popMessage = err.msg
					this.$refs.popup.open()
					this.closeCartPop()
					setTimeout(() => {
						this.$refs.popup.close()
					}, 1000)
				})
			},
			/**
			 * 立即购买
			 */
			buy() {
				const productList = []
				productList.push({
					...this.productInfo,
					isMjsProduct: true,
				})
				const data = {
					productList:productList,
					isCart:false,
					totalPrice:this.productInfo.price,
					isPresellItem:this.isPresellItem
				}
				uni.navigateTo({
					url: `/pages/products/order/confirm`,
					success: function(res) {
						res.eventChannel.emit("sendParams", data);
					}
				})
			},
			stopPrevent() {},

			/**
			 * 格式化库存
			 */
			formatStock() {
				const {
					itemType,
					stock,
					displayRuleType,
					displayQuantity,
					stockDisplay
				} = this.productInfo
				let text = "剩余库存" + (stock || 0)
				switch (itemType) {
					// 如果为玛吉斯商品会根据库存显示规则进行判断，来显示库存，如果能查到规则显示stockDispaly字段，查不到就展示真实库存stock，
					case 1:
						if (stockDisplay) {
							text = stockDisplay
						}
						break
						// 判断为套餐商品时，显示套餐商品库存
					case 4:
						if (displayRuleType === 1) {
							text = '库存：' + displayQuantity
						} else if (displayRuleType === 2) {
							text = '库存：' + displayQuantity + '%'
						}
						break
				}
				return text
			},

			/**
			 * 预定商品
			 */
			reserve() {
				let postData = {
					itemNo: this.productInfo.subItemNo,
					itemQuantity: 1
				}
				reserve.orderSingleCreate(postData).then((res) => {
					uni.showToast({
						title: '添加预定商品成功',
						icon: 'none'
					})
				}).catch((err) => {
					uni.showToast({
						title: err.msg || err,
						icon: 'none'
					})
				})
			},

			/**
			 * 计算预计到手价
			 */
			calcRebateAmount() {
				let {
					price,
					rebateAmount
				} = this.productInfo
				let calcRebateAmount = 0
				calcRebateAmount = Number(price || 0).sub(Number(rebateAmount || 0))
				if (Number(calcRebateAmount) < 0) {
					calcRebateAmount = 0
				}
				return Number(calcRebateAmount).toFixed(2)
			}
		},

	}
</script>

<style lang='scss'>
	.page {
		padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
		background-color: $uni-bg-color-grey;
	}

	.carousel {
		height: 100vw;
		position: relative;
		background-color: #f1f1f1;

		.swiper-wrap,
		.swiper-box {
			height: 100%;
			position: relative;
		}

		.image-wrapper {
			width: 100%;
			height: 100%;
		}

		.swiper-item {
			display: flex;
			justify-content: center;
			align-content: center;
			height: 100vw;
			background-color: #fff;
			overflow: hidden;

			.img {
				width: 100%;
				height: 100%;
			}
		}

		.swipe-dot {
			position: absolute;
			bottom: 20px;
			right: $uni-spacing-col-base;
			color: #fff;
			padding: 2px $uni-spacing-col-base;
			border-radius: $uni-border-radius-lg;
			background-color: rgba(0, 0, 0, 0.6);
		}
	}

	/* 标题简介 */
	.introduce-section {
		background-color: #fff;
		padding: $uni-spacing-col-base;
		margin: $uni-spacing-col-base;
		border-radius: $uni-border-radius-base;
		overflow: hidden;
		position: relative;
		background-image: url(../../../static/image/deadline/deadline-product-info.png);
		background-size: contain;
		background-repeat: no-repeat;
		background-position: right bottom;

		.title {
			font-size: 32rpx;
			color: $uni-text-color;
			height: 50rpx;
			line-height: 50rpx;
			position: relative;
			z-index: 20;
		}

		.price-wrap {
			display: flex;
			justify-content: space-between;
			align-items: center;
			position: relative;
			z-index: 10;
		}

		/* 是否有返利 */
		.isPreferential {
			height: 12px;
			line-height: 22px;
			margin-bottom: 18px;
		}

		.noPreferential {
			margin-bottom: 10px;
		}

		.price-box {
			display: flex;
			align-items: baseline;
			padding: 10rpx 0;
			font-size: 26rpx;
			color: $uni-color-primary;

			.price-tip {
				font-weight: 600;
			}
		}

		.price {
			font-size: $uni-font-size-huge;
			margin-left: 12rpx;
			font-weight: 600;
		}

		.back {
			color: #333333;
		}

		.m-price {
			margin-left: 36rpx;
			font-size: 20rpx;
		}

		.coupon-tip {
			align-items: center;
			padding: 4rpx 10rpx;
			background-color: $uni-color-primary;
			font-size: $uni-font-size-sm;
			color: #fff;
			border-radius: 6rpx;
			line-height: 1;
			transform: translateY(-4rpx);
		}

		.store {
			font-size: $uni-font-size-sm;
			color: $uni-text-color-grey;
		}

		.integral-box {
			position: relative;
			z-index: 10;

			.inte-row {
				font-size: $uni-font-size-sm;
				color: $uni-text-color-grey;
				margin-bottom: $uni-spacing-col-sm;
				color: $uni-text-color-subsidiary;

				.tag {
					display: inline-block;
					margin-right: $uni-spacing-col-base;
				}
			}
		}

		.bot-row {
			display: flex;
			align-items: center;
			height: 50rpx;
			font-size: $uni-font-size-sm;
			color: $uni-text-color-grey;

			text {
				flex: 1;
			}
		}
	}

	.sku-table {
		background-color: #fff;
		padding: $uni-spacing-col-base;
		margin: $uni-spacing-col-base $uni-spacing-col-base 0;
		border-radius: $uni-border-radius-base;

		.tr {
			border: 1px solid $uni-border-color;
			border-top: none;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			height: 40px;
			font-size: $uni-font-size-base;
			color: $uni-text-color-subsidiary;

			&:first-of-type {
				border-top: 1px solid $uni-border-color;
			}

			.td-label {
				background-color: $uni-bg-color-grey;
				height: 40px;
				width: 90px;
				flex: 0 0 90px;
				box-sizing: border-box;
				line-height: 40px;
				padding-left: $uni-spacing-col-lg;
			}

			.td-con {
				flex: 1;
				padding-left: $uni-spacing-col-lg;
				width: 100%;
				overflow: hidden;
				font-size: $uni-font-size-base;
				color: $uni-text-color;
				text-overflow: ellipsis;
				word-break: break-all;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}
		}
	}

	.c-list {
		font-size: $uni-font-size-sm;
		color: $uni-text-color-grey;
		background-color: #fff;

		.c-row {
			display: flex;
			align-items: center;
			padding: 20rpx 30rpx;
			position: relative;
		}

		.tit {
			width: 140rpx;
		}

		.con {
			flex: 1;
			color: $uni-text-color;

			.selected-text {
				margin-right: 10rpx;
			}
		}

		.bz-list {
			height: 40rpx;
			font-size: $uni-font-size-sm;
			color: $uni-text-color;

			text {
				display: inline-block;
				margin-right: 30rpx;
			}
		}

		.con-list {
			flex: 1;
			display: flex;
			flex-direction: column;
			color: $uni-text-color;
			line-height: 40rpx;
		}

		.red {
			color: $uni-color-primary;
		}
	}

	/* 评价 */
	.eva-section {
		display: flex;
		flex-direction: column;
		padding: 20rpx 30rpx;
		background-color: #fff;
		margin-top: 16rpx;

		.e-header {
			display: flex;
			align-items: center;
			height: 70rpx;
			font-size: uni-font-size-sm;
			color: $uni-text-color-grey;

			.tit {
				font-size: $uni-font-size-base;
				color: $uni-text-color;
				margin-right: 4rpx;
			}

			.tip {
				flex: 1;
				text-align: right;
			}

			.icon-you {
				margin-left: 10rpx;
			}
		}
	}

	.eva-box {
		display: flex;
		padding: 20rpx 0;

		.portrait {
			flex-shrink: 0;
			width: 80rpx;
			height: 80rpx;
			border-radius: 100px;
		}

		.right-con {
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $uni-font-size-base;
			color: $uni-text-color;
			padding-left: 26rpx;

			.con {
				font-size: $uni-font-size-base;
				color: $uni-text-color;
				padding: 20rpx 0;
			}

			.bot {
				display: flex;
				justify-content: space-between;
				font-size: $uni-font-size-base;
				color: $uni-text-color-grey;
			}
		}
	}

	/*  详情 */
	.detail-desc {
		background-color: #fff;

		.d-header {
			height: 80rpx;
			line-height: 80rpx;
			padding-left: $uni-spacing-col-base;
			font-size: $uni-font-size-lg;
			color: $uni-text-color;
			font-weight: 600;
			position: relative;
			background-color: $uni-bg-color-grey;

			text {
				position: relative;
				z-index: 1;
			}
		}
	}

	/* 规格选择弹窗 */
	.attr-content {
		padding: 10rpx 30rpx;

		.a-t {
			display: flex;

			image {
				width: 170rpx;
				height: 170rpx;
				flex-shrink: 0;
				margin-top: -40rpx;
				border-radius: 8rpx;
				;
			}

			.right-con {
				display: flex;
				flex-direction: column;
				padding-left: 24rpx;
				font-size: $uni-font-size-sm;
				color: $uni-text-color;
				line-height: 42rpx;

				.price {
					font-size: $uni-font-size-lg;
					color: $uni-color-primary;
					margin-bottom: 10rpx;
				}

				.selected-text {
					margin-right: 10rpx;
				}
			}
		}

		.attr-list {
			display: flex;
			flex-direction: column;
			font-size: $uni-font-size-sm;
			color: $uni-text-color;
			padding-top: 30rpx;
			padding-left: 10rpx;
		}

		.item-list {
			padding: 20rpx 0 0;
			display: flex;
			flex-wrap: wrap;

			text {
				display: flex;
				align-items: center;
				justify-content: center;
				background-color: #eee;
				margin-right: 20rpx;
				margin-bottom: 20rpx;
				border-radius: 100rpx;
				min-width: 60rpx;
				height: 60rpx;
				padding: 0 20rpx;
				font-size: $uni-font-size-base;
				color: $uni-text-color;
			}

			.selected {
				background-color: #fbebee;
				color: $uni-color-primary;
			}
		}
	}

	/*  弹出层 */
	.popup {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 99;

		&.show {
			display: block;

			.mask {
				animation: showPopup 0.2s linear both;
			}

			.layer {
				animation: showLayer 0.2s linear both;
			}
		}

		&.hide {
			.mask {
				animation: hidePopup 0.2s linear both;
			}

			.layer {
				animation: hideLayer 0.2s linear both;
			}
		}

		&.none {
			display: none;
		}

		.mask {
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
			background-color: rgba(0, 0, 0, 0.4);
		}

		.layer {
			position: fixed;
			z-index: 99;
			bottom: 0;
			min-height: 40vh;
			border-radius: 10rpx 10rpx 0 0;
			background-color: #fff;
			padding-bottom: env(safe-area-inset-bottom);

			.btn {
				height: 36px;
				line-height: 36px;
				border-radius: 36px;
				background-color: $uni-color-primary;
				font-size: $uni-font-size-base;
				color: #fff;
				margin: $uni-spacing-col-lg auto;
			}
		}

		@keyframes showPopup {
			0% {
				opacity: 0;
			}

			100% {
				opacity: 1;
			}
		}

		@keyframes hidePopup {
			0% {
				opacity: 1;
			}

			100% {
				opacity: 0;
			}
		}

		@keyframes showLayer {
			0% {
				transform: translateY(120%);
			}

			100% {
				transform: translateY(0%);
			}
		}

		@keyframes hideLayer {
			0% {
				transform: translateY(0);
			}

			100% {
				transform: translateY(120%);
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
		right: 0;
		height: 100rpx;
		padding-bottom: env(safe-area-inset-bottom);
		background-color: #fff;
		box-shadow: 0 -1px 0 0 rgba(0, 0, 0, 0.1);

		.action-btn {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 45%;
			height: 72rpx;
			border: 1px solid $uni-color-primary;
			color: $uni-color-primary;
			font-size: $uni-font-size-base;
			padding: 0;
			border-radius: 72rpx;
			background-color: #fff;

			&.buy-now-btn {
				color: #fff;
				background-color: $uni-color-primary;
			}
		}
	}

	/*猜你喜欢 */
	.u-like {
		.d-header {
			height: 80rpx;
			text-align: center;
			line-height: 80rpx;
			padding-left: $uni-spacing-col-base;
			font-size: $uni-font-size-base;
			color: $uni-color-primary;
			position: relative;
			background-color: $uni-bg-color-grey;
		}

		.product-list {
			width: calc(100% - 40rpx);
			margin: 10rpx auto;
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;

			.product-item {
				background-color: #ffffff;
			}

			.product-info {
				padding: 25rpx 15rpx;
				display: flex;
				flex-direction: column;
			}

			.product-info-top {
				display: flex;
				flex-direction: column;
			}

			// 名称
			.product-name {
				line-height: 28rpx;
				font-size: 26rpx;
				font-weight: bold;
				color: #1C1C1C;
				overflow: hidden;
				-webkit-line-clamp: 2;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				margin-bottom: 10rpx;
			}

			// 品牌
			.product-brand {
				line-height: 20rpx;
				font-size: 20rpx;
				font-weight: 400;
				color: #666666;
				margin-bottom: 20rpx;
			}

			// 价格
			.product-price {
				line-height: 18rpx;
				font-size: 20rpx;
				font-weight: bold;
				color: $uni-color-primary;
			}

			// 两列样式
			.two-item {
				width: calc((100vw - 40rpx - 10rpx)/2);
				margin-bottom: 10rpx;
				box-shadow: 0px 6px 26px 0px rgba(123, 71, 46, 0.05);
				border-radius: 5px;

				.product-image {
					height: calc((100vw - 40rpx - 10rpx) / 2);
					width: calc((100vw - 40rpx - 10rpx) / 2);
				}

				.product-info {
					padding: 0 25rpx 25rpx 25rpx;
				}
			}
		}

	}

	/*购物车弹出框*/
	.popup-content {
		height: 300px;
		border-radius: $uni-border-radius-base $uni-border-radius-base 0 0;
		background-color: #fff;

		.popup-header {
			height: 44px;
			border-bottom: 1px solid $uni-border-color;
			position: relative;
			text-align: center;
			line-height: 44px;

			.popup-delete {
				position: absolute;
				right: 0;
				top: 0;
				width: 36px;
				height: 100%;
			}
		}

		.action-btn {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 90%;
			position: absolute;
			bottom: 0;
			left: 5%;
			margin-bottom: calc(20px + env(safe-area-inset-bottom));
			height: 72rpx;
			border: 1px solid $uni-color-primary;
			color: #fff;
			font-size: $uni-font-size-base;
			padding: 0;
			border-radius: 72rpx;
			background-color: $uni-color-primary;
		}
	}

	.success-mag {
		width: 70vw;
		height: 100px;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: rgba(0, 0, 0, 0.6);
		border-radius: 10px;
		color: $uni-color-primary;
	}

	.no-maxxis {
		padding-bottom: 0;
	}
</style>

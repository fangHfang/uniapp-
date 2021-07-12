<template>
	<view class="product-item" @click="goToDetail()">
		<view class="top-left" v-if="productItem.isSaleStatus === 0">下架</view>
		<view class="item-img">
			<image class="img" :src="productItem.itemImageUrl" mode="aspectFit"></image>
		</view>
		<view class="item-con">
			<view class="title">{{productItem.itemName}}</view>
			<view class="row">
				<text class="text">品牌：{{productItem.itemBrand}}</text>
			</view>
			<view class="row">
				<text class="text">规格：{{productItem.itemSpecDetail}}</text>
			</view>
			<text class="text">分类:{{productItem.itemCategoryBackend}}</text>
			<view class="flex j-space-between">
				<view class="price">￥{{productItem.itemPrice}}</view>
				<view class="price" style="color:#333;">x{{productItem.itemQuantity}}</view>
			</view>
		</view>
		<yu-toast
			:message1="powerData.msg1"
			:message2="powerData.msg2"
			:duration="powerData.duration"
			verticalAlign="center"
			:backgroundColor="powerData.bgColor"
			:color="powerData.fontColor"
			ref="power"
		></yu-toast>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	import yuToast from '@/components/yu-toast/yu-toast'
	export default {
		name: 'i-product-item',
		props: {
			productItem: {
				type: Object,
				default () {
					return {}
				}
			},
			tabIndex:{
				type: [Number,String],
				default () {
					return 0
				}
			}
		},
		components: {},
		data() {
			return {
				// 权限提示
				powerData:{
					msg1:'您没有权限,',
					msg2:'请开通相应权限。',
					duration:2000,
					bgColor:"#000000cc",
					fontColor:"#ed6d00",
				},
			}
		},
		computed: {
			...mapState({
				// 权限集合
				resourceList: state => state.login.resourceList
			}),
		},
		mounted() {},
		methods: {
			/**
			 * 跳转商品详情
			 */
			goToDetail() {
				// 商品详情权限-STOREAPPA0401
				if(!this.resourceList.some((item)=>{return item.resourceNo === 'STOREAPPA0401'})){
					this.$refs.power.show()
					return
				}
				let isPresellItem = this.tabIndex === 0 ? true : false
				const {itemNo} = this.productItem
				uni.navigateTo({
					url: '/pages/products/product-detail/product-detail?subItemNo=' + itemNo + "&isPresellItem=" + isPresellItem
				})
			}
		}
	}
</script>

<style lang="scss">
	.product-item {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		background-color: #fff;
		padding: $uni-spacing-row-base;
		border-radius: $uni-border-radius-base;
		position: relative;
		.top-left{
			top: 10px;
			left: 0;
			padding: 4px 5px;
			color: #CCCCCC;
			font-size: 12px;
			background-color: #666666;
			border-radius: 0 3px 3px 0;
			position: absolute;
			z-index: 30;
		}
		.item-img {
			flex: 0 0 90px;
			margin: 0 10px;
			width: 90px;
			height: 90px;
			border: 1px solid #CCCCCC;
			border-radius: 3px;
			.img {
				width: 100%;
				height: 100%;
				border-radius: 3px;
			}
		}

		.item-con {
			flex: 1;
			position: relative;

			.title {
				width: 100%;
				overflow: hidden;
				font-size: $uni-font-size-base;
				color: $uni-text-color;
				text-overflow: ellipsis;
				word-break: break-all;
				display: -webkit-box;
				-webkit-line-clamp: 2; //多行在这里修改数字即可
				/* autoprefixer: ignore next */
				-webkit-box-orient: vertical;
			}

			.row {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top: $uni-spacing-row-sm;
			}

			.text {
				font-size: $uni-font-size-sm;
				color: $uni-text-color-grey;
			}

			.tag-box {
				display: flex;
				margin-top: $uni-spacing-col-sm;

				.tag {
					margin-right: $uni-spacing-col-sm;
				}
			}

			.price {
				font-size: $uni-font-size-lg;
				color: $uni-color-primary;
				margin-top: $uni-spacing-col-base;
			}
		}
	}
</style>

<template>
	<!-- 优惠券兑换商品用 -->
	<view v-if="isCoupon" class="product-item" style="padding: 25px 10px;">
		<view v-if="productItem.showCheckBox" class="check-box" :class="productItem.isChecked?'selected':''"></view>
		<view class="item-img item-coupon-img" @tap="goToDetail(productItem)">
			<fr-image loading-ing-img="oblique-light"   class="img" :src="productItem.image" mode="aspectFit"></fr-image>
		</view>
		<view class="item-con">
			<view class="title" @tap="goToDetail(productItem)">{{productItem.name}}</view>
			<view class="text">品牌：{{productItem.brand}}</view>
			<view class="text">分类：{{productItem.classification}}</view>
			<view class="text">规格：{{productItem.sku}}</view>
			<view class="price">￥{{productItem.price}}</view>
		</view>
	</view>
	<view v-else-if="isIntegral" class="product-item">
		<view v-if="productItem.showCheckBox" class="check-box" :class="productItem.isChecked?'selected':''"></view>
		<view class="top-left" v-if="!(productItem.stockDisplay || productItem.stock)">已售罄</view>
		<view class="item-img" :class="[isCart ? 'item-cart-img' : '']" @tap="goToDetail(productItem)">
			<fr-image loading-ing-img="oblique-light" class="img" :src="productItem.listPicture" mode="aspectFit"></fr-image>
		</view>
		<view class="item-con flex j-space-between flex-column">
			<view>
				<view class="title" @tap="goToDetail(productItem)">{{productItem.itemName}}</view>	
				<template v-if="isCart">
					<!-- 商品类型 itemType（1:商品；2：优惠券, 4: 套餐商品） -->
					<view v-if="productItem.itemType === 1 || productItem.itemType === 4">
						<view class="flex j-space-between">
							<text class="text" style="width:auto;">分类：{{formatCategory()}}</text>
							<text class="text" style="width:auto;">库存：{{productItem.stockDisplay || productItem.stock}}</text>
						</view>
						<view class="text" style="width: 100%;">品牌：{{productItem.itemBrand}}</view>
						<view class="text" style="width: 100%;">规格：{{productItem.itemSpecDetail}}</view>
					</view>
					<view v-else>
						<view class="flex j-space-between">
							<text class="text" style="width:auto;">卡券信息：{{productItem.couponDesc}}</text>
							<text class="text" style="width:auto;">库存：{{productItem.stockDisplay || productItem.stock}}</text>
						</view>
						<view class="text" style="width: 100%;">卡券类型：{{productItem.couponType === 1 ? '兑换券' : '消费券'}}</view>
						<view class="text" style="width: 100%;">卡券有效时间：{{productItem.couponEffectiveTime}}</view>
					</view>
				</template>
				<template v-else>
					<!-- 商品类型 itemType（1:商品；2：优惠券, 4: 套餐商品） -->
					<view v-if="productItem.itemType === 1 || productItem.itemType === 4">
						<view class="flex j-space-between">
							<text class="text" style="width:auto;">分类：{{formatCategory()}}</text>
							<text class="text" style="width:auto;">库存：{{productItem.stockDisplay || productItem.stock}}</text>
						</view>
						<view class="text" style="width: 100%;">品牌：{{productItem.brandName}}</view>
						<view class="text" style="width: 100%;">规格：{{productItem.specDetail}}</view>
					</view>
					<view v-else>
						<view class="flex j-space-between">
							<text class="text" style="width:auto;">卡券信息：{{productItem.couponDesc}}</text>
							<text class="text" style="width:auto;">库存：{{productItem.stockDisplay || productItem.stock}}</text>
						</view>
						<view class="text" style="width: 100%;">卡券类型：{{productItem.couponType === 1 ? '兑换券' : '消费券'}}</view>
						<view class="text" style="width: 100%;">卡券有效时间：{{productItem.couponEffectiveTime}}</view>
					</view>
				</template>
				
				
				<view class="tag-box">
					<uni-tag size="small" class="tag" :inverted="true" :text="tag" type="error" v-for="(tag,i) in productItem.tags"
					:key="i" />
				</view>
			</view>
			<view class="price remains">{{productItem.price ? productItem.price : 0}}积分</view>
			<view class="right-bottom">
				<view class="special-tag" v-if="productItem.seckill || productItem.snapUp || productItem.commodityMix">
					{{productItem.seckill?'限时秒杀':productItem.snapUp?'限时抢购':productItem.commodityMix?'商品组合':''}}
				</view>
				<view class="normal" v-else>
					<uni-number-box 
						:style="{'margin-right':isCart ? '0px' : '10px'}"
						:min="1" 
						:max="parseInt(productItem.stock) || 1" 
						:value="productItem.currentNum" 
						@change="currentNumChange" 
						:disabled="!productItem.stock"/>
					<uni-icons v-if="!isCart" type="cart" color="#F35332" size="25" @click.native.stop="addIntegralCart" />
				</view>
			</view>
		</view>
	</view>
	<view v-else class="product-item">
		<view v-if="productItem.showCheckBox" class="check-box" :class="productItem.isChecked?'selected':''"></view>
		<view class="item-img" @tap="goToDetail(productItem)">
			<fr-image loading-ing-img="oblique-light"  class="img" :src="productItem.listPicture" mode="aspectFit"></fr-image>
		</view>
		<view class="top-left" v-if="!productItem.stock">已售罄</view>
		<view class="item-con">
			<view class="title" @tap="goToDetail(productItem)">{{productItem.itemName}}</view>
			<!-- 套餐商品展示子商品名称 和分类 -->
			<template v-if="productItem.itemType === 4">
				<view class="row" @tap="goToDetail(productItem)">
					<text class="text" style="width: 100%;" v-if="productItem.pkgRelationItemInfo">{{productItem.pkgRelationItemInfo.map((item)=>{return item.itemName}).join(',')}}</text>
					<text class="text" v-else></text>
				</view>
				<view class="flex j-space-between">
					<text class="text" style="width: 100%;">分类：{{productItem.categoryName}}</text>
				</view>
			</template>
			<template v-else>
				<view class="row" @tap="goToDetail(productItem)">
					<text class="text" style="width: 48%;">品牌：{{productItem.brandName}}</text>
					<text class="text" style="width: 48%;">{{formatStock()}}</text>
				</view>
				<view class="flex j-space-between">
					<text class="text" style="width: 48%;">规格：{{productItem.specDetail}}</text>
					<text class="text" style="width: 48%;">分类：{{productItem.categoryName}}</text>
				</view>
			</template>
			
			<view class="tag-box">
				<uni-tag size="small" class="tag small-tag" :inverted="true" :text="tag" type="error" v-for="(tag,i) in productItem.tags" :key="i" />
			</view>
			<view class="price">￥{{$filtersNum(productItem.price)}}</view>
			<view class="right-bottom">
				<view class="special-tag" v-if="productItem.seckill || productItem.snapUp || productItem.commodityMix">
					{{productItem.seckill?'限时秒杀':productItem.snapUp?'限时抢购':productItem.commodityMix?'商品组合':''}}
				</view>
				<view class="normal" v-else>
					<uni-number-box ref="numberBox" :min="parseInt(productItem.stock) ? 1 : parseInt(productItem.stock)" :max="parseInt(productItem.stock) || 1" :value="productItem.currentNum" @change="currentNumChange" :disabled="!productItem.stock"/>
					<uni-icons v-if="isProductDetail" type="cart" color="#F35332" size="25" @click.native.stop="addCart" />
				</view>
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
        default() {
          return {}
        }
      },
      // 积分商城
      isIntegral: {
        type: Boolean,
        default: false
      },
      // 积分商城点击购物车
      isCart: {
        type: Boolean,
        default: false,
      },
	  // 优惠券兑换商品用
	  isCoupon: {
	    type: Boolean,
	    default: false,
	  },
	  // 是否是商品详情加入购物车，不展示图标
	  isProductDetail: {
	    type: Boolean,
	    default: true,
	  },
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
			resourceList: state => state.login.resourceList,
			// 触发视图更新
			triggerNumberMallTab: state => state.app.triggerNumberMallTab
		}),
	},
	watch: {
		triggerNumberMallTab() {
			this.$refs.numberBox.setChangeFromInner()
		},
	},
    mounted() {
    },
    methods: {
      clickProductItem(item) {
        console.log(item)
      },
      checkChange(val) {
        console.log(val)
      },
      addCart() {
		this.$emit('addCart')
      },
	  addIntegralCart(){
		this.$emit('addIntegralCart')
	  },
      // 当前选中值的change时间
      currentNumChange(value){
        if(this.isIntegral){
          this.productItem.currentNum = Number(value) ? Number(value) : 1
          this.$emit('addCart',Number(value) ? Number(value) : 1 )
        }else{
          this.productItem.currentNum = value
        }
      },
	  /**
	   * 
	   * @param {Object} productItem
	   */
      goToDetail(productItem) {
        if (!this.isIntegral) {
			// 商品详情权限-STOREAPPA0401
			if(!this.resourceList.some((item)=>{return item.resourceNo === 'STOREAPPA0401'})){
				this.$refs.power.show()
				return
			}
			// 触发更新数量视图-商城tab
			this.$store.dispatch('app/setTriggerNumberMallTab')
			uni.navigateTo({
				url: '/pages/products/product-detail/product-detail?subItemNo=' + productItem.subItemNo
			})
        }
		else{
			// 触发更新数量视图-商城tab
			this.$store.dispatch('app/setTriggerNumberMallTab')
			uni.navigateTo({
			  url: '/pages/my-pages/mall/detail/mall-detail?itemNo=' + productItem.itemNo
			})
		}
      },
			
			/**
			 * 格式化库存
			 */
			formatStock(){
				const { itemType,stock,displayRuleType,displayQuantity,stockDisplay } = this.productItem
				let text = "库存：" + stock
				// 商品类型,1：玛吉斯商品；2：非玛商品；4：套餐
				switch(itemType){
					// 如果为玛吉斯商品会根据库存显示规则进行判断，来显示库存，如果能查到规则显示stockDispaly字段，查不到就展示真实库存stock，
					case 1:
						if(stockDisplay){
							text = stockDisplay
						}
						break
					// 判断为套餐商品时，显示套餐商品库存
					case 4:
						if(displayRuleType === 1){
							text = '库存：' + displayQuantity
						}else if(displayRuleType === 2){
							text = '库存：' + displayQuantity + '%'
						}
						break
				}
				return text
			},
			
			/**
			 * 格式化分类
			 */
			formatCategory(){
				let category = this.isCart ? this.productItem.itemCategory : this.productItem.categoryName
				if(category && category.length > 10){
						category = category.substring(0,10) + '...'
				}
				return category
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
		margin-bottom: $uni-spacing-row-base;
		border-radius: $uni-border-radius-base;
		position: relative;
		.check-box {
			flex: 0 0 16px;
			width: 16px;
			height: 16px;
			border-radius: 50%;
			position: relative;
			border: 1px solid $uni-border-color;

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

		.item-img {
			flex: 0 0 90px;
			margin: 0 10px 0 0;
			width: 90px;
			height: 90px;
			position: relative;
			z-index: 1;

			.img {
				width: 100%;
				height: 100%;
				background-color: #f1f1f1;
				border-radius:8rpx;
			}
		}
		.item-cart-img{
			width: 80px;
			height: 80px;
			border: 1px solid #CCCCCC;
			border-radius: 3px;
		}
		.item-coupon-img{
			width: 115px;
			height: 115px;
			border: 1px solid #CCCCCC;
			border-radius: 3px;
			flex: initial;
		}

		.item-con {
			flex: 1;
			position: relative;
			width: calc(100% - 110px);
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
				text-overflow: ellipsis;
				  word-break: normal;
				  overflow: hidden;
				  white-space: nowrap;
				  width:50%;
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
			.remains{
				font-size: $uni-font-size-sm;
				font-weight: bold;
			}

			.right-bottom {
				position: absolute;
				bottom: 0;
				right: 0;

				.special-tag {
					color: #fff;
					text-align: center;
					width: 100px;
					height: 24px;
					line-height: 24px;
					position: absolute;
					bottom: 0;
					right: -10px;
					font-size: $uni-font-size-sm;
					margin-left: 10px;
					font-weight: normal;
					background: linear-gradient(to right, #fc9121, #fd5122);

					&::after {
						content: ' ';
						border-width: 12px 0px 12px 14px;
						border-color: rgba(255, 255, 255, 0) rgba(255, 255, 255, 0) rgba(255, 255, 255, 0) rgba(255, 255, 255, 1);
						border-style: solid;
						display: block;
						position: absolute;
						left: 0;
						top: 0;
						z-index: 1;
					}
				}

				.normal {
					display: flex;
					align-items: center;

					.uni-numbox {
						width: auto;
						margin-right: $uni-spacing-col-base;
					}
				}
			}
		}
	
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
	}
	.small-tag{
		padding: 0 5px;
		height: 17px;
		line-height: 17px;
	}
	/deep/.uni-numbox__value{
		width: 50px;
	}
</style>

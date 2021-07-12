<template>
	<view class="product-item">
		<view v-if="productItem.showCheckBox || isManage" class="check-box" :class="productItem.isChecked?'selected':''"
		 @click="checkChange"></view>
		<view class="item-img" @tap="goToDetail">
			<image class="img" :src="productItem.itemImageUrl" mode="aspectFit"></image>
		</view>
		<view class="item-con">
			<view class="title" @tap="goToDetail">{{productItem.itemName}}</view>
			<view class="row" @tap="goToDetail">
				<text class="text">品牌：{{productItem.itemBrand}}</text>
			</view>
			<view class="row" @tap="goToDetail">
				<text class="text">规格：{{productItem.itemSpecDetail}}</text>
			</view>
			<text class="text">分类:{{productItem.itemCategory}}</text>
			<view class="price" :class="{grey:!productItem.showCheckBox}">￥{{productItem.itemPrice}}</view>
			<view class="right-bottom">
				<view class="normal" v-if="productItem.showCheckBox">
					<uni-number-box ref="numberBox" :value="productItem.cartItemQuantity" :min="1" @change="handleNumberChange" @onFocus="handFocus" @onBlur="handBlur"/>
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
	import integral from "@/api/mall/integral";
	export default {
		name: 'i-product-item',
		props: {
			productItem: {
				type: Object,
				default () {
					return {}
				}
			},
			isManage: {
				type: Boolean,
				default: false
			},
			type: {
				type: Boolean,
				default: false
			},
		},
		components: {},
		data() {
			return {
				// 是否输入数量
				isInputNum:false,
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
		watch: {
			triggerNumber() {
				this.$refs.numberBox.setChangeFromInner()
			},
		},
		computed: {
			...mapState({
				// 权限集合
				resourceList: state => state.login.resourceList,
				// 触发视图更新
				triggerNumber: state => state.app.triggerNumber
			}),
		},
		mounted() {},
		methods: {
			/**
			 * 多选框改变
			 * @param {Object} val
			 */
			checkChange(val) {
				this.productItem.isChecked = !this.productItem.isChecked
				this.$emit('updateProductItem', this.productItem)
			},
			/**
			 * 计步器改变
			 * @param {Object} val
			 */
			handleNumberChange(val) {
				if(this.isInputNum){
					return
				}
				this.productItem.cartItemQuantity = val
				this.changeCartNum(JSON.parse(val))
				this.$emit('updateProductItem', this.productItem)
			},

			/**
			 * 获取焦点
			 */
			handFocus(e){
				this.isInputNum = true
			},
			
			/**
			 * 失去焦点事件
			 */
			handBlur(val){
				this.changeCartNum(JSON.parse(val))
				this.isInputNum = false
			},

			/**
			 * 修改购物车商品数量
			 */
			changeCartNum(val){
				if(typeof(val) !== "number"){
					return
				}
				const { subItemNo } = this.productItem
				let payload = {
					itemNo:subItemNo,
					itemQuantity:val
				}
				integral.editIntegralCart(payload).then((res)=>{
					// uni.showToast({
					// 	title: '删除成功！'
					// })
				}).catch((err)=>{
					console.log(err)
				})
			},
			
			/**
			 * 跳转详情
			 */
			goToDetail() {
				// 商品详情权限-STOREAPPA0401
				if(!this.resourceList.some((item)=>{return item.resourceNo === 'STOREAPPA0401'})){
					this.$refs.power.show()
					return
				}
				const {subItemNo} = this.productItem;
				this.$store.dispatch('app/setTriggerNumber')
				uni.navigateTo({
					url: '/pages/products/product-detail/product-detail?subItemNo=' + subItemNo
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

		.item-img {
			flex: 0 0 90px;
			margin: 0 10px;
			width: 90px;
			height: 90px;

			.img {
				width: 100%;
				height: 100%;
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

				&.grey {
					color: $uni-text-color-grey;
				}
			}

			.right-bottom {
				position: absolute;
				bottom: 0;
				right: 0;

				.normal {
					display: flex;
					align-items: center;

					.uni-numbox {
						width: auto;
					}
				}
			}
		}
	}
	/deep/.uni-numbox__value{
		width: 50px;
	}
</style>

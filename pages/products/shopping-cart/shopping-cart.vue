<template>
	<view class="page">


		<uni-nav-bar
			left-icon="arrowleft"
			title="购物车"
			:rightText="isManage?'完成':'管理'"
			@clickRight="handleManage"
			@clickLeft="toBack"
			 backgroundColor="#ed6d00"
			 color="#fff"
		  />

		<view class="count">共{{realChildrenList.length}}件商品</view>

		<v-tabs
			v-model="tabIndex"
			:tabs="tabs"
			:scroll="false"
			:lineScale="0.4"
			activeColor="#ed6d00"
			lineColor="#ed6d00"
			height="44px"
			fontSize="32rpx"
			lineHeight="4rpx"
		/>


		<swiper class="swiper-box" :current="tabIndex" duration="300" @change="swiperChange">
			<swiper-item v-for="(item,index) in tabs" :key="index" class="swiper-item ">
				<cartSwiperItem :ref="'cartSwiper'+index" @changeSelected="changeSelected" :type="type"  @downCallBack="downCallBack" :data="cartData.length > 0 ? cartData[index] : []" :isManage="isManage" />
			</swiper-item>
		</swiper>


		<view class="bottom-action">
			<view class="check-wrap" @click="checkAllChange">
				<view class="check-box" :class="isAllChecked ? 'selected' : ''"></view>
				<text class="text">全选</text>
			</view>
			<view class="calc" v-if="!isManage">
				<text>合计:</text>
				<text class="price">￥{{ totalPrice }}</text>
			</view>
			<view class="btn-wrap">
				<button @tap="toOrder" class="cart-btn order" v-if="!isManage">立即下单{{selectedProducts.length>0?'('+selectedProducts.length+')':''}}</button>
				<button @tap="toDelete" class="cart-btn delete" v-else>删除{{selectedProducts.length>0?'('+selectedProducts.length+')':''}}</button>
			</view>
		</view>


		<!-- 对话框 -->
		<uni-popup id="popupDialog" ref="popupDialog" type="dialog">
			<uni-popup-dialog type="warn" title="" :content="message" @confirm="dialogConfirm"></uni-popup-dialog>
		</uni-popup>


		<!-- 库存不足弹框 -->
		<uni-popup ref="storeDialog" type="dialog">
			<view class="d-content">
				<view class="d-header">
					<text class="text">商品库存不足</text>
					<text>超过部分设置为预设商品</text>
				</view>
				<view class="d-con" v-for="(item,index) in storeDialog" :key="index">
					<view class="con-title">{{item.name}}</view>
					<view class="con-block">
						<view v-for="(x,i) in item.list" :key="i" class="con-row">
							<view class="check-box" :class="x.isChecked?'selected':''" @click="changeCheckDialog(x)"></view>
							<view class="row-right">
								<text class="text">{{x.label}}</text>
								<text class="number">{{x.number}}件</text>
							</view>
						</view>
					</view>
				</view>
				<view class="button-group">
					<button class="dialog-button" @click="$refs.storeDialog.close()">取消</button>
					<button class="dialog-button" @click="$refs.storeDialog.close()">确定</button>
				</view>
			</view>
		</uni-popup>


	</view>
</template>

<script>
	import cartSwiperItem from './cart-swiper-item.vue';

	import shoppingCart from '@/api/product/shoppingCart.js'

	export default {
		name: 'shoppingCart',
		components: {
			cartSwiperItem
		},
		data() {
			return {
				systemInfo: uni.getSystemInfoSync(),
				//tab标签列表
				tabs: ['玛吉斯', '非玛吉斯'],
				tabIndex: 0,
				//是否点了管理按钮
				isManage: false,
				//是否全选
				isAllChecked: false,
				//删除信息
				message: '',
				//库存不足弹框
				storeDialog: [
					{
						name: '允许购买商品',
						list: [{
								isChecked: false,
								label: '玛吉斯汽车轮胎MA656 205 5R16 91V逸动XT逸动逸动逸动逸动',
								number: 100
							},
							{
								isChecked: false,
								label: '玛吉斯汽车轮胎MA656 205 5R16 91V逸动XT逸动逸动逸动逸动',
								number: 20
							}
						]
					},
					{
						name: '预定商品',
						list: [{
								isChecked: false,
								label: '玛吉斯汽车轮胎MA656 205 5R16 91V逸动XT逸动逸动逸动逸动',
								number: 30
							},
							{
								isChecked: false,
								label: '玛吉斯汽车轮胎MA656 205 5R16 91V逸动XT逸动逸动逸动逸动',
								number: 5
							}
						]
					}
				],
				// 二维数组 [[], []]  [玛吉斯商品， 非玛吉斯商品]
				cartData: [],
				totalPrice: 0,
				selectedProducts: [],
				type:true
			}
		},
		watch: {
			selectedProducts: {
				handler(newVal, oldVal) {
					if (this.realChildrenList.length === newVal.length && newVal.length > 0) {
						this.isAllChecked = true
					} else {
						this.isAllChecked = false
					}
					this.totalPrice = newVal.reduce((pre, cur) => {
						let onePrice =  Number(cur.itemPrice).mul(Number(cur.cartItemQuantity))
						return Number(pre).add(Number(onePrice))
					}, 0)
				},
				deep: true
			}
		},
		onLoad() {},
		computed:{
			realChildrenList() {
				if (this.cartData.length > 0) {
					return this.cartData[this.tabIndex].filter(x => x.isSaleStatus && x.isItemStock)
				}
				return []
			},
			currentTabData() {
				const { cartData,tabIndex } = this
				if (cartData.length > 0) {
					return cartData[tabIndex]
				}
				return []
			}
		},
		onShow(){
			this.listCartData();
		},
		mounted() {

			// this.listCartData();

			// 不太清楚这个弹框具体业务
			// this.$refs.storeDialog.open()
		},
		methods: {
			listCartData() {

				uni.showLoading({
					title: '加载中'
				});

				shoppingCart.listCart({}).then((res) => {
					if (res.code !== 200) {
						uni.showToast({ title: res.msg, icon:'none', duration: 2000 });
						return
					}
					let { data } = res
					this.storeName = data.storeName
					// 重置选中项
					this.selectedProducts = []
					this.cartData = [data.normalTyreCartRespList || [], data.normalCartRespList || []]
					// this.cartData = [result.a || [], result.b || []]

				}).catch(({ data }) => {
					uni.showToast({ title: data.msg, icon:'none', duration: 2000 });
				}).finally(() => {
					uni.hideLoading();
				})

			},
			countSelectedProducts() {
				this.selectedProducts = this.currentTabData.filter(x => x.isChecked)
			},
			changeSelected() {
				let cartSwiper = this.$refs['cartSwiper' + this.tabIndex][0]
				if (cartSwiper) {
					if (this.isManage) {
						let a = []
						let tempParentList = cartSwiper.cartList
						let tempChildrenList = []
						tempParentList.forEach(x => {
							let products = x.productList || []
							x.isChecked = this.isAllChecked
							a.push.apply(a, products)
						})
						this.selectedProducts = a.filter(x => x.isChecked)
					} else {
						let productList = cartSwiper.cartList[0].productList || []
						this.selectedProducts = productList.filter(x => x.isChecked)
					}
				}
			},
			/**
			 * 切换全选
			 */
			checkAllChange() {
				this.isAllChecked = !this.isAllChecked
				let cartSwiper = this.$refs['cartSwiper' + this.tabIndex][0]
				if (cartSwiper) {
					if (this.isManage) {
						let tempParentList = cartSwiper.cartList
						let tempChildrenList = []
						tempParentList.forEach(x => {
							let products = x.productList || []
							x.isChecked = this.isAllChecked
							products.forEach(v => v.isChecked = this.isAllChecked)
						})
					} else {
						let productList = cartSwiper.cartList[0].productList || []
						productList.forEach(v => v.isChecked = this.isAllChecked)
					}
				}
				cartSwiper.updateProductItem()
			},
			downCallBack(mescroll) {
				shoppingCart.listCart({}).then((res) => {
					if (res.code !== 200) {
						mescroll.endSuccess()
						uni.showToast({ title: res.msg, icon:'none', duration: 2000 });
						return
					}
					let { data } = res
					this.storeName = data.storeName
					this.cartData = [data.normalTyreCartRespList || [], data.normalCartRespList || []]
				}).catch((res) => {
					uni.showToast({ title: res.msg, icon:'none', duration: 2000 });
				}).finally(() => {
					mescroll.endSuccess()
				})
			},
			/**
			 * 去下单
			 */
			toOrder() {
				this.type = true
				if (this.selectedProducts.length < 1) {
					uni.showToast({
						title: '请至少选择一件商品',
						icon: 'none',
						duration: 2000
					});
					return
				}
				this.selectedProducts = this.selectedProducts.map((item)=>{
					return {
						...item,
						isMjsProduct:this.tabIndex === 0
					}
				})
				const data = {
					productList:this.selectedProducts,
					isCart:true,
					totalPrice:this.totalPrice
				}
				// 触发数量视图更新
				this.$store.dispatch('app/setTriggerNumber')
				uni.navigateTo({
					url: `/pages/products/order/confirm`,
					success: function(res) {
						res.eventChannel.emit("sendParams", data);
					}
				})
			},
			/**
			 * 删除
			 */
			toDelete() {
				if (this.selectedProducts.length < 1) {
					uni.showToast({
						title: '请至少选择一件商品',
						icon: 'none',
						duration: 2000
					});
					return
				}
				this.message = `确定要删除这${this.selectedProducts.length}项商品吗`
				this.$refs.popupDialog.open()
			},
			/**
			 * 对话框点击确认按钮
			 */
			dialogConfirm(done) {
				let params = { itemNos: this.selectedProducts.map(x => x.subItemNo) }
				shoppingCart.batchDeleteCart(params).then(({ data }) => {
					if (data.code !== 200) {
						uni.showToast({ title: data.msg, icon:'none', duration: 2000 });
						this.$refs.popupDialog.close()
            return
					}
        }).catch(({ data }) => {
					uni.showToast({ title: data.msg, icon:'none', duration: 2000 });
				}).finally(() => {
				  // 重新查询购物车
          this.listCartData();
					this.$refs.popupDialog.close()
				})
			},
			/**
			 * swipe切换事件
			 * @param {Object} e
			 */
			swiperChange(e) {
				let {
					current
				} = e.target;
				this.tabIndex = current;
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
			 * 点击管理按钮
			 */
			handleManage() {
				this.isManage = !this.isManage
			},
			/**
			 * 库存弹框check
			 */
			changeCheckDialog(item) {
				item.isChecked = !item.isChecked
			}
		},
	}
</script>

<style lang="scss">
	.page {
		height: 100vh;
		overflow-y: hidden;

		.count {
			background-color: $uni-color-primary;
			text-align: center;
			line-height: 30px;
			color: $uni-text-color-inverse;
			font-size: $uni-font-size-sm;
			margin-top: -2px;
			position: relative;
			z-index: 103;
		}

		/deep/.v-tabs__container-item {
			font-weight: 600;
		}

		// swpier
		.swiper-box {
			background-color: #F2F2F2;
			height:100vh;
			height: calc(100vh - 45px - 44px - 28px - var(--status-bar-height) - 60px);
		}

		.check-wrap {
			display: flex;
			align-items: center;

			.text {
				margin-left: 5px;
				font-size: $uni-font-size-base;
			}
		}

		/deep/.check-box {
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

		.bottom-action {
			position: absolute;
			bottom: 0;
			left: 0;
			right:0;
			height: 60px;
			background-color: #fff;
			box-shadow: 0 -1px 0 0 rgba(0,0,0,0.1);
			display: flex;
			padding: 0 10px;
			padding-bottom: env(safe-area-inset-bottom);
			justify-content: space-between;
			align-items: center;

			.calc {
				font-size: $uni-font-size-lg;

				.price {
					color: $uni-color-primary;
				}
			}

			.cart-btn {
				height: 36px;
				min-width: 100px;
				text-align: center;
				line-height: 36px;
				color: #fff;
				background-color: $uni-color-primary;
				border-radius: 44px;
				font-size: $uni-font-size-base;
			}
		}
	}

	/*库存不足弹框*/
	.d-content {
		max-height: 70vh;
		overflow: auto;
		background-color: #fff;
		width: 84vw;
		border-radius: 10px;
		font-size: $uni-font-size-base;

		.d-header {
			padding: 10px 0;
			text-align: center;
			line-height: 20px;
			border-bottom: 1px solid $uni-border-color;

			.text {
				display: block;
			}
		}

		.con-title {
			line-height: 30px;
			padding-left: 10px;
		}

		.con-block {
			border: 1px solid $uni-border-color;
			border-radius: $uni-border-radius-lg;
			margin: 5px 10px;

			.con-row {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				padding: 10px 10px 0;

				.row-right {
					flex: 1;
					margin-left: 5px;

					.text {
						overflow: hidden;
						font-size: $uni-font-size-sm;
						color: $uni-text-color;
						text-overflow: ellipsis;
						word-break: break-all;
						display: -webkit-box;
						-webkit-line-clamp: 2; //多行在这里修改数字即可
						/* autoprefixer: ignore next */
						-webkit-box-orient: vertical;
					}

					.number {
						font-size: $uni-font-size-sm;
						color: $uni-color-primary;
					}
				}
			}
		}

		.button-group {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 10px;
			margin: 15px 0;

			.dialog-button {
				background-color: #ffffff;
				border: 1px solid #ed6d00;
				height: 36px;
				color: #ed6d00;
				flex: 0 0 44%;
				font-size: $uni-font-size-base;
				border-radius: 20px;

				&:last-of-type {
					background-color: #ed6d00;
					color: #fff;
				}
			}
		}
	}
</style>

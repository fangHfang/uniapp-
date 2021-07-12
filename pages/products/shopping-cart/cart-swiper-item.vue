<template>
	<mescroll-uni
		ref="mescrollRef"
		@init="mescrollInit"
		class="mescroll-uni"
		:top="pageOptions.mescrollTop"
		:bottom="pageOptions.mescrollBottom"
		safearea
		:down="downOption"
		@down="downCallBack"
		:up="upOption"
	 >

		<view class="cart-list">
			<view class="item-wrap" v-for="(item,index) in cartList.filter(x => x.productList.length > 0)" :key="'cartList-' + index">

				<!-- <view class="item-header">
					<view v-if="isManage || item.tags===''" class="check-box" :class="item.isChecked ? 'selected' : ''" @click="checkChange(item)"></view>
					<view>
						<text class="iconfont mendian" :class="item.tags===''?'red':''"></text>
						<text class="title">{{ storeName }}</text>
					</view>
				</view> -->

				<productItem v-for="(product,i) in item.productList" :key="'productList-' + i" :productItem="product" :isManage="isManage" :type="type" @updateProductItem="(val) => { updateProductItem(val, index, i) }"></productItem>

				<view class="">
					<uni-tag size="small" class="tag" :text="item.tags" :class="item.tags==='已下架'?'red':'grey'" />
				</view>

			</view>
		</view>

	</mescroll-uni>
</template>

<script>
	import productItem from './product-item.vue';
	export default {
		components: {
			productItem
		},
		props: {
			isManage: {
				type: Boolean,
				default: false
			},
			storeName: {
				type: String,
				default: "无"
			},
			data: {
				type: Array,
				default: () => []
			},
			type:{
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				upOption: {
					use: false
				},
				downOption: {
					auto: false
				},
				// 页面配置
				pageOptions: {
					// 适配刘海屏
					mescrollTop: 0,
					mescrollBottom: 0
				},
				cartList: []
			}
		},
		watch: {
			data(val) {
				this.cartList = this.getCartList(val)
			},
			cartList(val) {
				// console.log(val)
			}
		},
		mounted() {

		},
		methods: {
			getCartList(data) {

				// 正常商品
				let normalList = data.filter(x => x.isSaleStatus && x.isItemStock)
				// 售罄 （无库存， 没下架）
				let sellOutList = data.filter(x => x.isSaleStatus && !x.isItemStock).map(item => {
					item.showCheckBox = false
					return item;
				})
				// 下架商品
				let offShelfList = data.filter(x => !x.isSaleStatus).map(item => {
					item.showCheckBox = false
					return item;
				})
				return [
					{
						storeTitle: this.storeName,
						tags: '',
						isChecked: false,
						productList: normalList.map(item => {
							item.showCheckBox = true
							return item;
						})
					},
					{
						storeTitle: this.storeName,
						tags: '已售罄',
						isChecked: false,
						productList: sellOutList.map(item => {
							item.showCheckBox = false
							return item;
						})
					},
					{
						storeTitle: this.storeName,
						tags: '已下架',
						isChecked: false,
						productList: offShelfList.map(item => {
							item.showCheckBox = false
							return item;
						})
					}
				]
			},
			updateProductItem(product, index, i) {
				let list = JSON.stringify(this.cartList)
				this.cartList = JSON.parse(list)
				this.$emit('changeSelected')
			},
			/**
			 * 选中门店
			 * @param {Object} val
			 */
			checkChange(item) {
				item.isChecked = !item.isChecked
				item.productList.forEach(x => x.isChecked = item.isChecked)
				let list = JSON.stringify(this.cartList)
				this.cartList = JSON.parse(list)
				this.$emit('changeSelected')
			},
			/**
			 * 下拉刷新回调
			 */
			downCallBack() {
				this.$emit('downCallBack', this.mescroll);
				// setTimeout(() => {
				// 	//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
				// 	this.mescroll.endSuccess();
				// }, 1000)
			},
		}
	}
</script>

<style lang="scss">
	.cart-list {
		padding: 10px 10px 0;
		overflow: hidden;

		.item-wrap {
			background-color: #fff;
			margin-bottom: 10px;
			position: relative;

			.uni-tag {
				position: absolute;
				top: 0;
				right: 0;

				/deep/span {
					color: #fff;
				}

				&.red {
					background-color: #e30003;
				}

				&.grey {
					background-color: #676767;
				}
			}

			.item-header {
				padding-left: 10px;
				line-height: 36px;
				display: flex;
				justify-content: flex-start;
				align-items: center;

				.iconfont {
					margin: 0 10px;
					&.red{
						color:$uni-color-primary;
					}
				}
			}
		}
	}
</style>

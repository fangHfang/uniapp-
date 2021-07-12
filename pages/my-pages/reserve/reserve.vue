<template>
	<view class="page">
		<uni-nav-bar
			left-icon="arrowleft"
			title="预定商品"
			@clickLeft="toBack"
			 backgroundColor="#ed6d00"
			 color="#fff"
		  />
		<v-tabs
			v-model="tabIndex"
			:tabs="tabs"
			:scroll="false"
			:lineScale="0.4"
			activeColor="#ed6d00"
			lineColor="#ed6d00"
			height="44px"
			field="name"
			fontSize="32rpx"
			lineHeight="4rpx"
			@change="changeTab"
		/>
		<swiper
			class="swiper-box" 
			:current="tabIndex"
			duration="300" 
			@change="swiperChange">
			<swiper-item 
				v-for="(item,index) in tabs" 
				:key="index" 
				class="swiper-item ">
				<cartSwiperItem 
					:ref="'cartSwiper'+index"  
					:i="index"
					:index="tabIndex" 
					:tabs="tabs"/>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import cartSwiperItem from './cart-swiper-item.vue';
	export default {
		name: 'reserve',
		components: {
			cartSwiperItem
		},
		data() {
			return {
				systemInfo: uni.getSystemInfoSync(),
				//tab标签列表
				tabs: [
					{name:'可购买',presellStatus:1},
					{name:"等待通知",	presellStatus:0},
				],
				tabIndex: 0,
			}
		},
		onLoad() {},
		computed:{},
		mounted() {
		},
		methods: {
			/**
			 * swipe切换事件
			 * @param {Object} e
			 */
			swiperChange(e) {
				let { current } = e.target;
				this.tabIndex = current;
			},
			/**
			 * tab切换事件
			 */
			changeTab(index) {
				this.tabIndex = index;
			},
			/**
			 * 返回上一级页面
			 */
			toBack() {
				uni.navigateBack({
					delta: 1
				})
			},
		},
	}
</script>

<style lang="scss">
	.page {
		height: 100vh;
		overflow-y: hidden;

		/deep/.v-tabs__container-item {
			font-weight: 600;
		}

		// swpier
		.swiper-box {
			background-color: #F2F2F2;
			height: calc(100vh - 45px - 44px - var(--status-bar-height)  - env(safe-area-inset-bottom));
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

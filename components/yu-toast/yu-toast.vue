<template>
	<view>
		<view v-if="showStatus" class="yu-toast-container active" :class="verticalAlign" :style="verticalAlign === 'center' ? verticalCenterStyle : ''">
			<view class="yu-toast-message" :style="messageStyle">
				<text v-if="message1">{{message1}}</text>
				<text v-if="message2">{{message2}}</text>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		name: 'yu-toast',
		props: {
			// 第一行信息
			message1: {
				type: String,
				default: ''
			},
			// 第二行信息
			message2: {
				type: String,
				default: ''
			},
			duration: {
				type: Number,
				default: 2000
			},
			verticalAlign: {
				type: String,
				default: 'bottom'
			},
			backgroundColor: {
				type: String,
				default: '#000000'
			},
			color: {
				type: String,
				default: '#FFFFFF'
			}
		},
		data() {
			return {
				showStatus: false
			};
		},
		computed: {
			verticalCenterStyle() {
				const value = uni.getSystemInfoSync().screenHeight / 2;
				return `bottom: ${value}px;`;
			},
			messageStyle() {
				return `background-color: ${this.backgroundColor};color: ${this.color};display: flex;flex-direction: column;`;
			}
		},
		methods: {
			show() {
				this.showStatus = true;
				setTimeout(() => {
					this.showStatus = false;
				}, this.duration);
			}
		}
	}
</script>
<style>
	.yu-toast-container {
		position: fixed;
		z-index: 9999;
		line-height: 18px;
		opacity: 0;
		width: 100%;
		display: flex;
		justify-content: center;
		left: 0;
	}

	.yu-toast-container.top {
		/* #ifdef H5 */
		top: 88px;
		/* #endif */
		/* #ifndef H5 */
		top: 44px;
		/* #endif */
	}

	.yu-toast-container.bottom {
		bottom: 50px;
	}

	.yu-toast-container.active {
		opacity: 1;
	}

	.yu-toast-message {
		padding: 60rpx 120rpx;
		font-size: 28upx;
		text-align: center;
		border-radius: 6px;
	}
</style>

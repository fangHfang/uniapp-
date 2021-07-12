<template>
	<view class="page" :style="`height:${systemInfo.windowHeight}px`">
		<uni-nav-bar title="修改号码" left-icon="back" backgroundColor="#ed6d00" color="#fff" @clickLeft="toBack" />
		<view class="card-box">
			<text class="card-header">{{card.title}}</text>
		</view>
		<view class="content">
			<view class="content-num">当前绑定的手机号码：{{card.num}}</view>
			<input class="num-inp" :class="[!isSure ? 'sure-color' : '']" v-model="phoneNum" :focus="focus" type="number" value=""
			 placeholder="请输入您要绑定的手机号码" @input="replaceInput('phoneNum')" />
			<view class="verification flex a-center j-space-between">
				<input class="num-inp inp-left" :class="[!isCode ? 'sure-color' : '']" v-model="code" :focus="focus" type="number"
				 value="" placeholder="请输入验证码" @input="replaceInput('code')" />
				<button v-if="!isSeccess" class="verification-btn" type="default" @click="getCode">获取验证码</button>
				<button v-else class="verification-btn flex-column" type="default">
					<view class="">
						获取验证码
					</view>
					<view class="">
						({{count}}s)
					</view>
				</button>
			</view>
		</view>
		<view class="page-bottom" :style="`height:${safeArea.bottom + 70}px`" @click="confirm">
			<text class="buttom-btn" :style="`margin-bottom:${safeArea.bottom}px`">确定</text>
		</view>
		<uni-popup ref="popup" type="center" class="popup-tips">
			<view class="popup-content" :class="[popRight ? 'seccess-color' : '']">{{popMessage}}</view>
		</uni-popup>
	</view>
</template>

<script>
	import system from '@/api/system/system.js'
	export default {
		name: 'modify',
		data() {
			return {
				systemInfo: uni.getSystemInfoSync(),
				card: {
					title: '规则：您绑定的号码必须和经销商后台维护的资料中的法人联系电话号码一致，否则，您将不能购买经销商旗下的商品（活动可以照常购买）以及查看数据。建议您更换绑定手机号码的同时也通知经销商',
					num: uni.getStorageSync('currentPhone')
				},
				focus: false,
				phoneNum: '',
				code: '',
				isSeccess: false,
				popRight: false,
				// 发送验证码等待的时间
				count: '',
				// 提示信息
				popMessage: '',
				// 手机号码输入是否正确
				isSure: true,
				// 验证码输入是否正确
				isCode: true,
				//定时器
				timer: null,
			}
		},
		computed: {
			//安全区域
			safeArea() {
				return this.systemInfo.safeAreaInsets
			}
		},
		onShow() {
			console.log('刷新啦')
		},
		mounted() {
			this.focus = true
		},
		methods: {
			/**
			 * 返回上一页
			 */
			toBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			/**
			 * 修改时时触发
			 * @param {Object} e---输入框的值
			 */
			replaceInput(title) {
				if (title === 'phoneNum') {
					this.isSure = true
				} else if (title === 'code') {
					this.isCode = true
				}
			},
			/**
			 * 验证码倒计时
			 */
			countCode() {
				const count = 60;
				if (!this.timer) {
					this.count = count;
					this.timer = setInterval(() => {
						if (this.count > 0 && this.count <= count) {
							this.count--;
						} else {
							clearInterval(this.timer);
							this.timer = null;
							this.isSeccess = false
						}
					}, 1000)
				}
			},
			/**
			 * 验证手机号
			 */
			checkPhone() {
				const reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
				if (!this.phoneNum) {
					this.popMessage = '请输入手机号码'
					this.isSure = false
					this.popRight = false
					this.$refs.popup.open()
					setTimeout(() => {
						this.$refs.popup.close()
					}, 2000)
					return false
				} else if (!reg.test(this.phoneNum)) {
					this.popMessage = '手机号码格式不正确\n请重新输入！'
					this.isSure = false
					this.popRight = false
					this.$refs.popup.open()
					setTimeout(() => {
						this.$refs.popup.close()
					}, 2000)
					return false
				} else if (this.phoneNum===this.card.num) {
					this.popMessage = '手机号已被绑定\n请选择其他手机号！'
					this.isSure = false
					this.popRight = false
					this.$refs.popup.open()
					setTimeout(() => {
						this.$refs.popup.close()
					}, 2000)
					return false
				}
				return true
			},
			/**
			 * 获取验证码
			 */
			getCode() {
				let check = this.checkPhone()
				if (check) {
					this.userSendCode()
				}
			},

			/**
			 * 发送验证码
			 */
			userSendCode() {
				let postData = {
					phone: this.phoneNum
				}
				system.userSendCode(postData).then((res) => {
					if (res.code === 200) {
						this.popMessage = '短信验证码已发送！'
						this.isSeccess = true
						this.popRight = true
						this.isSure = true
						this.countCode()
						this.$refs.popup.open()
						setTimeout(() => {
							this.$refs.popup.close()
						}, 2000)
					} else {
						uni.showToast({
							icon: "none",
							title: res.msg
						})
					}
				}).catch((err) => {
					uni.showToast({
						icon: "none",
						title: "验证码发送失败"
					})
				})
			},

			/**
			 * 点击确认按钮触发
			 */
			confirm() {
				let _this = this
				let check = this.checkPhone()
				if (check) {
					if (!this.code) {
						this.popMessage = '请输入验证码！'
						this.isCode = false
						this.popRight = false
						this.$refs.popup.open()
						setTimeout(() => {
							this.$refs.popup.close()
						}, 2000)
					} else {
						let postData = {
							phone: this.phoneNum,
							smsCode: this.code
						}
						system.userModifyPhone(postData).then((res) => {
							if (res.code === 200) {
								uni.showToast({
									icon: "success",
									title: '修改成功'
								})
								setTimeout(() => {
									_this.toBack()
								}, 1200)
							} else {
								this.popMessage = res.msg
								this.isCode = false
								this.popRight = false
								this.$refs.popup.open()
								setTimeout(() => {
									this.$refs.popup.close()
								}, 2000)
							}
						}).catch((err) => {
							this.popMessage = err.msg
							this.isCode = false
							this.popRight = false
							this.$refs.popup.open()
							setTimeout(() => {
								this.$refs.popup.close()
							}, 2000)
						})
					}
				}
			}
		}
	}
</script>

<style lang="scss">
	.page {
		background-color: #fff;
		position: relative;
		overflow: hidden;
	}

	.card-box {
		background: #F2F2F2;
		padding: 25px 10px;
		color: $uni-text-color;
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		/* #endif */
	}

	.card-header {
		font-size: $uni-font-size-base;
		line-height: 20px;
		color: #666666;
	}

	.content {
		padding: 18px 10px;
	}

	.content-num {
		color: #1C1C1C;
		font-size: 13px;
		font-weight: bold;
	}

	.num-inp {
		height: 48px;
		font-size: 13px;
		margin-top: 35px;
		padding: 0 20px;
		background: #F2F2F2;
		border: 2rpx solid #E5E5E5;
		border-radius: 3px;
	}

	.verification {
		width: 100%;
		margin-top: 15px;
	}

	.inp-left {
		width: calc(100% - 100px - 40px);
		margin-top: 0;
	}

	.verification-btn {
		width: 90px;
		height: 50px;
		color: #fff;
		font-size: 15px;
		font-weight: bold;
		margin-left: 10px;
		margin-right: 0;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #ed6d00;
		border-radius: 3px;
		line-height: 18px;
	}

	.page-bottom {
		background-color: #fff;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 0 10px;
		border-top: 1rpx solid #B6B6B6;
	}

	.buttom-btn {
		height: 40px;
		line-height: 40px;
		text-align: center;
		border-radius: 40px;
		background-color: $uni-color-primary;
		color: #fff;
		position: absolute;
		top: 15px;
		left: 10px;
		right: 10px;
		font-size: $uni-font-size-base;
	}

	.popup-tips {
		/deep/ .uni-transition {
			display: none;
		}

		.popup-content {
			width: 200px;
			height: 75px;
			white-space: pre;
			text-align: center;
			display: flex;
			color: #ed6d00 !important;
			font-size: 13px;
			align-items: center;
			justify-content: center;
			color: rgba(0, 0, 0, 0.8);
			border-radius: 5px;
			background: rgba(0, 0, 0, 0.8);
		}

		.seccess-color {
			color: #00B60D !important;
		}
	}

	.sure-color {
		color: #FF0000;
	}
</style>

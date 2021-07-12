<template>
	<view class="page">
		<uni-nav-bar fixed statusBar id="navBar" :title="info.name" left-icon="back" backgroundColor="#ed6d00"
			color="#fff" @clickLeft="toBack" :right-icon="info.rightIconUrl?'paperclip':''"
			@clickRight="info.rightIconUrl?toUrl(info.rightIconUrl):''"></uni-nav-bar>

		<view class="font-box">
			<text :class="flash ? 'shandian icon iconfont':'jingyongshandian icon iconfont' " @click="toFlash"></text>
			<text class="font">{{info.dec}}</text>
			<text class="font-red" v-if="info.mark!=='phone'" @click="confirmDialog">手动输入条码</text>
		</view>

		<!-- 手动输入编码核销弹窗 -->
		<!-- 提交信息 -->
		<uni-popup ref="dialogInput" type="dialog" @change="popupChange" :maskClick="false">
			<uni-popup-dialog mode="input" title="手动输入条码" value="" placeholder="请输入" @confirm="dialogInputConfirm">
			</uni-popup-dialog>
		</uni-popup>

	</view>
</template>

<script>
	import permision from "@/common/utils/permission.js"
    const sunmiScan = uni.requireNativePlugin('Scan');
	export default {
		onLoad(option) {
			const {
				...a
			} = option
			this.info = a
		},
		components: {},
		data() {
			return {
				// 扫码页面显示信息
				info: {},
				// 闪光灯
				flash: false,
				// 手动输入条码信息
				value: null,
				systemInfo: uni.getSystemInfoSync(),
				topHeight: 60,
				barcode: null,
				once: 0,
				doing: false
			}
		},
		computed: {},
		created() {},
		mounted() {
			this.countTopBar()
		},
		onShow() {
			// #ifdef APP-PLUS
			  //这里判断一下设备及版本。
		  	  sunmiScan.bindService()
			  if(uni.getSystemInfoSync().platform=='android' &&  sunmiScan.getScannerModel().code > 100){

			  }else{
                if (this.once !== 0 && !this.barcode) {
                  this.scanplus();
                }
                if (this.barcode && !this.doing) {
                  this.barcode.start()
                  this.doing = true
                }
			  }
			// #endif
		},
		onHide() {
			if (this.barcode) {
				this.barcode.cancel()
				this.doing = false
			}
		},
		destroyed() {},
		methods: {
			/**
			 * 计算顶部DOM元素节点
			 */
			async countTopBar() {
				const topBar = await this.$getComponentsDom('#navBar');
				this.topHeight = topBar.height
				// #ifdef APP-PLUS
				  //这里判断一下设备及版本。
				  if(uni.getSystemInfoSync().platform=='android' &&  sunmiScan.getScannerModel().code > 100){
					sunmiScan.onScanListener({num1:1}, res => {
					  that.dialogInputConfirm("1",res.code)
					});
				  }else{
					this.scanplus();
				  }
				// #endif
			},
			// #ifdef APP-PLUS
			async checkPermission(code) {
				let status = permision.isIOS ? await permision.requestIOS('camera') :
					await permision.requestAndroid('android.permission.CAMERA');
				if (status === null || status === 1) {
					status = 1;
				} else {
					uni.showModal({
						content: "需要相机权限",
						confirmText: "设置",
						success: function(res) {
							if (res.confirm) {
								permision.gotoAppSetting();
							}
						}
					})
				}
				return status;
			},
			// #endif
			async scanplus() {
				var that = this
				let status = await this.checkPermission();
				if (status !== 1) {
					return;
				}
				that.barcode = await this.createBarcode();
				that.barcode.setFlash(false)
				that.barcode.start() //开始识别二维码  
				that.once++
				that.doing = true
				// 扫码成功后进行的事件 
				that.barcode.onmarked = function(type, code, file) {
					that.success(code)
				}
				// 扫码失败后进行的事件 
				that.barcode.onerror = function(error) {
					uni.showToast({
						icon: 'none',
						title: error.message
					})
					setTimeout(() => {
						that.toBack()
					}, 500)
				}
			},
			// 创建Barcode扫码控件
			async createBarcode() {
				let that = this
				const currentWebview = that.$mp.page.$getAppWebview() || that.$scope.$getAppWebview();
				// #ifdef APP-PLUS  
				let barcode = null;
				if (!barcode) {
					barcode = plus.barcode.create('barcode', [plus.barcode.QR, plus.barcode.CODE128], {
						top: that.topHeight + 'px',
						left: '0px',
						width: '100%',
						height: '450px',
						frameColor: '#ed6d00',
						scanbarColor: '#ed6d00',
						position: 'static'
					});
					currentWebview.append(barcode);
				}
				// #endif
				return barcode;
			},
			/**
			 * 成功加载扫码
			 * */
			success(code) {
				let that = this
				// 此处判断是否是扫码退货，区分调接口返回，或者跳转页面
				if (that.info.confirmTo === '/pages/work/return/add') {
					that.$store.dispatch('work/getRefundProductByCode', {
						barCode: code
					}).then(() => {
						that.toBack()
					}).catch((err) => {
						setTimeout(() => {
							this.barcode && this.barcode.close()
							this.barcode = null
							//返回并刷新
							let pages = getCurrentPages();
							let beforePage = pages[pages.length - 2]
							uni.navigateBack({
								delta: 1,
								success: function() {
									that.barcode && that.barcode.close()
									// #ifdef APP-PLUS
									beforePage.$vm.setRemarkShake()
									// #endif
									// #ifndef APP-PLUS
									beforePage.setRemarkShake()
									// #endif
								}
							});
						}, 1500)
					})
				} else if (that.info.confirmTo === '/pages/work/delivery/index') {
					//扫码出库
					if (that.info.mark === 'list') {
						that.$store.dispatch('work/getOutInfoEaseOrder', {
							barCode: code
						}).then(() => {
							that.toBack()
						}).catch(() => {
							setTimeout(() => {
								that.toBack()
							}, 500)
						})
					} else if (that.info.mark === 'phone') {
						console.log(code)
						try {
							let user = {}
							// 法1
							// let user = JSON.parse(code) || {}

							// 法2
							user = (new Function('', 'return ' + code))()

							// 法3
							if (!user.phone) {
								let tempCode= (code + '').replace(/\"/g, '');
								let formatCode=tempCode.substring(1,tempCode.length-1);
								let arr = formatCode.split(',');
								console.log('法2无效了'+arr)
								user = {
									userNo: arr[0] && arr[0].split(':')[1],
									userName: arr[1] && arr[1].split(':')[1],
									phone: arr[2] && arr[2].split(':')[1]
								}
							}

							console.log(user)
							that.$store.commit('work/setCarMasterPhone', user)
							that.toBack()
						} catch (err) {
							console.log(err)
							uni.showToast({
								title: '车主信息有误，扫码失败',
								icon: 'none'
							})
							setTimeout(() => {
								that.toBack()
							}, 500)
						}
					}
				} else if (that.info.confirmTo === '/pages/work/renew/detail/renew-detail') {
					//扫码出库
					if (that.info.mark === 'list') {
						that.$store.dispatch('work/getOutInfoRenewOrder', {
							barCode: code
						}).then(() => {
							that.toBack()
						}).catch(() => {
							setTimeout(() => {
								that.toBack()
							}, 500)
						})
					}
				} else {
					this.barcode && this.barcode.close()
					this.barcode = null
					const url = that.info.confirmTo + '?code=' + code
					uni.redirectTo({
						url
					})
					return
				}
			},
			/**
			 * 开启/关闭闪光灯
			 * */
			toFlash: function() {
				this.flash = !this.flash
				this.barcode.setFlash(this.flash)
			},
			/**
			 * 打开提交信息
			 */
			confirmDialog() {
				this.$refs.dialogInput.open()
			},
			popupChange(e) {
				if (e.show) {
					this.barcode && this.barcode.close()
					this.barcode = null
				} else {
					// #ifdef APP-PLUS
					this.scanplus();
					// #endif
				}
			},
			/**
			 * 输入对话框的确定事件
			 */
			dialogInputConfirm(done, val) {
				const url = this.info.confirmTo
				this.value = val
				this.$refs.dialogInput.close()
				// 扫码页 手动输入条码后 要跳转的指定页面
				// 此处判断是否是扫码退货，区分调接口返回，或者跳转页面
				if (this.info.confirmTo === '/pages/work/return/add') {
					this.$store.dispatch('work/getRefundProductByCode', {
						barCode: val
					}).then(() => {
						this.toBack()
					})
				} else if (this.info.confirmTo === '/pages/work/delivery/index') {
					//扫码出库
					this.$store.dispatch('work/getOutInfoEaseOrder', {
						barCode: val
					}).then(() => {
						this.toBack()
					})
				} else if (this.info.confirmTo) {
					// this.barcode && this.barcode.close()
					// this.barcode = null
					const url = this.info.confirmTo + '?code=' + this.value
					uni.redirectTo({
						url
					})
				} else {
					// 默认可不传（不传 则navigateBack)
					this.toBack()
				}

			},
			/**
			 * 返回上一级页面
			 */
			toBack() {
				this.barcode && this.barcode.close()
				this.barcode = null
				uni.navigateBack({
					delta: 1
				})
			},
			/**
			 * 右侧按钮点击事件
			 */
			toUrl(url) {
				// this.barcode && this.barcode.close()
				// this.barcode = null
				uni.navigateTo({
					url,
					success() {
						this.barcode && this.barcode.close()
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		position: relative;
	}

	.font-box {
		position: fixed;
		left: 0;
		right: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
		flex-direction: column;
		width: 100%;
		bottom: calc(100vw/2 - 90px);
	}

	.ziconfont {
		font-family: ziconfont;
	}

	.icon {
		text-align: center;
		line-height: 60rpx;
		color: #fff;
		font-size: 32rpx;
		width: 160rpx;
		height: 60rpx;
		margin-bottom: 20rpx;
		border-radius: 80rpx;
	}

	.shandian {
		background-color: #ed6d00;
	}

	.jingyongshandian {
		background-color: #ddd;
	}

	.font {
		color: #999;
		margin-bottom: 20rpx;
		font-size: 24rpx
	}

	.font-red {
		color: #ed6d00;
		font-size: 24rpx;
		text-decoration: underline;
	}

	.barcode {
		border-radius: 20px;
	}
</style>

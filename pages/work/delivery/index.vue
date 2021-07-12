<template>
	<view class="page">
		<uni-nav-bar fixed statusBar id="navBar" title="扫码出库" rightText="暂存记录" left-icon="back"
			backgroundColor="#ed6d00" color="#fff" @clickLeft="toBack" @clickRight="toHistory"></uni-nav-bar>
		<text class="box-title-text">商品信息</text>
		<view v-if="outInfoList.length">
			<uni-swipe-action>
				<uni-swipe-action-item class="list-item" v-for="(item,index) in outInfoList" :key="index">
					<view class="body-box">
						<view class="item-head">
							<text class="name-text">{{item.dealerName}}</text>
						</view>
						<view class="item-body">
							<view class="flex j-space-between">
								<text class="sb-item-text">条码编码：</text>
								<text class="sb-item-text">{{item.itemBarCode}}</text>
							</view>
							<view class="flex j-space-between">
								<text class="sb-item-text">花纹规格：</text>
								<text class="sb-item-text">{{item.itemSpecDetail}}</text>
							</view>
							<view class="flex j-space-between">
								<text class="sb-item-text">周期：</text>
								<!-- <text class="sb-item-text">{{item.period || ''}}</text> -->
								<input @blur="e=>periodBlur(e,item)" :maxlength="4" v-model="item.period"
									class="sb-item-text sb-input" type="number" placeholder="请输入轮胎周期" />
							</view>
						</view>
					</view>
					<template v-slot:right>
						<view class="del" @click="deleteOutInfo(item)"><text>删除</text></view>
					</template>
				</uni-swipe-action-item>
			</uni-swipe-action>
			<view class="add-box">
				<view class="add-again-btn" @click="openBarCode">
					<uni-icons type="plusempty" color="#ed6d00" size="14"></uni-icons>
					<text class="add-again">继续添加</text>
				</view>
			</view>
		</view>
		<view v-else class="list-item">
			<view class="body-box">
				<view class="item-head">
					<text class="name-text">玛吉斯轮胎</text>
				</view>
				<view class="item-body barcode-box" @click="openBarCode">
					<image class="barcode-img" src="../../../static/image/work/sm-img@3x.png">
						<text class="barcode-text">点此扫描轮胎条码</text>
				</view>
			</view>
		</view>

		<text class="box-title-text">订单信息</text>

		<form>
			<view class="form-item">
				<view class="form-item-head">
					<text class="text-primary">车主手机号 *</text>
					<text class="text-gray">请扫描车主信息码进行识别</text>
				</view>
				<view class="barcode-form-box">
					<input :value="carInfo.phone" class="form-input disabled" name="input" disabled />
					<view class="barcode-btn-box" @click="openBarCode('phone')">
						<uni-icons type="scan" color="#fff" size="18"></uni-icons>
						<text class="btn-text">扫描</text>
					</view>
				</view>
			</view>
			<view class="form-item">
				<view class="form-item-head">
					<text class="text-primary">车牌号 *</text>
				</view>
				<view class="barcode-form-box">
					<input :value="carInfo.carNumber" class="form-input disabled" name="input" disabled />
					<view class="barcode-btn-box" @click="getCarNumber('carNumber')">
						<uni-icons type="scan" color="#fff" size="18"></uni-icons>
						<text class="btn-text">扫描</text>
					</view>
				</view>
			</view>
			<view class="form-item">
				<view class="form-item-head">
					<text class="text-primary">车架号 *</text>
				</view>
				<view class="barcode-form-box">
					<input :value="carInfo.carFrame" class="form-input disabled" name="input" disabled />
					<view class="barcode-btn-box" @click="openScan('vin')">
						<uni-icons type="scan" color="#fff" size="18"></uni-icons>
						<text class="btn-text">扫描</text>
					</view>
				</view>
			</view>
			<view class="form-item item-row">
				<view class="img-view-box" @click="previewImage(carInfo.img)">
					<image class="img-view" v-if="carInfo.img" :src="carInfo.img" />
					<image class="img-view" v-else src="aaa" />
					<uni-icons v-if="carInfo.img" class="show-icon" type="search" color="#fff" size="18">
					</uni-icons>
				</view>
				<text class="tips-text">车架号缩略图</text>
			</view>
			<view class="form-item">
				<view class="form-item-head">
					<text class="text-normal">车型</text>
				</view>
				<view class="barcode-form-box">
					<input :value="carInfo.carDec" class="form-input disabled" name="input" disabled />
				</view>
			</view>
			<view class="fixed-buttom-box">
				<button class=" flex a-center j-center fixed-buttom-btn black-skin"
					:style="`border-radius:${systemInfo.windowWidth/2}px;margin-right:5px;`" @click="tempSubmit"
					:disabled="btnDisabled">暂存</button>
				<button class=" flex a-center j-center fixed-buttom-btn"
					:style="`border-radius:${systemInfo.windowWidth/2}px;margin-left:5px;`" @click="submit"
					:disabled="btnDisabled">完成</button>
			</view>
		</form>
		<uni-popup ref="selectPopup" type="bottom">
			<view class="action-box">
				<button class="zbtn take" @click="openScan('carNumber')">拍照扫描车牌</button>
				<button class="zbtn hand" @click="confirmDialog">手动输入车牌</button>
				<button class="zbtn bye" @click="cancelSelectPopup">取消</button>
			</view>
		</uni-popup>
		<!-- 提交信息 -->
		<uni-popup ref="dialogInput" type="dialog" :maskClick="false">
			<uni-popup-dialog mode="input" title="手动输入车牌" value="" placeholder="请输入" @confirm="dialogInputConfirm">
			</uni-popup-dialog>
		</uni-popup>
		<view class="applets">
			<image class="img" src="../../../static/image/work/applets.png" mode="aspectFill" @click="toApplets">
			</image>
		</view>
	</view>
</template>

<script>
	import {
		upLoadURL
	} from '@/static/base/system-constant.js'
	import AjaxUtil from "@/common/utils/request.js"
	import order from '@/api/ease/order.js'
	import {
		mapState
	} from 'vuex'
	export default {
		onLoad() {},
		components: {},
		data() {
			return {
				systemInfo: uni.getSystemInfoSync(),
				// 是否暂存
				limitSave: true,
				warehouseOutNo: '',
				vinInfo: {
					carNumber: '',
					carFrame: '',
					carDec: '',
					img: ''
				},
				mark: '',
				btnDisabled: false,
				//周期合法
				periodValid: true
			}
		},
		watch: {
			carInfo: {
				handler() {
					// 重新监测
					this.checkForm();
				},
				deep: true
			},
			outInfoList: {
				handler() {
					this.checkForm();
				},
				deep: true
			},
		},
		computed: {
			outInfoList() {
				return this.$store.state.work.outInfoList
			},
			carInfo() {
				return {
					phone: this.$store.state.work.outCarMaster.phone,
					carNo: this.$store.state.work.outCarMaster.userNo,
					carName: this.$store.state.work.outCarMaster.userName,
					...this.vinInfo
				}
			},
			...mapState({
				// 门店集合
				storeList: state => state.login.storeList,
				// 门店选中下标
				storeIndex: state => state.login.storeIndex
			}),
		},
		//路由传值
		onLoad(option) {
			this.$store.commit('work/setOutInfoList', [])
			this.$store.commit('work/setCarMasterPhone', {})
			this.warehouseOutNo = option.warehouseOutNo || ''
			if (this.warehouseOutNo) {
				this.orderNoDetail(this.warehouseOutNo, option.mark)
			}
		},
		mounted() {
			this.checkForm()
		},

		methods: {
			/**
			 * 周期输入框失去焦点
			 */
			periodBlur(e, item) {
				let val = e.detail.value
				item.period = (val + '').replace(/[^0-9]/g, '');
				this.checkPeriod(item.period)
			},
			checkPeriod(val) {
				let reg = /^[0-9]*$/;
				if (!val) {
					uni.showToast({
						title: '请输入轮胎周期',
						icon: 'none'
					})
					this.periodValid = false
					return true
				}
				if (!reg.test(val)) {
					uni.showToast({
						title: '请输入正确的轮胎周期',
						icon: 'none'
					})
					this.periodValid = false
					return true
				} else {
					if ((val + '').length === 4) {
						this.periodValid = true
						return false
					} else {
						uni.showToast({
							title: '轮胎周期应该为4位数字',
							icon: 'none'
						})
						this.periodValid = false
						return true
					}
				}
			},
			/**
			 * 清空数据
			 * @param {Object} mark
			 * @param {Object} warehouseOutNo
			 */
			clearData() {
				this.$store.commit('work/setOutInfoList', [])
				this.$store.commit('work/setCarMasterPhone', {
					phone: ''
				})
				this.vinInfo = {
					carNumber: '',
					carFrame: '',
					carDec: '',
					img: '',
				}
			},
			/**
			 * 查询订单详情
			 */
			orderNoDetail(warehouseOutNo, mark) {
				if (mark) {
					this.mark = mark
					this.warehouseOutNo = warehouseOutNo
				}
				let postData = {
					warehouseOutNo
				}
				uni.showLoading({
					title: '加载中···'
				})
				order.getEaseOrderDetail(postData).then((res) => {
					console.log(res)
					if (res.code === 200) {
						if (res.data.detailList) {
							this.$store.commit('work/setOutInfoList', res.data.detailList.map(x => {
								return {
									...x,
									'old': true
								}
							}))
						}
						this.$store.commit('work/setCarMasterPhone', {
							"phone": res.data.mobile,
							"userNo": res.data.vehicleOwnerCarNo,
							"userName": res.data.carName,
							"carNo": res.data.vehicleOwnerCarNo
						})
						this.vinInfo = {
							carNumber: res.data.carNumber || '',
							carFrame: res.data.carFrameNumber || '',
							carDec: res.data.carModel || '',
							img: res.data.carFrameImageUrl || ''
						}
					} else {
						uni.showToast({
							icon: "none",
							title: res.msg
						})
					}
					uni.hideLoading()
				}).catch((err) => {
					uni.hideLoading()
					uni.showToast({
						icon: "none",
						title: err.msg
					})
				})
			},
			/**
			 * 删除出库商品
			 * @param {Object} item
			 */
			deleteOutInfo(item) {
				this.$store.commit('work/deleteOutInfoList', item.itemBarCode)
				this.periodValid = true
			},
			// 监测每项都已填写过 则进入保存，否则为暂存
			checkForm() {
				let a = true
				let b = true
				for (let item in this.carInfo) {
					if (!this.carInfo[item]) {
						if (item !== 'carNo' && item !== 'carName' && item !== 'carFrame' && item !== 'carDec') {
							a = true
							break
						}
					}
					a = false
				}
				if (this.outInfoList.length > 0) {
					b = false
				} else {
					b = true
				}
				if (!a && !b) {
					this.limitSave = false
				} else {
					this.limitSave = true
				}
			},

			/**
			 * 图片放大
			 * */
			previewImage(src) {
				uni.previewImage({
					urls: [src]
				})
			},
			/**
			 * 扫码
			 */
			openBarCode(mark) {
				let obj = {
					name: '扫描轮胎条码',
					dec: '请对轮胎条码进行扫描',
					confirmTo: '/pages/work/delivery/index',
					mark: 'list'
				}
				if (mark === 'phone') {
					obj = {
						name: '扫描车主二维码',
						dec: '请对车主二维码进行扫描',
						confirmTo: '/pages/work/delivery/index',
						mark: 'phone'
					}
				}
				uni.navigateTo({
					url: `/pages/work/com/barcode?name=${obj.name}&dec=${obj.dec}&confirmTo=${obj.confirmTo}&mark=${obj.mark}`
				})
			},
			/**
			 * 获取车牌
			 */
			getCarNumber(mark) {
				this.$refs.selectPopup.open()
			},
			cancelSelectPopup() {
				this.$refs.selectPopup.close()
			},
			/**
			 * 打开提交信息
			 */
			confirmDialog() {
				this.cancelSelectPopup()
				this.$refs.dialogInput.open()
			},

			/**
			 * 输入对话框的确定事件
			 */
			dialogInputConfirm(done, val) {
				let newVal = (val + '').toUpperCase()
				let xreg =
					/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/;
				let creg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;
				let canSave = true
				if (newVal.length == 7) {
					canSave = creg.test(newVal);
				} else if (newVal.length == 8) {
					canSave = xreg.test(newVal);
				} else {
					canSave = false;
				}
				if (!canSave) {
					uni.showToast({
						title: '请输入正确的车牌号',
						icon: 'none'
					})
				} else {
					this.vinInfo.carNumber = newVal
					this.$refs.dialogInput.close()
				}

			},
			/**
			 * 扫描（打开图片）
			 * @param {Object} mark
			 */
			openScan(mark) {
				let self = this;
				let header = AjaxUtil.getHeader()
				uni.chooseImage({
					count: 1,
					sourceType: ['camera'],
					success: async (res) => {
						if (mark === 'carNumber') {
							uni.showLoading({
								title: '识别车牌中···'
							})
							uni.uploadFile({
								url: upLoadURL +
									'/trade/store/app/warehouse/out/vehiclePlateDistinguish',
								filePath: res.tempFiles[0].path,
								name: 'file',
								header: {
									...header,
									"Content-Type": "multipart/form-data",

								},
								success: (uploadFileRes) => {
									let result = JSON.parse(uploadFileRes.data)
									if (result.code == 200) {
										console.log(result)
										this.vinInfo.carNumber = JSON.parse(result.msg) && JSON
											.parse(result.msg).Code
									}
									uni.hideLoading()
								},
								fail: (err) => {
									uni.hideLoading()
									console.log(err, 'err')
								}
							});
						} else if (mark === 'vin') {
							uni.showLoading({
								title: '识别图片中···'
							})
							uni.uploadFile({
								url: upLoadURL + '/trade/store/app/warehouse/out/vinDistinguish',
								filePath: res.tempFiles[0].path,
								name: 'file',
								header: {
									...header,
									"Content-Type": "multipart/form-data",
								},
								success: (uploadFileRes) => {
									console.log(uploadFileRes)
									let result = JSON.parse(uploadFileRes.data)
									if (result.code == 200) {
										console.log(result)
										this.vinInfo.carFrame = result.data.vinCode || ''
										this.vinInfo.carDec = (result.data.modelYear || '') + ' ' + (result
											.data.brandName || '') + (result.data.vehicleSeriesName || '') +
											' ' + (result.data.vehicleTypeName || '')
										this.vinInfo.img = result.data.imageUlr
									} else {
										// 不要显示弹框 20210624
										// uni.showToast({
										// 	title: result.msg,
										// 	icon: 'none'
										// })
										this.vinInfo.carFrame = ''
										this.vinInfo.carDec = ''
										this.vinInfo.img = result.data.imageUlr
									}
									uni.hideLoading()
								},
								fail: (err) => {
									uni.hideLoading()
									console.log(err, 'err')
								}
							});
						}

					}
				});
			},
			/**
			 * 提交
			 * @param {Object}
			 */
			async submit(e) {
				let _this = this
				_this.outInfoList.some(x => {
					return _this.checkPeriod(x.period)
				})
				if (!_this.periodValid) return
				let postData = {
					"carFrameImageUrl": this.carInfo.img,
					"carFrameNumber": this.carInfo.carFrame,
					"carModel": this.carInfo.carDec,
					"carNumber": this.carInfo.carNumber,
					"flag": true,
					"itemBarCodes": this.outInfoList.map(x => x.itemBarCode),
					"mobile": this.carInfo.phone,
					"carNo": this.carInfo.carNo,
					"carName": this.carInfo.carName,
					"itemBarCodeReqList": this.outInfoList.map(x => {
						return {
							itemBarCode: x.itemBarCode,
							period: x.period
						}
					})
				}
				if (this.mark === 'temp') {
					postData.warehouseOutNo = this.warehouseOutNo
					postData.itemBarCodes = this.outInfoList.filter(y => y.old).map(x => x.itemBarCode);
					postData.newItemBarCodes = this.outInfoList.filter(y => !y.old).map(x => x.itemBarCode);
				}
				console.log(postData)
				//暂存
				if (this.limitSave) {
						uni.showToast({
							icon: "none",
							title: '数据不完整，请先暂存'
						})
				} else {
					this.btnDisabled = true
					// 安心跑-完成 之前调用。后台以此来记录用户来过门店
					// 完成的时候调用
					// if(!this.limitSave){
					// 	await this.checkVehicleStoreUser(postData)
					// }
					uni.showLoading({
						title: '保存中···'
					})
					if (this.mark === 'temp') {
						order.updateTransferEaseOrder(postData).then((res) => {
							console.log(res)
							if (res.code === 200) {
								uni.showToast({
									icon: "success",
									title: res.msg
								})
								uni.hideLoading()
								setTimeout(() => {
									let warehouseOutNo = res.data && res.data.warehouseOutNo
									// 暂存改安心跑
									// const url = '/pages/work/delivery/detail?warehouseOutNo=' + warehouseOutNo
									// #2367 安心跑下单后，跳转的安心跑订单页面需要替换成订单详情页面
									const url = "/pages/work/order/detail/order-detail?orderNo=" +
										warehouseOutNo
									uni.navigateTo({
										url,
										success: () => {
											_this.clearData()
										}
									})
								}, 1000)
							} else {
								uni.showToast({
									icon: "none",
									title: res.msg
								})
							}
							uni.hideLoading()
							this.btnDisabled = false
						}).catch((err) => {
							console.log(err)
							uni.hideLoading()
							this.btnDisabled = false
							uni.showToast({
								icon: "none",
								title: err.msg
							})
						})

					} else if (this.mark === 'reapply') {
						let params = {
							"carFrameImageUrl": this.carInfo.img,
							"carFrameNumber": this.carInfo.carFrame,
							"warehouseOutNo": this.warehouseOutNo
						}
						order.reapplyEaseOrder(params).then((res) => {
							console.log(res)
							if (res.code === 200) {
								uni.showToast({
									icon: "success",
									title: res.msg
								})
								uni.hideLoading()
								setTimeout(() => {
									uni.navigateBack({
										delta: 2
									})
								}, 1000)
							} else {
								uni.showToast({
									icon: "none",
									title: res.msg
								})
							}
							uni.hideLoading()
							this.btnDisabled = false
						}).catch((err) => {
							uni.hideLoading()
							this.btnDisabled = false
							uni.showToast({
								icon: "none",
								title: err.msg
							})
						})

					} else {
						order.createEaseOrder(postData).then((res) => {
							console.log(res)
							if (res.code === 200) {
								uni.showToast({
									icon: "success",
									title: res.msg
								})
								uni.hideLoading()
								setTimeout(() => {
									let warehouseOutNo = res.data && res.data.warehouseOutNo
									// 暂存去list，完成去详情
									// const url = '/pages/work/delivery/detail?warehouseOutNo=' + warehouseOutNo
									// #2367 安心跑下单后，跳转的安心跑订单页面需要替换成订单详情页面
									const url = "/pages/work/order/detail/order-detail?orderNo=" +
										warehouseOutNo
									uni.navigateTo({
										url,
										success: () => {
											_this.clearData()
										}
									})
								}, 1000)
							} else {
								uni.showToast({
									icon: "none",
									title: res.msg
								})
							}
							uni.hideLoading()
							this.btnDisabled = false
						}).catch((err) => {
							console.log(err)
							uni.hideLoading()
							this.btnDisabled = false
							uni.showToast({
								icon: "none",
								title: err.msg
							})
						})
					}

				}
			},
			/**
			 * 提交
			 * @param {Object}
			 */
			async tempSubmit(e) {
				let _this = this
				// _this.outInfoList.some(x => {
				// 	return _this.checkPeriod(x.period)
				// })
				// if (!_this.periodValid) return
				let postData = {
					"carFrameImageUrl": this.carInfo.img,
					"carFrameNumber": this.carInfo.carFrame,
					"carModel": this.carInfo.carDec,
					"carNumber": this.carInfo.carNumber,
					"flag": true,
					"itemBarCodes": this.outInfoList.map(x => x.itemBarCode),
					"mobile": this.carInfo.phone,
					"carNo": this.carInfo.carNo,
					"carName": this.carInfo.carName,
					"itemBarCodeReqList": this.outInfoList.map(x => {
						return {
							itemBarCode: x.itemBarCode,
							period: x.period
						}
					})
				}
				if (this.mark === 'temp') {
					postData.warehouseOutNo = this.warehouseOutNo
					postData.itemBarCodes = this.outInfoList.filter(y => y.old).map(x => x.itemBarCode);
					postData.newItemBarCodes = this.outInfoList.filter(y => !y.old).map(x => x.itemBarCode);
				}
				console.log(postData)
				this.btnDisabled = true
				//暂存
				uni.showLoading({
					title: '暂存中···'
				})
				order.createTempEaseOrder(postData).then((res) => {
					if (res.code === 200) {
						uni.showToast({
							icon: "success",
							title: res.msg
						})
						uni.hideLoading()
						setTimeout(() => {
							// 暂存去list，完成去详情
							const url = '/pages/work/delivery/list'
							uni.navigateTo({
								url,
								success: () => {
									_this.clearData()
								}
							})
						}, 1000)
					} else {
						uni.showToast({
							icon: "none",
							title: res.msg
						})
					}
					uni.hideLoading()
					this.btnDisabled = false
				}).catch((err) => {
					uni.hideLoading()
					this.btnDisabled = false
					this.btnDisabled = false
					uni.showToast({
						icon: "none",
						title: err.msg
					})
				})
				
			},
			/**
			 * 检查 车辆-门店-用户 的关系
			 */
			checkVehicleStoreUser(data) {
				const {
					carNumber,
					carModel,
					carFrameImageUrl,
					carFrameNumber,
					carNo
				} = data
				let postData = {
					// 车牌号
					licensePlateNumber: carNumber,
					// 车型
					model: carModel,
					// 门店编号
					storeNo: (this.storeList && this.storeList.length > 0) ? this.storeList[this.storeIndex]
						.customerNo : '',
					// 用户编号
					userNo: carNo,
					// vin码
					vinCode: carFrameNumber,
					// 车架照片
					vinImgUrl: carFrameImageUrl,
				}
				return new Promise((resolve, reject) => {
					order.checkVehicleStoreUser(postData).then((res) => {
						console.log('调用成功', res)
						resolve()
					}).catch((err) => {
						resolve()
						console.log('检查 车辆-门店-用户 的关系', err)
					})
				})
			},
			/**
			 * 前往暂存记录
			 */
			toHistory() {
				uni.navigateTo({
					url: '/pages/work/delivery/list'
				})
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
			 * 跳转车主小程序码
			 */
			toApplets() {
				uni.navigateTo({
					url: '/pages/work/applet/applet'
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		height: calc(100vh - 160rpx;
			);
		padding-bottom: 160rpx;
		overflow-y: auto;
		background-color: #F2F2F2;
		position: absolute;
		z-index: 999;
	}

	.box-title-text {
		font-size: 26rpx;
		font-weight: 500;
		color: #333;
		display: flex;
		margin: 20rpx;
	}

	.list-item {
		width: calc(100vw - 40rpx);
		margin-left: 20rpx;
		border-bottom-width: 1rpx;
		border-bottom-color: #eee;
		border-bottom-style: solid;
		background-color: #fff;
	}

	.body-box {
		width: calc(100% - 40rpx);
		padding: 20rpx;
	}

	.item-head {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		width: 100%;
		padding: 10rpx 0;
		border-bottom-width: 1rpx;
		border-bottom-color: #eee;
		border-bottom-style: solid;

		.name-text {
			padding-bottom: 20rpx;
			color: #333;
			font-size: 24rpx;
		}
	}

	.item-body {
		display: flex;
		flex-direction: column;
		width: 100%;
		padding: 10rpx 0;

		.sb-item-text {
			color: #333;
			font-size: 24rpx;
			padding-top: 20rpx;
		}
	}

	.barcode-box {
		display: flex;
		flex-direction: center;
		align-items: center;
		position: relative;

		.barcode-img {
			width: 300rpx;
			height: calc(300rpx / 2.06);
		}

		.barcode-text {
			text-align: center;
			color: $uni-color-primary;
			font-size: 26rpx;
			position: absolute;
			bottom: 30rpx;
		}
	}

	.del {
		width: 160rpx;
		height: 100%;
		background-color: #E10000;
		display: flex;
		align-items: center;
		justify-content: center;

		text {
			color: #fff
		}
	}

	.add-box {
		background-color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20rpx;
		margin-left: 20rpx;
		width: calc(100% - 80rpx);

		.add-again-btn {
			border-color: $uni-color-primary;
			border-style: dashed;
			border-width: 1rpx;
			width: 200rpx;
			border-radius: 100rpx;
			padding: 16rpx 60rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.add-again {
			margin-left: 10rpx;
			text-align: center;
			color: $uni-color-primary;
			font-size: 26rpx
		}
	}

	.item-row {
		display: flex;
		flex-direction: row;
	}

	.form-item {
		width: calc(100vw - 80rpx);
		margin-left: 20rpx;
		background-color: #fff;
		padding: 20rpx;

		.form-item-head {
			display: flex;
			justify-content: space-between;
			padding-bottom: 20rpx;

			.text-primary {
				color: $uni-color-primary;
				font-size: 26rpx
			}

			.text-gray {
				color: $uni-text-color-grey;
				font-size: 26rpx
			}

			.text-normal {
				font-size: 26rpx;
				color: #333;
			}
		}

		.disabled {
			/deep/.uni-input-input:disabled {
				background-color: #E5E5E5;
				border-color: #ddd;
				border-width: 1rpx;
				border-style: solid;
				border-radius: 4rpx;
				padding: 20rpx;
				width: calc(100% - 40rpx - 4rpx);
				box-shadow: 0 0 0 rgba(0, 0, 0, 0);
			}
		}

		/deep/.form-input {
			flex: 1;
			height: auto;
			background-color: $uni-bg-color-grey;

			/deep/.uni-input-placeholder {
				font-size: 28rpx
			}
		}

		.form-input:disabled {
			font-size: 28rpx;
			background-color: $uni-bg-color-grey;
		}

		.barcode-form-box {
			display: flex;
			height: 100rpx;
			justify-content: space-between;

			.barcode-btn-box {
				background-color: $uni-color-primary;
				width: 120rpx;
				margin-left: 20rpx;
				border-radius: 4rpx;
				padding: 0 40rpx;
				height: 100%;
				display: flex;
				justify-content: center;
				align-items: center;

				.btn-text {
					margin-left: 10rpx;
					color: #fff;
				}
			}
		}

		.img-view-box {
			width: 200rpx;
			height: 140rpx;
			border-radius: 8rpx;
			overflow: hidden;
			background-color: #f2f2f2;
			position: relative;

			.img-view {
				width: 100%;
				height: 100%;
			}

			.show-icon {
				position: absolute;
				bottom: 10rpx;
				right: 10rpx;
				background-color: rgba(0, 0, 0, .5);
				width: 60rpx;
				height: 60rpx;
				border-radius: 30rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}

		.tips-text {
			color: #999;
			font-size: 24rpx;
			padding: 20rpx;
		}
	}

	.action-box {
		background-color: #fff;
		border-radius: 10px 10px 0 0;

		.zbtn {
			width: 100%;
			height: 44px;
			border-bottom: 1px solid #eee;
			font-size: 14px;
			border-radius: 0;
			line-height: 44px;
			color: #ed6d00;
			background-color: #fff;

			&::after {
				display: none;
			}

			&.bye {
				color: #666;
			}
		}
	}

	.fixed-buttom-box {
		.fixed-buttom-btn::after {
			border: none;
		}
	}

	.applets {
		position: fixed;
		bottom: 320rpx;
		bottom: calc(320rpx + constant(safe-area-inset-bottom));
		bottom: calc(320rpx + env(safe-area-inset-bottom));
		right: 0px;
		z-index: 105;
		width: 100rpx;
		height: 132rpx;
		display: flex;
		overflow: hidden;
		align-items: center;
		justify-content: center;

		.img {
			width: 100%;
			height: 100%;
		}
	}

	.sb-input {
		flex: 1;
		position:relative;
		text-align: right;
		&::after{
			position:absolute;
			bottom:0;
			right:0;
			width:120rpx;
			height:1px;
			content:'';
			background-color: $uni-color-primary;
		}
	}
</style>

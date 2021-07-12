<template>
	<view class="page">
		<uni-nav-bar id="tab" title="安心跑资料填写" backgroundColor="#ed6d00" color="#fff" left-icon="back" @clickLeft="navBack"></uni-nav-bar>
		<scroll-view class="scroll-view" scroll-y :style="`height:${swiperHeight}`">
			<!-- 车辆信息 -->
			<view class="renew-name-number flex a-center">
				<view class="item-icon flex a-center j-center">
					<icon class="iconfont cheliang" type=""></icon>
				</view>
				<view class="item-vehicle">
					<view class="item-vehicle-num flex a-center">
						<view class="item-vehicle-name">车牌号:</view>
						<view class="renew-name">{{detailData.carNumber}}</view>
					</view>
					<view class="item-vehicle-num flex a-center">
						<view class="item-vehicle-name">车主手机号:</view>
						<view class="renew-name">{{detailData.mobile}}</view>
					</view>
					<view class="item-vehicle-num flex a-center">
						<view class="item-vehicle-name">车架号:</view>
						<view class="renew-name">{{detailData.carFrameNumber}}</view>
					</view>
				</view>
			</view>
			<view style="padding: 20rpx;">
				<!-- 消费信息 -->
				<view class="item-bg" style="margin-bottom: 20rpx;">
					<view class="renew-no-status flex j-space-between">
						<view class="renew-no">消费信息</view>
					</view>
					<view class="renew-name-number renew-consumption flex a-center">
						<view class="item-vehicle">
							<view class="item-vehicle-num flex a-center">
								<view class="item-vehicle-name">门店名称</view>
								<view class="renew-name">{{detailData.storeName}}</view>
							</view>
							<view class="item-vehicle-num flex a-center">
								<view class="item-vehicle-name">关联订单</view>
								<view class="renew-name">{{detailData.warehouseOutNo}}</view>
							</view>
						</view>
					</view>
				</view>
				<!-- 选择换新轮胎 -->
				<view class="item-bg" v-if="detailData.detailList && detailData.detailList.length>0">
					<view class="renew-no-status flex j-space-between">
						<view class="renew-no">选择换新轮胎</view>
					</view>
					<view class="item-detail" v-for="(renewItem,renewIndex) in detailData.detailList" :key="renewIndex">
						<view class="item-vehicle">
							<view class="">
								<view class="item-vehicle-num flex a-center">
									<view class="item-vehicle-name">规格明细:</view>
									<view class="renew-num">{{renewItem.itemSpecDetail}}</view>
								</view>
								<view class="item-vehicle-num flex a-center">
									<view class="item-vehicle-name">条码:</view>
									<view class="renew-num">{{renewItem.itemBarCode}}</view>
								</view>
								<view class="item-vehicle-num flex a-center">
									<view class="item-vehicle-name">周期:</view>
									<view class="renew-num">{{renewItem.period}}</view>
								</view>
								<view class="detail-check" @click="change(renewItem)">
									<uni-icons :class="renewItem.isChecked ? 'selected' : 'check-box'" :type="renewItem.isChecked ? 'checkbox-filled' : 'circle'"></uni-icons>
								</view>
							</view>
						</view>
						<view v-if="renewItem.isChecked">
							<view class="detail-tag flex a-center j-space-between">
								<view class="">*上传图片</view>
								<view class="" @click="viewExample">*轮胎上传图片范例</view>
							</view>
							<view class="flex j-space-between">
								<view class="camera-box" v-for="(item,index) in renewItem.imgList" :key="index">
									<view class="camera flex a-center j-center flex-column" v-if="item.license">
										<image :src="item.license" mode="aspectFit"></image>
										<view class="cu-tag bg-red" @tap.stop="DelImg(item)">
											<uni-icons type="closeempty"></uni-icons>
										</view>
										<view v-if="mark==='reapply'" class="opinion" :class="['','','agree','reject'][item.isAgree]">{{['','','通过','驳回'][item.isAgree]}}</view>
									</view>
									<view v-else class="camera flex a-center j-center" @click="takePhoto(item)">
										<uni-icons type="camera"></uni-icons>
									</view>
									<view class="tag mgt5 flex a-center j-center">{{item.imgName}}</view>
								</view>
							</view>
						</view>
					</view>
					<view class="item-detail">
						<view class="detail-tag">*换新类型</view>
						<view class="item-vehicle detail-renew" style="24rpx 32rpx">
							<view class="detail-renew-name flex a-center">冲击造成断纱之胎侧鼓包</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="page-bottom" id="pageBottom">
			<view v-if="mark==='reapply'" class="buttom-btn" @click="reapplyConfirm">重新提交</view>
			<view v-else class="buttom-btn" @click="confirm">确认提交</view>
			<view class="buttom-tag flex a-center j-center">温馨提示：如有不清楚的地方，请点击查看照片举例说明</view>
		</view>
	</view>
</template>

<script>
	import order from '@/api/ease/order.js'
	import renew from '@/api/ease/renew.js'
	import {
		upLoadURL
	} from '@/static/base/system-constant.js'
	import AjaxUtil from "@/common/utils/request.js"
	export default {
		data() {
			return {
				systemInfo: uni.getSystemInfoSync(),
				detailData: {
					detailList:[]
				},
				// 可滚动区域高度
				swiperHeight: '100%',
				warehouseOutNo: '',
				mark:'',
				renewNo:''
			}
		},
		computed: {
			//安全区域
			safeArea() {
				return this.systemInfo.safeAreaInsets
			}
		},
		//路由传值
		async onLoad(option) {
			const {
				warehouseOutNo,
				mark,
				renewNo
			} = option;
			this.mark = mark;
			if (warehouseOutNo && mark==="apply") {
				this.warehouseOutNo = warehouseOutNo;
				this.warehouseOutNoDetail()
			}
			if (renewNo && mark==="reapply") {
				this.renewNo = renewNo;
				this.renewNoDetail()
			}
		},
		onUnload() {

		},
		mounted() {
		},
		methods: {
			/**
			 * 计算底部DOM元素节点
			 */
			async countBottomBar() {
				let that = this
				const topHeight = await this.$getComponentsDom('#tab');
				const bottomHeight = await this.$getComponentsDom('#pageBottom') || {
					height: 0
				};
				this.swiperHeight = (that.systemInfo.windowHeight - topHeight.height - bottomHeight.height) + 'px'
			},
			/**
			 * 查看轮胎上传图片范例
			 */
			viewExample(){
				uni.navigateTo({
					url:'/pages/work/renew/run-ease/example'
				})
			},
			/**
			 * 查询出库订单详情
			 */
			warehouseOutNoDetail() {
				let postData = {
					warehouseOutNo: this.warehouseOutNo
				}
				uni.showLoading({
					title: '加载中···'
				})
				order.getEaseOrderDetail(postData).then((res) => {
					if (res.code === 200) {
						this.detailData = res.data
						let tempList = this.detailData.detailList && this.detailData.detailList.map(x => {
							return {
								...x,
								isChecked: false,
								imgList: [{
									license: '',
									imgName: '鼓包内里',
									isAgree: 1
								}, {
									license: '',
									imgName: '鼓包对应位置',
									isAgree: 1
								}, {
									license: '',
									imgName: '轮胎规格',
									isAgree: 1
								}, {
									license: '',
									imgName: '轮胎周期',
									isAgree: 1
								}, {
									license: '',
									imgName: '现场照片',
									isAgree: 1
								}, {
									license: '',
									imgName: '车辆行驶证',
									isAgree: 1
								}]
							}
						})
						this.detailData.detailList = tempList.filter(x => x.runAtEaseStatus === 1)
					} else {
						uni.showToast({
							icon: "none",
							title: res.msg
						})
					}
					setTimeout(()=>{
						this.countBottomBar()
					},100)
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
			 * 查询换新订单详情
			 */
			renewNoDetail() {
				let postData = {
					renewNo: this.renewNo
				}
				uni.showLoading({
					title: '加载中···'
				})
				renew.getRenewDetail(postData).then((res) => {
					if (res.code === 200) {
						this.detailData.carNumber=res.data.vehicleOwnerCarNumber
						this.detailData.mobile=res.data.vehicleOwnerMobile
						this.detailData.carFrameNumber=res.data.vehicleOwnerCarFrameNumber
						this.detailData.storeName=res.data.storeName
						this.detailData.warehouseOutNo=res.data.warehouseOutNo
						this.detailData.detailList=res.data.renewDetailList.filter(x=>!x.renewDetailType).map(x=>{
							return{
								itemBarCode: x.itemBarCode,
								itemName: x.itemName,
								itemSpecDetail: x.itemSpecDetail,
								period: x.period,
								isChecked:true,
								renewDetailNo:x.renewDetailNo,
								imgList: [{
									license: x.renewDetailOneImageUrl,
									imgName: '鼓包内里',
									//2通过 3驳回  0,1无
									isAgree: x.renewDetailOneApprovalStatus
								}, {
									license: x.renewDetailTwoImageUrl,
									imgName: '鼓包对应位置',
									isAgree: x.renewDetailTwoApprovalStatus
								}, {
									license: x.renewDetailThreeImageUrl,
									imgName: '轮胎规格',
									isAgree: x.renewDetailThreeApprovalStatus
								}, {
									license: x.renewDetailFourImageUrl,
									imgName: '轮胎周期',
									isAgree: x.renewDetailFourApprovalStatus
								}, {
									license: x.renewDetailFiveImageUrl,
									imgName: '现场照片',
									isAgree: x.renewDetailFiveApprovalStatus
								}, {
									license: x.renewDetailSixImageUrl,
									imgName: '车辆行驶证',
									isAgree: x.renewDetailSixApprovalStatus
								}]
							}
						})
					} else {
						uni.showToast({
							icon: "none",
							title: res.msg
						})
					}
					setTimeout(()=>{
						this.countBottomBar()
					},100)
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
			 * 返回上一页
			 */
			navBack() {
				uni.navigateBack({
					delta: 1
				});
			},
			/**
			 * 选择换新轮胎
			 */
			change(renewItem) {
				renewItem.isChecked = !renewItem.isChecked
			},
			/**
			 * 确认提交
			 */
			confirm() {
				let realList = this.detailData.detailList.filter(x => x.isChecked)
				if(realList.length == 0){
				    uni.showToast({
						icon: "none",
						title: "请选择换新轮胎"
				    })
				    return
				}
				let arr = [];
				realList.forEach(x => {					    
					arr.push({							
						"renewDetailFiveImageUrl": x.imgList[4].license,							
						"renewDetailFourImageUrl": x.imgList[3].license,					   
						"renewDetailOneImageUrl": x.imgList[0].license,					    
						"renewDetailSixImageUrl": x.imgList[5].license,					
						"renewDetailThreeImageUrl": x.imgList[2].license,					
						"renewDetailTwoImageUrl": x.imgList[1].license,					    
						"warehouseOutDetailNo": x.warehouseOutDetailNo							
					})								
				})
				let postData = {
					"renewDescribe": "冲击造成断纱之胎侧鼓包",
					"renewDetailList": arr,
					"warehouseOutNo": this.warehouseOutNo
				}
				uni.showLoading({
					title: '提交中···'
				})
				renew.createRenewOrder(postData).then((res) => {
					if (res.code === 200) {
						uni.showToast({
							icon: "success",
							title: '提交成功'
						})
						setTimeout(() => {
							this.navBack()
						}, 1000)

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
			 * 重新提交
			 */
			reapplyConfirm() {
				let realList = this.detailData.detailList.filter(x => x.isChecked)
				if(realList.length == 0){
				    uni.showToast({
				      icon: "none",
				      title: "请选择换新轮胎"
				    })
				    return
				}
				realList.forEach(x => {
					arr.push({
						"renewDetailFiveImageUrl": x.imgList[4].license,
						"renewDetailFiveApprovalStatus": x.imgList[4].isAgree,
						"renewDetailFourImageUrl": x.imgList[3].license,
						"renewDetailFourApprovalStatus": x.imgList[3].isAgree,
						"renewDetailOneImageUrl": x.imgList[0].license,
						"renewDetailOneApprovalStatus": x.imgList[0].isAgree,
						"renewDetailSixImageUrl": x.imgList[5].license,
						"renewDetailSixApprovalStatus": x.imgList[5].isAgree,
						"renewDetailThreeImageUrl": x.imgList[2].license,
						"renewDetailThreeApprovalStatus": x.imgList[2].isAgree,
						"renewDetailTwoImageUrl": x.imgList[1].license,
						"renewDetailTwoApprovalStatus": x.imgList[1].isAgree,
						"renewDetailNo": x.renewDetailNo
					})
				})
				let postData = {
					"updateImageList": arr,
					"renewNo": this.renewNo
				}
				uni.showLoading({
					title: '重新提交中···'
				})
				renew.modifyRenewImage(postData).then((res) => {
					if (res.code === 200) {
						uni.showToast({
							icon: "success",
							title: '提交成功'
						})
						setTimeout(() => {
							this.navBack()
						}, 1000)

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
			 * 上传图片
			 */
			takePhoto(item) {
				let self = this;
				let header = AjaxUtil.getHeader()
				uni.chooseImage({
					count: 1,
					success: async (res) => {
						uni.showLoading({
							title: '加载图片中···'
						})
						uni.uploadFile({
							url: upLoadURL + '/basic/admin/oss/upload?target=item',
							filePath: res.tempFiles[0].path,
							name: 'file',
							header: {
								...header,
								"Content-Type": "multipart/form-data",

							},
							success: (uploadFileRes) => {
								let result = JSON.parse(uploadFileRes.data)
								if (result.code == 200) {
									item.license = result.data.objectUrl
									item.isAgree = 1
								}
								uni.hideLoading()
							},
							fail: (err) => {
								uni.hideLoading()
								console.log(err, 'err')
							}
						});
					}
				});
			},
			//删除图片
			DelImg(item) {
				let that = this;
				uni.showModal({
					title: '',
					content: '确定要删除么',
					cancelText: '取消',
					confirmText: '确定',
					success: function(res) {
						if (res.confirm) {
							item.license = ''
							item.isAgree = 1
						} else if (res.cancel) {}
					}
				})
			},
		}
	}
</script>
<style lang="scss" scoped>
	.page {
		background-color: #f2f2f2;
		height: 100vh;
		overflow: hidden;
	}

	.scroll-view {
		overflow: hidden;
	}

	// 车主信息
	.renew-name-number {
		width: calc(100% - 40rpx);
		padding: 20rpx;
		background: #fff;

		.item-icon {
			width: 76rpx;
			height: 76rpx;
			color: #fff;
			background: #F35337;
			border-radius: 10rpx;
			margin-right: 20rpx;

			.iconfont {
				font-size: 50rpx;
			}
		}

		.item-vehicle {
			width: calc(100% - 96rpx);
		}

		.item-vehicle-name {
			width: 168rpx;
			color: #616161;
			font-size: 24rpx;
			font-weight: bold;
		}

		.item-vehicle-num {
			margin-bottom: 20rpx;
		}

		.item-vehicle-num:nth-last-of-type(1) {
			margin-bottom: 0;
		}

		// 订单名称
		.renew-name {
			width: 80%;
			font-size: 24rpx;
			font-weight: bold;
			color: #252527;
			overflow: hidden;
			-webkit-line-clamp: 1;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-box-orient: vertical;
		}

		// 订单数量
		.renew-number {
			font-size: 24rpx;
			font-weight: bold;
			color: #252527;
		}
	}

	.item-bg {
		background: #fff;
		position: relative;
		border-radius: 5rpx;
		box-shadow: 0px 6rpx 26rpx 0px rgba(123, 71, 46, 0.05);

		.renew-consumption {
			color: $uni-text-color;
		}

		.item-vehicle-name {
			color: $uni-text-color;
		}

		.renew-name {
			color: #616161;
		}
	}

	// 订单号，订单状态
	.renew-no-status {
		padding: 20rpx 0;
		border-bottom: 1px solid #F2F2F2;

		// 订单号
		.renew-no {
			padding-left: 20rpx;
			font-size: 26rpx;
			font-weight: 600;
			color: #7C7C7C;
			display: flex;
			align-items: center;
		}
	}

	// 订单详情
	.item-detail {
		padding: 20rpx;

		.item-vehicle {
			padding: 34rpx 80rpx;
			border-radius: 20rpx;
			background: #F2F2F2;
			border: 1px solid #E5E5E5;
			position: relative;

			.detail-check {
				position: absolute;
				top: 12rpx;
				left: 12rpx;
			}
		}

		.item-vehicle-num {
			margin-bottom: 20rpx;
		}

		.item-vehicle-num:nth-last-of-type(1) {
			margin-bottom: 0;
		}

		.item-vehicle-name {
			width: 168rpx;
			font-weight: bold;
			font-size: 26rpx;
		}

		.detail-tag {
			color: #EB741A;
			padding: 0 0 10px;
			font-size: 26rpx;
		}

		.detail-renew {
			padding: 32rpx 24rpx;
		}

		.detail-renew-name {
			width: 100%;
			color: $uni-text-color;
			font-size: 26rpx;
			font-weight: 500;
		}

		.renew-num {
			color: #616161;
			font-size: 26rpx;
		}

		.detail-state {
			position: absolute;
			top: 12rpx;
			right: 12rpx;

			.renew-status {
				width: 92rpx;
				height: 40rpx;
				color: #fff;
				font-size: 24rpx;
				border-radius: 5rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
	}

	.camera-box {
		width: calc((100% - 25px) / 6);

		.tag {
			color: #7C7C7C;
			font-size: 22rpx;
			margin-top: 6rpx;
		}
	}

	.camera {
		height: 50px;
		border: 1rpx dashed #CCCCCC;
		border-radius: 5rpx;
		position: relative;

		image {
			width: 100%;
			height: 100%;
		}

		.uni-icons {
			color: #CCCCCC !important;
			font-size: 30px !important;
			font-weight: 100;
		}

		.opinion {
			width: 36px;
			height: 22px;
			color: #fff;
			font-size: 22rpx;
			font-weight: bold;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 5rpx;
			position: absolute;
		}

		.agree {
			background: #27CE00;
		}

		.reject {
			background: #CE0000;
		}

		.cu-tag {
			position: absolute;
			top: 0;
			right: 0;

			.uni-icons {
				color: #CCCCCC !important;
				font-size: 16px !important;
				font-weight: 500;
			}
		}
	}

	.check-box {
		color: $uni-text-color-subsidiary !important;
		font-size: 36rpx !important;
		background: #fff;
		border-radius: 50%;
	}

	.selected {
		color: $uni-color-primary !important;
		font-size: 36rpx !important;
	}

	.page-bottom {
		width: 100%;
		position: fixed;
		bottom: 0;
		padding: 10px 10px calc(20rpx + constant(safe-area-inset-bottom) / 2);
		padding: 10px 10px calc(20rpx + env(safe-area-inset-bottom) / 2);
		background-color: #f2f2f2;
		z-index: 9;
		font-size: $uni-font-size-base;
	}

	.buttom-btn {
		width: calc(100% - 40rpx);
		height: 40px;
		line-height: 40px;
		text-align: center;
		border-radius: 20px;
		background-color: $uni-color-primary;
		color: #fff;
	}

	.buttom-tag {
		width: calc(100% - 40rpx);
		height: 80rpx;
		color: #A6A6A6;
		font-size: 26rpx;
	}
</style>

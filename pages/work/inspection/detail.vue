<template>
	<view class="page" :style="`height:${systemInfo.windowHeight}px`">
		<uni-nav-bar fixed statusBar title="店检详情" left-icon="back" backgroundColor="#ed6d00" color="#fff" @clickLeft="toBack" />
		<view class="card-box" :class="[0,1,2].includes(detailData.auditStatus) ? 'card-height' :'' ">
			<view v-if="[0,1,2].includes(detailData.auditStatus)" class="function-content" style="padding: 0;">
				<view class="inspection flex j-space-between">
					<view class="inspection-state">
						<view class="inspection-date mb10">{{detailData.created}}</view>
						<view class="mb10">店铺总分：<text class="inspection-fraction">{{detailData.score}}</text></view>
						<view v-if="detailData.rewardStatus === 1">奖<text class="space">励：</text>
							<text class="inspection-price" @click="lookReward(detailData)">查看</text>
						</view>
						<view v-else>奖<text class="space">励：</text>
							<text class="inspection-fraction">无</text>
						</view>
					</view>
					<view class="state-img">
						<image v-if="detailData.auditStatus === 1" src="../../../static/image/work/hege@3x.png" mode="aspectFit"></image>
						<image v-if="detailData.auditStatus === 2" src="../../../static/image/work/buhege@3x.png" mode="aspectFit"></image>
						<image v-if="detailData.auditStatus === 0" src="../../../static/image/work/daihege@3x.png" mode="aspectFit"></image>
					</view>
				</view>
			</view>
			<view v-if="detailData.remark" class="function-content">
				<view class="content-title">评语</view>
				<view class="inspection">
					<view class="inspection-text"> {{detailData.remark}}</view>
				</view>
			</view>
			<view class="function-content" v-for="(item,index) in detailData.clauseList" :key="index">
				<view class="flex a-center j-space-between">
					<view class="content-title">{{item.name}}</view>
					<view v-if="!([0,1,2].includes(detailData.auditStatus)) && item.imgUrl && item.status!==2" @click="chooseImg(item)" class="upload-again">重新上传</view>
				</view>
				<view class="inspection flex j-space-between">
					<view class="inspection-icon flex a-center j-center">
						<image v-if="item.imgUrl" :src="item.imgUrl" mode="aspectFill" @click="preview(item.imgUrl)"></image>
						<uni-icons v-else type="camera" @click="chooseImg(item)"></uni-icons>
					</view>
					<view v-if="!([0,1,2].includes(detailData.auditStatus))" class="inspection-info">
						<view class="info-con">
							<view class="item-title">{{item.requirement}}</view>
							<view class="item-title">满分{{item.fullScore}}分</view>
						</view>
						<view class="item-look" @click="lookExamples(item.exampleUrl)">查看示例</view>
					</view>
					<view v-else class="flex a-center j-center" style="width: calc(100% - 160px);">
						<view class="inspection-num flex a-center j-center">{{item.obtainScore}}</view>
					</view>
				</view>
			</view>
		</view>
		<view v-if="!([0,1,2].includes(detailData.auditStatus))" class="page-bottom" :style="`height:${safeArea.bottom/2 + 70}px`"
		 @click="confirm">
			<text class="buttom-btn" :class="canSave ? '':'upload-bg'" :style="`margin-bottom:${safeArea.bottom/2}px`">确认上传</text>
		</view>
		<uni-popup class="popup" ref="popup" type="center">
			<image style="width: 100%;max-height:100vh;" :src="exampleUrl" mode="widthFix"></image>
			<uni-icons type="close" @click="close"></uni-icons>
		</uni-popup>
		<uni-popup ref="dialogPopup" type="dialog">
			<uni-popup-dialog class="reward-popup" mode="base" title="获得奖励" content="" :duration="2000" :before-close="true" @close="closeDialog"
			 @confirm="closeDialog" :showCancel="false">
				<template slot="content">
					<view class="content">
						<view class="content-popup flex a-center">
							<view class="staff-name">优惠券</view>
							<view class="reward">{{reward.couponName}} {{reward.couponCount}}</view>
						</view>
						<view class="content-popup flex a-center">
							<view class="staff-name">兑换点</view>
							<view class="reward">{{reward.exchangeName}} {{reward.exchangeAmount}}</view>
						</view>
						<view class="content-popup flex a-center">
							<view class="staff-name">返利</view>
							<view class="reward">{{reward.rebateName}} {{reward.rebateAmount}}</view>
						</view>
						<view class="content-popup flex a-center">
							<view class="staff-name">积分</view>
							<view class="reward">{{reward.integralName}} {{reward.integralAmount}}</view>
						</view>
					</view>
				</template>
			</uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import {
		upLoadURL
	} from '@/static/base/system-constant.js'
	import AjaxUtil from "@/common/utils/request.js"
	import inspection from '@/api/inspection/inspection.js'
	export default {
		name: 'InspectionDetail',
		data() {
			return {
				cycleNo: '',
				inspectNo: '',
				auditNo:'',
				detailData: {
					clauseList: []
				},
				exampleUrl: '',
				systemInfo: uni.getSystemInfoSync(),
				canSave: false,
				reward: {
					couponNum: '3',
					exchangeNum: '3',
					rebateNum: '100',
					integralNum: '500'
				}
			}
		},
		computed: {
			//安全区域
			safeArea() {
				return this.systemInfo.safeAreaInsets
			}
		},
		onLoad(option) {
			this.cycleNo = option.cycleNo
			this.inspectNo = option.inspectNo
			this.auditNo = option.auditNo
			this.getDetailData()
		},
		mounted() {},
		watch: {
			detailData: {
				handler() {
					// 重新监测
					this.checkForm();
				},
				deep: true
			}
		},
		methods: {
			// 监测每项都已填写过 则进入保存，否则为暂存
			checkForm() {
				let list = this.detailData.clauseList || []
				this.canSave = list.every(x => {
					return x.imgUrl
				})
			},
			/**
			 * 预览图片
			 * @param {Object} url
			 */
			preview(url){
				if(url){
					uni.previewImage({
						urls: [url]
					});
				}
			},
			/**
			 * 选择拍照图片
			 * @param {Object} item
			 */
			chooseImg(item) {
				let self = this;
				let header = AjaxUtil.getHeader()
				uni.chooseImage({
					count: 1,
					sourceType: ['camera'],
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
								console.log(uploadFileRes)
								let result = JSON.parse(uploadFileRes.data)
								if (result.code == 200) {
									item.imgUrl = result.data.objectUrl
								} else {
									uni.showToast({
										icon: "none",
										title: '上传图片格式不正确，请重试'
									})
								}
								uni.hideLoading()
							},
							fail: (err) => {
								consol.log(err)
								uni.hideLoading()
								uni.showToast({
									icon: "none",
									title: '上传图片格式不正确，请重试'
								})
							}
						});
					}
				});
			},
			/**
			 * 返回上一页
			 */
			toBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			/**
			 * 查询列表数据
			 */
			getDetailData() {
				let postData = {
					cycleNo: this.cycleNo,
					inspectNo: this.inspectNo
				}
				if(this.auditNo){
					postData.auditNo=this.auditNo
				}
				uni.showLoading({
					title: '加载中···'
				})
				inspection.getInspectionDetail(postData).then((res) => {
					if (res.code === 200) {
						this.detailData = res.data
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
			 * 查看示例
			 */
			lookExamples(url) {
				if (url) {
					this.exampleUrl = url
					this.$refs.popup.open()
				} else {
					uni.showToast({
						icon: "none",
						title: '暂无示例图'
					})
				}
			},
			/**
			 * 查看奖励
			 * @param {Object} item
			 */
			lookReward(item) {
				this.$refs.dialogPopup.open();
				this.reward = item.reward || {}
			},
			/**
			 * 关闭示例
			 */
			close() {
				this.$refs.popup.close()
			},
			/**
			 * 确认上传
			 */
			confirm() {
				if (!this.canSave) return
				let details = this.detailData.clauseList.map(x => {
					return {
						"description": x.description,
						"exampleUrl": x.exampleUrl,
						"fullScore": x.fullScore,
						"imgUrl": x.imgUrl,
						"name": x.name,
						"requirement": x.requirement,
						"sort": x.sort
					}
				})
				let postData = {
					"cycleNo": this.cycleNo,
					"inspectNo": this.inspectNo,
					details
				}
				uni.showLoading({
					title: '上传中···'
				})
				console.log(postData)
				inspection.submitInspection(postData).then((res) => {
					if (res.code === 200) {
						uni.showToast({
							icon: "success",
							title: res.msg
						})
						uni.hideLoading()
						setTimeout(() => {
							//返回并刷新
							let pages = getCurrentPages();
							let beforePage = pages[pages.length - 2]
							uni.navigateBack({
								delta:1,
								success: function() {
									// #ifdef APP-PLUS
									beforePage.$vm.listRemoteDataByPage()
									// #endif
									// #ifndef APP-PLUS
									beforePage.listRemoteDataByPage()
									// #endif
								}
							});
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
			 * 点击取消按钮触发
			 * @param {Object} done
			 */
			closeDialog(done) {
				done()
			}
		}
	}
</script>

<style lang="scss">
	.page {
		background-color: #F2F2F2;
		position: relative;
		overflow: auto;
	}

	.card-box {
		height: calc(100vh - 45px - 70px - var(--status-bar-height) - constant(safe-area-inset-bottom) / 2);
		height: calc(100vh - 45px - 70px - var(--status-bar-height) - env(safe-area-inset-bottom) / 2);
		padding-bottom: 10px;
		color: $uni-text-color;
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		/* #endif */
		overflow-y: auto;
	}

	.card-height {
		height: calc(100vh - 45px - var(--status-bar-height)- env(safe-area-inset-bottom) / 2);
		height: calc(100vh - 45px - var(--status-bar-height)- constant(safe-area-inset-bottom) / 2);
	}

	.function-content {
		color: #1C1C1C;
		font-size: 13px;
		padding: 0 10px;
		overflow: hidden;

		.content-title {
			color: #252527;
			padding: 12px 0;
			font-weight: bold;
		}

		.upload-again {
			color: #ed6d00;
			font-size: 12px;
		}

		.inspection {
			background: #fff;
			padding: 20px 10px;
			border-radius: 3px;
			color: #252527;
			font-size: 12px;
			font-weight: bold;
			box-shadow: 0px 3px 15px 0px rgba(0, 0, 0, 0.05);

			.inspection-icon {
				width: 160px;
				height: 90px;
				background: #EEEEEE;
				border-radius: 5px;

				.uni-icons {
					color: #9B9B9B !important;
					font-size: 30px !important;
					font-weight: 100;
				}

				image {
					width: 100%;
					height: 100%;
					border-radius: 5px;
				}
			}

			.inspection-info {
				width: 146px;
				padding: 4px 0;
				position: relative;

				.info-con {
					max-height: 80px;
					overflow: auto;
					margin-bottom: 15px;
				}

				.item-title {
					color: #CCCCCC;
					font-size: 13px;
				}

				.item-look {
					color: #ed6d00;
					font-size: 12px;
					position: absolute;
					bottom: 0px;
				}
			}
		}

		.inspection-state {
			color: #252527;
			font-size: 12px;
			font-weight: 400;

			.inspection-date {
				opacity: .5;
			}

			.inspection-fraction {
				font-weight: bold;
			}

			.inspection-price {
				color: #ed6d00;
				font-weight: bold;
				border-bottom: 1px solid #ed6d00;
			}

			.space {
				text-indent: 2em;
			}
		}

		.state-img {
			width: 70px;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.inspection-text {
			width: 100%;
			min-height: 56px;
			color: #252527;
			font-size: 13px;
		}

		.inspection-num {
			width: 75px;
			height: 36px;
			color: #ed6d00;
			font-size: 25px;
			border: 1px solid #ed6d00;
			border-radius: 5px;
		}
	}

	.uni-popup {
		/deep/ .uni-transition {
			.uni-popup-dialog {
				width: 84vw;
			}

			.uni-dialog-title {
				padding-bottom: 15px;

				.uni-popup__error {
					color: #1C1C1C;
					font-size: 19px;
				}
			}

			.uni-dialog-content {
				padding: 0;
				padding-bottom: 15px;
			}
		}

	}

	.content {
		width: calc(100% - 20px);
		padding: 25px 10px;
		border-top: 1px solid #ddd;
		border-bottom: 1px solid #ddd;

		.content-popup {
			height: 30px;
			color: #1C1C1C;
			font-size: 10px;
			border: 1upx solid rgba(204, 204, 204, .5);
			border-bottom: none;
		}

		.content-popup:nth-last-of-type(1) {
			border-bottom: 1upx solid rgba(204, 204, 204, .5);
		}

		.staff-name {
			width: 85px;
			height: 100%;
			color: #666666;
			padding: 0 10px;
			display: flex;
			align-items: center;
			background: rgba(204, 204, 204, .3);
		}

		.reward {
			height: 100%;
			color: #666666;
			padding: 0 10px;
			display: flex;
			align-items: center;
		}
	}

	.page-bottom {
		background-color: #fff;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 0 10px;
		border-top: 1rpx solid rgba(182, 182, 182, .5);
	}

	.buttom-btn {
		height: 40px;
		line-height: 40px;
		text-align: center;
		border-radius: 20px;
		background-color: $uni-color-primary;
		color: #fff;
		position: absolute;
		top: 15px;
		left: 10px;
		right: 10px;
		font-size: $uni-font-size-base;
	}

	.upload-bg {
		background: #666666;
	}

	.mb10 {
		margin-bottom: 10px;
	}

	.popup {
		/deep/ .uni-popup__wrapper-box {
			width: calc(100% - 20px);
			margin: 0 10px;
			border-radius: 5px;
			position: relative;
		}

		/deep/ .uni-icons {
			position: absolute;
			z-index: 2;
			top: 4px;
			right: 3px;
			font-size: 20px !important;
		}
	}
</style>

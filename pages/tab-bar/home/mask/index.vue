<template>
	<view class="page-popup" @touchmove.stop.prevent="moveHandle">
		<!-- 签约截止 -->
		<uni-popup ref="popup" type="center" class="contract-popup flex a-center j-center">
			<view class="popup-box inspect">
				<view class="header-bg">
					<image class="img" src="@/static/image/home/bg@3x.png" mode="widthFix"></image>
					<uni-icons type="close" @click="closePopup('contract')"></uni-icons>
				</view>
				<scroll-view class="content-box" scroll-y>
					<view class="popup-content" v-for="(x,y) in contractList" :key="y">
						<view class="contract">
							<view class="content-name">请注意，{{x.ruleName}}签约任务即将截止</view>
							<view class="content-tips">正在核算您的成绩，可在商户中心-签约管理中查看</view>
						</view>
						<view class="contract">
							<view class="content-name">签约任务完成情况</view>
							<view class="content-tips">入库任务<text class="contract-num">{{x.sumMonthly}} </text> 条，完成 <text class="contract-num"> {{x.lowerLimitMonthly}} </text> 条</view>
						</view>
					</view>
				</scroll-view>
				<view class="check-tips flex a-center" @click="check('contract')">
					<uni-icons class="grey" :class="contractChecked? 'checked':''" :type="contractChecked? 'circle-filled' : 'circle'"
					 ></uni-icons>
					<text>当日不再提示</text>
				</view>
				<view class="btn-box flex a-center j-center">
					<button class="btn" type="default" @click="toContract">查看任务</button>
				</view>
			</view>
		</uni-popup>
		<!-- 店检截止 -->
		<uni-popup ref="checkPopup" type="center" class="check-popup flex a-center j-center">
			<view class="popup-box inspect">
				<view class="header-bg">
					<image class="img" src="@/static/image/home/bg@3x.png" mode="widthFix"></image>
					<uni-icons type="close" @click="closePopup('check')"></uni-icons>
				</view>
				<scroll-view class="content-box" scroll-y>
					<view class="popup-content" v-for="(x,y) in inspectList" :key="y">
						<view class="contract">
							<view class="content-name">请注意，{{x.inspectName}}店检任务即将截止</view>
							<view class="content-tips">正在核算您的成绩，可在工作台-店检中查看</view>
						</view>
						<view class="contract">
							<view class="content-name">店检任务完成情况</view>
							<view class="content-tips"><text class="contract-num">{{x.taskTotal}} </text> 店检项目，完成 <text class="contract-num"> {{x.taskComplete}} </text> 项</view>
						</view>
					</view>
				</scroll-view>
				<view class="check-tips flex a-center" @click="check('inspect')">
					<uni-icons class="grey" :class="inspectChecked? 'checked':''" :type="inspectChecked? 'circle-filled' : 'circle'"
					 ></uni-icons>
					<text>当日不再提示</text>
				</view>
				<view class="btn-box flex a-center j-center">
					<button class="btn" type="default" @click="toInspect">查看任务</button>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="registerPopup" type="center" class="register-popup flex a-center">
			<view class="popup-box flex">
				<view class="bg-img">
					<image src="@/static/image/home/register-bg@3x.png" mode="widthFix"></image>
				</view>
				<view class="register-content flex a-center j-center flex-column">
					<view class="register-title">新店注册礼包</view>
					<scroll-view class="card-box-wrap" scroll-y>
						<view class="register-coupon flex a-center j-center" v-for="(item,index) in regGiftList" :key="index">
							<view class="coupon-left">
								<view class="coupon-price">￥ <text style="font-size: 40rpx;">{{item.discountAmount}}</text></view>
								<view class="coupon-full-price" v-if="item.orderLimitType===1">满 {{item.orderLimitAmount}} 元可用</view>
								<view class="coupon-full-price" v-else>不限制</view>
							</view>
							<view class="coupon-right">
								<view class="coupon-title">{{item.couponName}}</view>
								<view class="coupon-time flex flex-column">
									<view class="">有效时间</view>
									<view class="time">{{item.startTime}} - {{item.endTime}}</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
			<uni-icons type="close" @click="closePopup('register')"></uni-icons>
		</uni-popup>
		<uni-popup ref="advertPopup" type="center" class="advert-popup flex a-center">
			<view class="popup-box flex">
				<image @click="change(false)" class="advert-left" src="@/static/image/home/advert-left.png" mode=""></image>
				<swiper class="swiper-box" circular :current="swiperIndex" @change="changeAdvert">
					<swiper-item 
						v-for="(item,index) in advertList" 
						:key="'advertList-' + index">
						<view style="width: 100%;height: 100%;" @click="navTo(item)">
							<fr-image loading-ing-img="oblique-light" :src="item.detail.imgUrl"></fr-image>
						</view>
					</swiper-item>
				</swiper>
				<image @click="change(true)" class="advert-right" src="@/static/image/home/advert-right.png" mode=""></image>
			</view>
			<uni-icons type="close" @click="closePopup('advert')"></uni-icons>
		</uni-popup>
		<uni-popup ref="couponPopup" type="center" class="coupon-popup flex a-center">
			<view class="popup-box flex">
				<view class="bg-img">
					<image class="c-img" src="@/static/image/home/coupon1.png"></image>
				</view>
				<view class="coupon-content flex a-center j-center flex-column">
					<scroll-view class="card-box-wrap-coupon" scroll-y>
						<view class="coupon-box flex a-center j-center" v-for="(item,index) in couponList" :key="index">
							<view class="coupon-left">
								<view class="coupon-price">￥ <text style="font-size: 38rpx;">{{item.price}}</text></view>
								<view class="coupon-time">有效时间</view>
							</view>
							<view class="coupon-right">
								<view class="coupon-title flex">
									<text>{{item.name}}</text>
									<view class="coupon-class">{{item.couponClass===1?'兑换券':'消费券'}}</view>
								</view>
								<view class="coupon-desc">{{item.desc}}</view>
								<view class="coupon-time">{{item.startTime}} - {{item.endTime}}</view>
							</view>
						</view>
					</scroll-view>
				</view>
				<view class="get-coupon" @click="getCoupon"></view>
			</view>
			<uni-icons type="close" @click="closePopup('coupon')"></uni-icons>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		name: 'HomePopup',
		props: {
			isRegister: {
				type: Boolean,
				default: () => false
			},
			isCheck: {
				type: Boolean,
				default: () => false
			},
			isContract: {
				type: Boolean,
				default: () => false
			},
			// 是否显示广告位
			isShowAdvert: {
				type: Boolean,
				default: () => false
			},
			// 是否显示优惠券
			isShowCoupon: {
				type: Boolean,
				default: () => false
			},
			regGiftList: {
				type: Array,
				default: () => []
			},
			inspectList: {
				type: Array,
				default: () => []
			},
			contractList: {
				type: Array,
				default: () => []
			},
			// 广告位集合
			advertList: {
				type: Array,
				default: () => []
			},
			// 优惠券集合
			couponList: {
				type: Array,
				default: () => []
			},
		},
		components: {},
		data() {
			return {
				inspectChecked:false,
				contractChecked:false,
				swiperIndex:0
			}
		},
		mounted() {},
		methods: {
			moveHandle() {
				return
			},
			/**
			 * 打开弹出层
			 */
			openPopup() {
				console.log(this.isRegister)
				if (this.isRegister) {
					this.$refs.registerPopup.open()
				}
				if (this.isCheck) {
					this.$refs.checkPopup.open()
				}
				if (this.isContract) {
					this.$refs.popup.open()
				}
				if(this.isShowAdvert){
					this.$refs.advertPopup.open()
				}
				if(this.isShowCoupon){
					this.$refs.couponPopup.open()
				}
			},
			/**
			 * 关闭弹出层
			 */
			closePopup(title) {
				if (title === 'contract') {
					this.$refs.popup.close()
				} else if (title === 'check') {
					this.$refs.checkPopup.close()
				} else if (title === 'advert') {
					this.$refs.advertPopup.close()
				}  else if (title === 'coupon') {
					this.$refs.couponPopup.close()
				} else {
					this.$refs.registerPopup.close()
				}
			},
			getCoupon(){
				this.closePopup('coupon')
			},
			/**
			 * 是否选择当日不再提示
			 * @param {Object} title
			 */
			check(title) {
				if (title === 'contract') {
					this.contractChecked = !this.contractChecked
					let today=this.contractChecked?(new Date().getMonth() +'/'+new Date().getDate()):''
					// #ifdef APP-PLUS
					plus.storage.setItem('contractTime', today)
					// #endif
					// #ifdef H5
					window.localStorage.setItem('contractTime',today);
					// #endif
				} else {
					this.inspectChecked = !this.inspectChecked
					let today=this.inspectChecked?(new Date().getMonth() +'/'+new Date().getDate()):''
					// #ifdef APP-PLUS
					plus.storage.setItem('inspectTime', today)
					// #endif
					// #ifdef H5
					window.localStorage.setItem('inspectTime',today);
					// #endif
				}

			},
			toInspect(){
				let that=this
				uni.navigateTo({
					url:'/pages/work/inspection/list',
					success() {
						that.closePopup('check')
					}
				})
			},
			toContract(){
				let that=this
				uni.navigateTo({
					url:'/pages/my-pages/contract/contract',
					success() {
						that.closePopup('contract')
					}
				})
			},
			/**
			 * 切换广告位
			 */
			change(type){
				let index = 0
				if(type){
					index = this.swiperIndex + 1
				}else{
					index = this.swiperIndex - 1
				}
				console.log(index,this.advertList.length)
				if(index < 0){
					this.swiperIndex = this.advertList.length - 1
				}else if(index > (this.advertList.length - 1)){
					this.swiperIndex = 0
				}else{
					this.swiperIndex = index
				}
			},
			
			/**
			 * 跳转页面
			 */
			navTo(item){
				let that = this
				const { linkUrl } = item.detail
				uni.navigateTo({
					url:linkUrl,
					success() {
						that.closePopup('advert')
					}
				})
			},
			
			
			/**
			 * 切换
			 */
			changeAdvert(e){
				const { current } = e.detail
				this.swiperIndex = current
			}
			
		}
	}
</script>

<style lang="scss" scoped>
	/*公共样式组件*/
	@font-face {
		font-family: "HYYaKuHeiW";
		src: url('/common/css/HYYaKuHeiW.ttf');
	}
	.card-box-wrap{
		height:240px;
		width:100%;
		overflow:hidden;
	}
	.card-box-wrap-coupon{
		height:204px;
		width:100%;
		overflow:hidden;
	}
	.page-popup {
		position: relative;
		z-index:100;
	}

	.popup-box {
		width: calc(100vw - 40rpx);
		background: #fff;
		border-radius: 20rpx;
	}

	.header-bg {
		width: 100%;
		position: relative;

		image {
			width: 100%;
			height: 100%;
		}

		.uni-icons {
			color: #fff !important;
			font-size: 36rpx !important;
			position: absolute;
			z-index: 20;
			top: 20rpx;
			right: 20rpx;
			font-weight: 400;
		}
	}

	.popup-content {
		margin: 0 20rpx;
		padding: 20rpx 0;
		border-bottom: 1px solid #FF4322;

		.contract:nth-of-type(1) {
			margin-bottom: 10rpx;
		}

		.content-name {
			color: $uni-text-color;
			font-weight: bold;
			font-size: $uni-font-size-base;
			margin-bottom: 10rpx;
		}

		.content-tips {
			font-size: $uni-font-size-sm;

			.contract-num {
				color: $uni-color-primary;
				font-weight: 500;
			}
		}
	}

	.check-tips {
		height: 80rpx;
		padding: 0 20rpx;
		color: $uni-text-color-subsidiary;
		font-size: $uni-font-size-sm;
		border-bottom: 1px solid #CCCCCC;

		.grey {
			margin-right: 12rpx;
		}

		.checked {
			color: $uni-color-primary !important;
		}
	}

	.btn-box {
		width: 100%;
		height: 120rpx;

		.btn {
			width: calc(100% - 100rpx);
			height: 80rpx;
			color: $uni-text-color-inverse;
			font-size: $uni-font-size-lg;
			font-weight: bold;
			background: $uni-color-primary;
			border-radius: 40rpx;
		}
	}
	.content-box{
		max-height:220px;
		overflow: hidden;
	}
	.contract-popup {
		position: absolute;
		z-index: 16;

		.uni-icons {
			z-index: 17;
		}
	}

	.check-popup {
		position: absolute;
		z-index: 13;

		.uni-icons {
			z-index: 14;
		}
	}

	.register-popup {
		position: absolute;
		z-index: 10;

		.popup-box {
			width: calc(100vw - 180rpx);
			height: 505px;
			position: relative;
			background: none;

			.bg-img {
				width: 100%;
				position: absolute;
				z-index: 11;
				top: 0;

				image {
					width: 100%;
					max-height:460px;
				}
			}

			.register-content {
				width: calc(100% - 80rpx);
				position: absolute;
				z-index: 12;
				padding: 0 40rpx;

				.register-title {
					font-family: HYYaKuHeiW;
					font-weight: 400;
					color: $uni-text-color-inverse;
					font-size: 40rpx;
					margin-top: 300rpx;
					margin-bottom: 40rpx;
				}

				.register-coupon {
					width: 100%;
					border-radius: 10rpx;
					background: $uni-text-color-inverse;
					margin-bottom: 20rpx;
					overflow: hidden;

					.coupon-left {
						padding: 10rpx;
						border-right: 1px dashed #FD9D1E;

						.coupon-price {
							color: #FD9D1E;
							font-size: 26rpx;
							font-family: HYYaKuHeiW;
						}

						.coupon-full-price {
							color: $uni-text-color;
							font-size: 10px;
						}
					}

					.coupon-right {
						padding: 10rpx;
						padding-left: 20rpx;

						.coupon-title {
							color: $uni-text-color;
							font-family: PingFang-SC-Heavy;
							font-weight: bold;
							font-size: 30rpx;
							margin-bottom: 0rpx;
							width:100%;
							max-width:170px;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}

						.coupon-time {
							color: rgba(51, 51, 51, .58);
							font-size: 22rpx;
							.time{
								font-size:10px;
							}
						}
					}
				}
			}
		}

		.uni-icons {
			color: #fff !important;
			font-size: 56rpx !important;
			position: absolute;
			z-index: 11;
			bottom: 0;
			left: 0;
			right: 0;
			margin: auto;
			font-weight: 400;
		}
	}
	.inspect{
		width:86vw;
		.header-bg{
			.img{
				width:100%;
				height:40.5428vw !important;
			}
		}
	}
	
	.advert-popup{
		position: absolute;
		z-index: 10;
		
		.popup-box {
			width: 608rpx;
			height: 888rpx;
			position: relative;
			background: none;
			bottom:40px;
			.swiper-box{
				position: absolute;
				width: 100%;
				height: 100%;
			}
			.advert-left{
				padding: 10px 0;
				width: 42rpx;
				height: 42rpx;
				top:calc(50% - 21rpx);
				right: calc((100vw - 608rpx) / 4 + 21rpx);
			}
			.advert-right{
				padding: 10px 0;
				width: 42rpx;
				height: 42rpx;
				top:calc(50% - 21rpx);
				left: calc(608rpx - 42rpx + ((100vw - 608rpx) / 4) - 21rpx);
			}
		}
		
		.uni-icons {
			color: #fff !important;
			font-size: 56rpx !important;
			position: absolute;
			z-index: 11;
			bottom: -54rpx;
			left: 0;
			right: 0;
			margin: auto;
			font-weight: 400;
		}
	}
	.coupon-popup{
		position: absolute;
		z-index: 12;
		/deep/.uni-mask--hook{
			background-color: rgba(0, 0, 0, 0.7) !important;
		}
		.popup-box {
			width: 800rpx !important;
			height: 887rpx !important;
			position: relative;
			background: none;
			margin:0 auto;
			bottom:40px;
			.bg-img,.c-img{
				width:100%;
				height:100%;
				object-fit: contain;
			}
			.get-coupon{
				background: url(../../../../static/image/home/coupon2.png) center center no-repeat;
				background-size:contain;
				width: 340rpx;
				height:70rpx;
				position: absolute;
				bottom:72rpx;
				left:230rpx;
				z-index: 12;
			}
			.coupon-content {
				width: 340rpx;
				position: absolute;
				top:228rpx;
				left:230rpx;
				z-index: 12;
				box-sizing: border-box;
				.coupon-box{
					width:340rpx;
					height:111rpx;
					background: url(../../../../static/image/home/coupon4.png) center center no-repeat;
					background-size:contain;
					display:flex;
					justify-content: flex-start;
					align-items: center;
					padding-bottom:10px;
					.coupon-left{
						flex:0 0 51px;
						display:flex;
						justify-content: center;
						align-items: center;
						flex-direction: column;
						color:rgb(130,16,19);
						font-size:11px;
						.coupon-price{
							font-size:20rpx;
						}
						.coupon-time{
							font-size:20rpx;
						}
					}
					.coupon-right{
						flex:1;
						color:rgb(130,16,19);
						.coupon-title{
							font-size:24rpx;
							justify-content: space-between;
							.coupon-class{
								background: url(../../../../static/image/home/coupon3.png) center center no-repeat;
								background-size:contain;
								color:#e9cca1;
								width:80rpx;
								height:34rpx;
								text-align: right;
								line-height: 34rpx;
								font-size:18rpx;
							}
						}
						.coupon-desc{
							font-size:18rpx;
						}
						.coupon-time{
							font-size:18rpx;
						}
					}
				}
				
			}
		}
		
		.uni-icons {
			color: #fff !important;
			font-size: 56rpx !important;
			position: absolute;
			z-index: 13;
			bottom: 0;
			left: 0;
			right: 0;
			margin: auto;
			font-weight: 400;
		}
	}
</style>

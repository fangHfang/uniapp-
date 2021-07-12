<template>
	<view class="page">
		<view class="bg-img"></view>
		<uni-nav-bar :border="false" class="high-index" title="签到" rightText="签到规则" backgroundColor="transparent" @clickRight="showRule"
		 left-icon="back" color="#fff" @clickLeft="toBack"></uni-nav-bar>
		<scroll-view class="con-container" :style="conContinerStyle" scroll-y>
			<view class="con-box">
				<view class="sign-btn-box high-index" :class="signed?'signed':''" @tap="toSign">
					<text class="iconfont qiandao"></text>
					<text>{{signed?'已签到':'签到'}}</text>
				</view>
				<view class="msg high-index">
					<text>已连续签到{{siStore.continuityCount}}天，继续加油！</text>
				</view>
				<view class="list-box">
					<MxDatePicker :show="showPicker" type="date" :highlightValue="signedList" color="#ed6d00" :showHoliday="false"
					 :pageInside="true" :disabledSelectDate="true" @changeDate="getSiStoreDateArray" />
				</view>
				<uni-list class="list-box">
					<uni-list-item :ellipsis="1" showArrow title="获取积分" :rightText="signNumber.integral ? signNumber.integral : '0'">
						<text class="score" :class="signed?'active':''">+1</text>
					</uni-list-item>
					<uni-list-item :ellipsis="1" showArrow title="获取返利" :rightText="signNumber.rebate ? signNumber.rebate : '0'" />
					<uni-list-item :ellipsis="1" showArrow title="获取兑换点" :rightText="signNumber.points ? signNumber.points : '0'" />
					<uni-list-item :ellipsis="1" showArrow title="获取优惠券" :rightText="signNumber.coupon ? signNumber.coupon : '0'" />
				</uni-list>
			</view>
		</scroll-view>
		<uni-popup ref="popup" type="dialog">
			<view class="modal-box">
				<view class="img-box">
					<image class="img" src="../../../static/image/work/sign-dialog.png" mode="aspectFit"></image>
				</view>
				<view class="rule-box">
					<scroll-view scroll-y="true" v-if="siStore.ruleDetails && siStore.ruleDetails.length > 0" class="rule-content">
						<view v-for="(item,index) in siStore.ruleDetails" :key="'list-' + index">{{index + 1}}、{{item}}</view>
					</scroll-view>
				</view>
				<view>
					<uni-icons class="icon-close" type="close" color="#fff" size="30" @click="closeRule" />
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import MxDatePicker from '@/components/mx-datepicker/mx-datepicker.vue'
	import '@/common/utils/DateUtil'
	import marketApi from '@/api/market/market.js'
	import { NO_ROW_LIMIT } from '@/static/base/system-constant' 
	import {dateFormat} from '@/common/utils/DateUtil.js'
	export default {
		name: 'sign',
		components: {
			MxDatePicker
		},
		data() {
			return {
				systemInfo: uni.getSystemInfoSync(),
				// 当日是否签到
				signed: false,
				signedList: [],
				showPicker: false,
				signNumber:{},
				integral: '500',
				// 签到记录详情
				siStore:{},
				// 选中日期
				selectedDay:new Date()
			}
		},
		onLoad(option) {},
		mounted() {
			this.$nextTick(() => {
				this.showPicker = true
			})
			// 查询签到记录
			this.getSiStoreDetail()
			// 查询签到记录集合
			this.getSiStoreDateArray(new Date())
			// 查询是否可以签到
			this.getSiStoreHasStatus()
		},
		computed: {
			//安全区域
			safeArea() {
				return this.systemInfo.safeAreaInsets
			},
			//内容区域样式
			conContinerStyle() {
				let height = this.systemInfo.windowHeight - this.safeArea.top - 45 - this.safeArea.bottom
				return `height:${height}px;`
			},
		},
		methods: {
			/**
			 * 查询是否可以签到
			 */
			getSiStoreHasStatus(){
				marketApi.siStoreHasStatus().then((res)=>{
					this.signed = !res.data
				}).catch((err)=>{
					console.log(err,'err')
				})
			},
			/**
			 * 查询签到记录
			 */
			getSiStoreDetail(){
				marketApi.getSiStoreDetail().then((res)=>{
					const { lastSignInTime } = res.data
					this.siStore = res.data
					this.signNumber = res.data.storeOneDayRewardDTO
					console.log(this.signNumber)
				}).catch((err)=>{
					console.log(err,'err')
				})
			},
			
			/**
			 * 查询签到记录
			 */
			getSiStoreDateArray(date){
				let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
				let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
				let param = {
					endDate:dateFormat('yyyy-MM-dd',lastDay),
					startDate:dateFormat('yyyy-MM-dd',firstDay)
				}
				marketApi.listSiStoreDateArray(this.$jsonFormat(param)).then((res)=>{
					let list = res.data.map((item)=>{
						return item.signInTime
					})
					this.signedList = list
				}).catch((err)=>{
					console.log(err,'err')
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
			 * 点击签到
			 */
			toSign() {
				if(this.signed){
					uni.showToast({
						title:'您今天已经签过到了',
						icon:'none'
					})
					return
				}
				marketApi.signInSiStore().then((res)=>{
					uni.showToast({
						title:'签到成功',
						icon:'none'
					})
					let today = (new Date()).format("yyyy/MM/dd")
					this.signed = true
					this.signedList.push(today)
					this.integral = '' + (parseInt(this.integral) + 1)
				}).catch((err)=>{
					console.log(err,'err')
				})
			},
			/**
			 * 显示签到规则
			 */
			showRule() {
				this.$refs.popup.open()
			},
			closeRule() {
				this.$refs.popup.close()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		height: 100vh;
		background-color: #fff;
		overflow: hidden;
	}

	.high-index {
		position: relative;
		z-index: 1;
	}
	.con-box {
		overflow: hidden;
	}

	.bg-img {
		height: 300px;
		width: 100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 0;
		// background-color: $uni-color-primary;
		background-image: url('@/static/image/work/sign-bg.png');
		background-size: cover;
		background-position: 0 0;
		background-repeat: no-repeat;
	}

	.sign-btn-box {
		width: 120px;
		height: 40px;
		border: 1px solid #fff;
		border-radius: 40px;
		background-color: #fff;
		margin: 20px auto 10px;
		color: $uni-color-primary;
		font-size: $uni-font-size-lg;
		display: flex;
		justify-content: center;
		align-items: center;

		.iconfont {
			font-size: 20px;
			margin-right: 10px;
		}

		&.signed {
			background-color: $uni-color-primary;
			color: #fff;
		}
	}

	.score {
		position: absolute;
		top: 2px;
		right: 20px;
		color: $uni-color-primary;
		font-size: $uni-font-size-sm;
		opacity: 0;

		&.active {
			-webkit-animation: 2s hue ease-in-out;
			animation: 2s hue ease-in-out;
		}
	}

	.msg {
		padding: 10px 10px 20px;
		text-align: center;
		color: #fff;
		font-size: $uni-font-size-base;
		font-weight: 300;
	}

	.list-box {
		margin: 10px;
		border-radius: $uni-border-radius-base;
		overflow: hidden;
		box-shadow: 0px 2px 43px 0px rgba(253, 80, 34, 0.33);
	}

	.modal-box {
		width: calc(100vw - 120rpx);
		height: calc((100vw - 120rpx)*1.3);
		position: relative;
		margin-top: 100rpx;

		.img-box {
			width: 100%;
			height: calc((100vw - 120rpx)*1.03);
			;

			.img {
				width: 100%;
				height: 100%;
			}
		}

		.rule-box {
			position: absolute;
			top: 240rpx;
			left: 0;
			width: 100%;
			height: 380rpx;
			overflow: auto;

			.rule-content {
				padding: 0 20px;
				display: flex;
				flex-direction: column;
				width: calc(100% - 40px);
				height: 380rpx;
				>view {
					font-size: $uni-font-size-base;
					color: #333;
					line-height: 46rpx;
				}
			}
		}

		.icon-close {
			position: absolute;
			left: 50%;
			margin-left: -12px;
			bottom: 0;
		}
	}

	@-webkit-keyframes hue {
		0% {
			opacity: 1;
		}

		100% {
			opacity: 0;
		}
	}
</style>

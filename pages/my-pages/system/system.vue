<template>
	<view class="page">
		<uni-nav-bar title="系统" left-icon="back" backgroundColor="#ed6d00" color="#fff" @clickLeft="toBack">
		</uni-nav-bar>
		<uni-card :is-shadow="true" mode='basic' class="page-card">
			<view class="item-card flex a-center j-space-between" @click="aboutUs">
				<view class="card-img flex a-center j-center">
					<image src="../../../static/image/my/banbenhao.png" mode="widthFix"></image>
					<view class="card-name">关于我们</view>
				</view>
				<view class="edition flex a-center j-center">
					<view class="edition-num">{{editionNum}}</view>
					<icon class="iconfont right" type=""></icon>
				</view>
			</view>
			<view class="item-card flex a-center j-space-between" @click="toLocation">
				<view class="card-img flex a-center j-center">
					<image src="../../../static/image/my/mendiandingwei.png" mode="widthFix"></image>
					<view class="card-name">门店定位</view>
				</view>
				<view class="edition flex a-center j-center">
					<view class="edition-num">{{storeAddress}}</view>
					<icon class="iconfont right" type=""></icon>
				</view>
			</view>
			<view class="item-card flex a-center j-space-between" @click="logOut">
				<view class="card-img flex a-center j-center">
					<image src="../../../static/image/my/tuichudenglu.png" mode="widthFix"></image>
					<view class="card-name">退出登录</view>
				</view>
				<view class="edition flex a-center j-center">
					<icon class="iconfont right" type=""></icon>
				</view>
			</view>
			<view class="item-card flex a-center j-space-between" @click="modifyNum">
				<view class="card-img flex a-center j-center">
					<image src="../../../static/image/my/banbenhao.png" mode="widthFix"></image>
					<view class="card-name">修改号码</view>
				</view>
				<view class="edition flex a-center j-center">
					<icon class="iconfont right" type=""></icon>
				</view>
			</view>
		</uni-card>
		<uni-popup ref="popup" type="dialog">
			<uni-popup-dialog mode="base" title="" content="确定退出当前账号吗？" :duration="2000" :before-close="true"
				@close="close" @confirm="confirm"></uni-popup-dialog>
		</uni-popup>
		<yu-toast :message1="powerData.msg1" :message2="powerData.msg2" :duration="powerData.duration"
			verticalAlign="center" :backgroundColor="powerData.bgColor" :color="powerData.fontColor" ref="power">
		</yu-toast>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import yuToast from '@/components/yu-toast/yu-toast'
	import AjaxUtil from "@/common/utils/request.js"
	import system from "@/api/system/system.js"
	export default {
		name: 'system',
		components: {},
		data() {
			return {
				editionNum: 'V1.01',
				storeAddress: '',
				// 权限提示
				powerData: {
					msg1: '您没有权限,',
					msg2: '请开通相应权限。',
					duration: 2000,
					bgColor: "#000000cc",
					fontColor: "#ed6d00",
				},
			}
		},
		computed: {
			...mapState({
				// 权限集合
				resourceList: state => state.login.resourceList
			}),
		},
		onLoad() {
			this.getSystemVersion()
		},
		methods: {
			getSystemVersion() {
				// #ifdef APP-PLUS
				console.log(plus.runtime)
				this.editionNum = 'V'+plus.runtime.version
				// #endif
			},
			getVersion() {
				let postData = {
					// 更新类型 0-总部 1-经销商Android-APP 2-经销商IOS-APP 7-门店Android-APP；9-门店IOS-APP
					updateType: uni.getSystemInfoSync().platform === 'ios' ? 9 : 7
				}
				system.getAppVersion(postData).then(res => {
					if (res.code === 200) {
						this.editionNum = res.data.editionNo
					}else{
						uni.showToast({
							icon:'none',
							title:res.msg
						})
					}
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
			 * 打开关于我们
			 */
			aboutUs() {
				// uni.navigateTo({
				// 	url: '/pages/my-pages/system/about-us/aboutUs'
				// })
			},
			/**
			 * 打开门店定位
			 */
			toLocation() {
				// 门店定位权限-STOREAPPA061001
				if (!this.resourceList.some((item) => {
						return item.resourceNo === 'STOREAPPA061001'
					})) {
					this.$refs.power.show()
					return
				}
				uni.navigateTo({
					url: '/pages/my-pages/system/location/list/list'
				})
			},
			/**
			 * 退出登录
			 */
			logOut() {
				this.$refs.popup.open();
			},
			/**
			 * 点击取消按钮触发
			 * @param {Object} done
			 */
			close(done) {
				done()
			},
			/**
			 * 点击确认按钮触发
			 * @param {Object} done
			 */
			confirm(done) {
				// 将登录后的token存入 local Storage
				AjaxUtil.setAccessToken('')
				uni.reLaunch({
					url: "/pages/login/login"
				})
				done()
			},
			/**
			 * 修改号码
			 */
			modifyNum() {
				// 修改号码权限-STOREAPPA061002
				if (!this.resourceList.some((item) => {
						return item.resourceNo === 'STOREAPPA061002'
					})) {
					this.$refs.power.show()
					return
				}
				uni.navigateTo({
					url: '/pages/my-pages/modify/modify-num'
				})
			}
		}
	}
</script>

<style lang="scss">
	.page {
		height: 100vh;
		background-color: #F2F2F2;
	}

	.page-card {
		background-color: #fff;

		.item-card {
			height: 52px;

			.card-img {
				image {
					width: 14px;
				}

				.card-name {
					color: #666;
					font-size: 14px;
					font-weight: bold;
					margin-left: 7px;
				}
			}

			.edition {
				.edition-num {
					color: #1C1C1C;
					font-size: 14px;
					margin-right: 10px;
				}

				.iconfont {
					color: #252527;
					opacity: 0.62;
					font-size: 9px;
				}
			}
		}
	}
</style>

<template>
	<view class="page">
		<view v-if="fullScreen" class="full-screen">
			<image src="../../static/image/login/bg-1.png" mode="aspectFill"></image>
		</view>
		<image class="bg-image" src="../../static/image/login/bg-1.png" mode="aspectFill"></image>
		<!-- 一键登录和验证码登录 -->
		<view v-if="showType === 'all'" class="button-box">
			<view :animation="animationData" style="transform: translateY(100px);opacity:0;">
				<view class="local-phone" @click="changeShowType('local')">
					<text>本机号码一键登录</text>
				</view>
				<view class="code-phone" @click="changeShowType('code')">
					<text>手机验证码登录</text>
				</view>
				<view class="code-phone" @click="register">
					<text>注册</text>
				</view>
				<view class="privacy-services" @click="privacyChange">
					<view :class="{'active':privacyActive}"></view>
					<text>勾选表示同意<text class="under-line" @click.stop="toPrivacy">《隐私政策》</text>、<text class="under-line" @click.top="toService">《服务政策》</text></text>
				</view>
			</view>
		</view>
		<!-- 一键登录和验证码登录 -->

		<!-- 一键登录 -->
		<view v-if="showType === 'local'" class="local-box" >
			<image src="../../static/image/login/bg2.png" mode="aspectFill"></image>
			<text class="local-phone">本机号码</text>
			<!-- <text class="phone-number">13071231555</text> -->
			<view class="code-phone" @click="changeShowType('code')">
				<text>手机验证码登录</text>
				<icon class="iconfont jiantou" style='color:#ed6d00;font-size: 32rpx;' type=""></icon>
			</view>
			<view class="quick-login" @click="arouseLoginPage">
				<text>一键登录</text>
			</view>
		</view>
		<!-- 一键登录 -->

		<!-- 验证码登录 -->
		<view v-if="showType === 'code'" class="code-box">
			<image src="../../static/image/login/bg3.png" mode="aspectFill"></image>
			<text class="local-phone">验证码登录</text>
			<uni-forms class="form-box" :value="loginForm" ref="form">
				<uni-forms-item class="form-item" name="phone">
					<uni-easyinput class="form-input" type="text" v-model="loginForm.phone" placeholder="输入手机号码" :clearable="false" @input="checkPhone" :maxlength="11"/>
					<text v-if="errMsg.phone" class="err-message phone">手机号错误请重新输入</text>
				</uni-forms-item>
				<uni-forms-item class="form-item" name="code">
					<uni-easyinput class="form-input" type="text" v-model="loginForm.code" placeholder="输入验证码" :clearable="false" @input="checkCode" :maxlength="6"/>
					<text v-if="codeForm.time" class="get-code">获取验证码({{codeForm.time}}s)</text>
					<text v-else class="get-code" @click="setVerCode">获取验证码</text>
					<text v-if="errMsg.code" class="err-message code">验证码错误重新获取</text>
				</uni-forms-item>
			</uni-forms>
			<text class="login-button" @click="loginClick">登录</text>
			<view class="privacy-services" @click="privacyCodeChange">
				<view :class="{'active':privacyActiveCode}"></view>
				<text>勾选表示同意<text class="under-line" @click.stop="toPrivacy">《隐私政策》</text>、<text class="under-line" @click.top="toService">《服务政策》</text></text>
			</view>
		</view>
		<!-- 验证码登录 -->
		
		<!-- 版本更新弹窗 -->
		<version-update ref="update"></version-update>
		<!-- 版本更新弹窗 -->
	</view>
</template>

<script>
	const uVerify = uni.requireNativePlugin('FuTong-UVerify')
	import AjaxUtil from "@/common/utils/request.js"
	import * as SystemConstant from '@/static/base/system-constant.js'
	import login from '@/api/login/login.js'
	import versionUpdate from '@/components/version-update/version-update.vue'
	export default {
		name: 'Login',
		components: {},
		data() {
			return {
				animationData: {},
				// 是否选中隐私服务
				privacyActive:true,
				// 验证码-是否选中隐私服务
				privacyActiveCode:true,
				// 显示步骤 all-显示本机，验证码，local-显示本机一键登录，code-验证码
				showType:"all",
				// 登录表单
				loginForm:{
					phone:"",
					code:""
				},
				// 验证码
				codeForm:{
					time:0,
					fuc:""
				},
				// 是否显示错误信息
				errMsg:{
					phone:false,
					code:false
				},
				// 显示启动图
				fullScreen:true,
				// 控制点击次数
				codeLoading:false
			}
		},
		onLoad() {
			// 登录流程
			this.loginProcess()
		},
		mounted() {
			let platform = uni.getSystemInfoSync().platform
			uVerify && uVerify.init(SystemConstant.VERIFY_INFO.appKey[platform], "maxxis_store_app_" + platform)
		},
		methods: {
			/**
			 * 应急-暂时随便掉个接口测试token是否过期
			 * 流程-调用接口测试token是否过期
			 * 过期则隐藏启动图-走登录
			 * 未过期则跳转至首页，隐藏启动图
			 */
			loginProcess(){
				let _this = this
				// type = true token未过期  false token 过期 重新登录
				let navTo = (type)=>{
					setTimeout(()=>{
						if(type){
							uni.reLaunch({
								url:"/pages/index/index",
								complete:()=>{
									_this.fullScreen = false
								}
							})
						}else{
							_this.fullScreen = false
							// 显示按钮
							_this.animation()
							// 检查版本更新
							_this.$refs.update.checkUpdate()
						}
					},2000)
				}
				let url = '/api/user/store/app/location/page'
				let uniUrl = ''
				// #ifdef APP-PLUS
				// 手动拼接全路径
				url = url.substring(url.indexOf("/api/") + 4)
				uniUrl = SystemConstant.URL + url
				// #endif
				// #ifdef H5
				uniUrl = url
				// #endif
				uni.request({
					url:uniUrl,
					data: {},
					header:AjaxUtil.getHeader(),
					method:"GET",
					success: (result) => {
						const { msg, code } = result.data;
						if (code === 200) {
							// 成功
							navTo(true)
						}else{
							navTo(false)
						}
					},
					fail: (err) => {
						// 处理其他情况
						navTo(false)
					},
					complete: (data) => {
						console.log(data,"complete")
					}
				})
			},


			animation(){
			  let animation = uni.createAnimation({
					duration: 1000,
					timingFunction: 'ease',
				})
			  animation.opacity(1).translate(0).step()
			  this.animationData = animation.export()
			},

			/**
			 * 选中隐私
			 */
			privacyChange(){
				this.privacyActive = !this.privacyActive
			},
			/**
			 * 验证码-选中隐私
			 */
			privacyCodeChange(){
				this.privacyActiveCode = !this.privacyActiveCode
			},

			/**
			 * 切换显示类型
			 * all-显示本机，验证码，local-显示本机一键登录，code-验证码
			 */
			changeShowType(type){
				this.showType = type
			},

			/**
			 * 校验手机号是否正确
			 */
			checkPhone(val){
				if(val.length === 11){
					if(!RegExp(/^[1][3,4,5,6,7,8,9][0-9]{9}$/).test(val)){
						this.errMsg.phone = true
					}else{
						this.errMsg.phone = false
					}
				}
			},

			/**
			 * 校验手机号是否正确
			 */
			checkCode(val){
				if(val.length === 6){
					if(!RegExp(/^\d{6}$/).test(val)){
						this.errMsg.code = true
					}else{
						this.errMsg.code = false
					}
				}
			},

			/**
			 * 发送验证码
			 */
			setVerCode(){
				if(this.errMsg.phone || this.loginForm.phone.length !== 11){
					uni.showToast({
						icon:"none",
						title:"请输入正确的手机号"
					})
					return
				}
				if(this.codeLoading){
					return
				}
				this.codeLoading = true
				let _this = this
				let postData = {
					phone:this.loginForm.phone
				}
				let payload = this.$jsonFormat(postData)
				login.sendCode(payload).then((res)=>{
					this.codeLoading = false
					_this.loginForm.code = ""
					_this.codeForm.time = 60
					_this.codeForm.fuc = setInterval(()=>{
						_this.codeForm.time--
						if(_this.codeForm.time <= 0){
							clearInterval(_this.codeForm.fuc)
						}
					},1000)
				}).catch((err)=>{
					this.codeLoading = false
					uni.showToast({
						icon:"none",
						title:"验证码发送失败"
					})
				})
			},

			/**
			 * 登录点击按钮
			 */
			loginClick(){
				if(this.errMsg.phone || this.loginForm.phone.length !== 11){
					uni.showToast({
						icon:"none",
						title:"请输入正确的手机号"
					})
					return
				}
				if(this.errMsg.code || this.loginForm.code.length !== 6){
					uni.showToast({
						icon:"none",
						title:"请输入正确的验证码"
					})
					return
				}
				if(!this.privacyActiveCode){
					uni.showToast({
						icon:"none",
						title:"请同意隐私政策"
					})
					return
				}
				let _this = this
				let postData = {
					phone:this.loginForm.phone,
					smsCode:this.loginForm.code,
					loginType:"sms"
				}
				let payload = this.$jsonFormat(postData)
				login.login(payload).then((res)=>{
					const {access_token,token_type} = res.data
					// 将登录后的token存入 local Storage
					AjaxUtil.setAccessToken(token_type + access_token)
					uni.setStorageSync('currentPhone', this.loginForm.phone)
					uni.showToast({
						icon:"none",
						title:"登录成功",
						complete:()=>{
							uni.redirectTo({
								url:"/pages/index/index",
							})
						}
					})
				}).catch((err)=>{
					uni.showToast({
						icon:"none",
						title:err.msg
					})
				})
			},

			/**
			 * 一键登录
			 */
			arouseLoginPage(){
				console.log(123)
				//设置页面配置 https://developer.umeng.com/docs/143070/detail/144780
				if(uVerify.setAuthUIConfig){
					console.log(uVerify.setAuthUIConfig)
					setTimeout(()=>{
						uVerify.setAuthUIConfig({
							"privacyState":true,
							"statusBarColor":-16617774
						})
					},500)
				}
				
				let platform = uni.getSystemInfoSync().platform
				uVerify.getLoginToken(SystemConstant.VERIFY_INFO.secretKey[platform], 5000, async (data) => {
					let resultKey = { ios: 'resultCode', android: 'code'  }

					if (data[resultKey[platform]] !== '600000') {
						if((data[resultKey[platform]] + '').indexOf('6000') !== -1 && data[resultKey[platform]] !== '600001'){
							uni.showToast({ title: data.msg, icon:'none', duration: 2000 })
						}
						return;
					}
					const {token,source} = data
					let verifyId = await uVerify.getVerifyId()
					let param = {
						token: token,
						platform: platform,
						verifyId:verifyId
					}
					uni.showLoading({mask:true})
					this.autoLogin(param)
				})
			},


			/**
			 * 唤起一键登录页面
			 */
			autoLogin(param){
				let payload = this.$jsonFormat(param)
				login.autoLogin(payload).then((res)=>{
					const {access_token,token_type} = res.data
					// 将登录后的token存入 local Storage
					AjaxUtil.setAccessToken(token_type + access_token)
					uni.setStorageSync('currentPhone', this.loginForm.phone)
					uni.hideLoading()
					uVerify.hideLoginLoading()
					uVerify.quitLoginPage()
					uni.showToast({
						icon:"none",
						title:"登录成功",
						complete:()=>{
							uni.redirectTo({
								url:"/pages/index/index",
							})
						}
					})
				}).catch((err)=>{
					uni.hideLoading()
					uVerify.hideLoginLoading()
					uVerify.quitLoginPage()
					uni.showToast({
						title:err.msg,
						icon:'none'
					})
					console.log(err)
				})
			},



			/**
			 * 注册，点击跳转注册页面
			 */
			register(){
				uni.navigateTo({
					url:'./register'
				})
			},

			/**
			 * 跳转服务
			 */
			toService(){
				uni.navigateTo({
					url:"/pages/my-pages/clause/service"
				})
			},

			/**
			 * 跳转隐私
			 */
			toPrivacy(){
				uni.navigateTo({
					url:"/pages/my-pages/clause/service"
				})
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	.page{
		height: 100vh;
	}
	.full-screen{
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 100;
		>image{
			width: 100%;
			height: 100%;
		}
	}
	// 背景
	.bg-image{
		width: 100%;
		height: 100vh;
		position: absolute;
	}
	// all
	.button-box{
		position: absolute;
		top:calc(520rpx + var(--status-bar-height));
		width: 100%;
		// 本机一键登录
		.local-phone{
			width: calc(100% - 150rpx);
			height: 90rpx;
			margin: auto;
			background-color: #FFFFFF;
			border-radius: 30rpx;
			text-align: center;
			line-height: 90rpx;
			>text{
				font-size: 36rpx;
				font-weight: bold;
				color: $uni-color-primary;
			}
		}
		// 验证码登录
		.code-phone{
			width: calc(100% - 150rpx);
			height: 90rpx;
			margin: 40rpx auto 60rpx;
			border: 4rpx solid #FFFFFF;
			border-radius: 30rpx;
			text-align: center;
			line-height: 90rpx;
			>text{
				font-size: 36rpx;
				font-weight: bold;
				color: #FFFFFF;
			}
		}
		// 隐私服务
		.privacy-services{
			width: 100%;
			margin: auto;
			display: flex;
			justify-content: center;
			align-items: center;
			>view{
				border: 2rpx solid #FFFFFF;
				width: 16px;
				height: 16px;
				border-radius: 50%;
				margin-right:10rpx;
				position: relative;
			}
			>text{
				font-size: 26rpx;
				font-weight: 500;
				color: #FFFFFF;
			}
			.active::before{
				content: '';
				position: absolute;
				width: 12px;
				height: 12px;
				left: 2px;
				top: 2px;
				background-color: #FFFFFF;
				border-radius: 50%;
			}
		}
	}

	// local
	.local-box{
		position: relative;
		top:30%;
		transform: translateY(0%);
		width: calc(100% - 100rpx);
		margin: auto;
		padding: 0 40rpx 0;
		display: flex;
		flex-direction: column;
		box-shadow: 0px 12px 24px 3px rgba(181, 43, 0, 0.3);
		>image{
			width: 100%;
			height: 100%;
			position: absolute;
			left: 0;
			top: 0;
			z-index: -1;
			border-radius: 30rpx;
		}
		.local-phone{
			font-size: 40rpx;
			font-weight: 400;
			color: $uni-color-primary;
			margin-top: 72rpx;
			line-height: 38rpx;
			margin-bottom: 40rpx;
		}
		.phone-number{
			font-size: 40rpx;
			font-weight: bold;
			color: $uni-color-primary;
			margin-bottom: 40rpx;
		}
		.code-phone{
			width: 250rpx;
			line-height: 50rpx;
			border: 2rpx solid $uni-color-primary;
			border-radius: 25rpx;
			display: flex;
			align-items: center;
			margin-bottom: 50rpx;
			>text{
				font-size: 24rpx;
				color: $uni-color-primary;
				padding: 13rpx 15rpx 13rpx 22rpx;
				line-height: 23rpx;
			}
		}
		.quick-login{
			background-color: $uni-color-primary;
			border-radius: 30px;
			line-height: 60rpx;
			width: 170rpx;
			display: flex;
			margin-bottom: 70rpx;
			>text{
				line-height: 30rpx;
				font-size: 30rpx;
				font-weight: bold;
				color: #FFFFFF;
				padding: 15rpx 25rpx;
			}
		}
	}
	// code
	.code-box{
		position: relative;
		top:50%;
		transform: translateY(-50%);
		width: calc(100% - 200rpx);
		margin: auto;
		padding: 0 60rpx 0;
		display: flex;
		flex-direction: column;
		box-shadow: 0px 12px 24px 3px rgba(181, 43, 0, 0.3);
		>image{
			width: 100%;
			height: 100%;
			position: absolute;
			left: 0;
			top: 0;
			z-index: -1;
			border-radius: 30rpx;
		}
		.local-phone{
			font-size: 40rpx;
			font-weight: 400;
			color: $uni-color-primary;
			margin-top: 72rpx;
			line-height: 38rpx;
			margin-bottom: 50rpx;
		}
		/deep/.form-box{
			padding: 0;
			.form-item{
				background-color: rgba(255,255,255,0);
				margin-bottom: 25rpx;
				.phone{
					position: absolute;
					right: 0px;
					bottom: 13rpx;
				}
				.code{
					position: absolute;
					right: 180rpx;
					bottom: 13rpx;
				}
			}
		}
		/deep/.form-input{
			.uni-easyinput__content{
				border-top-width: 0;
				border-left-width: 0;
				border-right-width: 0;
				border-radius: 0;
				border-color: $uni-color-primary!important;
				background-color: rgba(255,255,255,0)!important;
				.uni-easyinput__content-input{
					padding-left: 0!important;
					.input-placeholder{
						font-size: 30rpx;
						color: $uni-color-primary;
						opacity: 0.7;
					}
					.uni-input-input{
						color: $uni-color-primary;
					}
				}
			}
		}
		.get-code{
			padding: 13rpx 11rpx;
			border: 1rpx solid $uni-color-primary;
			border-radius: 5rpx;
			font-size: 26rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: $uni-color-primary;
			right: 20rpx;
			bottom: 15rpx;
			position: absolute;
		}
		.login-button{
			margin-top: 26rpx;
			margin-bottom: 50rpx;
			font-size: 30rpx;
			padding:10rpx 0;
			font-weight: bold;
			color: #FFFFFF;
			line-height: 30px;
			text-align: center;
			border-radius: calc((100vw - 200rpx - 120rpx) / 2);
			background-color: $uni-color-primary;
		}
		// 隐私服务
		.privacy-services{
			width: 100%;
			margin: auto;
			display: flex;
			justify-content: center;
			align-items: center;
			margin-bottom: 72rpx;
			>view{
				border: 2rpx solid $uni-color-primary;
				width: 16px;
				height: 16px;
				border-radius: 50%;
				margin-right:10rpx;
				position: relative;
			}
			>text{
				font-size: 26rpx;
				font-weight: 500;
				color: $uni-color-primary;
			}
			.active::before{
				content: '';
				position: absolute;
				width: 12px;
				height: 12px;
				left: 2px;
				top: 2px;
				background-color: $uni-color-primary;
				border-radius: 50%;
			}
		}
		// 错误信息
		.err-message{
			font-size: 22rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: #E70202;
		}
	}
	.under-line{
		text-decoration: underline;
	}
	
</style>

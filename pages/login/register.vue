<template>
	<view class="page" :style="`height:${systemInfo.windowHeight}px`">
		<uni-nav-bar title="门店注册" left-icon="back" backgroundColor="#ed6d00" color="#fff" @clickLeft="toBack"></uni-nav-bar>
		<view class="function-content">
			<view class="content-title">经销商信息</view>
			<view class="feedback" style="padding-top: 0;">
				<view class="info">
					<view class="flex a-center j-space-between">
						<view class="info-title flex a-center">所属经销商*</view>
						<view class="tag">请扫描经销商码</view>
					</view>
					<uni-easyinput class="feedback-input" disabled suffixIcon="scan" v-model="registerForm.dealerName" placeholder="请输入" @iconClick="scanCodeDealer" @blur="blurInp(registerForm.dealerName,'dealerName')"></uni-easyinput>
				</view>
				<view class="info">
					<view class="info-title flex a-center">经销商编号*</view>
					<input class="feedback-content" disabled v-model="registerForm.dealerNo" type="text" value="" placeholder="请输入" @blur="blurInp(registerForm.dealerNo,'dealerNo')" />
				</view>
			</view>
			<view class="flex a-center j-space-between">
				<view class="content-title">门店信息</view>
				<view class="tag" @click="addLicense">拍照添加门店信息
				    <uni-icons type="camera-filled"></uni-icons>
				</view>
			</view>
			<view class="feedback" style="padding-top: 0;">
				<view class="info">
					<view class="info-title flex a-center">门店名称*</view>
					<input class="feedback-content" v-model="registerForm.name" type="text" value="" placeholder="请输入" @blur="blurInp(registerForm.name,'name')" />
				</view>
				<view class="info">
					<view class="info-title flex a-center">负责人*</view>
					<input class="feedback-content" v-model="registerForm.contact" type="text" value="" placeholder="请输入" @blur="blurInp(registerForm.contact,'contact')" />
				</view>
				<view class="info">
					<view class="info-title flex a-center">联系人手机号*</view>
					<input class="feedback-content" v-model="registerForm.contactPhone" type="text" value="" placeholder="请输入" @blur="blurInp(registerForm.contactPhone,'contactPhone')" />
				</view>
				<view class="info">
					<view class="flex a-center j-space-between">
						<view class="info-title flex a-center">门店地址*</view>
						<view class="tag flex" @click="getLocation">
								<text>使用当前定位</text>
						    <icon class="iconfont dangqianweizhi" type=""></icon>
						</view>
					</view>
					<input class="feedback-content mgb10" v-model="registerForm.districtName" disabled type="text" value="" placeholder="请选择地址"  />
					<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault" @onCancel="onCancel" @onConfirm="onConfirm"></mpvue-city-picker>
					<input class="feedback-content" v-model="registerForm.address" disabled type="text" value="" placeholder="请输入" @blur="blurInp(registerForm.address,'address')" />
				</view>
			</view>
			<view class="content-title">门店信息</view>
			<view class="feedback">
				<view class="info">
					<view class="info-title flex a-center">上传图片*(身份证仅需正面即可)</view>
					<view class="flex a-center j-space-between">
						<view class="camera-box">
							<view class="camera flex a-center j-center" v-if="registerForm.license">
								<image :src="registerForm.license" mode="heightFix"></image>
								<view class="cu-tag bg-red" @tap.stop="DelImg('license')">
									<uni-icons type="closeempty"></uni-icons>
								</view>
							</view>
							<view v-else class="camera flex a-center j-center" @click="takePhoto('license')">
								<uni-icons type="camera"></uni-icons>
							</view>
							<view class="tag mgt5 flex a-center j-center">营业执照照片</view>
						</view>
						<view class="camera-box">
							<view class="camera flex a-center j-center" v-if="registerForm.doorUrl">
								<image :src="registerForm.doorUrl" mode="heightFix"></image>
								<view class="cu-tag bg-red" @tap.stop="DelImg('doorUrl')">
									<uni-icons type="closeempty"></uni-icons>
								</view>
							</view>
							<view v-else class="camera flex a-center j-center" @click="takePhoto('doorUrl')">
								<uni-icons type="camera"></uni-icons>
							</view>
							<view class="tag mgt5 flex a-center j-center">门头照片</view>
						</view>
						<view class="camera-box">
							<view class="camera flex a-center j-center" v-if="registerForm.contactUrl">
								<image :src="registerForm.contactUrl" mode="heightFix"></image>
								<view class="cu-tag bg-red" @tap.stop="DelImg('contactUrl')">
									<uni-icons type="closeempty"></uni-icons>
								</view>
							</view>
							<view v-else class="camera flex a-center j-center" @click="takePhoto('contactUrl')">
								<uni-icons type="camera"></uni-icons>
							</view>
							<view class="tag mgt5 flex a-center j-center">负责人身份证照片</view>
						</view>
					</view>
				</view>
			</view>
			<view class="checkbox">
				<view class="flex a-center">
					<checkbox-group @change="changeIsAgree">
						<label>
							<checkbox value="true" />
						</label>
					</checkbox-group>
					<view class="info-title">已阅读</view>
					<view class="tag content">注册协议*勾选则视为同意条款内容</view>
				</view>
				<view class="">
					<text class="tips">*</text>
					<text>注册成功将获得开业优惠券，系统会自动发放，在“商户中心”我的优惠券中查看</text>
				</view>
			</view>
		</view>
		<view class="page-bottom" :style="`height:${safeArea.bottom + 70}px`" @click="confirm">
			<text class="buttom-btn" :style="`margin-bottom:${safeArea.bottom}px`">提交</text>
		</view>
	</view>
</template>

<script>
	import permision from "@/common/utils/permission.js"
	import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue'
	import * as SystemConstant from '@/static/base/system-constant.js'
	import register from '@/api/login/register';
	export default {
		name: 'register',
		components: {
			mpvueCityPicker
		},
		data() {
			return {
				systemInfo: uni.getSystemInfoSync(),
				// 注册表单
				registerForm:{
					// 经销商名称
					dealerName:'',
					// 经销商编码
					dealerNo:'',
					// 地区名称：xx省/xx市/xx区
					districtName:"",
					// 详细地址
					address:"",
					// 纬度
					latitude:"",
					// 经度
					longitude:"",
					// 营业执照
					license:'',
					// 门头照片
					doorUrl:'',
					// 联系人身份证照片
					contactUrl:'',
					// 门店名称
					name:"",
					// 负责人,
					contact:"",
					// 联系人手机号
					contactPhone:"",
					// 租户编号
					tenantNo:"",
					// 是否同意
					isAgree:false
				},
				store:{
					name:'',
					contact:'',
					contactPhone:'',
					pickerText:'',
					address:''
				},
				cityPickerValueDefault: [0, 0, 1],
				themeColor: '#007AFF',
			}
		},
		computed:{
			//安全区域
			safeArea(){
				return this.systemInfo.safeAreaInsets
			}
		},
		onLoad(option) {
			// 提示需要定位权限
			this.checkLocation()
		},
		onShow() {
		},
		methods: {
			/**
			 * 返回上一级页面
			 */
			toBack(){
				uni.navigateBack({
					delta: 1
				})
			},
			/**
			 * 输入框失焦时触发
			 * @param {Object} e 输入框输入的内容
			 * @param {Object} title
			 */
			blurInp(e,title){
				if(title === 'dealerName'){
					this.registerForm.dealerName = e
				}else if(title === 'dealerNo'){
					this.registerForm.dealerNo = e
				}else if(title === 'name'){
					this.registerForm.name = e
				}else if(title === 'contact'){
					this.registerForm.contact = e
				}else if(title === 'contactPhone'){
					this.registerForm.contactPhone = e
				}else if(title === 'address'){
					this.registerForm.address = e
				}
			},
			/**
			 * 使用当前定位
			 */
			getLocation(){
				const that = this
				uni.getLocation({
				    type: 'wgs84',
				　　 geocode:true,
				    success: function (res) {
						const {latitude,longitude} = res
						const {province,city,district,street = '',streetNum = '',poiName = ''} = res.address
						const address = province + '-' + city + '-' + district
						const addressInfo = street + streetNum + poiName
						that.registerForm.districtName = address
						that.registerForm.address = addressInfo
						that.registerForm.latitude = latitude
						that.registerForm.longitude = longitude
					},
					fail(err) {
						console.log(err)
					}
				});
			},
			// 三级联动选择
			showMulLinkageThreePicker(e) {
				this.$refs.mpvueCityPicker.show()
			},
			onCancel(e) {
				console.log(e)
			},
			onConfirm(e) {
				console.log(e)
				this.registerForm.districtName = e.label
			},
			/**
			 * 上传图片
			 */
			takePhoto(title){
				const that = this
				uni.chooseImage({
				    count: 1,
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					extension:['gif','pdf'],
				    success: function (res) {
						uni.uploadFile({
							url:SystemConstant.upLoadURL + '/user/store/app/register/oss/upload?target=user',     // 后端api接口
							filePath: res.tempFiles[0].path, // uni.chooseImage函数调用后获取的本地文件路劲
							name:'file',     //后端通过'file'获取上传的文件对象
							header:{"Content-Type": "multipart/form-data"},
							success:(uploadRes) => {
								console.log(uploadRes,'uploadRes')
								let result = JSON.parse(uploadRes.data)
								if (result.code == 200){
									const { objectUrl } = result.data
									if(title === 'license'){
										that.registerForm.license = objectUrl
									}else if(title === 'doorUrl'){
										that.registerForm.doorUrl = objectUrl
									}else if(title === 'contactUrl'){
										// 负责人通过身份ocr获取
										that.registerForm.contactUrl = objectUrl
										let uniUrl = ''
										let url = '/api/basic/store/app/ocr/ocrIdCardPortraitInfo'
										// #ifdef APP-PLUS
										// 手动拼接全路径
										if(url.indexOf("http") === 0){
											uniUrl = url
										}else if(url.indexOf("/api/") !== -1){
											url = url.substring(url.indexOf("/api/") + 4)
											uniUrl = SystemConstant.URL + url
										}else if(url.indexOf("/upload/") !== -1){
											uniUrl = SystemConstant.upLoadURL + url
										}else{
											uniUrl = SystemConstant.URL + url
										}
										// #endif
										// #ifdef H5
										uniUrl = url
										// #endif
										uni.request({
											url:uniUrl,
											data: {
												'imageUrl':objectUrl
											},
											header:{
												'Content-Type':'application/x-www-form-urlencoded'
											},
											method:"POST",
											success: (result) => {
												const { code,data }  = result.data
												if( code === 200 ){
													that.registerForm.contact = data.cardName
												}else{
													console.log(result,'result')
												}
											},
											fail: (err) => {
												console.log(err,'err')
											},
											complete: (data) => {
											}
										})
									}
								}
							},
							fail:(err)=>{
								console.log(err,'err')
							}
						});
				    }
				});
			},
			
			//删除图片
			DelImg(title) {
				let that = this;
				uni.showModal({
					title: '',
					content: '确定要删除么',
					cancelText: '取消',
					confirmText: '确定',
					success: function (res) {
						if (res.confirm) {
							if(title === 'license'){
								that.registerForm.license = ''
							}else if(title === 'doorUrl'){
								that.registerForm.doorUrl = ''
							}else if(title === 'contactUrl'){
								that.registerForm.contactUrl = ''
							}
						} else if (res.cancel) {
						}
					}
				})
			},
			/**
			 * 提交
			 */
			confirm(){
				if(this.verification()){
					return
				}
				uni.showLoading()
				let postData = JSON.parse(JSON.stringify(this.registerForm))
				postData.districtName = postData.districtName.replace(/-/g,"/")
				delete postData.dealerName
				delete postData.isAgree
				register.storeRegister(postData).then((res)=>{
					uni.hideLoading()
					if(res.code === 200){
						uni.showToast({
							title:'注册成功，等待审核通过',
							icon:"none"
						})
						uni.reLaunch({
							url:"/pages/login/login"
						})
					}else{
						uni.showToast({
							title:'注册失败',
							icon:"none"
						})
					}
				}).catch((err)=>{
					uni.hideLoading()
					console.log(err,'err')
					uni.showToast({
						title:err.msg || err,
						icon:"none"
					})
				})
			},
			
			/**
			 * 表单校验
			 */
			verification(){
				let msg = ''
				let list = {
					// 经销商编码
					dealerNo:'请填写编码',
					// 地区名称：xx省/xx市/xx区
					districtName:"请选择地区",
					// 详细地址
					address:"请填写详细地址",
					// 纬度
					latitude:"请点击定位",
					// 经度
					longitude:"请点击定位",
					// 营业执照
					license:'请填写执照信息',
					// 门头照片
					doorUrl:'请上传门头照片',
					// 联系人身份证照片
					contactUrl:'请上传身份证件',
					// 门店名称
					name:"请填写门店名称",
					// 负责人,
					contact:"请填写负责人",
					// 联系人手机号
					contactPhone:"请填写手机号",
					// 租户编号
					tenantNo:"请扫经销商码",
					// 是否同意
					isAgree:'请同意条款内容'
				}
				for(let k in list){
					if(!this.registerForm[k]){
						msg = list[k]
					}
				}
				if(msg){
					uni.showToast({
						title:msg,
						icon:'none'
					})
				}
				return msg
			},

			/**
			 * 选中是否同意条规
			 */
			changeIsAgree(e){
				this.registerForm.isAgree = e.detail.value.length > 0
			},

			/**
			 * 扫码-经销商
			 */
			scanCodeDealer(){
				// #ifndef H5
				let _this = this
				uni.scanCode({
					scanType: ['qrCode'],
					success: function (res) {
						let codeContent = JSON.parse(res.result.trim())
						let { dealerName ,dealerNo,tenantNo} = codeContent
						_this.registerForm.dealerNo = dealerNo
						_this.registerForm.dealerName = dealerName
						_this.registerForm.tenantNo = tenantNo
						// console.log('条码类型：' + res.scanType);
						// console.log('条码内容：' + res.result);
					},
					fail:function(res){
						uni.showToast({
							icon:"none",
							title:"扫码失败，请重新尝试"
						})
					}
				});
				// #endif
				// #ifdef H5
				uni.showToast({
					icon:"none",
					title:"无法在网页上进行扫码操作"
				})
				// #endif
			},

			/**
			 * 添加营业执照照片
			 * 
			 * 1、先选择图片后上传图片，返回得到图片在线链接
			 * 2、将图片在线地址传到OCR服务端进行识别，返回门店信息置入form
			 */
			addLicense(){
				let _this = this
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					extension:['gif','pdf'],
					success: function (res) {
						uni.uploadFile({
							url:SystemConstant.upLoadURL + '/user/store/app/register/oss/upload?target=user',     // 后端api接口
							filePath: res.tempFiles[0].path, // uni.chooseImage函数调用后获取的本地文件路劲
							name:'file',     //后端通过'file'获取上传的文件对象
							header:{"Content-Type": "multipart/form-data"},
							success:(uploadRes) => {
								let result = JSON.parse(uploadRes.data)
								if (result.code == 200){
									const { objectUrl } = result.data
									let uniUrl = ''
									let url = '/api/basic/store/app/ocr/ocrBizLicenseInfo'
									// #ifdef APP-PLUS
									// 手动拼接全路径
									if(url.indexOf("http") === 0){
										uniUrl = url
									}else if(url.indexOf("/api/") !== -1){
										url = url.substring(url.indexOf("/api/") + 4)
										uniUrl = SystemConstant.URL + url
									}else if(url.indexOf("/upload/") !== -1){
										uniUrl = SystemConstant.upLoadURL + url
									}else{
										uniUrl = SystemConstant.URL + url
									}
									// #endif
									// #ifdef H5
									uniUrl = url
									// #endif
									uni.request({
										url:uniUrl,
										data: {
											'imageUrl':objectUrl
										},
										header:{
											'Content-Type':'application/x-www-form-urlencoded'
										},
										method:"POST",
										success: (result) => {
											const { code,data }  = result.data
											if( code === 200 ){
											  _this.registerForm.name = data.bizName
											}else{
												console.log(result,'result')
											}
										},
										fail: (err) => {
											console.log(err,'err')
										},
										complete: (data) => {
										}
									})
								}
							},
							fail:(err)=>{
								console.log(err,'err')
							}
						});
					}
				});
			},
			
			
			async checkLocation() {
				let _this = this
				return new Promise(async(resolve,reject)=>{
					// #ifdef APP-PLUS
					let status = await this.checkPermission();
					if (status !== 1) {
							return;
					}
					// #endif
					_this.doGetLocation(resolve,reject);
				})
					
			},
			doGetLocation(resolve,reject) {
				let that=this
				// #ifdef APP-PLUS
				uni.getLocation({
					success: (res) => {
						resolve({
							latitude:res.latitude,
							longitude:res.longitude
						})
					},
					fail: (err) => {
						if (err.errMsg.indexOf("auth deny") >= 0) {
							uni.showToast({
								icon:'none',
								title: "访问位置被拒绝"
							})
						} else {
							uni.showToast({
								title:JSON.stringify(err.errMsg),
								icon:"none",
								duration:3000
							})
							console.log(err.errMsg)
						}
						reject({
							latitude:0,
							longitude:0
						})
					},
				})
				// #endif
				// #ifdef H5
				resolve({
					latitude:31.27537,
					longitude:121.54367
				})
				// #endif
			
					
			},
			async checkPermission() {
				let status = permision.isIOS ? await permision.requestIOS('location') :
					await permision.requestAndroid('android.permission.ACCESS_FINE_LOCATION');
			
				if (status === null || status === 1) {
					status = 1;
				} else if (status === 2) {
					uni.showModal({
						content: "系统定位已关闭",
						confirmText: "确定",
						showCancel: false,
						success: function(res) {
						}
					})
				} else if (status.code) {
					uni.showModal({
						content: status.message
					})
				} else {
					uni.showModal({
						content: "需要定位权限",
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
		}
	}
</script>

<style lang="scss">
	.page{
		background-color: #F2F2F2;
		.function-content{
			height: calc(100vh - 45px - 71px - var(--status-bar-height) - 15px);
			color: #1C1C1C;
			font-size: 13px;
			padding: 15px 10px;
			padding-top: 0;
			overflow-y: auto;
			.content-title{
				color: #252527;
				padding: 15px 0;
				font-weight: bold;
			}
			.tag{
				color: rgba(37,37,39,.5);
				font-size: 12px;
				font-weight: 400;
				.uni-icons{
					margin-left: 4px;
					color: #ed6d00 !important;
				}
				.iconfont{
					margin-left: 4px;
				}
			}
			.content{
				color: #ed6d00;
				margin-left: 10px;
			}
			.feedback{
				background: #fff;
				padding: 15px 10px;
				border-radius: 3px;
				color: #252527;
				font-size: 12px;
				font-weight: bold;
				box-shadow: 0px 3px 15px 0px rgba(0, 0, 0, 0.05);
				.feedback-content{
					width: calc(100% - 2px - 26px);
					height: 34px;
					padding: 0 13px;
					color: rgba(37,37,39,.65);
					font-size: 12px;
					background: #F2F2F2;
					border: 1px solid #E5E5E5;
					border-radius: 3px;
					display: flex;
					align-items: center;
				}
				.feedback-input{
					padding: 0;
					/deep/ .uni-input-wrapper{
						font-size: 12px;
					}
					/deep/ .is-input-border{
						background: #F2F2F2 !important;
					}
				}
				.info-title{
					height: 50px;
					color: #EB3526;
					font-weight: 400;
					font-size: 13px;
				}
				/deep/ .content-clear-icon{
					color: #ed6d00 !important;
				}
			}
		}
	}
	.camera-box{
		width: calc((100% - 20px) / 3);
	}
	.camera{
		height: 70px;
		border: 1px dashed #9B9B9B;
		border-radius: 5px;
		position: relative;
		image{
			width: 100%;
			height: 100%;
		}
		.uni-icons{
			color: #9B9B9B !important;
			font-size: 30px !important;
			font-weight: 100;
		}
		.cu-tag{
			position: absolute;
			top: 0;
			right: 0;
			.uni-icons{
				color: #9B9B9B !important;
				font-size: 16px !important;
				font-weight: 500;
			}
		}
	}
	.checkbox{
		margin: 10px;
		/deep/ .uni-checkbox-input{
			width: 15px;
			height: 15px;
			color: #ed6d00 !important;
		}
		/deep/ .uni-checkbox-input:hover{
			border-color: #ed6d00 !important;
		}
		.tips{
			color: #EB3526;
			margin-right: 10px;
		}
	}
	.page-bottom{
		background-color: #fff;
		position:fixed;
		bottom: 0;
		left:0;
		right:0;
		padding:0 10px;
		border-top: 1rpx solid rgba(182,182,182,.5);
	}
	.buttom-btn{
		height:40px;
		line-height: 40px;
		text-align: center;
		border-radius:20px;
		background-color: $uni-color-primary;
		color:#fff;
		position:absolute;
		top:15px;
		left:10px;
		right:10px;
		font-size: $uni-font-size-base;
		font-weight: bold;
		.iconfont{
			margin-right: 10rpx;
			font-size: 14px;
		}
	}
	.mgb10{
		margin-bottom: 10px;
	}
	.mgt5{
		margin-top: 5px;
	}
	.bg-fff{
		background: #fff !important;
	}
</style>

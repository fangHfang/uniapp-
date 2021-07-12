<template>
	<view class="page" id="pageBox" :style="conContinerStyle">
		<uni-nav-bar fixed statusBar :title="title" left-icon="back" backgroundColor="#ed6d00" color="#fff" @clickLeft="toBack"
		 :rightText="storeLocationNo?'删除定位':''" @clickRight="deleteLocation" />
		<view class="con-container">
			<view class="card-box">
				<view class="card">
					<text class="card-label">定位信息</text>
					<input class="card-input no-bg" v-model="addressInfo.info" type="text" disabled placeholder="获取定位" />
					<text class="card-label">定位标题</text>
					<input class="card-input" v-model="addressInfo.title" :maxlength="15" type="text" placeholder="请输入" />
					<text class="card-label">定位说明</text>
					<textarea class="card-input textarea" v-model="addressInfo.describe" :maxlength="30" type="text" placeholder="请输入" />
					<view class="map-box">
						<map 
							ref="map" 
							class="map"  
							v-show="showMap" 
							:style="mapStyle" 
							:latitude="card.latitude" 
							:longitude="card.longitude" 
							:markers="card.covers"
						>
							<cover-view class="location-icon" @click="doGetLocation"></cover-view>
							<cover-image class="icon" src='/static/image/my/dangqianweizhi.png' @click="doGetLocation"></cover-image>
						</map>
					</view>
					<view class="instruction">
						<view class="i-header">
							<text>当前位置</text>
							<view class="flex" @tap="doGetLocation">
								<text class="iconfont icon-dangqianweizhi">&#xe618;</text>
								<text style="color:#ed6d00">使用当前定位</text>
							</view>
						</view>
						<text class="con">{{locationAddress}}</text>
					</view>
				</view>
			</view>
		</view>
		<view v-show="title!=='查看定位'" class="page-bottom" :style="`height:${safeArea.bottom + 70}px;position:${fixedButton?'fixed':'relative'};`">
			<text class="buttom-btn" @click="submitVerify" :style="`margin-bottom:${safeArea.bottom}px`">提交审核</text>
		</view>
		<uni-popup ref="dialogDel" type="dialog" :maskClick="false">
			<uni-popup-dialog title='提示' content="确定删除当前定位吗？" :before-close="true" @close="close" type="warn" @confirm="dialogConfirm"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>	
	import system from '@/api/system/system.js'
	// nuve icon 得用这种方式引入
	import fontFace from '@/common/utils/iconfont.js'
	// #ifdef APP-PLUS
	import permision from "@/common/utils/permission.js"
	// #endif
	export default {
		name:'locationEdit',
		components:{
		},
		data() {
			return {
				systemInfo: uni.getSystemInfoSync(),
				title:'添加定位',
				addressInfo:{
					title:'',
					describe:'',
					address:'',
					info:'',
					districtName: '',
				},
				locationAddress:'',
				region:'',
				card: {
					latitude: 31.20,
					longitude: 121.46,
					covers:[{
						latitude: 31.20,
						longitude: 121.46,
						iconPath: '/static/image/my/location.png',
						width:'20px',
						height:'20px'
					}],
				},
				fixedButton:true,
				storeLocationNo:'',
				showMap:true
			}
		},
		computed:{
			//安全区域
			safeArea(){
				return this.systemInfo.safeAreaInsets
			},
			//内容区域样式
			conContinerStyle(){
				let height=this.systemInfo.windowHeight
				let paddingBottom=this.fixedButton?(70 +this.safeArea.bottom):0
				return `padding-bottom:${paddingBottom}px;overflow:auto;`
			},
			// 地图宽高
			mapStyle(){
				let width=this.systemInfo.windowWidth-40
				return `height:${width}px;width:${width}px;`
			}
		},
		created() {
		},
		onLoad(option) {
			this.title=option.pageTitle
			if(this.title!=='查看定位'){
				this.doGetLocation()
			}
			if(option.storeLocationNo){
				this.storeLocationNo=option.storeLocationNo
				this.getLocationDetail(option.storeLocationNo)
			}
		},
		mounted(){
			this.countPageHeight()
		},
		methods: {
			/**
			 * 计算顶部DOM元素节点
			 */
			async countPageHeight() {
				const pageBox = await this.$getComponentsDom('#pageBox');
				const windowHeight= this.systemInfo.windowHeight
				if(pageBox.height>windowHeight-70){
					this.fixedButton=false
				}
			},
			/**
			 * 返回上一页
			 */
			toBack(){
				uni.navigateBack({
					delta: 1
				})
			},
			/**
			 * 点击删除
			 */
			deleteLocation(){
				this.showMap=false
				this.$refs.dialogDel.open()
			},
			/**
			 * 点击取消按钮触发
			 * @param {Object} done
			 */
			close(done) {
				done()
				this.showMap=true
			},
			/**
			 * 删除定位
			 * @param {Object} done
			 */
			dialogConfirm(done) {
				let postData = '?storeLocationNo='+this.storeLocationNo
				system.locationDelete(postData).then((res) => {
					if (res.code === 200) {
						uni.showToast({
							icon: "success",
							title: '删除成功'
						})
						done()
						this.showMap=true
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
				}).catch((err) => {
					uni.showToast({
						icon: "none",
						title: err.msg
					})
				})
			},
			getLocationDetail(storeLocationNo){
				uni.showLoading({
					title: '加载中···'
				})
				let params='?storeLocationNo='+storeLocationNo
				system.locationDetail(params).then((res) => {
					if (res.code === 200) {
						this.addressInfo={
							title:res.data.title,
							describe:res.data.describes,
							address:res.data.address,
							districtName: res.data.districtName || '',
						}
						if(this.title==='查看定位'){
							this.addressInfo.info=(res.data.districtName || '').split('/').join('') + res.data.address
							if(res.data.latitude){
								let markers=[{
									latitude: res.data.latitude,
									longitude: res.data.longitude,
									iconPath: '/static/image/my/location.png',
									width:'20px',
									height:'20px'
								}]
								this.card.latitude=res.data.latitude
								this.card.longitude=res.data.longitude
								this.card.covers=[...markers]
							}
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
			 * 审核
			 */
			submitVerify(){
				if(!this.card.latitude){
					uni.showToast({
						icon: "none",
						title: '请获取当前定位'
					})
					return 
				}
				if(!this.addressInfo.title){
					uni.showToast({
						icon: "none",
						title: '请输入定位标题'
					})
					return 
				}
				if(!this.addressInfo.describe){
					uni.showToast({
						icon: "none",
						title: '请输入定位说明'
					})
					return 
				}
				let params={
					"address": this.addressInfo.address,
					"describes": this.addressInfo.describe,
					"latitude": this.card.latitude,
					"longitude": this.card.longitude,
					"title": this.addressInfo.title,
					"districtName": this.addressInfo.districtName
				}
				uni.showLoading({
					title: '提交中···'
				})
				if(this.storeLocationNo){
					params.storeLocationNo=this.storeLocationNo
					system.locationModify(params).then((res) => {
						if (res.code === 200) {
							uni.hideLoading()
							uni.showToast({
								icon: "success",
								title: '提交成功！'
							})
							setTimeout(()=>{
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
							},1000)
						} else {
							uni.hideLoading()
							uni.showToast({
								icon: "none",
								title: res.msg
							})
						}
					}).catch((err) => {
						uni.hideLoading()
						uni.showToast({
							icon: "none",
							title: err.msg
						})
					})
				}else{
					system.locationApply(params).then((res) => {
						if (res.code === 200) {
							uni.hideLoading()
							uni.showToast({
								icon: "success",
								title: '提交成功！'
							})
							setTimeout(()=>{
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
							},1000)
						} else {
							uni.hideLoading()
							uni.showToast({
								icon: "none",
								title: res.msg
							})
						}
					}).catch((err) => {
						uni.hideLoading()
						uni.showToast({
							icon: "none",
							title: err.msg
						})
					})
				}
			},
			async getLocation() {
					// #ifdef APP-PLUS
					let status = await this.checkPermission();
					console.log(status)
					if (status !== 1) {
							return;
					}
					// #endif
					this.doGetLocation();
			},
			doGetLocation() {
				let that=this
					uni.getLocation({
						type:'wgs84',
						geocode:true,
						success: (res) => {
							let province=res.address.province || ''
							let city=res.address.city || ''
							let district=res.address.district || ''
							let street=res.address.street || ''
							let streetNum= res.address.streetNum || ''
							let poiName=res.address.poiName || ''
							let markers=[{
								latitude: res.latitude,
								longitude: res.longitude,
								iconPath: '/static/image/my/location.png',
								width:'20px',
								height:'20px'
							}]
							that.card.latitude=res.latitude
							that.card.longitude=res.longitude
							that.addressInfo.districtName=province+'/'+city+'/'+district
							that.card.covers=[...markers]
							that.locationAddress=province+city+district+street+streetNum+poiName
							if(that.title!=='查看定位'){
								that.addressInfo.info=that.locationAddress
								that.addressInfo.address=street+streetNum+poiName
							}
						},
						fail: (err) => {
							uni.showToast({
								icon:'none',
								title: "访问位置被拒绝"
							})
							console.log(err.errMsg)
						}
					})
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
			}
		}
	}
</script>

<style lang="scss" scoped>
	.iconfont {
		font-family: iconfont;
	}
	.icon-dangqianweizhi{
		color: #666;
		font-size:24px;
	}
	.page {
		background-color: #F2F2F2;
		position:relative;
		overflow:auto;
	}
	.map-box{
		position:relative;
		width:calc(100vw - 40px);
		height:calc(100vw - 40px);
		background-color: #f2f2f2;
	}
	.map{
		position:absolute;
		top:0;
		left:0;
	}
	.card-box {
		padding:15px 10px;
		color:$uni-text-color;
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		/* #endif */
	}
	.card{
		background-color: #fff;
		padding:10px;
		border-radius: $uni-border-radius-base;
	}
	.card-label{
		font-size:$uni-font-size-base;
		line-height:30px;
		margin-bottom: 5px;
	}
	.card-input{
		font-size:$uni-font-size-sm;
		color:$uni-text-color;
		margin-bottom:$uni-spacing-col-base;
		height:32px;
		line-height: 20px;
		border-style:solid;
		border-width:1px;
		border-color:$uni-border-color;
		border-radius:$uni-border-radius-base;
		padding:$uni-spacing-col-sm $uni-spacing-col-base;
		width:auto;
		background-color: $uni-bg-color-grey;
	}
	.no-bg{
		background-color: #fff;
	}
	.textarea{
		height:80px;
	}
	/deep/ .input-placeholder{
		font-size:$uni-font-size-sm;
		color:$uni-text-color-grey;
	}
	.input-box{
		position: relative;
	}
	.arrow-right{
		position:absolute;
		right:5px;
		top:8px;
	}
	.map-box{
		margin-top:10px;
	}
	.location-icon {
		position: absolute;
		right: 5px;
		bottom: 5px;
		border-radius: 50%;
		width: 36px;
		height: 36px;
		background-color: #fff;
		box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2);
		box-sizing: content-box;
	}

	.icon {
		position: absolute;
		right: 10px;
		bottom: 10px;
		width: 26px;
		height: 26px;
		z-index: 10;
		border-radius: 50%;
	}
	.info-box{
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		/* #endif */
		padding:$uni-spacing-col-sm $uni-spacing-col-base;
		color:$uni-text-color;
		font-size:$uni-font-size-base;
	}
	.last{
		padding-bottom:$uni-spacing-col-base;
	}
	.info{
		border-style:solid;
		border-width:1px;
		border-color:$uni-color-primary;
		border-radius:$uni-border-radius-base;
		padding:$uni-spacing-col-base;
	}
	.title{
		font-weight:600;
		line-height: 30px;
	}
	.con{
		font-size:$uni-font-size-sm;
		line-height: 20px;
	}
	.i-header{
		font-size:$uni-font-size-base;
		margin-top:15px;
		color:#000;
		line-height: 30px;
		font-weight: 400;
		/* #ifndef APP-NVUE */
		display:flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
	.page-bottom{
		background-color: #fff;
		bottom: 0;
		left:0;
		right:0;
		padding:0 10px;
	}
	.buttom-btn{
		height:40px;
		line-height: 40px;
		text-align: center;
		border-radius:40px;
		background-color: $uni-color-primary;
		color:#fff;
		position:absolute;
		top:15px;
		left:10px;
		right:10px;
		font-size: $uni-font-size-base;
	}
</style>

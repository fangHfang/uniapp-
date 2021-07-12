<template>
	<view class="page">
		<uni-nav-bar fixed statusBar id="navBar" title="编辑收货地址" left-icon="back" backgroundColor="#ed6d00" color="#fff" @clickLeft="toBack" ></uni-nav-bar>
		<form>
			<uni-list class="list-box">
				<uni-list-item>
					<template slot="body">
						<view class="flex a-center j-space-between w">
							<text class="form-name">收货人</text>
							<input v-model="addressInfo.consignee" class="form-input" placeholder="请输入" :maxlength="10"/>
						</view>
					</template>
				</uni-list-item>
				<uni-list-item>
					<template slot="body">
						<view class="flex a-center j-space-between w">
							<text class="form-name">手机号码</text>
							<input v-model="addressInfo.phone" class="form-input" type="phone"  placeholder="请输入"/>
						</view>
					</template>
				</uni-list-item>
				<uni-list-item>
					<template slot="body">
						<view class="flex a-center j-space-between w">
							<text class="form-name ">所在地区</text>
							<text class="form-input" :style="!addressInfo.provinceCode && 'color:#666'" @click="openPicker">{{  districtName || '请选择' }}</text>
							<lotus-address v-on:choseVal="choseValue" :lotusAddressData="lotusAddressData"></lotus-address>
						</view>
					</template>
				</uni-list-item>
				<uni-list-item>
					<template slot="body">
						<view class="flex a-center j-space-between w">
							<text class="form-name">详细地址</text>
							<textarea v-model="addressInfo.address" :maxlength="40" class="form-input" auto-height  placeholder="请输入"/>
						</view>
					</template>
				</uni-list-item>
			</uni-list>
			<uni-list class="last-child">
				<uni-list-item>
					<template slot="body" >
						<view class="flex a-center j-space-between w">
							<text class="form-name">设为默认地址</text>
							<switch @change="switchChange" :checked="addressInfo.isDefault" :disabled="isDisabled" color="#ed6d00" style="transform:scale(0.7)"/>
						</view>
					</template>
				</uni-list-item>
			</uni-list>
			<view class="fixed-buttom-box">
				<button 
					@click="addressLoading"
					class=" flex a-center j-center fixed-buttom-btn"
					:style="`border-radius:${systemInfo.windowWidth/2}px`"
					form-type="submit">保存</button>
			</view>		
		</form>
		<uni-popup ref="dialog" type="dialog" >
			<uni-popup-dialog 
				:title='message.title' 
				:content="message.content" 
				confirmText="保存" 
				closeText="放弃"
				:beforeClose="true"
				@close="close" 
				@confirm="dialogConfirm"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import lotusAddress from "../../../components/Winglau14-lotusAddress/Winglau14-lotusAddress.vue";
	
	import user from '@/api/user/user.js'
	import mall from '@/api/mall/mall.js'
	// 未修改的地址数据
	// 放在此处是为了不让vue监听，加入Observer属性，导致对象判断不一致
	let originalData = {};
	let timer = null
    export default {
		name: 'addressEdit',
		components:{
			 "lotus-address":lotusAddress
		},
		onLoad(e) {
			const { userAddressNo } = e
			if (userAddressNo) {
				this.userAddressNo = userAddressNo
				this.initData()
			}
		},
        data() {
            return {
				systemInfo:uni.getSystemInfoSync(),
				message:{
					title:'您编辑的内容还未保存',
					content:'是否退出编辑？'
				},
				lotusAddressData:{
					visible:false,
					provinceName:'',
					cityName:'',
					townName:'',
				},
				addressInfo:{
					provinceCode: '',
					cityCode: '',
					areaCode: '',
					phone: '',
					address: '',
					isDefault: true,
					dimension: '',
					longitude: ''
				},
				districtName: '',
				userAddressNo: '',
				// 不让取消默认选中
				isDisabled:false,
            }
        },
		watch:{
			
		},
		computed:{
			
		},
		created() {
		  
		},
		/**
		 * 监听物理返回键
		 */
		onBackPress(e){
			const {from} = e 
			if(from === 'navigateBack'){
				return false
			}
			this.toBack()
			return true
		},
		mounted(){
			this.getLocationInfo().then(({ latitude, longitude }) => {
				this.dimension = latitude
				this.longitude = longitude
			})
		},
        methods: {
			/**
			 * 获取经纬度信息
			 */
			getLocationInfo() {
				return new Promise((resolve,reject)=>{
					uni.getLocation({
						type: 'wgs84',
						// 设置该参数为true可直接获取经纬度及城市信息
						geocode:true,
						success: (res) => {
							resolve(res);
						},
						fail: () => {
							reject({
								msg: '获取地理位置失败'
							});
						}
					})
				})
			},
			initData() {
				uni.showLoading({
				    title: '加载中'
				});
				mall.listAddressAll().then(res =>{
					let currentAddress = res.data.find(x => x.userAddressNo === this.userAddressNo)
					originalData = JSON.parse(JSON.stringify(currentAddress)) || {}
					if (currentAddress) {
						let addressList = currentAddress.districtName.split('/')
						this.lotusAddressData.provinceName = addressList[0]
						this.lotusAddressData.cityName = addressList[1]
						this.lotusAddressData.townName = addressList[2]
						this.districtName = currentAddress.districtName
						delete currentAddress.districtName
						delete currentAddress.remarks
						delete currentAddress.userAddressNo
						currentAddress.isDefault = currentAddress.isDefault === 0
						this.isDisabled = currentAddress.isDefault
						this.addressInfo = currentAddress
					}
					uni.hideLoading();
				})
			},
			/**
			 * 打开picker
			 */
			openPicker() {
				this.lotusAddressData.visible = true;
			},
			/**
			 * 回传已选的省市区的值
			 */
			choseValue(res){
				//res数据源包括已选省市区与省市区code
				this.lotusAddressData.visible = res.visible;//visible为显示与关闭组件标识true显示false隐藏
				//res.isChose = 1省市区已选 res.isChose = 0;未选
				if(res.isChose){
					this.lotusAddressData.provinceName = res.province;//省
					this.lotusAddressData.cityName = res.city;//市
					this.lotusAddressData.townName = res.town;//区
					this.addressInfo.provinceCode = res.provinceCode; 
					this.addressInfo.cityCode = res.cityCode; 
					this.addressInfo.areaCode = res.townCode;
					this.districtName = `${res.province}/${res.city}/${res.town}`
				}
			},
			/**
			 * 开关
			 */
			switchChange(){
				this.addressInfo.isDefault = !this.addressInfo.isDefault
			},
			
			/**
			 * 防抖
			 */	
			addressLoading(){
				let _this = this
				if(timer){
				    clearTimeout(timer) 
				}
				timer = setTimeout(()=>{
					_this.saveAddress()
				},1000)
			},
			
			/** 
			 * 提交
			 * @param {Object} 
			 */
			saveAddress() {
				uni.showLoading({mask:true})
				let param = this.$deepClone(this.addressInfo)
				param.isDefault = this.addressInfo.isDefault ? 0 : 1
				
				// 验证收货人
				if (!param.consignee) {
					uni.showToast({ title: '请输入收货人', icon:'none', duration: 1000 })
					return false
				}
				
				// 验证手机号
				if (!param.phone) {
					uni.showToast({ title: '请输入手机号', icon:'none', duration: 1000 })
					return false
				} else {
					if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(param.phone))) {
						uni.showToast({ title: '请输入正确格式的手机号', icon:'none', duration: 1000 })
						return false
					}
				}
				
				// 验证所在地区
				if (!this.districtName) {
					uni.showToast({ title: '请选择所在地区', icon:'none', duration: 1000 })
					return false
				}
				
				// 验证详细地址
				if (!param.address) {
					uni.showToast({ title: '请输入详细地址', icon:'none', duration: 1000 })
					return false
				}
				
				param.districtName = this.districtName
				
				if (this.userAddressNo) {
					param.userAddressNo = this.userAddressNo
					user.modifyUserAddress(param).then((res) => {
						uni.hideLoading();
						if (res.code === 200) {
							// 判断缓存中的地址是否和修改的相同
							// 相同则替换，不同则跳过
							const cacheAddress = uni.getStorageSync('address')
							if(cacheAddress){
								const { userAddressNo } = cacheAddress
								if(param.userAddressNo === userAddressNo){
									uni.setStorageSync('address',param)
								}
							}
							uni.showToast({ title: res.msg, icon:'success' })
							
							setTimeout(() => {
								uni.navigateBack({
									delta: 1
								})
							},2000)
							
						} else {
							uni.showToast({ title: res.msg, icon:'none', duration: 1000 })
						}
					}).catch(()=>{
						uni.hideLoading();
					})
					return false
				}
				
				user.createUserAddress(param).then((res) => {
					uni.hideLoading();
					if (res.code === 200) {
						uni.showToast({ title: res.msg, icon:'success', duration: 2000 })
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							})
						},2000)
					} else {
						uni.showToast({ title: res.msg, icon:'none', duration: 1000 })
					}
				}).catch(()=>{
					uni.hideLoading();
				})
				
			},
			
			/**
			 * 返回上一级页面
			 */
			toBack(){
				let newAddressData = {
					...this.addressInfo,
					districtName:this.districtName,
					isDefault:this.addressInfo.isDefault ? 0 : 1,
					userAddressNo:this.userAddressNo,
					remarks:null
				}
				// 加入两个对象一致，则为未修改，直接返回上一页，不一致则弹窗询问是否保存
				if(this.isObjEqual(newAddressData,originalData)){
					uni.navigateBack({
						delta: 1
					})
				}else{
					this.$refs.dialog.open()
				}
			},

			isObjEqual(o1,o2){
				var props1 = Object.getOwnPropertyNames(o1);
				var props2 = Object.getOwnPropertyNames(o2);
				if (props1.length != props2.length) {
					return false;
				}
				for (var i = 0,max = props1.length; i < max; i++) {
					var propName = props1[i];
					if (o1[propName] !== o2[propName]) {
					return false;
					}
				}
				return true;
			},

			/**
			 * 继续支付
			 */
			dialogConfirm() {
				this.addressLoading()
				this.$refs.dialog.close()
			},

			/**
			 * 取消
			 */
			close(){
				uni.navigateBack({
					delta: 1
				})
			},
        }
    }
</script>

<style lang="scss"  scoped>
	.page{
		min-height: 100vh;
		overflow-y: hidden;
		background: #F2F2F2;
		/deep/.uni-dialog-title-text{
			  font-size: 28rpx;
			  color: #333;
			  position: relative;
			  top: 40rpx;
		}
		/deep/.uni-dialog-content{
			padding-bottom:0;
			position: relative;
			top:-10rpx;
		}
		/deep/.uni-dialog-content-text{
			font-size:28rpx;
			color:#333;
			width:260rpx;
			font-weight: 500;
			text-align: center;
		}
	}
	.form-name{
		font-size:26rpx;
		color:#333;
	}
	.form-input{
		font-size:26rpx;
		text-align: right;
		flex:1;
		margin-left:10rpx;
	}
	.last-child{
		margin-top:20rpx;
		/deep/.uni-list-item__container{
			padding:20rpx;
		}
	}
</style>
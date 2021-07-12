<template>
	<view class="page">
		<uni-nav-bar fixed statusBar title="订单确认" left-icon="back" backgroundColor="#ed6d00" color="#fff" @clickLeft="back"></uni-nav-bar>
		 <view>
			<uni-list class="list-box">
				<uni-list-item :border="false">
					<template slot="body">
						<view  class="flex a-center w" @click="toAddressEdit">
							<uni-icons  class="tips-icon" type="location-filled" color="#ed6d00" size="24"></uni-icons>
							<view  v-if="userInfo.addressInfo.id" class="center-content address">
								<view><text class="name text-normal">{{userInfo.addressInfo.name}}</text><text class="text-gray">{{userInfo.addressInfo.phone}}</text></view>
								<text class="phone text-normal">{{userInfo.addressInfo.districtName.replace(/\//g, '') + userInfo.addressInfo.address}}</text>
							</view>
							<view v-else class="center-content address"><text class="name text-normal">新增收货地址</text></view>
							<uni-icons  class="tips-icon" type="forward" color="#666" size="18"></uni-icons>
						</view>
					</template>
				</uni-list-item>
			</uni-list>

			<view class="list-box list-swiper">
				<view
					class="item-box flex j-space-between"
					style="border:none">
					<!-- 
						懒加载图片组件
						class="image-box flex a-center j-center"
						该class属性，app上不生效
						暂且不明原因
						故将所有样式替换成style
						陈虎 2020.02.25
						-->
					<fr-image 
						style="
							width:150rpx;
							height:150rpx;
							border-radius:12rpx;
							overflow: hidden;
							background-color: #000;
							display: flex;
							align-items: center;
							justify-content:center;
						"
						loading-ing-img="oblique-light" 
						mode="widthFix"  
						:src="itemDescDTO.imageUrl.length > 0 && itemDescDTO.imageUrl[0]"
					></fr-image>
					<view class="right-content">
						<view class="item-name">
							<text class="text-normal name">{{itemDescDTO.itemName}}</text>
						</view>
						<!-- 商品类型 itemType（1:商品；2：优惠券） -->
						<view>
							<view class="item">
								<text class="text-gray">品牌：</text>
								<text class="text-gray">{{ itemDescDTO.brandName}}</text>
							</view>
							<view class="item">
								<text class="text-gray">分类：</text>
								<text class="text-gray">{{ itemDescDTO.categoryName}}</text>
							</view>
							<view class="item">
								<text class="text-gray">规格：</text>
								<text class="text-gray">{{ itemDescDTO.specDetail}}</text>
							</view>
						</view>
						<view class="item-price flex a-center j-space-between">
							<view>
								<text class="text-primary" style="padding-right: 5px;">兑换点</text>
								<text class="text-primary price">{{exchangeDetail.exchangeAmount}}</text>
							</view>
							<uni-number-box 
								ref="numberBox"
								v-model="exchangeDetail.itemQuantity" 
								:min="1" 
								:max="Number(exchangeDetail.exchangeLimit)" 
								style="margin-bottom:2px" 
								@change="(val)=>changeNum(val)" 
								@onFocus="(val)=>handFocus(val)" 
								@onBlur="(val)=>handBlur(val)"
							></uni-number-box>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="fixed-buttom-box row" style="z-index:10;">
			<view class="w35 fixed-font">
				<text class="text-normal">兑换点:</text>
				<text class="text-primary">{{ totalPrice }}</text>
			</view>
			<view class=" flex a-center j-center fixed-buttom-btn"
					:class="{'gray-bg':isLoading}"
				  :style="`border-radius:${systemInfo.windowWidth/2}px;`"
				   @click="orderAdd">
				<text class="normal" >立即兑换</text>
			</view>
		</view>
		<!-- 弹窗提示 有确认取消-->
		<uni-popup ref="dialog" type="dialog" >
			<uni-popup-dialog :title='message' @confirm="dialogConfirm"></uni-popup-dialog>
		</uni-popup>
		<yu-toast
			:message1="toastData.msg1"
			:message2="toastData.msg2"
			:duration="toastData.duration"
			verticalAlign="center"
			:backgroundColor="toastData.bgColor"
			:color="toastData.fontColor"
			ref="remind"
		></yu-toast>
	</view>
</template>

<script>
import exchange from "@/api/user/exchange";
import wallet from '@/api/wallet/wallet.js'
import coupon from '@/components/coupon'
import { NO_ROW_LIMIT } from '@/static/base/system-constant' 
import yuToast from '@/components/yu-toast/yu-toast'
import permision from "@/common/utils/permission.js"
let timer = null
export default {
		name: 'orderConfirm',
		components: {
			coupon,
			yuToast
		},
		data() {
			return {
			  	// 生成订单的类
			  	orderInfo:{},
				systemInfo:uni.getSystemInfoSync(),
				// 兑换点值
				exchangeDetail:{},
				// 兑换商品信息
				itemDescDTO:{
					imageUrl:[]
				},
				userInfo:{
					addressInfo:{
						id:null,
						name:'',
						province:'',
						city:'',
						town:'',
						phone:'',
						address:'',
						default:false
					},
					// addressInfo:null,
					points:{
						num:0,
						value:0,
						maxNum:300
					}
				},	
				// 订单验证状态
				orderStatus:0,
				// 提示文字
				message:'',
				// 经销商关系
				dealerRelation:{},
				// 消息提醒
				toastData:{
					msg1:'设置提醒成功!',
					msg2:'',
					duration:2000,
					bgColor:"#000000cc",
					fontColor:"#ed6d00",
				},
				// 请求等待
				isLoading:false
			}
		},
		computed:{
			// 总兑换点
			totalPrice(){
				let totalPrice = 0
				const {exchangeAmount,itemQuantity} = this.exchangeDetail
				totalPrice = exchangeAmount * itemQuantity
				return totalPrice
			},

		},
		onLoad(option) {
			// 详情和购物车返回的数据值不一样做统一处理
			// 监听从上个页面传过来值
			const eventChannel = this.getOpenerEventChannel()
			eventChannel.on('sendParams', (data) => {
				this.exchangeDetail = data
				this.itemDescDTO = this.exchangeDetail.itemDescDTO
			})
		},
		onShow(){
			const address = uni.getStorageSync('address');
			if(address){
				const { ...a } = address
				this.userInfo.addressInfo = {
					...a,
					id:a.userAddressNo,
					name:a.consignee
				}
			}
		},
		mounted() {
		},
		methods: {
			/**
			 * 前往收货地址页面
			 * */
			toAddressEdit(){
				uni.navigateTo({
					url:'/pages/my-pages/address/list'
				})
			},

			/**
			 * 立即下单接口
			 */
			orderAdd(){
				let _this = this
				if(timer){
				    clearTimeout(timer) 
				}
				timer = setTimeout(()=>{
					_this.orderLoading()
				},1000)
			},
			
			/**
			 * 防抖
			 */	
			orderLoading(){
				if(this.isLoading){
					return
				}
				// 下单
				this.orderExchangeAdd()
			},
			
			/**
			 * 兑换点下单
			 */
			async orderExchangeAdd(){
				this.isLoading = true
				uni.showLoading()
				const { exchangeDetail } = this
				const { userAddressNo } = this.userInfo.addressInfo
				let postData = {
					itemNo:exchangeDetail.epRuleNo,
					itemQuantity:exchangeDetail.itemQuantity
				}
				if(userAddressNo){
					// 下单人地址编号
					postData['userAddressNo'] = userAddressNo
				}else{
					this.toastData.msg1 = '请选择地址'
					this.toastData.msg2 = ''
					this.$refs.remind.show()
					return
				}
				let LatLog = await this.getLocation()
				postData['longitude'] = LatLog.longitude
				postData['latitude'] = LatLog.latitude
				
				await exchange.createOrderExchange(postData).then(res =>{
					uni.hideLoading()
					this.orderStatus = 0
					// 赋值
					this.orderInfo = res.data
					this.pay()
				}).catch((err)=>{
					uni.hideLoading()
					this.message = err.msg
					// 验证不通过弹窗提示
					this.$refs.dialog.open()
					this.isLoading = false
				})
			},
			
			async getLocation() {
				let _this = this
				return new Promise(async(resolve,reject)=>{
					// #ifdef APP-PLUS
					let status = await this.checkPermission();
					if (status !== 1) {
						this.isLoading = false
						uni.hideLoading();
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
						uni.showToast({
							icon:'none',
							title: "访问位置被拒绝"
						})
						console.log(err.errMsg)
						reject({
							latitude:0,
							longitude:0
						})
					},
					complete:()=>{
						reject({
							latitude:0,
							longitude:0
						})
					}
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
			

			/**
			 * 验证
			 * */
			 validate(){
				 let valid = false
				 switch (this.orderStatus){
					 case 0:
					 valid = true
					 break
					 case 1:
					 this.message = '活动已截止\n去看看其他活动吧!'
					 break
					 case 2:
					 this.message = '你已超出下单范围\n请返回门店重新下单~'
					 break
					 case 3:
					 this.message = '商品已售罄\n去看看其他商品吧!'
					 break
					 case 4:
					 this.message = '已达到商品购买上限，\n请调整购买数量!'
					 break
					 case 5:
					 this.message = '你还未设置门店定位\n请设置定位后重新下单!'
					 case 6:
					 this.message = '本次活动不允许使用优惠券!'
					 break
					 default:
					 this.message = '未知错误，\n不能正常下单！'
					 break
				 }
				 return valid
			 },

			
			/**
			 * 支付
			 * */
			 pay(){
				if(this.validate()){
					uni.navigateTo({
						url:'/pages/products/order/resultExchange?orderInfo=' + JSON.stringify(this.orderInfo)
					})
					return
				}
				// 验证不通过弹窗提示
				this.$refs.dialog.open()
			 },

			/**
			 * 返回
			 */
			back() {
				uni.navigateBack({
					delta: 1
				})
			},

			/**
			 * 确定事件
			 */
			dialogConfirm(done, val) {
				this.$refs.dialog.close()
				uni.navigateBack({
				 	delta: 1
				 })
			},
		}
	}
</script>

<style lang="scss">
	.page {
		height: calc(100vh - 160rpx);
		padding-bottom:160rpx;
		overflow-y: auto;
		background-color: #F2F2F2;
		position: absolute;
		z-index: 999;
		/deep/.uni-dialog-title-text{
		  font-size: 36rpx;
		  color: #333;
		  position: relative;
		  font-weight: 400;
		  top: 50rpx;
		  text-align: center;
		  width:380rpx;
		}
		/deep/.uni-dialog-content{
			padding:0;
		}
		.row{
			flex-direction: row;
			.text-normal{
				font-size:30rpx;
				text-align: center;
				font-weight:600
			}
			.text-primary{
				color:$uni-color-primary;
				font-size:32rpx;
				font-weight:600
			}
			.w35{
				width:35%;
			}
		}
		/deep/.uni-countdown__number{width:auto;}
		.fixed-buttom-btn{
			padding:20rpx;
			.small{
				color:#fff;
				font-size:20rpx;
			}
			.normal{
				color:#fff;
				font-size:32rpx;
				margin-left:20rpx;
			}
		}
	}
	.text-primary{
		color:$uni-color-primary;
		font-size:26rpx
	}
	.text-gray{
		color:$uni-text-color-grey;
		font-size:26rpx
	}
	.text-normal{
		font-size:26rpx;
		color:#333;
	}
	.center-content{
		flex:1
	}
	.list-box{
		width:calc(100vw - 40rpx);
		margin-left:20rpx;
		margin-top:20rpx;
		border-radius:12rpx;
		overflow: visible;
		/deep/.uni-list-item__container{
			overflow: visible;
		}
		.item-box{
			padding:20rpx 0;
			width:100%;
			border-bottom:1px solid #eee;
		}
	}
	.list-swiper{
		background-color: #fff;
		padding:20rpx;
		width:calc(100vw - 80rpx);
	}
	.address{
		margin-left:20rpx;
		.name{
			font-size:30rpx;
		}
		.phone{
			font-size:28rpx;
		}
		.text-gray{
			font-size:24rpx;
			margin-left:20rpx;
		}
	}
	.image-box{
		width:150rpx;
		height:150rpx;
		border-radius:12rpx;
		overflow: hidden;
		background-color: #000;
	}
	.right-content{
		flex:1;
		margin-left:20rpx;
		.item{
			line-height: 1.2;
		}
		.item-name{
			line-height: 1.4;
			margin-bottom:20rpx;
		}
		.item-price{
			margin-top:20rpx;
		}
		.name{
			font-size:32rpx;
			color:#333;
		}
		.text-gray{
			font-size:20rpx;
		}
		.text-primary{
			font-size:20rpx;
		}
		.price{
			font-size:30rpx;
		}
	}
	.pronts{
		.youhuiquan,.ma{
			color:$uni-color-primary;
			font-size:38rpx;
		}
		.youhuiquan.gray,.ma.gray{
			color:#ddd;
		}
		.name{
			margin-left:20rpx;
			font-size:28rpx;
		}
		.name.gray{
			color:#ddd;
		}
		.num{
			background-color: #f1f1f1;
			padding:4rpx 8rpx;
			border-radius:8rpx;
			margin-left:10rpx;
		}
		.not-text{
			color:#ddd;
			font-size:28rpx;
		}
		.text-gray{
			font-size:20rpx;
		}
	}
	.pop-bottom{
		/deep/ .uni-popup__wrapper-box{
			background-color:#fff;
		}
	}
	.popup-box{
		background-color:#fff;
		width:100%;
		max-height:80vh;
		padding-bottom:140rpx;
		.btn-primary{
			position: absolute;
			bottom:30rpx;
			left:20rpx;
			z-index:100;
		}
		.popup-name{
			font-size:32rpx;
			padding:20rpx 0 20rpx;
			width:100vw;
			text-align: center;
		}
		.title{
			margin-top:20rpx;
			position: relative;
			width:100%;
			text-align: center;
			z-index:10;
			.text-normal{
				font-size:24rpx;
				position: relative;
				z-index:10;
				padding:10rpx 40rpx;
				background-color: #fff;
			}
			&::after{
				content: '';
				width:calc(100vw - 20rpx);
				height:1px;
				background-color:#eee;
				position: absolute;
				top:20rpx;
				left:10rpx;
			}
		}
		.list-box{
			width:calc(100vw - 10px);
			/deep/.uni-list-item__container{
				padding:0;
			}
			margin-top:0;
			/deep/.uni-list--border:after{
				background-color:#fff;
			}
		}
	}
	.del{
		width:160rpx;
		height:100%;
		background-color:#E10000;
		margin-left:20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		text{
			color:#fff
		}
	}
	.fixed-font{
		margin-bottom:calc(constant(safe-area-inset-bottom) / 2);
		margin-bottom:calc(env(safe-area-inset-bottom) / 2);
	}
	// 返利盒子
	.deduction-box{
		display: flex;
		width: 140rpx;
		align-items: center;
		justify-content: center;
		>text{
			width: 60rpx;
		}
		>input{
			width: 70rpx;
		}
	}
	.gray-bg{
		background-color: #a7a7a7;
	}
</style>

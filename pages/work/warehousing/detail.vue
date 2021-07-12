<template>
	<view class="page">
		<uni-nav-bar title="商品详情" left-icon="back" backgroundColor="#ed6d00" color="#fff" @clickLeft="toBack"></uni-nav-bar>
		<uni-list class="list-box">
			<!-- <uni-list-item title="商品名称" :rightText="itemInfo.itemName"></uni-list-item> -->
			<!-- <uni-list-item title="销售价" rightText="10 元"></uni-list-item> -->
			<uni-list-item title="商品规格" :rightText="itemInfo.itemSpecDetail"></uni-list-item>
			<uni-list-item title="经销商名称" :rightText="itemInfo.dealerName"></uni-list-item>
		</uni-list>
		<view class="img-box">
			<!-- <view class="barcode">
				<canvas style="width: 440rpx;height: 140rpx;" canvas-id="barcode" id="barcode"/>
				<view class="barnum">{{ code }}</view>
			</view> -->
			<view class="no-barcode">
			</view>
			<view v-if="message" class="message-box">
				<text class="text">扫码无效</text>
				<text class="text">{{message}}</text>
			</view>
			
		</view>
		<view class="fixed-buttom-box">
			<button 
				class=" flex a-center j-center fixed-buttom-btn"
				:style="`border-radius:${systemInfo.windowWidth/2}px`"
				@click="reScan">继续扫码</button>
		</view>
	</view>
</template>

<script>
	
	import warehouse from '@/api/order/warehouse.js'
	import CODE from '@/common/utils/wmf.code.min.js';
	export default {
		name: 'warehousingList',
		data() {
			return {
				systemInfo:uni.getSystemInfoSync(),
				// code: "",
				// 93201883232
				code: "",
				itemInfo: {},
				message:'',
				// 是否显示条形码
				showCode:false,
			}
		},
		onLoad(option) {
			const { code } = option
			this.code = code
		},
		mounted() {
			uni.showLoading()
			//条形码
			// CODE.BarCode({
			// 		id: 'barcode',// canvas 的canvas-id
			// 		code: this.code,// 生成条形码的字符串
			// 		color: '#000',// 条形码的颜色
			// 		bgColor: '#FFFFFF',// 背景色
			// 		width: 300,// 宽度
			// 		height: 100// 高度
			// });
			this.getLocationInfo().then((res) => {
				let { latitude, longitude } = res
				this.inBound(this.code, latitude, longitude)
			}).catch((error) => {
				uni.showToast({
					title: error.msg,
					icon: 'error',
					duration: 2000
				});
			})
			
		},
		methods: {
			
			getLocationInfo() {
				return new Promise((resolve,reject)=>{
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
								title:JSON.stringify(err)
							})
							if (err.errMsg.indexOf("auth deny") >= 0) {
								uni.showToast({
									icon:'none',
									title: "访问位置被拒绝"
								})
							} else {
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
				})
				
			},
			
			/**
			 * @param {Object} code 商品条码
			 * @param {Object} latitude 纬度
			 * @param {Object} longitude 经度
			 */
			inBound(code, latitude, longitude) {
				let payload = {
					itemBarCode: code,
					latitude: String(latitude),
					longitude: String(longitude)
				}
				warehouse.warehouseCreate(payload).then((res) => {
					uni.hideLoading()
					if (res.code === 200) {
						uni.showToast({
							icon:"none",
							title:"扫码入库成功！"
						})
						this.itemInfo = res.data
						console.log(res.data,'itemInfo')
					}else{
						this.message = res.msg
					}
				}).catch((res) => {
					uni.hideLoading()
					console.log(res)
					this.message = res.msg
					console.log(res.msg || '扫码入库失败')
				})
			
			},
			/**
			 * 返回到上一页
			 */
			toBack(){
				uni.navigateBack({
					delta: 1
				});
			},
			/**
			 * 重新扫码
			 */
			reScan(){
				
				// 如果直接返回到扫码页面，会卡死
				// uni.navigateBack({
				// 	delta: 1
				// })
				
				const obj = {
					name:'扫码入库',
					dec:'请对条码进行核销',
					api:'',
					rightIconUrl:'/pages/work/warehousing/list',
					confirmTo:'/pages/work/warehousing/detail',
					failTo:'/pages/work/warehousing/fail'
				}
				uni.redirectTo({
					url:`/pages/work/com/barcode?name=${obj.name}&dec=${obj.dec}&api=${obj.api}&&rightIconUrl=${obj.rightIconUrl}&confirmTo=${obj.confirmTo}&failTo=${obj.failTo}`
				})
			}
		}
	}
</script>

<style lang="scss">
	.page{
		min-height: 100vh;
		background-color: #F2F2F2;
	}
	.list-box{
		width:calc(100vw - 40rpx);
		margin-left:20rpx;
		margin-top:20rpx;
		border-radius:12rpx;
		overflow: hidden;
	}
	.img-box{
		display:flex;
		justify-content: center;
		align-items: center;
		width:100vw;
		flex-direction: column;
		.img{
			height:230rpx;
			background-color: #000000;
		}
	}
	.message-box{
		display: flex;
		flex-direction: column;
		text-align: center;
		color: $uni-color-primary;
		margin-top: 20rpx;
		position: relative;
		top: 30px;
	}
	.barcode {
	    display: flex;
	    flex-direction: column;
	    justify-content: center;
	    align-items: center;
		width: 600rpx;
		background-color: #fff;
		border-radius: 10rpx;
		padding: 20px 0 10px;
		margin-top: 120px;
	}
	
	.barcode::before{
		content: '';
		height: 0px;
		width: 0px;
	}
	.no-barcode{
		width: 600rpx;
		border-radius: 10rpx;
		padding: 20px 0 10px;
		margin-top: 120px;
		height: 0rpx;
	}
	
	.barnum {
	    width: 670rpx;
	    font-size: 30rpx;
	    text-align: center;
			margin-top: 20rpx;
	}
	/deep/.uni-list-item__extra{
		width: 75%;
	}
</style>

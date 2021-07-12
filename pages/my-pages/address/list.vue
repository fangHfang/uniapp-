<template>
	<view class="page">
		<uni-nav-bar id="navBar" title="选择收货地址" rightText="新增地址" left-icon="back" backgroundColor="#ed6d00" color="#fff" @clickLeft="toBack" @clickRight="add"></uni-nav-bar>
		<mescroll-uni
			ref="mescrollRef"
			@init="mescrollInit"
			class="mescroll-uni"
			:top="pageOptions.mescrollTop"
			:bottom="pageOptions.mescrollBottom"
			safearea
			@down="downCallback"
			@up="upCallback">
				<view  class="list-item" v-for="(item,index) in list" :key="index">
					<view class="body-box">
						<uni-swipe-action>
							<uni-swipe-action-item>
								<view class="flex a-center j-space-between w">
									<view class="center-content address"  @tap="checkAddress(item)">
										<view>
											<text class="name text-normal">{{item.consignee}}</text>
											<text class="text-gray">{{item.phone}}</text>
											<text v-if="item.isDefault === 0" class="default">默认</text>
										</view>
										<text class="text-address text-normal">{{formatAddress(item)}}</text>
									</view>
									<uni-icons @tap="edit(item.userAddressNo)" class="tips-icon flex a-center j-center" type="compose" color="#666" size="18"></uni-icons>
								</view>
								<template v-slot:right>
									<view class="del" @click="del(item.userAddressNo,index)"><text>删除</text></view>
								</template>
							</uni-swipe-action-item>
						</uni-swipe-action>
					</view>
					</view>
					<noData v-if="list.length === 0" />
		</mescroll-uni>
		<uni-popup ref="dialog" type="dialog" >
			<uni-popup-dialog title='确定删除收货地址吗？' @confirm="dialogConfirm"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
  import noData from '@/components/no-data/index.vue'
  import mall from '@/api/mall/mall.js'
  import user from '@/api/user/user.js'
	import order from '@/api/order/order.js'
	export default {
		name: 'addressList',
		components: {noData},
		data() {
			return {
				// 下拉刷新组件实例
				mescroll: null,
				// 页面配置
				pageOptions: {
					// 适配刘海屏
					mescrollTop:40,
					mescrollBottom:20
				},
				list:[],
				// 要删除的对象
				delObj:{
					userAddressNo:null,
					index:null
				},
				// 积分订单修改地址
				integralOrderNo:""
			}
		},
		onLoad(e) {
			const { integralOrderNo } = e
			this.integralOrderNo = integralOrderNo
		},
		mounted() {
		  this.countTopBar()
		},
		onShow(){
			 this.listAddressAll()
		},
		methods: {

      /**
       * 查询全部收货地址
       */
      listAddressAll(){
				uni.showLoading({
					mask:true,
					title: '加载中'
				});
				mall.listAddressAll().then(res =>{
				this.list = res.data
				uni.hideLoading();
				})
      },

      /**
       * 计算顶部DOM元素节点
       */
		async countTopBar(){
			const searchBarHeight = await this.$getComponentsDom('#navBar');
			this.pageOptions.mescrollTop = searchBarHeight.bottom + 'px'
		},

		/**
		 * 初始化回调方法
		 * @param {Object} mescroll
		 */
		mescrollInit(mescroll) {
			this.mescroll = mescroll
		},
		/**
		 * 返回上一级页面
		 */
		toBack(){
			uni.navigateBack({
				delta: 1
			})
		},
		/**
		 * 新增收货地址
		 */
		add(){
			uni.navigateTo({
				url:'/pages/my-pages/address/edit'
			})
		},

		/**
		 * 选择收货地址
		 */
		checkAddress(item){
			const parms = this.parms(item)
			const pages = getCurrentPages();
			const page = (pages[pages.length-2]).route;
			// 判断是否是订单页，是：返回，否：进入编辑
			if(page === 'pages/products/order/confirm' || page === 'pages/products/order/confirmIntegral' ||  page === 'pages/products/order/confirmExchange'){
				// 将 地址 存储在本地缓存中指定的 key 中
				uni.setStorageSync('address', item);
				uni.navigateBack({
					delta: 1
				})
				return
			}
			// 判断订单号是否有值，并且上个页面是积分订单详情页面，修改该订单号地址
			if(page === 'pages/my-pages/integral/detail/integral-detail' && this.integralOrderNo){
				let postData = {
					orderNo:this.integralOrderNo,
					userAddressNo:item.userAddressNo
				}
				uni.showLoading({
					mask:true
				})
				order.editAddress(postData).then((res)=>{
					uni.showToast({
						title:'修改地址成功',
						icon:'success'
					})
					setTimeout(()=>{
						uni.hideLoading()
						uni.navigateBack({
							delta: 1
						})
					},1000)
				}).catch(()=>{
					
				})
				// 将 地址 存储在本地缓存中指定的 key 中
				return
			}
			uni.navigateTo({
				url:`/pages/my-pages/address/edit?userAddressNo=${item.userAddressNo}`
			})
		},

      /**
       * 工具函数
       * parms 返回的地址参数
       */
      parms(item){
        let parms = [
          `id=${item.userAddressNo}`,
          `name=${item.consignee}`,
          `phone=${item.phone}`,
          `province=${item.province}`,
          `city=${item.city}`,
          `town=${item.town}`,
          `address=${item.address}`,
          `default=${item.isDefault}`,
        ].join('&')
        return parms
      },

			/**
			 * 编辑收货地址
			 */
			edit(userAddressNo){
				uni.navigateTo({
					url:`/pages/my-pages/address/edit?userAddressNo=${userAddressNo}`
				})
			},

			/**
			 * 确认删除
			 */
			dialogConfirm() {
				uni.showLoading({
					mask:true,
					title: '加载中'
				});
				user.delUserAddress(this.delObj).then((res)=>{
					this.list.splice(this.delObj.index,1)
					this.$refs.dialog.close()
					uni.hideLoading()
					uni.showToast({
						title:"删除地址成功",
						icon:"success",
					})
				}).catch((err)=>{
					console.log('删除地址失败:' + err)
					uni.showToast({
						title:"删除地址失败",
						icon:"none"
					})
				})
			},


			/**
			 * 点击删除
			 */
			del(userAddressNo,index){
				this.$refs.dialog.open()
				this.delObj.userAddressNo = userAddressNo
				this.delObj.index = index
			},

			/**
			 * 下拉刷新回调
			 */
			downCallback() {
			  // 重新查询地址
			  this.listAddressAll()
				setTimeout(() => {
					//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
					this.mescroll.endSuccess(this.list.length,false);
				}, 1000)
			},
			
			/**
			 * 格式化地址
			 */
			formatAddress(item){
				let { districtName,address } = item
				districtName = districtName.replace(/\//g, '')
				return districtName + address
			}
		}
	}
</script>

<style lang="scss">
	.mescroll-uni{
		padding-top: var(--status-bar-height);
	}
	.page{
		min-height: 100vh;
		overflow-y: hidden;
		background-color: #F2F2F2;
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
	}
	.list-item{
		width:100%;
		overflow: visible;
		background-color: #fff;
		border-bottom:1px solid #eee;
	}
	.center-content{
		flex:1;
		padding:30rpx 0;
	}
	.address{
		margin-left:20rpx;
		.name{
			font-size:30rpx;
		}
		.phone,.text-address{
			font-size:24rpx;
			color:#999;
			text-align: left;
		}
		.text-gray{
			font-size:24rpx;
			margin-left:20rpx;
		}
	}
	.tips-icon{
		width:100rpx;
		height:100%;
	}
	.default{
		color:#fff;
		border-radius:8rpx;
		background-color: $uni-color-primary;
		padding:4rpx 20rpx;
		margin-left:10rpx;
		font-size:20rpx;
	}
	.del{
		width:160rpx;
		height:100%;
		background-color:#E10000;
		display: flex;
		align-items: center;
		justify-content: center;
		text{
			color:#fff
		}
	}


</style>

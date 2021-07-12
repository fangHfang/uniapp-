<template>
	<view class="page">
		<view id="tab">
			<uni-nav-bar 
				id="iNavBar"
				title="订单管理" 
				backgroundColor="#ed6d00" 
				color="#fff"
				left-icon="back"
				@clickLeft="navBack" 
				@clickRight="openOrderTypePop"
			>
				<block slot="right">
					<view class="order-type">
						<view><text class="uni-nav-bar-text" style="font-size:14px;">{{ orderTypeList[currentOrderTypeIndex].label }}</text></view>
						<uni-icons type="arrowdown" color="#fff" size="14" />
					</view>
				</block>
			</uni-nav-bar>
			<!-- 搜索栏 -->
			<view class="flex search-box">
				<view class="search-mask" @tap="toSearch"></view>
				<uni-search-bar class="search-bar" placeholder="订单编号" @confirm="" @input="" :radius="20" type="" cancelButton="none" @focus=""/>
			</view>
			<v-tabs 
				v-model="tabIndex" 
				:tabs="tabs" 
				:scroll="false"
				class="tab-box"
				bold
				field="name"
				badge="number"
				color="#666"
				activeColor="#ed6d00"
				lineColor="#ed6d00"
				height="80rpx"
				fontSize="24rpx"
				lineHeight="8rpx"
				@change="changeTab"></v-tabs>
		</view>
		<swiper 
			class="swiper-box"
			:style="`height:${swiperHeight}`"
			:current="tabIndex" 
			duration="300" 
			@change="swiperChange">
		  <swiper-item 
				v-for="(item,index) in tabs" 
				:key="index"
				class="swiper-item ">
				<order-list-item
					:ref="'mescrollItem' + index" 
					:i="index" 
					:height='topHeight'
					:index="tabIndex" 
					:tabs="tabs"
					:orderCategory="orderTypeList[currentOrderTypeIndex].value"
					:orderStatusKey="item.status"
					@toDetail="toDetail"
					@openDialog="openDialog"
					></order-list-item>
		  </swiper-item>
		</swiper>
		<uni-popup ref="popup" type="dialog">
			<view class="modal-box">
				<icon @click="close" class="iconfont cancel" style='color:#000000;font-size: 34rpx;' type=""></icon>
				<view class="modal-content">
					<text v-if="dialogOptions.showTextOne">{{dialogOptions.textOne}}</text>
					<text>{{dialogOptions.textTwo}}</text>
				</view>
				<view class="modal-button">
					<view class="cancel-button" @click="close">
						<text>取消</text>
					</view>
					<view class="confirm-button" @click="dialogConfirm()">
						<text>确定</text>
					</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup v-if="topNavBarHeight!==0" ref="orderTypePopup" type="top" :topHeight="topNavBarHeight">
			<view class="popup-content">
				<uni-list>
					<uni-list-item :class="index===currentOrderTypeIndex ?'popli active':'popli'" v-for="(item,index) in orderTypeList" :key="index" :title="item.label" :rightText="index===currentOrderTypeIndex?'✔':''" :clickable="true" @click="changeOrderType(item,index)"/>
				</uni-list>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	import vTabs from "@/components/v-tabs/v-tabs.vue";
	import OrderListItem from "./order-list-item.vue";
	import order from '@/api/order/order.js'
	export default {
		name: 'orderList',
		components: {
			vTabs,
			OrderListItem
		},
		data() {
			return {
				systemInfo:uni.getSystemInfoSync(),
				// tabs 0-待付款,1-待收货,2-部分收货,3-已完成,4-强制收货,5-已退款,6-已关闭
				tabs: [
					{name:"全部",status:null},
					{name:"待付款",status:0},
					{name:"待收货",status:1},
					{name:"已取消",status:6},
					{name:"已完成",status:3},
				],
				// tabs下标
				tabIndex: 1 ,
				swiperHeight:'100%',
				topHeight:'100%',
				currentOrderTypeIndex:0,
				topNavBarHeight:0,
				orderTypeList:[
					{label:'全部',value:null},
					{label:'商城订单',value:1},
					{label:'秒杀订单',value:2},
					{label:'限时抢购',value:3},
					{label:'商品组合',value:4},
				],
				// 弹窗设置
				dialogOptions:{
					// 弹窗类型 type:1-收货，2-取消订单
					type:'',
					// 是否显示第一行
					showTextOne:true,
					// 第一行文本
					textOne:"",
					// 第二行文本
					textTwo:"",
					// 选中类型
					item:{}
				}
			}
		},
		onLoad(e) {
			const {tabIndex} = e
			this.tabIndex = Number(tabIndex)
		},
		computed:{
			...mapState({
				// 积分
				integralInfo: state => state.login.integralInfo,
			}),
		},
		created(){
			
		},
		mounted(){
			//this.mescrollItem.listOrderByPage(orderStatus);
			this.countTopBar();
		},
		onShow(){
			// 用于改变订单状态后刷新列表页
			this.refreshAllOrder()
		},
		methods: {
			/**
			 * 计算顶部DOM元素节点
			 */
			async countTopBar(){
				let that = this
				const topHeight = await this.$getComponentsDom('#tab');
				const iNavBar = await this.$getComponentsDom('#iNavBar');
				this.topNavBarHeight=iNavBar.height
				this.topHeight = topHeight.bottom+ 'px'
				this.swiperHeight =  (that.systemInfo.windowHeight - topHeight.bottom) + 'px'
			},
			changeOrderType(item,index){
				this.currentOrderTypeIndex=index
				this.$refs.orderTypePopup.close()
			},
			openOrderTypePop(){
				this.$refs.orderTypePopup.open()
			},
			/**
			 * tab切换事件
			 */
			changeTab(index) {
				this.tabIndex = index;
			},
			/**
			 * swipe切换事件
			 * @param {Object} e
			 */
			swiperChange(e) {
				let { current } = e.target;
				this.tabIndex = current;
			},
			
			/**
			 * 跳转详情页
			 * 传入id和标题，标题需要显示
			 */
			toDetail({id,name}){
				// uni.navigateTo({
				// 	url:'/pages/community/detail/communityDetail?id=' + id + '&title=' + name
				// })
			},
			
			/**
			 * 跳转搜索页
			 */
			toSearch(){
				uni.navigateTo({
					url:"/pages/my-pages/order/search/order-search"
				})
			},
			
			
			/**
			 * 返回上一页
			 */
			navBack(){
				const obj = {
					"name": "my",
					"id": 4
				}
				uni.reLaunch({
					url:`/pages/index/index?name=${obj.name}&id=${obj.id}`
				})
			},

			/**
			 * 打开弹窗
			 */
			openDialog(item){
				this.dialogOptions = item
				this.$refs.popup.open()
			},

			close(){
				this.$refs.popup.close()
			},

			/**
			 * 弹窗
			 */
			dialogConfirm(){
				// type:1-收货，2-取消订单
				switch(this.dialogOptions.type){
					case 1:
						// 调用确认收货方法
						this.receivingGoods()
						break
					case 2:
						// 调用取消订单方法
						this.cancelOrder()
						break
				}
			},

			/**
			 * 确认收货方法
			 */
			receivingGoods(){
				uni.showLoading({mask:true})
				let postData = {
					customerNo:this.integralInfo.customerNo,
					orderNo:this.dialogOptions.item.orderNo
				}
				order.createOrder(postData).then((res)=>{
					this.close()
					uni.hideLoading()
					uni.showToast({
						title:"确认收货成功",
						icon:'success',
					})
					this.refreshAllOrder()
				}).catch((err)=>{
					console.log('确认下单失败:' + err)
				})
			},
			
			/**
			 * 取消订单方法
			 */
			cancelOrder(){
				uni.showLoading({mask:true})
				let postData = {
					orderNo:this.dialogOptions.item.orderNo
				}
				order.cancelOrder(postData).then((res)=>{
					this.close()
					uni.hideLoading()
					uni.showToast({
						title:"取消订单成功",
						icon:'success',
					})
					this.refreshAllOrder()
				}).catch((err)=>{
					uni.showToast({
						title:'订单已取消',
						icon:"none"
					})
					console.log('确认下单失败:' + err)
				})
			},

			/**
			 * 手动刷新订单
			 */
			refreshAllOrder(){
				let _this = this
				this.tabs.map((item,index)=>{
					_this.$refs['mescrollItem' + index] && _this.$refs['mescrollItem' + index][0].downCallback()
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page{
	}
	// swpier
	.swiper-box{
		background-color: #F2F2F2;
	}
	.swiper-item{
		height:100%;
		width:100%;
	}
	// swpier
	// 搜索栏
	.search-box {
		position: relative;
		.search-mask{
			position: absolute;
			z-index: 2;
			width: 100%;
			height: 100%;
		}
	}
	/deep/.search-bar {
		width: 100%;
		background-color: #FFFFFF;
		padding: 20rpx;
	
		>.uni-searchbar__box {
			justify-content: left;
			height: 68rpx;
			border-color: $uni-color-primary;
	
			>.uni-searchbar__text-placeholder {
				margin-left: 0px;
			}
		}
	}
	// 搜索栏
	.tab-box{
		border-bottom: 1px solid #eee;
	}
	.modal-box{
		width: calc(90vw - 100rpx);
		height: calc(50vw - 150rpx);
		background-color: #FFFFFF;
		border-radius: 20rpx;
		padding: 100rpx 50rpx 50rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		>icon{
			position: absolute;
			right: 20rpx;
			top:20rpx
		}
		.modal-content{
			display: flex;
			flex-direction: column;
			>text{
				text-align: center;
				line-height: 48rpx;
				font-size: 36rpx;
				font-weight: 400;
				color: #1C1C1C;
			}
		}
		.modal-button{
			display: flex;
			justify-content: space-between;
			.cancel-button{
				border: 2rpx solid #ed6d00;
				border-radius: 40rpx;
				padding: 11rpx 100rpx;
				>text{
					font-size: 38rpx;
					font-family: PingFang SC;
					font-weight: bold;
					color: #ed6d00;
				}
			}
			.confirm-button{
				background-color: #ed6d00;
				border-radius: 40rpx;
				padding: 11rpx 100rpx;
				>text{
					font-size: 38rpx;
					font-family: PingFang SC;
					font-weight: bold;
					color: #FFFFFF;
				}
			}
		}
	}
	.order-type{
		display:flex;
		width:100%;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
	}
	/deep/.uni-navbar__content{
		z-index:2000;
	}
	/deep/.status-bar-placeholder{
		z-index:2000;
	}
	/deep/.popli{
		.uni-list-item__container{
			padding: 12px 15px;
		}
		&.active{
			span,text,div{
				color:$uni-color-primary;
			}
		}
	}
</style>

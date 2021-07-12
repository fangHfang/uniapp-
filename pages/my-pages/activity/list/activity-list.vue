<template>
	<view class="page">
		<view id="tab">
			<uni-nav-bar 
				title="活动订单" 
				backgroundColor="#ed6d00" 
				color="#fff"
				left-icon="back"
				@clickLeft="navBack"
			></uni-nav-bar>
			<!-- 搜索栏 -->
			<view class="flex search-box">
				<uni-search-bar 
					class="search-bar" 
					placeholder="输入订单号" 
					@input="inputWord"
					:radius="20" 
					type="" 
					cancelButton="none"/>
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
				<activity-list-item
					:ref="'mescrollItem' + index" 
					:i="index" 
					:height='topHeight'
					:index="tabIndex" 
					:tabs="tabs"
					:orderNo="orderNo"
					@openDialog="openDialog"
					></activity-list-item>
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
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	import vTabs from "@/components/v-tabs/v-tabs.vue";
	import ActivityListItem from "./activity-list-item.vue";
	import order from '@/api/order/order.js'
	export default {
		name: 'activityList',
		components: {
			vTabs,
			ActivityListItem
		},
		data() {
			return {
				systemInfo:uni.getSystemInfoSync(),
				// tabs
				tabs: [
					{name:"全部",orderStatus:''},
					{name:"待付款",orderStatus:0},
					{name:"待收货",orderStatus:1},
					{name:"取消",orderStatus:6},
					{name:"已完成",orderStatus:3},
				],
				// tabs下标
				tabIndex: 0 ,
				// 0-待付款,1-待收货,2-部分收货,3-已完成,4-强制收货,5-已退款,6-已关闭
				orderStatus:1,
				swiperHeight:'100%',
				topHeight:'100%',
				// 搜索订单号
				orderNo:"",
				// 搜索节流定时器
				searchTimer:"",
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
			// const {tabIndex} = e
			// this.tabIndex = Number(tabIndex)
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
				this.topHeight = topHeight.bottom+ 'px'
				this.swiperHeight =  (that.systemInfo.windowHeight - topHeight.bottom) + 'px'
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

			// 输入监听
			inputWord(val){
				// this.curWord = e.detail.value // 已使用v-model,无需再次赋值
				// 节流,避免输入过快多次请求
				this.searchTimer && clearTimeout(this.searchTimer)
				this.searchTimer = setTimeout(()=>{
					// 查询方法 val 是对象
					this.orderNo = val.value;
				},300)
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
			 * 手动刷新订单
			 */
			refreshAllOrder(){
				let _this = this
				this.tabs.map((item,index)=>{
					_this.$refs['mescrollItem' + index] && _this.$refs['mescrollItem' + index][0].downCallback()
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
	}
	/deep/.search-bar {
		width: 100%;
		background-color: #FFFFFF;
		padding: 20rpx 20rpx 0 20rpx;
	
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
</style>

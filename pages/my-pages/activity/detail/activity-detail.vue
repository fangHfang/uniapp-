<template>
	<view class="page">
		<uni-nav-bar
			title="订单详情"
			backgroundColor="#ed6d00"
			color="#fff"
			left-icon="back"
			@clickLeft="navBack"
		></uni-nav-bar>
		<scroll-view class="scroll-view" scroll-y="true" >
			<!-- 顶部订单状态 -->
			<view class="top-order-status">
				<!-- 0-待付款,1-待收货,2-部分收货,3-已完成,4-强制收货,5-已退款,6-已关闭 -->
				<view class="order-status" v-if="tableData.orderStatus === 0">
					<icon class="iconfont qian-renminbi" style='color:#ed6d00;font-size: 58rpx;' type=""></icon>
					<text>待付款</text>
				</view>
				<view class="order-status" v-if="tableData.orderStatus === 1">
					<icon class="iconfont zhifuchenggong" style='color:#ED9700;font-size: 58rpx;' type=""></icon>
					<text class="wait-receiving-goods">待收货</text>
				</view>
				<view class="order-status" v-if="tableData.orderStatus === 2">
					<icon class="iconfont dengdai" style='color:#ED9700;font-size: 58rpx;' type=""></icon>
					<text class="wait-receiving-goods">部分收货</text>
				</view>
				<view class="order-status" v-if="tableData.orderStatus === 3">
					<icon class="iconfont zheng-que" style='color:#0DC316;font-size: 58rpx;' type=""></icon>
					<text class="done-receiving-goods">已完成</text>
				</view>
				<view class="order-status" v-if="tableData.orderStatus === 4">
					<icon class="iconfont warning" style='color:#E80000;font-size: 58rpx;' type=""></icon>
					<text class="compulsory-receipt">强制收货</text>
				</view>
				<view class="order-status" v-if="tableData.orderStatus === 5">
					<icon class="iconfont qian-renminbi" style='color:#ed6d00;font-size: 58rpx;' type=""></icon>
					<text>已退款</text>
				</view>
				<view class="order-status" v-if="tableData.orderStatus === 6">
					<icon class="iconfont cancel" style='color:#666666;font-size: 58rpx;' type=""></icon>
					<text class="cancelled">已关闭</text>
				</view>
				<view class="count-down" v-if="tableData.orderStatus === 0">
					<text>等待买家付款</text>
					<view class="flex a-center j-center">
						<text class="text-normal" style="color: #00B60D;">剩余</text>
						<uni-countdown 
							@timeup='timUp'
							:minute="minutes"
							:second="seconds"
							:show-day="false"
							:showHour="false"
							splitorColor="#00B60D"
							color="#00B60D"
							backgroundColor="rgba(0,0,0,0)" 
							borderColor="rgba(0,0,0,0)"></uni-countdown>
						<text class="text-normal" style="color: #00B60D;">自动关闭</text>
					</view>
				</view>
			</view>
			<!-- 地址 -->
			<view class="address-box">
				<icon class="iconfont dizhi" style='color:#ed6d00;font-size: 44rpx;' type=""></icon>
				<view class="address-info">
					<view class="address-user">
						<text class="user-name">{{tableData.receiveName}}</text>
						<text class="user-phone">{{tableData.receiveMobile}}</text>
					</view>
					<text class="address-address">{{tableData.receiveAddressSummary && tableData.receiveAddressSummary.replace(/\//g, '')}}</text>
				</view>
			</view>
			<!-- 商品 -->
			<view class="product-box">
				<text class="proudct-box-title">{{tableData.orderActivities[0].isMjsProduct ? '玛吉斯商品' : '非玛吉斯商品'}}</text>
				<!-- 套餐商品 -->
				<view class="set-meal-box">
					<view
						v-for="(meal,mealIndex) in tableData.orderItems"
						:key="'orderDetailList' + mealIndex">
						<view class="product-item">
							<view class="product-image">
								<image :src="meal.itemImageUrl" mode=""></image>
							</view>
							<view class="product-info">
								<view class="product-info-top">
									<text class="product-name">{{meal.itemName}}</text>
									<text class="product-brand">品牌: {{meal.itemBrand}}</text>
									<text class="product-spc">规格: {{meal.itemSpecDetail}}</text>
									<text class="product-classify">分类: {{meal.itemCategoryBackend}}</text>
								</view>
								<view class="product-price-number">
									<text class="product-price">￥{{formatMoney(meal.itemPrice)}}</text>
									<text class="product-number">x{{meal.itemQuantity}}</text>
								</view>
							</view>
							<!-- orderDetailScanCodeStatus -->
							<!-- 0- 不需要扫码；1-未扫码；2- 部分扫码；3- 扫码完成 -->
							<view class="scan-code"  :class="{'all':meal.orderDetailScanCodeStatus !== '2','half':meal.orderDetailScanCodeStatus === '2'}">{{formatCodeStatus(meal.orderDetailScanCodeStatus)}}</view>
							
						</view>
					</view>
				</view>
				<!-- 申请退货 || 扫码记录 -->
				<view class="product-botton" v-if="tableData.orderStatus === 2 && tableData.orderActivities[0].isMjsProduct">
					<!-- <text @click="open(2)" v-if="tableData.orderStatus === 1">申请退货</text> -->
					<!-- <text>申请退款</text> -->
					<text @click="navToCode">扫码记录</text>
				</view>
				<view class="product-botton" v-if="tableData.orderStatus === 0">
					<text @click="open('取消订单')">取消订单</text>
				</view>
			</view>
			<!-- 支付信息 -->
			<view class="pay-info-box" v-if="tableData.orderStatus !== 3">
				<view class="pay-info-activity">{{tableData.orderActivities[0].activityName}}</view>
				<view class="pay-info-item">
					<text class="pay-item-title">支付信息</text>
					<view class="pay-info">
						<view class="pay-info-left">
							<text>总额：</text>
							<text>优惠券折扣：</text>
							<text>新玛元折扣：</text>
							<text>实付款：</text>
						</view>
						<view class="pay-info-right">
							<text>¥{{formatMoney(tableData.orderAmount)}}</text>
							<text>¥{{formatMoney(tableData.consumeCouponAmount)}}</text>
							<text>¥{{formatMoney(tableData.consumeRebateAmount)}}</text>
							<text class="red">¥{{formatMoney(tableData.payAmount)}}</text>
						</view>
					</view>
				</view>
				
				<view class="pay-info-item">
					<text class="pay-item-title">获利信息</text>
					<view class="pay-info">
						<view class="pay-info-left">
							<text>积分：</text>
							<text>新玛元：</text>
							<text>兑换点：</text>
						</view>
						<view class="pay-info-right">
							<text>{{tableData.integrationAmount}}</text>
							<text>{{tableData.rebateAmount}}</text>
							<text v-if="tableData.epRuleNames && tableData.epRuleNames.length > 0">{{tableData.epRuleNames[0].exchangeAmount}}</text>
							<text v-else>0</text>
						</view>
					</view>
				</view>
				
				<view class="pay-info-item">
					<text class="pay-item-title">订单信息</text>
					<view class="pay-info">
						<view class="pay-info-left">
							<text>订单编号：</text>
							<text>下单时间：</text>
						</view>
						<view class="pay-info-right">
							<text>{{tableData.orderNo}}</text>
							<text>{{tableData.orderTime}}</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 付款单 -->
			<view class="pay-info-box" v-if="tableData.orderStatus !== 0 && tableData.orderStatus !== 6">
				<view class="pay-info-item">
					<text class="pay-item-title">付款单</text>
					<view class="pay-info">
						<view class="pay-info-left">
							<text>支付时间：</text>
							<text>支付方式：</text>
						</view>
						<view class="pay-info-right">
							<text>{{tableData.payTime}}</text>
							<text>{{formatPayChannel(tableData.payChannel)}}</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 已取消-付款单 -->
			<view class="pay-info-box" v-if="tableData.orderStatus === 6">
				<view class="pay-info-item">
					<view class="pay-info">
						<view class="pay-info-left">
							<text>订单编号：</text>
							<text>下单时间：</text>
							<text>支付方式：</text>
							<text class="red">合计：</text>
						</view>
						<view class="pay-info-right">
							<text>{{tableData.orderNo}}</text>
							<text>{{tableData.orderTime}}</text>
							<text>{{tableData.payChannel}}</text>
							<text class="red">¥{{formatMoney(tableData.orderPayAmount)}}</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 当显示底部按钮时，填充一下此处 -->
			<view v-if="tableData.orderStatus !== 4 && tableData.orderStatus !== 5" class="bottom-button-box"></view>
			<view v-else class="bottom-button-box-default"></view>
		</scroll-view>
		<!-- 0-待付款,1-待收货,2-部分收货,3-已完成,4-强制收货,5-已退款,6-已关闭 -->
		<view class="bottom-button mescroll-safearea" v-if="tableData.orderStatus === 0">
			<view class="button-box" @click="open(tableData.orderStatus)">
				<text v-if="tableData.orderStatus === 0" >确认付款</text>
				<!-- <text v-if="tableData.orderStatus === 1 || tableData.orderStatus === 2">确认收货</text> -->
				<!-- 活动订单没有重新下单 -->
				<!-- <text v-if="tableData.orderStatus === 3 || tableData.orderStatus === 6">重新下单</text> -->
			</view>
		</view>
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
					<view class="confirm-button" @click="dialogConfirm">
						<text>确定</text>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import order from '@/api/order/order.js'
	import {dateUtil,dateFormat} from '@/common/utils/DateUtil.js'
	import seckill from "@/api/deadline/seckill"
	export default {
		data() {
			return {
				mealProductList:[],
				// 0-待付款,1-待收货,2-部分收货,3-已完成,4-强制收货,5-已退款,6-已关闭
				order:{
					status:1
				},
				modal:{
					show:true,
					type:1
				},
				// 查询条件
				searchData:{
					// 订单编号
					orderNo:''
				},
				// 0 待发货、1 已发货
				tableData: {
					
					orderItems:[],
					orderActivities:[{}]
				},
				//支付过期时间
				payExpireTime:'',
				//支付是否过期
				isExpire:false,
				minutes:0,
				seconds:0,
				// 当前时间
				now:new Date(),
				// 倒计时
				setTime:"",
				// 弹窗设置
				dialogOptions:{
					// 弹窗类型,1-确认收货,2-申请退货
					// type:1,
					// 是否显示第一行
					showTextOne:true,
					// 第一行文本
					textOne:"",
					// 第二行文本
					textTwo:""
				}
			}
		},
		//路由传值
		onLoad(option) {
		   const { orderNo } = option;
		   this.searchData.orderNo = orderNo;
		   // 倒计时
			this.setTime = setInterval(()=>{
				this.now = new Date()
			},1000)
		},
		onShow() {
			this.orderNoDetail()
		},
		onUnload(){
			this.setTime && clearInterval(this.setTime)
		},
		mounted(){
			
		},
		computed:{
			/**
			 * 显示显示倒计时-小时
			 */
			calcReturnGoods(){
				let type = false
				// 30分钟后不允许退款
				if(this.tableData.cancelTime && (new Date(this.tableData.cancelTime.replace(/-/g, "/")).getTime() > this.now.getTime())){
					type = true
				}
				return type
			},
			...mapState({
				// 积分
				integralInfo: state => state.login.integralInfo,
			}),
		},
		methods: {
			/**
			 * 查询订单详情
			 */
			orderNoDetail(){
				let payload = this.$jsonFormat(this.searchData)
				seckill.getActiveOrderItemDetail(payload).then(res => {
					if (res.code === 200) {
						this.tableData = res.data;
						this.payExpireTime = res.data.expireTime;
						const now = new Date();
						const nowDay = dateFormat('yyyy-MM-dd HH:mm:ss',now);
						// const nowDay = '2021-01-05 09:57:00';
						// //如果支付时间已经过期则无法支付，不显示倒计时
						if(nowDay> this.payExpireTime || nowDay=== this.payExpireTime){
							this.isExpire = true
							if(this.tableData.orderStatus == 0){
								this.timUp();
							}
						}else{
							this.timeSubtraction(nowDay,this.payExpireTime)
						}
					} else {
					this.$message.error("查询失败,请稍后重试");
					}
				}).catch(() => {
				});
			},
			/**
			 * 返回上一页
			 */
			navBack(){
				uni.navigateBack({
					delta:1
				})
				// uni.navigateTo({
				//     url:"/pages/my-pages/activity/list/activity-list?tabIndex=1"
				// })
			},
			/**
			 * 打开弹窗
			 * type:// 0-待付款,1-待收货,2-部分收货,3-已完成,4-强制收货,5-已退款,6-已关闭
			 */
			open(type){
				switch(type.toString()){
					case '0':
						let payExpireTime = new Date(this.tableData.cancelTime.replace(/-/g, "/"))
						let orderInfo = {
							...this.tableData,
							payAmount:this.tableData.orderAmount,
							orderStatus:"待付款",
							payExpireTime:dateFormat('yyyy-MM-dd HH:mm:ss',payExpireTime),
							consumeCouponAmount:this.tableData.consumeCouponAmount || 0,
							consumeRebateAmount:this.tableData.consumeRebateAmount || 0,
							isActivity:true
						}
						// 判断所有商品是否全部扫码，否则需要提示
						uni.navigateTo({
							url:'/pages/products/order/pay?orderInfo=' + JSON.stringify(orderInfo)
						})
						return
						break;
					case '1':
					case '2':
						// 判断所有商品是否全部扫码，否则需要提示
						// 非玛吉斯不需要扫码
						let isShow = false
						this.tableData.orderItems.map((item)=>{
							if(item.orderDetailScanCodeStatus === '未扫码' || item.orderDetailScanCodeStatus === '部分扫码'){
								isShow = true
							}
						})
						this.dialogOptions = {
							orderStatus:type.toString(),
							showTextOne:isShow,
							textOne:"还有部分商品未扫码入库",
							textTwo:"是否确认收货？"
						}
						break;
					case '申请退款':
						// 判断所有商品是否全部扫码，否则需要提示
						this.dialogOptions = {
							orderStatus:'申请退款',
							showTextOne:true,
							textOne:"您还未收到商品",
							textTwo:"是否退款？"
						}
						break;
					case '取消订单':
						// 判断所有商品是否全部扫码，否则需要提示
						this.dialogOptions = {
							orderStatus:'取消订单',
							showTextOne:false,
							textOne:"您还未收到商品",
							textTwo:"是否取消订单？"
						}
						break;
					
				}
			  	// 通过组件定义的ref调用uni-popup方法
			  	this.$refs.popup.open()
			},
			close(){
				this.$refs.popup.close()
			},
			/**
			 * 弹窗
			 */
			dialogConfirm(){
				switch(this.dialogOptions.orderStatus){
					case '1':
					case '2':
						// 调用确认收货方法
						this.receivingGoods()
						break
					case '申请退款':
						// 调用退款方法
						this.refund()
						break
					case '取消订单':
						// 调用取消订单
						this.timUp()
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
					orderNo:this.tableData.orderNo
				}
				order.createOrder(postData).then((res)=>{
					uni.hideLoading()
					uni.showToast({
						title:"确认收货成功",
						icon:'success',
					})
					setTimeout(()=>{
						uni.navigateBack({
							delta:1
						})
					},1500)
				}).catch((err)=>{
					console.log('确认下单失败:' + err)
				})
			},
			
			/**
			 * 退款
			 */
			refund(){
				uni.showLoading({mask:true})
				let postData = {
					customerNo:this.integralInfo.customerNo,
					orderNo:this.tableData.orderNo
				}
				order.orderRefund(postData).then((res)=>{
					uni.hideLoading()
					uni.showToast({
						title:"退款成功",
						icon:'success',
					})
					setTimeout(()=>{
						uni.navigateBack({
							delta:1
						})
					},1500)
				}).catch((err)=>{
					console.log('退款失败:' + err)
				})
			},
			
			/**
			 * 跳转扫码详情
			 */
			navToCode(){
				uni.navigateTo({
					url:"/pages/work/warehousing/order-list?orderNo=" + this.tableData.orderNo
				})
			},
			
			/**
			 * 付款倒计时结束刷新页面
			 * 调用主动取消接口，再重新请求详情页
			 */
			timUp(){
				let postData = {
					orderNo:this.searchData.orderNo,
				}
				order.cancelOrder(postData).then(res => {
					if (res.code === 200) {
						this.close()
						uni.showToast({
							title:"取消订单成功",
							icon:'none',
						})
						this.orderNoDetail()
					} else {
						uni.showToast({
							title:'订单已取消',
							icon:"none"
						})
					}
				}).catch(() => {
					uni.showToast({
						title:'订单已取消',
						icon:"none"
					})
				});
			},

			/**
			 * 公共方法计算相差的年月日，时分秒
			 */
			timeSubtraction(beginTime,endTime) {
				let dateBegin = new Date(beginTime.replace(/-/g, "/"));
				let dateEnd = new Date(endTime.replace(/-/g, "/"));
				let dateDiff = dateEnd.getTime() - dateBegin.getTime();//时间差的毫秒数
				let dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));//计算出相差天数
				let leave1 = dateDiff % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
				let hours = Math.floor(leave1 / (3600 * 1000));//计算出小时数
				//计算相差分钟数
				let leave2 = leave1 % (3600 * 1000);   //计算小时数后剩余的毫秒数
				let minutes = Math.floor(leave2 / (60 * 1000)); //计算相差分钟数
				//计算相差秒数
				let leave3 = leave2 % (60 * 1000);     //计算分钟数后剩余的毫秒数
				let seconds = Math.round(leave3 / 1000);
				this.dayDiff = dayDiff;
				this.minutes = minutes;
				this.seconds = seconds;
			},
			
			/**
			 * 支付渠道格式化
			 */
			formatPayChannel(index){
				let list = [
					'未支付',
					'微信支付',
					'微信小程序支付',
					'支付宝支付',
					'银联支付',
					'大额支付',
					'线下支付',
					'积分支付',
					'兑换点支付',
					'信用支付',
				]
				return list[index || 0]
			},
			
			/**
			 * 格式化状态
			 * 0- 不需要扫码；1-未扫码；2- 部分扫码；3- 扫码完成
			 */
			formatCodeStatus(status){
				let text = ''
				switch(status){
					case '0':
						text = '不需要扫码'
						break
					case '1':
						text = '未扫码'
						break
					case '2':
						text = '部分扫码'
						break
					case '3':
						text = '扫码完成'
						break
				}
				return text
			},
			
			/**
			 * 格式化金额，返回两位小数
			 */
			formatMoney(value){
				let text = '0.00'
				if(value){
					text = Number(value).toFixed(2)
				}
				return text
			}
		}
	}
</script>
<style lang="scss" scoped>
	.page{
		background-color: #f2f2f2;
		height: 100vh;
	}
	.scroll-view{
		height: calc(100% - 88rpx - var(--status-bar-height))
	}
	// 底部按钮填充高度
	.bottom-button-box{
		width: 100%;
		height: calc(80rpx + 25rpx + 25rpx);
		height: calc(80rpx + 25rpx + constant(safe-area-inset-bottom));
		height: calc(80rpx + 25rpx + env(safe-area-inset-bottom));
	}
	.bottom-button-box-default{
		width: 100%;
		height: 40rpx;
		height: calc(40rpx + constant(safe-area-inset-bottom));
		height: calc(40rpx + env(safe-area-inset-bottom));
	}
	// 顶部订单状态
	.top-order-status{
		width: 100vw;
		background-color: #FFFFFF;
		// 订单状态
		.order-status{
			padding: 40rpx;
			text-align: center;
			display: flex;
			align-items: center;
			justify-content: center;
			>text{
				margin-left: 25rpx;
				line-height: 38rpx;
				font-size: 40rpx;
				font-weight: bold;
				color: #ed6d00;
			}
			// 待付款
			.wait-pay{
				color: #ED9700!important;
			}
			// 待收货
			.wait-receiving-goods{
				color: #ED9700!important;
			}
			// 已取消
			.cancelled{
				color: #666666!important;
			}
			// 完成收货
			.done-receiving-goods{
				color: #0DC316!important;
			}
			// 强制收货
			.compulsory-receipt{
				color: #E80000!important;
			}
		}
		// 倒计时
		.count-down{
			display: flex;
			align-items: center;
			flex-direction: column;
			justify-content: center;
			padding: 0 40rpx 40rpx 40rpx;
			text-align: center;
			>text{
				font-size: 24rpx;
				font-weight: 400;
				color: #00B60D;
				line-height: 28rpx;
			}
		}
	}
	// 顶部订单状态
	// 地址
	.address-box{
		margin: 20rpx;
		background-color: #FFFFFF;
		border-radius: 5rpx;
		padding: 20rpx;
		display: flex;
		align-items: center;
		.address-info{
			margin-left: 44rpx;
			.address-user{
				.user-name{
					font-size: 30rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: #1C1C1C;
				}
				.user-phone{
					margin-left: 35rpx;
					font-size: 26rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: #666666;
				}
			}
			.address-address{
				font-size: 26rpx;
				font-weight: 400;
				color: #1C1C1C;
			}
		}
	}
	// 地址
	// 产品
	.product-box{
		margin: 0 20rpx 20rpx;
		background-color: #FFFFFF;
		box-shadow: 0px 6rpx 26rpx 0px rgba(123, 71, 46, 0.05);
		border-radius: 5rpx;
		padding: 40rpx 20rpx;
		// 标题
		.proudct-box-title{
			line-height: 26rpx;
			font-size: 26rpx;
			font-weight: bold;
			color: #1C1C1C;
		}
		// 套餐商品
		.set-meal-box{
			border-bottom: 1px solid #CCCCCC;
		}
		// 普通商品
		.normal-product{

		}
		// 产品
		.product-item{
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 30rpx;
			margin-top:30rpx;
			position: relative;
			// 图片
			.product-image{
				width: 22.6vw;
				height: calc(22.6vw - 2rpx);
				border: 1rpx solid #CCCCCC;
				border-radius: 5rpx;
				>image{
					width: 100%;
					height: 100%;
				}
			}
			// 右侧信息
			.product-info{
				width: calc(100vw - 22.6vw - 40rpx - 40rpx - 20rpx);
				.product-info-top{
					display: flex;
					flex-direction: column;
					// 名称
					.product-name{
						line-height: 30rpx;
						font-size: 26rpx;
						font-weight: bold;
						color: #1C1C1C;
						margin-bottom: 10rpx;
						overflow: hidden;
						-webkit-line-clamp: 2;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-box-orient: vertical;
					}
					// 品牌
					.product-brand{
						line-height: 28rpx;
						font-size: 20rpx;
						font-weight: 400;
						color: #666666;
						margin-bottom: 10rpx;
					}
					// 规格
					.product-spc{
						line-height: 28rpx;
						font-size: 20rpx;
						font-weight: 400;
						color: #666666;
						margin-bottom: 10rpx;
					}
					// 分类
					.product-classify{
						line-height: 28rpx;
						font-size: 20rpx;
						font-weight: 400;
						color: #666666;
						margin-bottom: 38rpx;
					}
				}
				// 底部价格和数量
				.product-price-number{
					display: flex;
					justify-content: space-between;
					// 价格
					.product-price{
						font-size: 20rpx;
						font-weight: bold;
						color: #ed6d00;
					}
					// 数量
					.product-number{
						font-size: 24rpx;
						font-weight: bold;
						color: #252527;
					}
				}
			}
			// 扫码
			.scan-code{
				position: absolute;
				right: 0px;
				top: 45rpx;
				line-height: 26rpx;
				font-size: 26rpx;
				font-weight: bold;
			}
			// 全部
			.all{
				color: #0DC316;
			}
			.half{
				color: #ED9700;
			}

		}
		// 申请退货 || 扫码记录
		.product-botton{
			text-align: right;
			margin-top: 30rpx;
			>text{
				padding: 8rpx 25rpx;
				line-height: 25rpx;
				background-color: #FFFFFF;
				border: 2rpx solid #ed6d00;
				border-radius: 5rpx;
				font-size: 26rpx;
				font-weight: bold;
				color: #ed6d00;
			}
		}
	}
	// 产品
	// 支付信息
	.pay-info-box{
		margin: 0 20rpx 20rpx;
		padding: 20rpx 20rpx 10px;
		background-color: #FFFFFF;
		box-shadow: 0px 6rpx 26rpx 0px rgba(123, 71, 46, 0.05);
		border-radius: 5rpx;
		.pay-info-activity{
			font-size: 24rpx;
			font-weight: 800;
			color: #1C1C1C;
			line-height: 24rpx;
		}
		.pay-info-item{
			padding-top: 10rpx;
			.pay-item-title{
				line-height: 24rpx;
				font-size: 24rpx;
				font-weight: bold;
				color: #1C1C1C;
			}
			.pay-info{
				margin-top: 30rpx;
				display: flex;
				justify-content: space-between;
				>view{
					display: flex;
					flex-direction: column;
					>text{
						line-height: 24rpx;
						font-size: 24rpx;
						font-weight: 400;
						color: #1C1C1C;
						margin-bottom: 20rpx;
						height: 24rpx;
					}
				}
				.pay-info-left{
					width: 22.6vw;
				}
				.pay-info-right{
					width: calc(100vw - 22.6vw - 40rpx - 40rpx - 20rpx);
				}
				.red{
					color: #FD5428;
				}
			}
		}
	}
	// 支付信息
	
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
	
	// 底部按钮
	.bottom-button{
		background-color: #FFFFFF;
		padding-top: 25rpx;
		padding-bottom: 25rpx;
		position: absolute;
		bottom: 0;
		width: 100%;
		.button-box{
			width: calc(100vw - 40rpx);
			margin: auto;
			height: 80rpx;
			line-height: 80rpx;
			background-color: #ed6d00;
			border-radius: 40rpx;
			text-align: center;
			>text{
				line-height: 32rpx;
				font-size: 34rpx;
				font-weight: bold;
				color: #FFFFFF;
			}
		}
	}
	/deep/.uni-countdown__number{width:auto;font-size: 28rpx;}
	
	/* 适配 iPhoneX */
	@supports (bottom: constant(safe-area-inset-bottom)) or (bottom: env(safe-area-inset-bottom)) {
		.mescroll-safearea {
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);
		}
	}

</style>

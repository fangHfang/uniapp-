<template>
	<view class="container page">
		<uni-nav-bar v-if="isShow" class="high-zindex" :style="isShow? 'position:fixed;z-index:9;top:0' :''" title="" left-icon="back" backgroundColor="#ed6d00" color="#fff" @clickLeft="toBack">
			<template slot="">
				<v-tabs v-model="tabIndex" :tabs="navTabs" :lineScale="0.2" bgColor="#ed6d00" color="#fff" activeColor="#fff" lineColor="#fff" height="88rpx" fontSize="24rpx" lineHeight="4rpx" @change="changeTab"></v-tabs>
			</template>
		</uni-nav-bar>
		<view v-else class="left-icon" :style="{'top':calcTop}" @click.stop="toBack">
			 <icon class="iconfont left" style='color:#FFFFFF;font-size: 27px;' type=""></icon>
		</view>
		<scroll-view 
			scroll-y="true"
			class="scroll-view" 
			:scroll-top="scrollTop"
			:scroll-into-view="scrollOptions.intoView"
			@scroll="scroll">
			<view id="swiper-box" class="carousel" >
				<view class="swiper-wrap">
					<swiper class="swiper-box" @change="swiperChange" duration="400">
						<swiper-item class="swiper-item" v-for="(item,index) in itemDetail.bannerPicture" :key="index">
							<view class="image-wrapper">
								<image :src="item" class="img" mode="aspectFill"></image>
							</view>
						</swiper-item>
					</swiper>
					<view class="special-tag" v-if="itemDetail.stockDisplay || itemDetail.stock">兑换即使用</view>
					<view class="special-tag" v-else>无货</view>
					<view class="swipe-dot">
						<text class="swiper-dot-item">{{ (swiperCurrent+1)+"/"+itemDetail.bannerPicture.length }}</text>
					</view>
				</view>
			</view>
			<view id="product-info" class="introduce-section" :class="[itemDetail.itemType === 2 ? 'introduce-section-height' : '']">
				<text class="title" v-if="itemDetail.itemName.length < 50">{{itemDetail.itemName}}</text>
				<text class="title" v-else>{{itemDetail.itemName.substring(0,50)}}...</text>
				<view class="price-wrap">
					<view class="price-box">{{itemDetail.price}}积分</view>
					<view class="store">剩余库存{{itemDetail.stockDisplay || itemDetail.stock}}</view>
				</view>
				<view class="bot-row">
					<view class="bot-limit">每人限购{{itemDetail.limitCount}}</view>
					<button type="primary" class="action-btn add-cart-btn" @tap="cartAdd()">加入购物车</button>
				</view>
				<view class="container-info" v-if="itemDetail.itemType === 2">
					<view class="card-info">卡券信息：{{itemDetail.couponDesc}}</view>
					<view class="card-info">卡券类型：{{itemDetail.couponType === 1 ? '兑换券' : '消费券'}}</view>
					<view class="card-info">卡券有效时间：{{itemDetail.couponEffectiveTime}}</view>
				</view>
			</view>
			<view class="sku-table" v-if="itemDetail.itemType === 1">
				<view class="tr">
					<view class="td-label">品牌</view>
					<template v-if="itemDetail.brandName">
						<view class="td-con" v-if="itemDetail.brandName.length < 10">{{itemDetail.brandName}}</view>
						<view class="td-con" v-else>{{itemDetail.brandName.substring(0,10)}}...</view>
					</template>
					<template v-else>
						<view class="td-con"></view>
					</template>
				</view>
				<view class="tr">
					<view class="td-label">分类</view>
					<view class="td-con">{{itemDetail.categoryName}}</view>
				</view>
				<view class="tr">
					<view class="td-label">规格</view>
					<template v-if="itemDetail.specDetail">
						<view class="td-con" v-if="itemDetail.specDetail.length < 30">{{itemDetail.specDetail}}</view>
						<view class="td-con" v-else>{{itemDetail.specDetail.substring(0,30)}}...</view>
					</template>
					<template v-else>
						<view class="td-con"></view>
					</template>
				</view>
			</view>

			<!-- 详情 -->
			<view id="product-detail" class="detail-desc">
				<view class="d-header">
					<text v-if="itemDetail.itemType === 1">商品详情</text>
					<text v-else>卡券详情</text>
				</view>
				<rich-text :nodes="details"></rich-text>
			</view>
		</scroll-view>
		<!-- 底部操作菜单 -->
		<uni-goods-nav class="goods-nav" :fill="true" :options="options" :buttonGroup="buttonGroup"  @click="onClick" @buttonClick="buttonClick">
			<template slot="total">
				<text class="total">合计: <text class="total-number">{{totalPrice}}</text> </text>
			</template>
		</uni-goods-nav>
		<uni-popup id="popup" style="z-index: 5000;" ref="popup" type="center">
			<view class="popup-content" style="color:#ed6d00;">不满足起订积分规则限制请继续添加商品！</view>
		</uni-popup>
		<uni-popup id="cart-popup" ref="cartPopup" type="bottom">
			<view class="popup-content">
				<view class="popup-header flex a-center j-space-between">
					<view class="popup-number">已选{{options[0].info}}件</view>
					<view class="popup-delet" @click="deleteCart">
						<uni-icons type="trash" color="#CCCCCC" size="16"></uni-icons>
						<text class="popup-delet-text">清空</text>
					</view>
				</view>
				<mescroll-uni 
					ref="mescrollRef" 
					@init="mescrollInit" 
					:top="cartMescrollTop" 
					:safearea="true" 
					:up="upOption" 
					@down="downCallback">
					<block
						v-for="(item,index) in cartList" 
						:key="index">
						<uni-swipe-action>
							<uni-swipe-action-item :disabled="item.isForceItem">
								<iProductItem 
									class="cart-product"
									:productItem="item" 
									:isCart="true" 
									:isIntegral="true"
									@addCart="(val)=>changeCartNum(item,val,index)"
								></iProductItem>
								<template v-slot:right>
									<view class="del" @click="del(item.itemNo)"><text>删除</text></view>
								</template>
							</uni-swipe-action-item>
						</uni-swipe-action>
					</block>
					<mescroll-empty v-if="cartList.length==0"></mescroll-empty>
				</mescroll-uni>
			</view>
		</uni-popup>
		<uni-popup ref="dialogPopup" type="dialog">
		    <uni-popup-dialog mode="base" title="" content="是否清空购物车商品？" :duration="2000" :before-close="true" @close="close" @confirm="confirm"></uni-popup-dialog>
		</uni-popup>
		<uni-popup ref="dialogDelPopup" type="dialog">
		    <uni-popup-dialog mode="base" title="" content="是否删除该积分商品？" :duration="2000" :before-close="true" @close="closeDel" @confirm="confirmDel"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	import integral from "@/api/mall/integral";
	import iProductItem from '@/components/i-product-item/i-product-item.vue';
	import iCartIcon from '@/components/i-cart-icon/i-cart-icon.vue';
	import MescrollEmpty from '@/components/mescroll-uni/components/mescroll-empty.vue';
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollMoreItemMixin from "@/components/mescroll-uni/mixins/mescroll-more-item.js";
	export default {
		name: 'mallDetail',
		components: {
			iProductItem,
			iCartIcon,
			MescrollMixin,
			MescrollMoreItemMixin,
			MescrollEmpty
		},
		data() {
			return {
				isShow:false,
				myScroll:44,
				tabIndex:0,
				navTabs:['商品信息','商品详情'],
				currentNum:1,
				swiperCurrent: 0,
				buttonGroup: [{
				  text: '兑换',
				  backgroundColor: '#ed6d00',
				  color: '#fff'
				}],
				// 商品编号
				itemNo:"",
				// 滚动配置
				scrollOptions:{
					intoView:""
				},
				scrollTop:0,
				// 商品详情
				itemDetail:{
					itemName:"",
					bannerPicture:[]
				},
				//内容详情
        		details: `
					<div style="width:100%"></div>
				`,
				cartMescrollTop:"54px",
				// 积分规则tabs
				tabs: [],
				downOption:{
					auto:false // 不自动加载 (mixin已处理第一个tab触发downCallback)
				},
				upOption:{
					use:false,
					auto:false, // 不自动加载
					// page: {
					// 	num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
					// 	size: 10 // 每页数据的数量
					// },
					empty:{
						tip: '~ 空空如也 ~', // 提示
						btnText: '去看看'
					},
					toTop:{
						src:""
					}
				},
				// 删除商品编码集合
				delProductNoList:[]
			};
		},
		computed:{
			...mapState({
				// 积分购物车
				cartList: state => state.integral.integralCartList,
				// 积分购物车信息
				options: state => state.integral.integralOptions,
			}),
			/**
			 * 总金额
			 **/ 
			totalPrice(){
				let totalPrice = 0
				totalPrice = this.cartList.reduce((prev, cur)=>{
					return prev + (cur.price * cur.currentNum)
				},0)
				
				return totalPrice
			},
			/**
			 * 设置实际的内容区域到顶部距离
			 */
			calcTop() {
				let statusHeight = uni.getSystemInfoSync().statusBarHeight
				return (statusHeight + 15) + 'px'
			},
		},
		onLoad(options) {
			const {itemNo} = options
			this.itemNo = itemNo
			this.getIntegralDetail()
		},
		onReady(){
			this.getInfo()
		},
		mounted(){
			// 查询所有积分规则
			this.getIntegralRuleList()
		},
		methods: {
			/**
			 * 滚动方法
			 */
			async scroll(event){
				const {scrollTop} = event.detail
				const infoDom = await this.$getComponentsDom('#product-info');
				const swiperDom = await this.$getComponentsDom('#swiper-box');
				let detailTop = infoDom.height + swiperDom.height - 24
				let infoDomTop = swiperDom.height - 44
				// 显示顶navBar
				if(scrollTop > this.myScroll){
					this.isShow = true
				}else{
					this.isShow = false
				}
				// 选中商品信息
				if(scrollTop >= infoDomTop && scrollTop < detailTop){
					this.tabIndex = 0
				}else if(scrollTop >= detailTop){
					this.tabIndex = 1
				}
			},
			/**
			 * 获取积分详情
			 */
			getIntegralDetail(){
				let postData = {
					itemNo:this.itemNo
				}
				let payload = this.$jsonFormat(postData)
				integral.getIntegralProductDetail(payload).then((res)=>{
					const {detailPicture} = res.data
					// 拼接商品详情标签
					let details = '<div style="width:100%"> \r\n'
					detailPicture && detailPicture.forEach(item =>{
						details += '<img style="width:100%;display:block;" src=' + "\"" +item + "\"" + '/> \r\n'
					})
					details += '</div>'
					this.details = details
					this.itemDetail = res.data
				}).catch((err)=>{
					console.log(err)
				})
			},
			
			/**
			 * 返回上一级页面
			 */
			toBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			getInfo() {
				return new Promise(resolve=>{
					setTimeout(()=>{ // 延时确保dom已渲染, 不使用$nextclick
						let query = uni.createSelectorQuery();
						query = query.in(this) // 支付宝小程序不支持in(this),而字节跳动小程序必须写in(this), 否则都取不到值
						query.select('.high-zindex').boundingClientRect(data => {
							console.log("得到布局位置信息" + JSON.stringify(data));
							// this.myScroll = data.height
							resolve(data)
						}).exec();
					},20)
				})
			},
			
			/**
			 * tab切换事件
			 */
			async changeTab(index) {
				this.tabIndex = index;
				const infoDom = await this.$getComponentsDom('#product-info');
				const swiperDom = await this.$getComponentsDom('#swiper-box');
				if(index){
					this.scrollTop = infoDom.height + swiperDom.height - 24
				}else{
					this.scrollTop = swiperDom.height - 44
				}
			},
			/**
			 * swipe切换事件
			 * @param {Object} e
			 */
			swiperChange(e) {
				let { current } = e.target;
				this.swiperCurrent = current;
			},
			// 当前选中值的change事件
			currentNumChange(value){
				this.currentNum = value
				this.options[0].info = value
			},
			/**
			 * 加入购物车
			 */
			cartAdd(){
				const { itemNo,stock } = this.itemDetail
				if(!stock){
					uni.showToast({
						title: '该商品已售罄',
						icon:"none"
					})
					return
				}
				let payload = {
					itemNo,
					itemQuantity:1
				}
				integral.addIntegralCart(payload).then((res)=>{
					this.downCallback()
					uni.showToast({
						title:'添加购物车成功!'
					})
				}).catch((err)=>{
					uni.showToast({
						title: err.msg || err,
						icon:"none"
					})
					console.log(err)
				})
			},
			
			/**
			 * 查询所有积分规则
			 */
			getIntegralRuleList(){
				integral.getStartPointList().then((res)=>{
					this.tabs = res.data
				}).catch((err)=>{
					console.log(err)
				})
			},
			
			
			/**
			 * 查询购物车列表
			 */
			getIntegralCartList(){
				return new Promise((resolve,reject)=>{
					this.$store.dispatch('integral/getIntegralCartList').then(()=>{
						resolve()
					}).catch(()=>{
						reject()
					})
				})
			},
			/**
			 * 底部左边的点击事件
			 */
			onClick () {
				if(!this.isCartPopup){
					this.$refs.cartPopup.open()
					this.isCartPopup = true
				}else{
					this.$refs.cartPopup.close()
					this.isCartPopup = false
				}
			},
			
			/**
			 * 底部右边的点击事件
			 */
			buttonClick () {
				// 判断购物车里是否有商品
				if(this.cartList.length === 0){
					uni.showToast({
						title:"请添加商品到购物车",
						icon:"none"
					})
					return
				}
				
				/**
				 * 先根据购物车里的 起订点编号 去重后 
				 * 找出起定点规则中 最大值  
				 * 判断当前总积分值是否大于这个最大值，否就提示，是则跳转下单页面
				 */
				let itemStartPointNoList = this.cartList.map((item)=>{return item.itemStartPointNo})
				let startNoList = Array.from(new Set(itemStartPointNoList))
				let maxStartPoint = 0
				this.tabs.map((item)=>{
					startNoList.map((no)=>{
						if(item.startPointNo === no && maxStartPoint < item.baseNumber){
							maxStartPoint = item.baseNumber
						}
					})
				})
				if(maxStartPoint > this.totalPrice){
					this.$refs.popup.open()
					setTimeout(() => {
						this.$refs.popup.close()
					}, 2000)
				}else{
					let data = {
						isCart:true,
						productList:this.cartList
					}
					uni.navigateTo({
						url:"/pages/products/order/confirmIntegral",
						success: function(res) {
							res.eventChannel.emit("sendParams", data);
						}
					})
				}
			},
			
			async downCallback(page) {
				let curPageCartData = await this.getIntegralCartList()
				//设置列表数据,追加新数据
				this.cartList = curPageCartData;
				//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
				setTimeout(() => {
					this.mescroll.endSuccess(curPageCartData.length);
				}, 1000)
			},
			
			/**
			 * 清空购物车
			 */
			deleteCart(){
				if(this.cartList.length === 0){
					uni.showToast({
						title: '购物车里已经清空了!',
						icon:"none"
					})
					return 
				}
				this.cartList.map((item)=>{
					this.delProductNoList.push(item.itemNo)
				})
				this.$refs.dialogPopup.open();
			},
			
			/**
			 * 点击确认按钮触发
			 * @param {Object} done
			 */
			confirm(done){
				this.delCartProduct().then(()=>{
					this.$refs.dialogPopup.close();
					uni.showToast({
						title: '清空成功！'
					})
				})
			},
			/**
			 * 点击取消按钮触发
			 * @param {Object} done
			 */
			close(done){
				done()
			},
			/**
			 * 点击取消按钮触发
			 */
			closeDel(done){
				done()
			},
			
			/**
			 * 删除单品
			 */
			del(itemNo){
				this.delProductNoList.push(itemNo)
				this.$refs.dialogDelPopup.open();
			},
			
			/**
			 * 点击确认按钮触发
			 * @param {Object} done
			 */
			confirmDel(){
				this.delCartProduct().then(()=>{
					this.$refs.dialogDelPopup.close();
				})
			},
			
			/**
			 * 删除购物车
			 */
			delCartProduct(){
				let postData = {
					itemNos:this.delProductNoList
				}
				return new Promise((resolve,reject)=>{
					integral.delIntegralCart(postData).then((res)=>{
						this.delProductNoList = []
						this.getIntegralCartList()
						uni.showToast({
							title: '删除成功！'
						})
						resolve()
					}).catch((err)=>{
						console.log(err)
						reject()
					})
				})
			},
			
			/**
			 * 修改购物车商品数量
			 */
			changeCartNum(row,val,index){
				let _this = this
				if(typeof(val) !== "number"){
					return
				}
				const { itemNo } = row
				let payload = {
					itemNo,
					itemQuantity:val
				}
				integral.editIntegralCart(payload).then((res)=>{
					_this.$set(_this.cartList[index],'cartItemQuantity',val)
					_this.$set(_this.cartList[index],'currentNum',val)
					// uni.showToast({
					// 	title: '删除成功！'
					// })
				}).catch((err)=>{
					console.log(err)
				})
			}
		
			
			
			
		},

	}
</script>

<style lang='scss'>
	.scroll-view{
		height: calc(100vh - 51px);
		height: calc(100vh - 51px - env(safe-area-inset-bottom));
	}
	.page {
		padding-bottom:calc(51px + env(safe-area-inset-bottom));
		background-color: $uni-bg-color-grey;
	}
	.high-zindex{
		/deep/ .v-tabs__container-item{
			width: calc(50% - 22px);
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}

	.carousel {
		height: 100vw;
		position: relative;
		background-color: #f1f1f1;
		.swiper-wrap,
		.swiper-box {
			height: 100%;
			position: relative;
		}

		.image-wrapper {
			width: 100%;
			height: 100%;
		}

		.swiper-item {
			display: flex;
			justify-content: center;
			align-content: center;
			height: 100vw;
			background-color: #fff;
			overflow: hidden;

			.img {
				width: 100%;
				height: 100%;
			}
		}
		.swipe-dot{
			position:absolute;
			bottom:20px;
			right:$uni-spacing-col-base;
			color:#fff;
			padding:2px $uni-spacing-col-base;
			border-radius: $uni-border-radius-lg;
			background-color: rgba(0,0,0,0.6);
		}
		.special-tag {
			color: #fff;
			text-align: center;
			width: 100px;
			height: 24px;
			line-height: 24px;
			position: absolute;
			top: 44px;
			right: -12px;
			font-size: $uni-font-size-sm;
			margin-left: 10px;
			font-weight: normal;
			background: linear-gradient(to right, #fd5122,#fc9121);
		
			&::after {
				content: ' ';
				border-width: 12px 0px 12px 14px;
				border-color: rgba(255, 255, 255, 0) rgba(255, 255, 255, 0) rgba(255, 255, 255, 0) rgba(255, 255, 255, 1);
				border-style: solid;
				display: block;
				position: absolute;
				left: 0;
				top: 0;
				z-index: 1;
			}
		}
	}
	
	/* 标题简介 */
	.introduce-section {
		padding:$uni-spacing-col-base;
		margin: $uni-spacing-col-base;
		border-radius:$uni-border-radius-base;
		background: url('../../../../static/image/my/integral/bg3.png') no-repeat center;
		background-size: 100% auto;

		.title {
			font-size: 16px;
			color: #1C1C1C;
			text-overflow: ellipsis;
			word-break: break-all;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			overflow: hidden;
		}
		.price-wrap{
			display:flex;
			justify-content: space-between;
			align-items: center;
		}
		.price-box {
			display: flex;
			align-items: baseline;
			padding: 14rpx 0;
			font-size: 20px;
			color: #FA4515;
			font-weight: 600;
		}
		.store{
			font-size: $uni-font-size-sm;
			color: $uni-text-color-grey;
		}
		.integral-box{
			.inte-row{
				font-size: $uni-font-size-sm;
				color: $uni-text-color-grey;
				margin-bottom:$uni-spacing-col-sm;
				color:$uni-text-color-subsidiary;
				.tag{
					display:inline-block;
					margin-right:$uni-spacing-col-base;
				}
			}
		}
		.bot-row {
			display: flex;
			align-items: center;
			justify-content: space-between;
			.bot-limit {
				color: #E10000;
				font-size: 10px;
				padding: 1px 12px;
				border-radius: 3px;
				border: 1px solid #E10000;
			}
			.action-btn{
				width: 75px;
				height: 25px;
				border: none;
				color: #fff;
				margin: 0;
				padding: 0;
				font-size: 12px;
				display: flex;
				align-items: center;
				justify-content: center;
				line-height: 0;
				border-radius: 13px;
				background: #ed6d00;
			}
		}
		.container-info{
			color: #333333;
			font-size: 10px;
			.card-info{
				margin-top: 6px;
			}
		}
	}
	.introduce-section-height{
		background-color: #FFFFFF;
	}
	.goods-nav{
		width: 100%;
		position: fixed;
		bottom: 0;
		/deep/ .uni-tab__cart-box{
			border-top: 1px solid #CCCCCC;
		}
		/deep/ .uni-tab__dot-box{
			top: 12px;
			right: -19px;
			.uni-tab__dot{
				width: 17px;
				height: 17px;
				border-radius: 50%;
			}
		}
		/deep/ .uni-tab__icon{
			width: 30px;
			height: 30px;
		}
		/deep/ .uni-icons{
			color: #ed6d00 !important;
			font-size: 30px !important;
		}
		/deep/ .uni-tab__right{
			margin-left: 80px;
		}
		/deep/ .uni-tab__cart-button-right-text{
			font-size: 17px;
		}
		.total{
			color: #1C1C1C;
			font-size: 17px;
			font-weight: bold;
			.total-number{
				color: #ed6d00;
				font-size: 15px;
				font-weight: bold;
				margin-left: 5px;
			}
		}
	}

	.sku-table{
		background-color: #fff;
		padding:$uni-spacing-col-base;
		margin: $uni-spacing-col-base $uni-spacing-col-base 0;
		border-radius:$uni-border-radius-base;
		.tr{
			border:1px solid $uni-border-color;
			border-top:none;
			display:flex;
			justify-content: flex-start;
			align-items: center;
			font-size: $uni-font-size-base;
			color: $uni-text-color-subsidiary;
			&:first-of-type{
				border-top:1px solid $uni-border-color;
			}
			.td-label{
				background-color: $uni-bg-color-grey;
				height:40px;
				width:90px;
				flex:0 0 90px;
				box-sizing: border-box;
				line-height: 40px;
				padding-left:$uni-spacing-col-lg;
			}
			.td-con{
				flex:1;
				padding-left:$uni-spacing-col-lg;
				padding-right: $uni-spacing-col-lg;
				font-size: $uni-font-size-base;
				color: $uni-text-color;
			}
		}
	}

	/*  详情 */
	.detail-desc {
		background-color: #fff;
		.d-header {
			height: 40px;
			line-height: 40px;
			padding-left: $uni-spacing-col-base;
			font-size: 14px;
			color: #1C1C1C;
			position: relative;
			background-color: $uni-bg-color-grey;

			text {
				position: relative;
				z-index: 1;
			}
		}
	}

	/* 规格选择弹窗 */
	.attr-content {
		padding: 10rpx 30rpx;

		.a-t {
			display: flex;

			image {
				width: 170rpx;
				height: 170rpx;
				flex-shrink: 0;
				margin-top: -40rpx;
				border-radius: 8rpx;
				;
			}

			.right-con {
				display: flex;
				flex-direction: column;
				padding-left: 24rpx;
				font-size: $uni-font-size-sm;
				color: $uni-text-color;
				line-height: 42rpx;

				.price {
					font-size: $uni-font-size-lg;
					color: $uni-color-primary;
					margin-bottom: 10rpx;
				}

				.selected-text {
					margin-right: 10rpx;
				}
			}
		}

		.attr-list {
			display: flex;
			flex-direction: column;
			font-size: $uni-font-size-sm;
			color: $uni-text-color;
			padding-top: 30rpx;
			padding-left: 10rpx;
		}

		.item-list {
			padding: 20rpx 0 0;
			display: flex;
			flex-wrap: wrap;

			text {
				display: flex;
				align-items: center;
				justify-content: center;
				background-color: #eee;
				margin-right: 20rpx;
				margin-bottom: 20rpx;
				border-radius: 100rpx;
				min-width: 60rpx;
				height: 60rpx;
				padding: 0 20rpx;
				font-size: $uni-font-size-base;
				color: $uni-text-color;
			}

			.selected {
				background-color: #fbebee;
				color: $uni-color-primary;
			}
		}
	}

	/*购物车弹出框*/
	.popup-content {
		height:300px;
		border-radius:$uni-border-radius-base $uni-border-radius-base 0 0;
		background-color: #fff;
		.popup-header{
			height:44px;
			border-bottom:1px solid $uni-border-color;
			position:relative;
			text-align: center;
			line-height: 44px;
			.popup-delete{
				position:absolute;
				right:0;
				top:0;
				width:36px;
				height:100%;
			}
		}
		.action-btn{
			display: flex;
			align-items: center;
			justify-content: center;
			width: 90%;
			position:absolute;
			bottom:0;
			left:5%;
			margin-bottom:calc(20px + env(safe-area-inset-bottom));
			height: 72rpx;
			border:1px solid $uni-color-primary;
			color:#fff ;
			font-size: $uni-font-size-base;
			padding: 0;
			border-radius: 72rpx;
			background-color: $uni-color-primary;
		}
	}
	
	
	.goods-nav{
		width: 100%;
		position: absolute;
		bottom: 0;
		/deep/.uni-tab__cart-sub-left{
			width: 70%;
		}
		/deep/ .uni-tab__cart-box{
			border-top: 1px solid #CCCCCC;
		}
		/deep/ .uni-tab__dot-box{
			top: 12px;
			right: -19px;
			.uni-tab__dot{
				width: 17px;
				height: 17px;
				border-radius: 50%;
			}
		}
		/deep/.uni-tab__icon{
			height: 30px;
		}
		/deep/ .uni-icons{
			color: #ed6d00 !important;
			font-size: 30px !important;
		}
		/deep/ .uni-tab__right{
			margin-left: 0px;
			width: 30%;
		}
		/deep/ .uni-tab__cart-button-right-text{
			font-size: 17px;
		}
		.total{
			color: #1C1C1C;
			font-size: 17px;
			font-weight: bold;
			padding-left: 10px;
			.total-number{
				color: #ed6d00;
				font-size: 15px;
				font-weight: bold;
				margin-left: 5px;
			}
		}
	}
	.uni-popup{
		z-index: 2999;
		position: fixed;
	}
	#popup{
		/deep/ .uni-transition{
			display: none;
		}
		/deep/ .popup-content{
			width: 50vw;
			padding: 0 20px;
			text-align: center;
			background-color: rgba(0, 0, 0, 0.8);
		}
	}
	#cart-popup{
		/deep/ .uni-transition{
			z-index: 2999;
			height: 50vh;
			bottom: 51px !important;
			bottom: calc(51px + env(safe-area-inset-bottom)) !important;
		}
		/deep/ .popup-content{
			width: 100vw;
			height: 50vh;
			display: initial;
			background-color: #fff;
			border-radius: 3px 3px 0 0;
			.popup-header{
				width: calc(100vw - 20px);
				height: 53px;
				padding: 0 10px;
				font-size: 15px;
				background-color: #fff;
				border-bottom: 1px solid #CCCCCC;
				.popup-number{
					color: #ed6d00;
				}
				.popup-delet-text{
					color: #666666;
					margin-left: 5px;
				}
			}
			.cart-list{
				padding: 10px 10px 0;
			}
		}
		/deep/ .mescroll-uni-fixed{
			background-color: #fff;
		}
	}
	
	.cart-product{
		width: calc(100% - 40rpx);
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
	
	.popup-content {
		width: 70vw;
		height: 100px;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: rgba(0, 0, 0, 0.6);
		border-radius: 10px;
	}
	.left-icon{
		position: absolute;
		left: 10px;
		top: 30px;
		z-index: 99;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		width: 32px;
		height: 32px;
		border-radius: 50%;
	}
	</style>

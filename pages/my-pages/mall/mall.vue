<template>
	<view class="page">
		<uni-nav-bar class="high-zindex" title="积分商城" left-icon="back" backgroundColor="#ed6d00" color="#fff" @clickLeft="toBack"></uni-nav-bar>
		<view class="con-container">
			<view class="filter-box">
				<uni-search-bar 
					class="high-zindex" 
					radius="100" 
					placeholder="商品名称/品牌/分类/规格" 
					clearButton="auto" 
					cancelButton="none"
					@confirm="search"
				 	@clear='clear' />
				<v-tabs 
					v-model="tabIndex" 
					:tabs="tabs" 
					:lineScale="0.2" 
					activeColor="#ed6d00" 
					lineColor="#ed6d00" 
					field="startPointName"
					height="88rpx" 
					fontSize="24rpx" 
					lineHeight="4rpx" 
					@change="changeTab"></v-tabs>
				<view class="rule">
					{{tabs.length > 0 ? tabs[tabIndex].startPointName : '积分规则'}}：
					<text v-if="tabs.length > 0">满{{tabs[tabIndex].baseNumber}}可兑换</text>
				</view>
			</view>
			<swiper
				class="swiper-box"
				:current="tabIndex" 
				duration="300" 
				@change="swiperChange">
			  <swiper-item 
					v-for="(item,index) in tabs" 
					:key="index"
					class="swiper-item ">
					<mall-item
						:ref="'mallItem-' + index" 
						:i="index" 
						:index="tabIndex" 
						:tabs="tabs"
						:startPointNo="item.startPointNo"
						:searchKey="searchKey"
						@addCart="addCart"></mall-item>
			  </swiper-item>
			</swiper>
		</view>
		<uni-goods-nav class="goods-nav" :fill="true" :options="options" :buttonGroup="buttonGroup"  @click="onClick" @buttonClick="buttonClick">
			<template slot="total">
				<text class="total">合计: <text class="total-number">{{totalPrice}} 积分</text></text>
			</template>
		</uni-goods-nav>
		<uni-popup id="popup" style="z-index: 5000;" ref="popup" type="center">
			<view class="popup-content" style="color:#ed6d00;">{{popMessage}}</view>
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
					@down="downCallback" 
					@emptyclick="emptyClick">
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
	import vTabs from "@/components/v-tabs/v-tabs.vue";
	import MallItem from "./mall-item.vue";
	import MescrollEmpty from '@/components/mescroll-uni/components/mescroll-empty.vue';
	import iProductItem from '@/components/i-product-item/i-product-item.vue';
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollMoreItemMixin from "@/components/mescroll-uni/mixins/mescroll-more-item.js";
	export default {
		name: 'mall',
		components: {
			vTabs,
			MallItem,
			iProductItem,
			MescrollMixin,
			MescrollMoreItemMixin,
			MescrollEmpty
		},
		data() {
			return {
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
				buttonGroup: [{
				  text: '兑换',
				  backgroundColor: '#ed6d00',
				  color: '#fff'
				}],
				// tabs
				tabs: [],
				// tabs下标
				tabIndex: 0,
				//积分规则
				rule:'',
				//默认条件
				defaultSelected: [],
				popMessage: '不满足起订积分规则限制请继续添加商品！',
				// 是否查看加入的购物车积分商品
				isCartPopup: false,
				cartMescrollTop:"54px",
				// 查询条件（商品名称/编码）
				searchKey:"",
				// 删除商品编码集合
				delProductNoList:[]
			}
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
		},
		mounted() {
			// 查询所有积分规则
			this.getIntegralRuleList()
		},
		methods: {
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
					this.$store.dispatch('integral/getIntegralCartList').then((list)=>{
						resolve(list)
					}).catch(()=>{
						reject()
					})
				})
			},

			/**
			 * 返回上一级页面
			 */
			toBack() {
				const obj = {
					"name": "my",
					"id": 4
				}
				uni.reLaunch({
					url:`/pages/index/index?name=${obj.name}&id=${obj.id}`
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
			async downCallback(page) {
				let curPageCartData = await this.getIntegralCartList()
				//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
				setTimeout(() => {
					this.mescroll.endSuccess(curPageCartData.length);
				}, 1000)
			},
			//点击空布局按钮的回调
			emptyClick() {
				uni.showToast({
					title: '点击了按钮,具体逻辑自行实现'
				})
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
			 * 点击取消按钮触发
			 * @param {Object} done
			 */
			close(done){
				done()
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
			 * 添加到购物车
			 * 刷新购物车查询接口
			 */
			addCart(){
				this.downCallback()
			},

			/**
			 * 查询商品编号
			 */
			search(val){
				try {
					this.searchKey = val.value
					this.$nextTick(()=>{
						this.$refs['mallItem-' + this.tabIndex][0].downCallback()
					})
				} catch (error) {
					console.log(error)
				}
			},

			/**
			 * 清空查询
			 */
			clear(){
				try {
					this.searchKey = ''
					this.$nextTick(()=>{
						this.$refs['mallItem-' + this.tabIndex][0].downCallback()
					})
				} catch (error) {
					console.log(error)
				}
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
				}).catch((err)=>{
					console.log(err)
				})
			}
		}
	}
</script>

<style lang="scss">
	.page{
		height: 100vh;
	}
	.high-zindex {
		position: relative;
		z-index: 102;
	}
	.con-container {
		height: calc(100% - var(--status-bar-height) - 45px);
		overflow: auto;
		width: 100%;
		position: relative;
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
	.rule{
		color: #666666;
		font-size: 11px;
		padding: 15px 10px;
		// position: fixed;
		background-color: #F2F2F2;
	}
	.mescroll-uni-warp /deep/ .mescroll-uni-fixed{
		background-color: #F2F2F2;
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
	// swpier
	.swiper-box{
		height: calc(100% - 88rpx - 94rpx - var(--status-bar-height) - 54px);
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
</style>

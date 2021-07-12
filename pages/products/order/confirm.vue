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
				<uni-swipe-action>
					<uni-swipe-action-item v-for="(item,index) in productList" :key="index" class="item-box"
					:style="productList.length === 1 && 'border:none'">
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
							:src="item.listPicture || item.itemImageUrl"
						></fr-image>
						<view class="right-content">
							<view class="item-name">
								<text class="text-normal name">{{item.itemName}}</text>
							</view>
							<view class="item">
								<text class="text-gray">品牌：</text>
								<text class="text-gray">{{ item.brandName || item.itemBrand}}</text>
							</view>
							<view class="item">
								<text class="text-gray">分类：</text>
								<text class="text-gray">{{ item.categoryName}}</text>
							</view>
							<view class="item">
								<text class="text-gray">规格：</text>
								<text class="text-gray">{{item.specDetail}}</text>
							</view>
							<view class="item-price flex a-center j-space-between">
								<view v-if="item.promotionDTO && item.promotionDTO.isDiscountOnly">
									<text class="text-primary">已优惠￥</text>
									<text class="text-primary price">{{item.discountAmount}}</text>
								</view>
								<view v-else>
									<text class="text-primary">￥</text>
									<text class="text-primary price">{{item.price}}</text>
								</view>
								<uni-number-box
									:ref="'numberBox-' + index"
									v-model="item.currentNum"
									:min="1"
									:max="Number(item.limitCount)"
									style="margin-bottom:2px"
									@change="(val)=>changeNum(val,index)"
									@onFocus="(val)=>handFocus(val,index)"
									@onBlur="(val)=>handBlur(val,index)"
								></uni-number-box>
							</view>
						</view>
						<template v-slot:right>
							<view class="del"><text>删除</text></view>
						</template>
					</uni-swipe-action-item>
				</uni-swipe-action>
			</view>

			<uni-list class="list-box">
				<uni-list-item :border="false">
					<template slot="body">
						<view class="flex a-center w pronts" v-if="(productList && productList.length > 0 && productList[0].promotionDTO && productList[0].promotionDTO.isDiscountOnly) || 
						rebateLimit === 0 || 
						(productList && productList.length > 0 && productList[0].itemType === 2) || 
						(productList && productList.length > 0 && productList[0].isMjsProduct === false) || 
						(productList && productList.length > 0 && productList[0].pkgRelationItemInfo && productList[0].pkgRelationItemInfo.length > 0 && productList[0].pkgRelationItemInfo[0].itemType === 2)">
							<text class="iconfont ma gray"></text>
							<view class="center-content flex-column flex">
								<text class="text-normal name gray">新玛元</text>
								<text v-if="userInfo.points.num !== 0" class="text-gray gray">
									<text v-if="rebateLimit === null">（剩余{{userInfo.points.num}}）</text>
									<text v-else>（剩余{{userInfo.points.num}}；且不可超过推荐数量{{rebateLimit}}）</text>
								</text>
							</view>
							<text class="not-text">不可用</text>
						</view>
						<view  class="flex a-center w pronts" v-else>
							<text class="iconfont ma" :class="{'gray':userInfo.points.num == 0}"></text>
							<view class="center-content flex-column flex">
								<text class="text-normal name" :class="{'gray':userInfo.points.num == 0}">新玛元</text>
								<text v-if="userInfo.points.num !== 0" class="text-gray" :class="{'gray':userInfo.points.num == 0}">
									<text v-if="rebateLimit === null">（剩余{{userInfo.points.num}}）</text>
									<text v-else>（剩余{{userInfo.points.num}}；且不可超过推荐数量{{rebateLimit}}）</text>
								</text>
							</view>
							<view class="deduction-box" v-if="userInfo.points.num !== 0">
								<text class="text-normal">抵扣</text>
								<input
									class="text-normal num"
									:value="userInfo.points.value"
									:max='rebateLimit === null ? 999999999 : rebateLimit'
									type="number"
									:auto-blur="true"
									confirm-type="done"
									@blur="pointsFormat"
									@confirm="pointsConfirm"/>
							</view>
							<text v-else class="not-text">不可用</text>
						</view>
					</template>
				</uni-list-item>
			</uni-list>

			<uni-list class="list-box" style="margin-bottom:10px;">
				<uni-list-item :border="false">
					<template slot="body">
						<view class="flex a-center w pronts" v-if="productList && productList.length > 0 && productList[0].promotionDTO && productList[0].promotionDTO.isDiscountOnly">
							<text class="iconfont youhuiquan gray"></text>
							<view class="center-content">
								<text class="text-normal name gray">优惠券</text>
							</view>
							<text class="not-text">不可用</text>
						</view>
						<view class="flex a-center w pronts" @click="open" v-else>
							<text class="iconfont youhuiquan" :class="{'gray':coupon.list.length == 0}"></text>
							<view class="center-content ">
								<text class="text-normal name" :class="{'gray':coupon.list.length == 0}">优惠券</text>
							</view>
							<view v-if="coupon.list.length > 0">
								<template v-if="coupon.active.length === 0">
									<text class="text-normal">{{coupon.list.length}} 张可用</text>
									<uni-icons  class="tips-icon" type="forward" color="#666" size="18" style="position: relative;top:2px;"></uni-icons>
								</template>
								<template v-else>
									<text class="text-normal" style="color:#ed6d00;">-￥{{discount}}</text>
									<uni-icons  class="tips-icon" type="forward" color="#666" size="18" style="position: relative;top:2px;"></uni-icons>
								</template>
							</view>
							<text v-else class="not-text">不可用</text>
						</view>
					</template>
				</uni-list-item>
			</uni-list>
		</view>
		<view class="fixed-buttom-box row" style="z-index:10;">
			<view class="w55 fixed-font" v-if="productList && productList.length > 0 && productList[0].promotionDTO && productList[0].promotionDTO.isDiscountOnly">
			</view>
			<view class="w55 fixed-font" v-else>
				<text class="text-normal">实付款</text>
				<text class="text-primary">¥{{ deductionPrice }}</text>
			</view>
			<view
				@click="orderAdd"
				class="flex a-center j-center fixed-buttom-btn"
				:class="{'gray-bg':isLoading}"
				:style="`border-radius:${systemInfo.windowWidth/2}px;width:45%;`">
				<!-- <text class="small">付款剩余时间</text>
				<uni-countdown @timeup='timUp' :minute="15" :show-day="false" :showHour="false" splitorColor="#fff" color="#fff" backgroundColor="rgba(0,0,0,0)" borderColor="rgba(0,0,0,0)"></uni-countdown> -->
				<text class="normal">立即下单</text>
			</view>
		</view>
		<!-- 优惠券列表 -->
		<uni-popup ref="popup" type="bottom" class="pop-bottom">
			<view class="popup-box">
				<text class="popup-name flex a-center j-center">选择优惠券</text>
				 <scroll-view scroll-y="true" style="max-height:calc(80vh - 300rpx)">
					<view class="title" style="margin-top:0"><text class="text-normal">可用优惠券  {{coupon.list.length}}</text></view>
					<uni-list class="list-box" :border="false">
						<uni-list-item  v-for="(item,index) in coupon.list" :key="index" >
							<template slot="body">
								<coupon :coupon="item" @checkedCoupon="(val)=>selectCoupon(val,item)"/>
							</template>
						</uni-list-item>
					</uni-list>

					<view class="title" v-if="coupon.unList.length>0"><text class="text-normal">不可用优惠券  {{coupon.unList.length}}</text></view>
					<uni-list class="list-box" :border="false">
						<uni-list-item  v-for="(item,index) in coupon.unList" :key="index" >
							<template slot="body">
								<coupon :coupon="item" disabled />
							</template>
						</uni-list-item>
					</uni-list>
				</scroll-view>
				<text class="btn-primary" @click="closeCouponPopup">确定</text>
			</view>
		</uni-popup>
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
		<uni-popup ref="stock" type="dialog" :maskClick="false">
			<uni-popup-dialog
				mode="base"
				class="reserve-dialog"
				:duration="2000"
				:before-close="true"
				@close="closeReserve"
				@confirm="confirmReserve">
				<template slot="content">
					<view class="reserve-box">
						<view class="reserve-title">
							<view class="title-content">商品库存不足</view>
							<view class="title-content">超过部分设置为预定商品</view>
							<!-- 关闭按钮 -->
							<view class="dialog-close-button" @click="closeReserve()">
								<icon class="iconfont cancel" style='color:#000000;font-size: 34rpx;' type=""></icon>
							</view>
						</view>
						<view class="reserve-product-box">
							<view class="reserve-product-title">预定商品</view>
							<view class="reserve-product-list">
								<view
									v-for="(item,index) in reserveProduct.presellItemList"
									:key="'presellItemList-' + index"
									class="reserve-product-item"
									:style="{'margin-top':index === 0 ? '0px' : '10px;'}">
									<view class="product-name">{{item.itemName}}</view>
									<view class="product-number">{{item.itemQuantity}}件</view>
								</view>
							</view>
						</view>
					</view>
				</template>
			</uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
import { mapState } from 'vuex'
import integral from "@/api/mall/integral";
import mall from '@/api/mall/mall.js'
import wallet from '@/api/wallet/wallet.js'
import coupon from '@/components/coupon'
import { NO_ROW_LIMIT } from '@/static/base/system-constant'
import yuToast from '@/components/yu-toast/yu-toast'
import permision from "@/common/utils/permission.js"
import reserve from '@/api/product/reserve.js'
import market from '@/api/market/market.js'
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
					// 是否购物车下单
				isCart: true,
					// 是否活动下单
					// 分类类型(0:秒杀活动,1:限时抢购活动,2:商品组合活动)
				isActive: undefined,
				productList:[],
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
						value:0
					}
				},
				coupon:{
					active:[],
					list:[],
					unList:[]
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
					bgColor:"rgba(0,0,0,.8)",
					fontColor:"#ed6d00",
				},
				// 请求等待
				isLoading:false,
				// 是否输入数量
				isInputNum:false,
				// 预定商品集合
				reserveProduct:{
					presellItemList:[],
					normalItemList:[]
				},
				// 是否预定下单
				isPresellItem:false,
				// 玛吉斯通用券叠加规则
				couponRule: {
					// 叠加限制(0:不限制,1:限制)
					superposeFlag: 0,
					// 优惠比例, 带单位, 比如用户输入10%, 传入10
					discountRate: 0
				}
			}
		},
		computed:{
			...mapState({
				// 积分
				integralInfo: state => state.login.integralInfo,
				// 使用返利上线
				rebateLimit: state => state.login.rebateLimit,
			}),
			// 总金额
			totalPrice(){
				let totalPrice = 0
				totalPrice = this.productList.reduce((prev, cur)=>{
					let add = Number(cur.price).mul(Number(cur.currentNum))
					return Number(prev).add(Number(add))
				},0)
				return Number().formatMoney(totalPrice)
			},
			// 抵扣后金额
			// 总金额 - 优惠券 - 抵扣
			deductionPrice(){
				let deductionPrice = JSON.parse(JSON.stringify(this.totalPrice))
				// 计算优惠券
				// 提取出折扣券
				let discountList = this.coupon.active.filter((item)=>{return item.discountType === 1})
				// 提取出满减券
				let fullReductionList = this.coupon.active.filter((item)=>{return item.discountType === 0})
				// 计算折扣券
				discountList.map((item)=>{
					deductionPrice = Number(deductionPrice).mul(Number(item.discountAmount).div(10))
				})
				// 计算满减券
				fullReductionList.map((item)=>{
					console.log(deductionPrice,'deductionPrice',item.discountAmount)
					deductionPrice = Number(deductionPrice).sub(Number(item.discountAmount).toFixed(2))
				})
				// 计算新玛元
				deductionPrice = Number(deductionPrice).sub(Number(this.userInfo.points.value).toFixed(2))
				if(deductionPrice <= 0){
					this.toastData.msg1 = '优惠后实付款金额小于零'
					this.toastData.msg2 = '请调整新玛元或者优惠券!'
					this.$refs.remind && this.$refs.remind.show()
					deductionPrice = 0
				}
				return Number(deductionPrice).toFixed(2)
			},

			/**
			 * 优惠券 优惠金额
			 */
			discount(){
				let deductionPrice = JSON.parse(JSON.stringify(this.totalPrice))
				// 计算优惠券
				// 提取出折扣券
				let discountList = this.coupon.active.filter((item)=>{return item.discountType === 1})
				// 提取出满减券
				let fullReductionList = this.coupon.active.filter((item)=>{return item.discountType === 0})
				// 计算折扣券
				discountList.map((item)=>{
					deductionPrice = Number(deductionPrice).mul(Number(item.discountAmount).div(10))
				})
				// 计算满减券
				fullReductionList.map((item)=>{
					console.log(deductionPrice,'deductionPrice',item.discountAmount)
					deductionPrice = Number(deductionPrice).sub(Number(item.discountAmount).toFixed(2))
				})
			  	let totalPrice = Number(this.totalPrice).sub(Number(deductionPrice))
				return Number(totalPrice).toFixed(2)
			},
		},
		watch:{
			/**
			 * 监听实际总金额变动
			 * 每次变化，清空新玛元，重新请求优惠券
			 *  */
			totalPrice:{
				handler(newVal) {
					this.userInfo.points.value = 0
					this.getCouponList()
				}
			}
		},
		onLoad(option) {
			// 更新返利上限
			this.$store.dispatch('login/getRebateLimit')
			// 监听从上个页面传过来值
			const eventChannel = this.getOpenerEventChannel()
			eventChannel.on('sendParams', (data) => {
				const { isCart ,isActive,dealerRelation,activeProductList = [],productList = [],isPresellItem} = data
				// 是否使用购物车下单
				this.isCart = isCart || false
				// 是否是从活动下单
				this.isActive = isActive
				// 是否是预定下单
				if(isPresellItem){
					this.isPresellItem = true
				}
				if(isActive !== undefined){
					// 经销商关系
					this.dealerRelation = JSON.parse(dealerRelation)
					this.productList = activeProductList.map(item =>{
						// 商品编号,秒杀批次号,活动编号,子活动编号
						const { itemName,itemNo,batchNo,promotionNo,subPromotionNo,stock,currentNum,
						amount,itemSpec,itemCategoryBackend,itemBrand,itemDetailUrls,personalLimitCount,
						productNo,isMjsProduct,saleStock,promotionDTO,discountAmount} = item
						/**
						 * 处理购买限额
						 * 假如personalLimitCount 为0则无限制
						 * 不为0则是该值
						 * 判断这个值与剩余库存，谁更小，则取谁，避免出现库存不足情况
						 * */
						let fullStock = 0
						if(personalLimitCount === 0){
							fullStock = 99999
						}else if(personalLimitCount > (stock - saleStock)){
								fullStock = stock - saleStock
						}else{
								fullStock = personalLimitCount
						}
					  return {
						  	itemName,
							isMjsProduct,
							discountAmount,
							productNo,
							itemNo,
							batchNo,
							promotionNo,
							subPromotionNo,
							currentNum:currentNum ? currentNum : 1,
							price:amount,
							specDetail:itemSpec,
							categoryName:itemCategoryBackend,
							brandName:itemBrand,
							listPicture:item.itemImageUrl || itemDetailUrls,
							limitCount:fullStock,
							promotionDTO:promotionDTO
						}
					})
				}else{
					// 详情和购物车返回的数据值不一样做统一处理
					this.productList = productList.map(item =>{
						/**
						 * 处理购买限额
						 * 假如item.limitCount 为0则无限制
						 * 此处不做限制，超出库存，则弹出预定商品窗口
						 * */
						let fullStock = 99999
						if(item.limitCount){
							fullStock = item.limitCount
						}
						item.currentNum = item.currentNum || item.cartItemQuantity || 1
						item.price = item.price || item.itemPrice || 0
						item.specDetail = item.specDetail || item.itemSpecDetail
						item.categoryName = item.categoryName || item.itemCategory
						item.brandName = item.brandName || item.itemBrand
						item.listPicture = item.listPicture || item.itemImageUrl
						item.limitCount = fullStock
						return item
					})
				}
			})
			// 查询返利余额
			this.getRebateDetail()
			// 查询玛吉斯通用券叠加规则
			this.getCouponLimit()
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
				uni.showLoading({mask:true})
				if(this.isLoading){
					uni.hideLoading();
					return
				}
				// 是否活动下单
				if(this.isActive === undefined){
					// 非活动下单
					this.orderNoActiveAdd()
				}else{
					// 活动下单
					this.orderActiveAdd()
				}
			},
			
			/**
			 * 非活动下单
			 */
		  async orderNoActiveAdd(){
				let _this = this
			  try {
				  	const { productList,isCart } = this
					const { userAddressNo } = this.userInfo.addressInfo
					let postData = {
						isCart:isCart
					}
					if(userAddressNo){
						// 下单人地址编号
						postData['userAddressNo'] = userAddressNo
					}else{
						uni.hideLoading();
						this.toastData.msg1 = '请选择地址'
						this.toastData.msg2 = ''
						this.$refs.remind.show()
						return
					}
					let LatLog = await this.getLocation()
					postData['longitude'] = LatLog.longitude
					postData['latitude'] = LatLog.latitude
					// 消耗的返利
					postData['consumeRebateAmount'] = this.userInfo.points.value
					postData['isPresellItem'] = this.isPresellItem
					// 判断是否存在选中的优惠券
					if(this.coupon.active.length > 0){
						postData['isCoupon'] = true
						postData['couponNoList'] = this.coupon.active.map((item)=>{return item.couponNo})
					}else{
						postData['isCoupon'] = false
					}
					// 如果不使用购物车表示是商品详情的立即购买
					if(!isCart){
						postData['itemNo'] = productList[0].subItemNo
						postData['itemQuantity'] = productList[0].currentNum
					}else{
						postData['cartList'] = productList.map(item => {
							return item.cartId
						})
					}

					await mall.orderAdd(postData).then(res =>{
						uni.hideLoading();
						// return
						this.orderStatus = 0
						// 赋值
						this.orderInfo = {
							...res.data,
							isActivity:false
						}
						// 调用跳转支付接口页面
						this.pay()
					}).catch((err)=>{
						uni.hideLoading();
						/**
						 * 此处有业务逻辑
						 * 当下单数量超过库存时，接口返回超出数量，转换为预定订单
						 **/
						 const {code,msg,data} = err
						 if(code === 6799){
						 	// 将返回的数据放入预定商品集合
						 	this.reserveProduct = data
							const { normalItemList,presellItemList } = data
							_this.productList.map((item,index)=>{
								normalItemList.map((normal)=>{
									if(item.subItemNo === normal.itemNo){
										_this.$refs['numberBox-' + index][0].setChangeFromInner()
										_this.$set(_this.productList[index],'currentNum',JSON.parse(normal.itemQuantity))
									}
								})
							})

						 	this.openReserve()
						 	return
						 }
						this.message = msg
						// 验证不通过弹窗提示
						this.$refs.dialog.open()
					})
			  } catch (error) {
				  uni.hideLoading();
			  }

			},

			/**
			 * 活动下单
			 * 分类类型(0:秒杀活动,1:限时抢购活动,2:商品组合活动)
			 */
			async orderActiveAdd(){
				try {
					let postData = {}
					let list = []
					const { subPromotionNo,promotionNo} = this.dealerRelation || {}
					const {currentNum,itemNo,batchNo} = this.productList[0]
					const { userAddressNo } = this.userInfo.addressInfo
					// 子活动编号
					postData['subPromotionNo'] = subPromotionNo
					// 活动编号
					postData['promotionNo'] = promotionNo
					// 消耗的返利
					postData['consumeRebateAmount'] = this.userInfo.points.value
					if(userAddressNo){
						// 下单人地址编号
						postData['userAddressNo'] = userAddressNo
					}else{
						uni.hideLoading();
						this.toastData.msg1 = '请选择地址'
						this.toastData.msg2 = ''
						this.$refs.remind.show()
						return
					}

					let LatLog = await this.getLocation()
					postData['longitude'] = LatLog.longitude
					postData['latitude'] = LatLog.latitude
					// 判断是否存在选中的优惠券
					if(this.coupon.active.length > 0){
						postData['couponNoList'] = this.coupon.active.map((item)=>{return item.couponNo})
					}
					switch(this.isActive){
						// 秒杀活动
						case 0:
							list.push({
								amount:currentNum,
								itemNo,
								batchNo
							})
							postData['seckillOrderCreateReqs'] = list
							break
						// 限时抢购活动
						case 1:
							list.push({
								amount:currentNum,
								itemNo
							})
							postData['flashsaleOrderCreateReqs'] = list
							break
						// 商品组合活动
						case 2:
							list = this.productList.map((item)=>{
								return {
									amount:item.currentNum,
									itemNo:item.itemNo
								}
							})
							postData['productmixOrderCreateReqs'] = list
							break
						default:
							break
					}
					await mall.orderActiveAdd(postData).then(res =>{
						uni.hideLoading()
						// 赋值
						this.orderInfo = {
							...res.data,
							isActivity:true
						}
						// 调用跳转支付接口页面
						this.pay()
					}).catch((err)=>{
						uni.hideLoading()
						this.message = err.msg
						// 验证不通过弹窗提示
						this.$refs.dialog.open()
					})
				} catch (error) {
					uni.hideLoading();
				}

			},

			async getLocation() {
				let _this = this
				return new Promise(async(resolve,reject)=>{
					// #ifdef APP-PLUS
					let status = await this.checkPermission();
					if (status !== 1) {
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
			 * 获取返利余额
			 */
			getRebateDetail(){
				wallet.rebateDetail().then((res)=>{
					const { currentlyAvailableAmount } = res.data
					this.userInfo.points.num = currentlyAvailableAmount
				}).catch((err)=>{
					console.log('获取返利余额失败:' + err || err.msg)
				})
			},
			
			/**
			 * 查询玛吉斯通用券叠加规则
			 */
			getCouponLimit(){
				market.getCouponLimit().then((res)=>{
					const { discountRate,superposeFlag } = res.data
					this.couponRule = {
						discountRate:discountRate || 0,
						superposeFlag
					}
				}).catch((err)=>{
					console.log('获取返利余额失败:' + err || err.msg)
				})
			},

			/**
			 * 输入返利金额-失去焦点
			 */
			pointsFormat(event){
				let val = 0
				const {value} = event.detail
				let pointsVal = Number(value).toFixed(2)
				// 订单金额 - 优惠券金额
				let totalPrice = Number(this.totalPrice).sub(Number(this.discount))
				if(!pointsVal || pointsVal < 0){
					val = 0
				// 输入值不可大于限制
				}else if(this.rebateLimit !== null && pointsVal > this.rebateLimit){
					val = Number(this.rebateLimit)
				}else{
					val = Number(pointsVal)
				}
				// 输入值不可大于（订单金额 - 优惠券金额)
				if(totalPrice < val){
					val = Number(totalPrice)
				}
				this.$set(this.userInfo.points,'value',pointsVal)
				setTimeout(()=>{
					this.$set(this.userInfo.points,'value',val)
				},0)
			},

			/**
			 * 选择优惠券
			 * @param checked 是否选中
			 * @param coupon 优惠券信息
			 */
			selectCoupon(checked,coupon){
				// 取消选中
				if(!checked){
					coupon.checked = checked
					return
				}
				// 原订单金额
				let totalPrice = this.totalPrice;
				// 计算后的订单金额
				let calcPrice = JSON.parse(JSON.stringify(this.totalPrice))
				// 已选优惠券集合(必须是消费券，兑换券忽略)
				let selectedList = this.coupon.list.filter((item)=>{return item.checked && item.couponClass === 0})
				
				/**
				 * 满减券
				 * 首先判断 是否原有优惠券，当前选中优惠券是否能叠加
				 * 然后计算已选中优惠券的值 与 （原订单金额 - 新玛元） 的差
				 * 再减去当前选中优惠券金额
				 * 大于则选中，小于则提示-优惠后实付款金额小于零
				 *
				 * 折扣券
				 * 带入计算后 优惠订单金额
				 * 大于 0 则选中 小于 0 则提示-优惠后实付款金额小于零
				 */
				if(selectedList.length > 0 && selectedList[0].compositionLimit === 1){
					// 此处是已选的优惠券不可叠加，直接返回
					this.toastData.msg1 = '已选了不可叠加的优惠券！'
					this.toastData.msg2 = '请重新选择'
					this.$refs.remind.show()
					return
				}
				if(selectedList.length > 0 && coupon.compositionLimit === 1){
					// 此处是已选有优惠期，及当前选中优惠券不可叠加，直接提示
					this.toastData.msg1 = '该优惠券不可叠加！'
					this.toastData.msg2 = '请重新选择'
					this.$refs.remind.show()
					return
				}
				
				const { superposeFlag,discountRate } = this.couponRule
				
				if(superposeFlag === 1 && coupon.limitType === 1){
					let mjsPrice = 0
					let limitPrice = totalPrice * discountRate / 100
					let mjsList = selectedList.filter(item=>{return item.limitType === 1})
					// 计算玛吉斯金额，是否超出限制
					mjsList.map((item)=>{
						mjsPrice = Number(mjsPrice).add(Number(item.discountAmount))
					})
					if(Number(mjsPrice).add(Number(coupon.discountAmount)) > limitPrice){
						this.toastData.msg1 = '已超出订单优惠限制！'
						this.toastData.msg2 = '请调整优惠券!'
						this.$refs.remind.show()
						return
					}
				}
				
				
				// 提取出折扣券
				let discountList = selectedList.filter((item)=>{return item.discountType === 1})
				// 提取出满减券
				let fullReductionList = selectedList.filter((item)=>{return item.discountType === 0})
				// 计算折扣券
				discountList.map((item)=>{
					calcPrice = Number(calcPrice).mul(Number(item.discountAmount).div(10))
				})
				// 判断当前选中优惠券 是满减还是 折扣
				if(coupon.discountType === 1){
					calcPrice = Number(calcPrice).mul(Number(coupon.discountAmount).div(10))
				}else{
					calcPrice = Number(calcPrice).sub(Number(coupon.discountAmount))
				}
				// 计算满减券
				fullReductionList.map((item)=>{
					calcPrice = Number(calcPrice).sub(Number(item.discountAmount))
				})
				// 计算新玛元
				calcPrice = Number(calcPrice).sub(Number(this.userInfo.points.value).toFixed(2))

				if(calcPrice < 0){
					this.toastData.msg1 = '优惠后实付款金额小于零'
					this.toastData.msg2 = '请调整新玛元或者优惠券!'
					this.$refs.remind.show()
				}else{
					coupon.checked = checked
				}
			},

			/**
			 * 输入返利金额点击完成
			 */
			pointsConfirm(){
				uni.hideKeyboard()
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
			 * 去支付
			 * */
			 pay(){
				if(this.validate()){
					// 支付金额为0时 无需跳转支付
					if(this.orderInfo.payAmount == 0){
						let orderInfo = {
							...this.orderInfo,
							status:true
						}
						uni.navigateTo({
							url:'/pages/products/order/result?orderInfo=' + JSON.stringify(orderInfo)
						})
						return
					}else{
						uni.navigateTo({
							url:'/pages/products/order/pay?orderInfo=' + JSON.stringify(this.orderInfo)
						})
						return
					}
				}
				// 验证不通过弹窗提示
				this.$refs.dialog.open()
			 },

			/**
			 * 获取优惠券集合
			 * 优惠券请求期间，不可下单
			 */
			getCouponList(){
				this.isLoading = true
				uni.showLoading({
					title: '加载中'
				});
				let payload = {
					items:this.productList.map((item)=>{
						return {
							itemBrand:item.brandName,
							itemCategoryBackend:item.categoryName,
							itemCategoryNo:item.categoryNo,
							itemNo:item.itemNo || item.subItemNo,
							productNo:item.productNo,
							isMjsProduct:item.isMjsProduct
						}
					}),
					orderAmount:this.totalPrice,
					orderType:this.isActive ? 1 : 0
				}
				mall.getCouponApplyAllList(payload).then((res)=>{
					uni.hideLoading();
					let { availableList,unAvailableList} = res.data
					if(!availableList){
						availableList = []
					}
					if(!unAvailableList){
						unAvailableList = []
					}
					this.coupon.active = []
					this.coupon.list = availableList.map((item)=>{
						return {
							...item,
							checked:false
						}
					}) || []
					this.coupon.unList = unAvailableList
					this.isLoading = false
				}).catch((err)=>{
					this.isLoading = false
					uni.showToast({
						title:err.msg || err,
						icon:'none'
					})
					console.log('获取优惠券列表失败:' + err || err.msg)
				})
			},
			/**
			 * 选中优惠券
			 * */
			checkedCoupon(id,index){
				let coupon = this.coupon.list[index]
				coupon.checked = !coupon.checked
				this.$forceUpdate()
			},
			/**
			 * 查看优惠券
			 * */
			open(){
				if(this.coupon.list.length > 0){
					this.$refs.popup.open()
				}
			},
			/**
			 * 关闭优惠券弹窗
			 */
			closeCouponPopup(){
				this.coupon.active = this.coupon.list.filter((item)=>{return item.checked})
				this.$refs.popup.close()
			},
			/**
			 * 时间到了
			 * */
			timUp() {
				uni.navigateBack({
					delta: 1
				})
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
			/**
			 * 增加/减少产品数量
			 */
			changeNum(val,index){
				this.$forceUpdate();
				// 只有购物车下单时 ，需要同步购物车数量
				// 并且不是输入
				if(this.isCart && !this.isInputNum){
					this.changeCartNum(JSON.parse(val),index)
				}
				let data = {
					...this.productList[index],
					currentNum:JSON.parse(val)
				}
				this.$set(this.productList,index,data)
			},

			/**
			 * 获取焦点
			 */
			handFocus(e){
				this.isInputNum = true
			},

			/**
			 * 失去焦点事件
			 */
			handBlur(val,index){
				this.changeCartNum(JSON.parse(val),index)
				this.isInputNum = false
			},

			/**
			 * 修改购物车商品数量
			 */
			changeCartNum(val,index){
				if(typeof(val) !== "number"){
					return
				}
				const { itemNo,subItemNo } = this.productList[index]
				let payload = {
					itemNo:subItemNo,
					itemQuantity:val
				}
				integral.editIntegralCart(payload).then((res)=>{
					// uni.showToast({
					// 	title: '删除成功！'
					// })
				}).catch((err)=>{
					console.log(err)
				})
			},
			/**
			 * 显示预定商品弹窗
			 * */
			openReserve(){
			  // 通过组件定义的ref调用uni-方法
			  this.$refs.stock.open()
			},
			/**
			 * 关闭预定按触发
			 * */
			closeReserve(){
				// 调用预定商品接口
				this.apiOrderPresellAdd(false)
				this.$refs.stock.close()
			},

			/**
			 * 确认预约商品按钮
			 */
			confirmReserve(){
				// 调用预定商品接口
				this.apiOrderPresellAdd(true)
				this.$refs.stock.close()
			},

			/**
			 * 调用预定商品接口
			 */
			apiOrderPresellAdd(flag){
				let _this = this
				const { presellItemList,normalItemList } = this.reserveProduct
				let postData = {
					flag,
					normalItemList:normalItemList.map((item)=>{
						const { cartId,itemNo,itemQuantity} = item
						let detail = {
							itemNo:itemNo,
							itemQuantity:itemQuantity
						}
						if(cartId){
							detail['cartId'] = cartId
						}
						return detail
					}),
					orderPresellReqList:presellItemList.map((item)=>{
						const { cartId,itemNo,itemQuantity} = item
						let detail = {
							itemNo:itemNo,
							itemQuantity:itemQuantity
						}
						if(cartId){
							detail['cartId'] = cartId
						}
						return detail
					}),
					tenantNo:this.integralInfo.tenantNo
				}
				reserve.orderPresellAdd(postData).then((res)=>{
					if(flag){
						uni.showToast({
							title:'预定商品成功',
							icon:'none'
						})
					}
				}).catch((err)=>{
					uni.showToast({
						title:err.msg || err,
						icon:'none'
					})
				})
			}

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
			.w55{
				width:55%;
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
		.youhuiquan.gray,.ma.gray,.text-gray.gray{
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
			width:calc(100vw - 40rpx);
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
	/deep/.uni-numbox__value{
		width: 100rpx;
	}
	.reserve-dialog{
		width: 90vw;
		/deep/.uni-dialog-title{
			display: none;
		}
		.reserve-box{
			width: 100%;
			.reserve-title{
				padding: 40rpx 0;
				position: relative;
				border-bottom: 2rpx solid #CCCCCC;
				.title-content{
					font-size: 28rpx;
					color: #1C1C1C;
					line-height: 34rpx;
					text-align: center;
				}
				.dialog-close-button{
					position: absolute;
					right: 30rpx;
					top: 10rpx;
				}
			}

			.reserve-product-box{
				padding: 20rpx 20rpx 40rpx;
				margin-bottom: 40rpx;
				border-bottom: 2rpx solid #CCCCCC;
				.reserve-product-title{
					font-size: 26rpx;
					font-family: PingFang SC;
					color: #000000;
					line-height: 34rpx;
				}
				.reserve-product-list{
					margin-top: 20rpx;
					padding: 20rpx;
					border:2rpx solid #CCCCCC;
					border-radius: 8rpx;
					max-height: 50vh;
					overflow: auto;
					.reserve-product-item{
						margin-top: 20rpx;
						.product-name{
							font-size: 24rpx;
							color: #000000;
							line-height: 28rpx;
							word-break: break-all;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2; /* 这里是超出几行省略 */
							overflow: hidden;
						}
						.product-number{
							font-size: 24rpx;
							font-family: PingFang SC;
							font-weight: bold;
							color: #ed6d00;
							line-height: 28rpx;
							margin-top: 20rpx;
						}
					}
				}
			}
		}
	}
</style>

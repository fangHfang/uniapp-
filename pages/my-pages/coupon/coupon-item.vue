<template>
	<!-- 
	swiper中的transfrom会使fixed失效,此时用height="100%"固定高度; 
	swiper中无法触发mescroll-mixins.js的onPageScroll和onReachBottom方法,只能用mescroll-uni,不能用mescroll-body
	-->
	<!-- ref动态生成: 字节跳动小程序编辑器不支持一个页面存在相同的ref (如不考虑字节跳动小程序可固定值为 ref="mescrollRef") -->
	<mescroll-uni
		:ref="'mescrollRef'+i"
		@init="mescrollInit"
		safearea
		:bottom="0"
		:up="upOption" 
		:down="downOption"
		@down="downCallback" 
		@up="upCallback"
		@emptyclick="emptyClick">
	 	<view class="community-list">
	 		<view 
	 			:id="'community-item-' + i + '-' + item.id" 
	 			class="community-li"
	 			v-for="(item,resultIndex) in pageData.result" 
	 			:key="'community-item-' + i + '-' + resultIndex"
				@click="$emit('toDetail',item)">
	 			<view class="coupon-item flex a-center j-space-between" :class="[i === 2 || i === 3 ? 'bgColor' : '']">
	 				<view class="coupon-left" :class="[i === 2 || i === 3 ? 'grey-coupon-left' : '']">
						<!-- couponClass 优惠券类型(0:消费券,1:兑换券) -->
	 					<view v-if="item.couponClass === 0">
							 <!-- discountType 优惠类型(0:满减,1:折扣) -->
	 						<text class="coupon-item-price" v-if="item.discountType === 0">￥<text class="coupon-price">{{item.discountAmount}}</text></text>
							<text class="coupon-item-price" v-else><text class="coupon-price">{{item.discountAmount}}</text>折</text>
	 						<text>{{item.couponName}}</text>
	 					</view>
						<view v-else>
	 						<text>{{item.couponName}}</text>
	 					</view>
						 <!-- couponClass 优惠券类型(0:消费券,1:兑换券) -->
						<template v-if="item.couponClass === 0">
							<!-- orderLimitType 订单金额限制类型(0:不限制,1:限制)-->
							<view class="full-price" v-if="item.orderLimitType === 1">满{{item.orderLimitAmount}}可用</view>
							<view class="full-price" v-else>无门槛</view>
						</template>
						<template v-else>
							<view class="full-price" style="height: 20px;line-height: 20px;">可兑换{{item.itemName}}</view>
						</template>
						
						<!-- receiveExpireType 领取有效期类型(0:截止时间,1:长期有效)-->
	 					<view class="">有效时间<text class="coupon-date">{{item.startTime.substring(0,10)}}-{{item.endTime.substring(0,10)}}</text></view>
	 				</view>
	 				<view class="coupon-right flex" :class="[i === 2 || i === 3 ? 'a-center' : '']">
	 					<view class="flex a-center j-space-between flex-column">
	 						<view v-if="i === 0" class="activation">待激活</view>
	 						<view v-if="i === 1 && item.compositionLimit === 0" class="superposition">可叠加</view>
	 						<view v-if="i === 2" class="invalid">已使用</view>
	 						<view v-if="i === 3" class="invalid">已失效</view>
							<view v-if="(i === 0 || i === 1) && item.couponClass === 1" class="exchangeGoods flex a-center j-center" @click="exchange(resultIndex)">兑换商品</view>
	 					</view>
						<view>
							<view class="coupon-type flex a-center" :class="[i === 2 || i === 3 ? 'grey-coupon-type' : '']">
								<!-- 优惠券类型(0:消费券,1:兑换券) -->
								<template v-if="item.couponClass === 0">
									<image v-if="i === 1 || i === 0" class="coupon-mark" src="../../../static/image/coupon/mark.png"></image>
									<image v-else class="coupon-mark" src="../../../static/image/coupon/mark-gray.png"></image>
								</template>
								<template v-else>
									<image v-if="i === 1 || i === 0" class="coupon-mark" src="../../../static/image/coupon/exchange.png"></image>
									<image v-else class="coupon-mark" src="../../../static/image/coupon/exchange-gray.png"></image>
								</template>
	 						</view>
							<view v-if="i === 0 || i === 1" class="coupon-open flex a-center j-end" @click="open(resultIndex)">
								<text>{{item.isOpen ? '收起' : '展开'}}</text>
								<icon class="iconfont" :class="[item.isOpen ? 'up' : 'down']" type=""></icon>
							</view>
						</view> 
	 				</view>
					<view class="coupon-gap coupon-gap-upper"></view>
					<view class="coupon-gap coupon-gap-down"></view>
	 			</view>
				<view v-if="item.isOpen" class="coupon-info">
					<view class="">卡券信息</view>
					<!-- 优惠券类型(0:消费券,1:兑换券) -->
					<template v-if="item.couponClass === 0">
						<view class="">1.{{couponType(item)}}</view>
						<view class="">2.{{item.compositionLimit === 0 ? '可叠加优惠券':'不可叠加优惠券'}}</view>
						<view class="" v-if="item.remark">3.优惠券备注:{{item.remark}}</view>
					</template>
					<template v-if="item.couponClass === 1">
						<view class="" v-if="item.remark">1.兑换券备注:{{item.remark}}</view>
					</template>
				</view>
	 		</view>
			<mescroll-empty v-if="pageData.result.length==0"></mescroll-empty>
	 	</view>
	 </mescroll-uni>
</template>

<script>
	import iProductItem from '@/components/i-product-item/i-product-item.vue';
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollMoreItemMixin from "@/components/mescroll-uni/mixins/mescroll-more-item.js";
	import mall from '@/api/mall/mall.js'
	import MescrollEmpty from '@/components/mescroll-uni/components/mescroll-empty.vue';
	export default {
		mixins: [MescrollMixin,MescrollMoreItemMixin], // 注意此处还需使用MescrollMoreItemMixin (必须写在MescrollMixin后面)
		components: {
			iProductItem,
			MescrollEmpty
		},
		data() {
			return {
				downOption:{
				},
				upOption:{
					auto:false, // 不自动加载
					page: {
						size: 10 // 每页数据的数量
					},
					noMoreSize: 4,
					empty:{
						use:false,
						tip: '~ 空空如也 ~', // 提示
						// btnText: '去看看'
					},
					toTop:{
						src:""
					}
				},
				goods: [], //列表数据
				// 列表数据 0-待激活，1-待使用,2-已使用，3-已失效
				pageData:{
					result:[]
				},
				// 搜索条件
				searchData:{
					// 当前页
					pageNum:1,
					// 分页大小
					pageSize:10,
				},
				exchangeCommodity:{
					"image": require('../../../static/image/mall/tyre.png'),
					"name": "玛吉斯汽车轮胎MA656 205 5R16 91V逸动XT逸动逸动逸动逸动",
					"price": "300.00",
					"brand": "玛吉斯",
					"sku": '225/60 r16',
					"remains": 300,
					"showRemains": true,
					"model": "飞驰者",
					"currentNum": 1,
					"tags": [],
					"isChecked": false,
					"showCheckBox": false,
					"seckill": false,
					"snapUp": false,
					"commodityMix": false,
					"classification":'分类1'
				}
			}
		},
		props:{
			i: Number, // 每个tab页的专属下标 (除了支付宝小程序必须在这里定义, 其他平台都可不用写, 因为已在MescrollMoreItemMixin定义)
			index: { // 当前tab的下标 (除了支付宝小程序必须在这里定义, 其他平台都可不用写, 因为已在MescrollMoreItemMixin定义)
				type: Number,
				default(){
					return 0
				}
			},
			tabs: { // 为了请求数据,演示用,可根据自己的项目判断是否要传
				type: Array,
				default(){
					return []
				}
			}
		},
		mounted() {
			// if(this.$isSpecial){
			// 	this.mescrollBottom = 280 + 40
			// }
		},
		methods: {
			/**
			 * 查询优惠券列表
			 * 优惠券状态(0:待领取，1:待使用，2:已过期，99:已使用)
			 */
			listCouponByPage(){
				let postData = {
					...this.searchData,
					// 优惠券状态(0:待领取，1:待使用，2:已过期，99:已使用)
					status:this.tabs[this.i].couponStatus
				}
				let payload = this.$jsonFormat(postData)
				return new Promise((resolve,reject)=>{
					mall.listCouponByPage(payload).then((res)=>{
						res.data.records = res.data.records.map((item)=>{
							return {
								...item,
								isOpen:false
							}
						}) || []
						resolve(res.data)
					}).catch((err)=>{
						console.log("查询活动订单-分页失败:" + err || err.msg)
						reject(err)
					})
				})
			},
			
			/**
			 * 下拉刷新回调
			 * 优惠券状态(0:待领取，1:待使用，2:已过期，99:已使用)
			 */
			async downCallback(page) {
				this.searchData['pageNum'] = 1
				this.mescroll.setPageNum(1)
				// 先触发查询
				// this.listCouponByPage()
				// 然后追加数据
				let curPageData = await this.listCouponByPage()
				//设置列表数据
				this.pageData.result = curPageData.records;
				//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
				setTimeout(()=>{
					this.mescroll.endSuccess(curPageData.records.length);
				},1000)
			},
			/**
			 * 上拉加载的回调:
			 * 其中page.num:当前页 从1开始,
			 * page.size:每页数据条数,默认10
			 */
			async upCallback(page) {
				let startNum = page.num + 1
				if(startNum === this.searchData['pageNum']){
					 setTimeout(()=>{
						this.mescroll.endByPage(this.pageData.result.length);
					 },500)
					 return
				}
				this.searchData['pageNum'] = startNum
				// 然后追加数据
				let curPageData = await this.listCouponByPage()
				//设置列表数据
				this.pageData.result = this.pageData.result.concat(curPageData.records); //追加新数据
				//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
				setTimeout(()=>{
					this.mescroll.endByPage(curPageData.records.length);
				},1000)
			},
			//点击空布局按钮的回调
			emptyClick(){
				uni.showToast({
					title:'点击了按钮,具体逻辑自行实现'
				})
			},
			/**
			 * 展开收起卡券信息
			 * @param {Object} id
			 */
			open(index){
				this.pageData.result[index].isOpen = !this.pageData.result[index].isOpen
			},
			/**
			 * 跳转兑换商品页面
			 */
			exchange(index){
				let { couponClass } = this.pageData.result[index]
				// 判断如果是兑换商品跳转兑换商品页面
				if(couponClass === 1){
					uni.navigateTo({
						url:'/pages/my-pages/coupon/exchange-goods/exchange-goods-list'
					})
				}
			},
			
			
			/**
			 * 显示优惠券类型
			 * 限制类型(0:通用券,1:玛吉斯通用券,2:分类券,3:单品券)
			 */
			couponType(row){
				let name = ''
				const { limitType,itemName} = row
				switch(limitType){
					case 0:
						name = '通用券';
						break;
					case 1:
						name = '玛吉斯通用券';
						break;
					case 2:
						name = '分类券';
						break;
					case 3:
						name = '单品券：' + itemName;
						break;
				}
				return name
			}
			
		}
	}
</script>
<style lang="scss" scoped>
	.community-list{
		padding: 20rpx;
		.community-li {
			width: 100%;
			margin-top: 20rpx;
			.coupon-item{
				width: 100%;
				height: 72px;
				background-color: #FFE1D9;
				border-radius: 3px;
				position: relative;
				.coupon-left{
					width: 67%;
					color: #ed6d00;
					font-size: 10px;
					padding-left: 30px;
					border-right: 1rpx dashed rgba(253,80,34,.5);
					.coupon-item-price{
						font-size: 13px;
						font-weight: bold;
						margin-right: 9px;
						.coupon-price{
							font-size: 17px;
						}
					}
					.full-price{
						margin: 3px 0;
					}
					.coupon-date{
						margin-left: 5px;
					}
				}
				.coupon-right{
					width: 33%;
					padding: 10px;
					font-size: 15px;
					position: relative;
					height: calc(100% - 20px);
					.activation{
						color: #18D000;
					}
					.superposition{
						color: #ed6d00;
					}
					.exchangeGoods{
						width: 58px;
						height: 16px;
						color: #fff;
						font-size: 10px;
						background-color: #ed6d00;
						border-radius: 3px;
						z-index: 2;
						padding: 2px;
						position: relative;
						top: 2px;
					}
					.invalid{
						color: #CCCCCC;
					}
					.coupon-type{
						position: absolute;
						right: -2px;
						.coupon-mark{
							width: 86rpx;
							height: 40rpx;
						}
						.coupon-item-type{
							color: #fff;
							font-size: 10px;
							margin-left: 10px;
						}
						.coupon-horn{
							width: 12px;
							height: 12px;
							background-color: #FFE1D9;
							transform:rotate(45deg);
							position: absolute;
							left: -7px;
						}
					}
					.coupon-open{
						color: #ed6d00;
						font-size: 10px;
						margin-top: 10px;
						position: absolute;
						bottom: 20rpx;
						right: 10rpx;
						.iconfont{
							font-size: 9px;
							margin-left: 4px;
						}
					}
				}
				.coupon-gap{
					width: 10px;
					height: 10px;
					background-color: #fff;
					border-radius: 50%;
					position: absolute;
					left: calc(67% - 8px);
				}
				.coupon-gap-upper{
					top: -6px;
				}
				.coupon-gap-down{
					bottom: -6px;
				}
			}
			.coupon-info{
				color: #666666;
				font-size: 10px;
				padding: 13px 10px;
				border: 1px solid rgba(253,80,34,.5);
				border-radius: 0px 0px 2.5px 2.5px;
			}
			.bgColor{
				background-color: #F0F0F0;
				.grey-coupon-left{
					color: #CCCCCC;
					border-right: 1rpx dashed rgba(102,102,102,.5);
				}
				.grey-coupon-type{
					bottom: 0;
					top: 0;
				}
			}
		}
		.community-li:nth-of-type(1){
			margin-top: 0;
		}
	}
	#popup{
		/deep/ .uni-transition{
			z-index: 2999;
		}
		/deep/ .popup-content{
			width: 100vw;
			display: initial;
			background-color: #fff;
			border-radius: 3px 3px 0 0;
			.popup-header{
				width: calc(100vw - 20px);
				height: 53px;
				padding: 0 10px;
				color: #1C1C1C;
				font-size: 17px;
				background-color: #fff;
				border-bottom: 1px solid #CCCCCC;
				position: relative;
				.iconfont{
					right: 10px;
					position: absolute;
				}
			}
			.product-item{
				border-radius: 0;
				margin-bottom: 0;
				padding-bottom: 10px;
			}
			.uni-dialog-button-group {
				display: flex;
				flex-direction: row;
				padding: 20px 10px;
				font-weight: 600;
				background-color: #fff;
				font-size: 17px;
			}
			
			.uni-dialog-button {
				display: flex;
				flex: 1;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				width: 144px;
				height: 38px;
				color: #ed6d00;
				border: 1px solid #ed6d00;
				border-radius: 20px;
			}
			
			.uni-border-left {
				color: #fff;
				background-color: #ed6d00;
				margin-left: 10px;
			}
			
			.uni-popup__error {
				color: $uni-color-error;
			}
			
			.uni-popup__info {
				color: #909399;
			}
			.primary-button{
				background-color:$uni-color-primary;
				
			}
		}
	}
</style>
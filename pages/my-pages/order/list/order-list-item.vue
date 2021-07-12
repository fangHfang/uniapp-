<template>
	<view>
		<!--
		swiper中的transfrom会使fixed失效,此时用height="100%"固定高度; 
		swiper中无法触发mescroll-mixins.js的onPageScroll和onReachBottom方法,只能用mescroll-uni,不能用mescroll-body
		-->
		<!-- ref动态生成: 字节跳动小程序编辑器不支持一个页面存在相同的ref (如不考虑字节跳动小程序可固定值为 ref="mescrollRef") -->
		 <mescroll-uni
		   :ref="'mescrollRef'+i"
			@init="mescrollInit"
		 	:bottom="mescrollBottom" 
			height="100%"
			safearea
			:up="upOption" 
			:down="downOption"
		 	@down="downCallback" 
		 	@up="upCallback"
		 	@emptyclick="emptyClick">
			<OrderItem 
				:list="pageData.result" 
				:orderTabIndex="index"
				@toDetail="toDetail" 
				@refresh="downCallback"
				@openDialog="openDialog"></OrderItem>
			<mescroll-empty v-if="pageData.result.length==0"></mescroll-empty>
		 </mescroll-uni>
		 <yu-toast
		 	:message1="powerData.msg1"
		 	:message2="powerData.msg2"
		 	:duration="powerData.duration"
		 	verticalAlign="center"
		 	:backgroundColor="powerData.bgColor"
		 	:color="powerData.fontColor"
		 	ref="power"
		 ></yu-toast>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	import yuToast from '@/components/yu-toast/yu-toast'
	import MescrollEmpty from '@/components/mescroll-uni/components/mescroll-empty.vue';
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollMoreItemMixin from "@/components/mescroll-uni/mixins/mescroll-more-item.js"
	import OrderItem from "../components/order-item.vue"
	import order from '@/api/order/order.js'
	import {dateFormat} from '@/common/utils/DateUtil'
	export default {
		mixins: [MescrollMixin,MescrollMoreItemMixin], // 注意此处还需使用MescrollMoreItemMixin (必须写在MescrollMixin后面)
		components:{
			OrderItem,
			MescrollEmpty
		},
		data() {
			return {
				downOption:{
				},
				upOption:{
					auto:false, // 不自动加载
					empty:{
						use : false
					}
				},
				// 列表数据
				pageData:{
					result:[]
				},
				mescrollBottom:0,
				searchData:{
					pageReq:{
						pageNum: 1,
						pageSize: 10
					}
				},
				// 权限提示
				powerData:{
					msg1:'您没有权限,',
					msg2:'请开通相应权限。',
					duration:2000,
					bgColor:"#000000cc",
					fontColor:"#ed6d00",
				},
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
			},
			height:{
				type: String,
				default:()=>'100%'
			},
			// 订单状态key
			orderStatusKey:{
				type: Number,
				default:1
			},
			// 订单类别
			orderCategory:{
				type: [ Object,Number],
				default(){
					return null
				}
			}
		
		},
		watch:{
			height:{
				handler(){
					this.mescrollBottom = this.$props.height
				}
			},
			orderCategory(val){
				this.downCallback()
			}
		},
		computed: {
			...mapState({
				// 权限集合
				resourceList: state => state.login.resourceList
			}),
		},
		mounted() {
			// this.downCallback()
		},
		methods: {
		//分页查询数据
		listOrderByPage(){
			let that = this
			let payload = JSON.parse(JSON.stringify(this.searchData))
			payload.orderStatus = this.orderStatusKey
			payload.orderCategory = this.orderCategory
			return new Promise((resole,reject)=>{
				order.listOrderByPage(payload).then(res => {
					  this.searchData.pageReq.pages = res.pages
					  that.pageData.result = that.searchData.pageReq.pageNum === 1 ? res.data.records:that.pageData.result.concat(res.data.records)
					  resole(res)
				}).catch((error) => {
					this.$message.error("查询失败,请稍后重试");
					reject(error.msg)
				});
			})
		},
			/*下拉刷新的回调 */
			// 0 待付款、1 待收货  ，2 部分收货 ，3 取消、4 已完成，5 强制收货
			async downCallback(page) {
				// 重置页码为1
				this.mescroll.setPageNum(1)
				this.searchData.pageReq.pageNum = 1
				const res = await this.listOrderByPage();
				//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
				setTimeout(()=>{
					this.mescroll.endSuccess(this.pageData.result.length);
				},1000)
			},
			/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
			async upCallback(page) {
				//联网加载数据
				let keyword = this.tabs[this.i].name
				if(page.num === this.searchData.pageReq.pages){
					 setTimeout(()=>{
						this.mescroll.endByPage(this.pageData.result.length);
					 },500)
					 return
				}
				this.searchData.pageReq.pageNum = page.num+1
				const res = await this.listOrderByPage()
				setTimeout(()=>{
					this.mescroll.endByPage(res.data.records.length);
				 },1000)

			},
			//点击空布局按钮的回调
			emptyClick(){
				uni.showToast({
					title:'点击了按钮,具体逻辑自行实现'
				})
			},

			/**
			 * 跳转详情页
			 */
			toDetail(item){
				// 订单详情权限-STOREAPPA060201
				if(!this.resourceList.some((item)=>{return item.resourceNo === 'STOREAPPA060201'})){
					this.$refs.power.show()
					return
				}
				if(item.orderCategory===1){
					uni.navigateTo({
						url:"/pages/my-pages/order/detail/order-detail?orderNo="+item.orderNo
					})
				}else{
					uni.navigateTo({
						url:"/pages/my-pages/activity/detail/activity-detail?orderNo="+item.orderNo
					})
				}
			},
			
			
			/**
			 * 拦截超过支付时间的订单
			 */
			openDialog(dialogOptions){
				const { type } = dialogOptions
				if(type === 1 || type === 2){
					this.$emit('openDialog',dialogOptions)
				}else{
					// 判断是否超过支付时间
					const now = new Date();
					// 直接调用取消订单接口
					if(new Date(dialogOptions.payExpireTime.replace(/-/g, '/')).getTime() < now.getTime()){
						this.timUp(dialogOptions.orderNo);
					}else{
						uni.navigateTo({
							url:'/pages/products/order/pay?orderInfo=' + JSON.stringify(dialogOptions)
						})
					}
				}
			},
			
			
			/**
			 * 付款倒计时结束刷新页面
			 * 调用主动取消接口，再重新请求详情页
			 */
			timUp(orderNo){
				uni.showLoading({
					mask:true
				})
				let postData = {
					orderNo:orderNo,
				}
				order.cancelOrder(postData).then(res => {
					uni.hideLoading()
					if (res.code === 200) {
						uni.showToast({
							title:"订单已取消",
							icon:'none',
						})
						this.downCallback()
					} else {
						uni.showToast({
							title:'订单已取消',
							icon:"none"
						})
					}
				}).catch(() => {
					uni.hideLoading()
					uni.showToast({
						title:'订单已取消',
						icon:"none"
					})
				});
			},
		}
	}
</script>
<style lang="scss" scoped>

</style>

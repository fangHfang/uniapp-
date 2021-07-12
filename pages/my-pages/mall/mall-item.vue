<template>
	<!-- 
	swiper中的transfrom会使fixed失效,此时用height="100%"固定高度; 
	swiper中无法触发mescroll-mixins.js的onPageScroll和onReachBottom方法,只能用mescroll-uni,不能用mescroll-body
	-->
	<!-- ref动态生成: 字节跳动小程序编辑器不支持一个页面存在相同的ref (如不考虑字节跳动小程序可固定值为 ref="mescrollRef") -->
	<mescroll-uni 
	    :ref="'mescrollRef'+i" 
		@init="mescrollInit"
		:safearea="true" 
		:bottom="mescrollBottom" 
		:down="downOption" 
		@down="downCallback" 
		:up="upOption" 
		@up="upCallback" 
		@emptyclick="emptyClick">
		<view class="product-list">
			<iProductItem 
				v-for="(item,pdIndex) in pageData.result" 
				:key="pdIndex" 
				:productItem="item" 
				:isIntegral="true" 
				@addIntegralCart="addCart(item)"></iProductItem>
			<mescroll-empty v-if="pageData.result.length==0"></mescroll-empty>
		</view>
	</mescroll-uni>
</template>

<script>
	import integral from "@/api/mall/integral";
	import MescrollEmpty from '@/components/mescroll-uni/components/mescroll-empty.vue';
	import iProductItem from '@/components/i-product-item/i-product-item.vue';
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollMoreItemMixin from "@/components/mescroll-uni/mixins/mescroll-more-item.js";
	import permission from '@/common/utils/permission.js'
	export default {
		mixins: [MescrollMixin,MescrollMoreItemMixin], // 注意此处还需使用MescrollMoreItemMixin (必须写在MescrollMixin后面)
		components: {
			iProductItem,
			MescrollEmpty
		},
		data() {
			return {
				downOption:{
					auto:false // 不自动加载 (mixin已处理第一个tab触发downCallback)
				},
				upOption:{
					auto:false, // 不自动加载
					empty:{
						tip: '~ 空空如也 ~', // 提示
						btnText: '去看看'
					},
					toTop:{
						src:""
					}
				},
				mescrollBottom: '30rpx',
				// 列表数据
				pageData:{
					result:[]
				},
				// 搜索条件
				searchData:{
					'pageReq.pageNum':1,
					'pageReq.pageSize':10,
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
			// 起订分规则编码
			startPointNo:{
				type: String,
				default(){
					return ""
				}
			},
			// 查询条件
			searchKey:{
				type: String,
				default(){
					return ""
				}
			}
		},
		mounted() {
			if(permission.isIOS){
				this.mescrollBottom = '60rpx'
			}
		},
		methods: {
			/**
			 * 查询积分商品
			 */
			listIntegralByPage(){
				let that = this
				let postData = JSON.parse(JSON.stringify(this.searchData))
				postData.startPointNo = this.startPointNo
				if(this.searchKey){
					postData.itemName = this.searchKey
					// postData.itemNo = this.searchKey
				}
				let payload = this.$jsonFormat(postData)
				return new Promise((resole,reject)=>{
					integral.listIntegralProductByPage(payload).then((res)=>{
						res.data.records.map((item)=>{
							item.currentNum = 1
						})
						resole(res.data)
					}).catch((err)=>{
						reject(err)
					})
				})
			},
			/**
			 * 下拉刷新回调
			 */
			async downCallback() {
				this.searchData['pageReq.pageNum'] = 1
				this.mescroll.setPageNum(1)
				// 先触发查询
				// this.listSeckillByPage()
				// 然后追加数据
				let curPageData = await this.listIntegralByPage()
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
				if(startNum === this.searchData['pageReq.pageNum']){
					 setTimeout(()=>{
						this.mescroll.endByPage(this.pageData.result.length);
					 },500)
					 return
				}
				this.searchData['pageReq.pageNum'] = startNum
				// 然后追加数据
				let curPageData = await this.listIntegralByPage()
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
			/***
			 * 添加购物车
			 */ 
			addCart(row){
				const { itemNo,currentNum,stock } = row
				if(!stock){
					uni.showToast({
						title: '该商品已售罄',
						icon:"none"
					})
					return
				}
				let payload = {
					itemNo,
					itemQuantity:currentNum
				}
				integral.addIntegralCart(payload).then((res)=>{
					this.$emit('addCart')
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
			}
		}
	}
</script>
<style lang="scss" scoped>
	.product-list {
		padding: 0 10px 2rpx;
		background-color: #F2F2F2;
	}
</style>
<template>
	<mescroll-uni
		:ref="'mescrollRef'+i"
		@init="mescrollInit"
		safearea
		:bottom="0"
		:up="upOption" 
		:down="downOption"
		@down="downCallback"
	 >
		<view class="cart-list">
				<productItem
					class="item-wrap" 
					v-for="(product,i) in pageData.result" 
					:key="i" 
					:tabIndex="index"
					:productItem="product"
					/>
				<mescroll-empty v-if="pageData.result.length==0"></mescroll-empty>
		</view>
	</mescroll-uni>
</template>

<script>
	import productItem from './product-item.vue';
	import reserve from '@/api/product/reserve.js';
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollMoreItemMixin from "@/components/mescroll-uni/mixins/mescroll-more-item.js";
	import MescrollEmpty from '@/components/mescroll-uni/components/mescroll-empty.vue';
	export default {
		mixins: [MescrollMixin,MescrollMoreItemMixin], // 注意此处还需使用MescrollMoreItemMixin (必须写在MescrollMixin后面)
		components: {
			productItem,
			MescrollEmpty
		},
		props: {
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
		data() {
			return {
				downOption:{
				},
				upOption:{
					use:false,
					auto:false, // 不自动加载
					page: {
						size: 10 // 每页数据的数量
					},
					noMoreSize: 4,
					empty:{
						tip: '~ 空空如也 ~', // 提示
						// btnText: '去看看'
					},
					toTop:{
						src:""
					}
				},
				// 要货状态(0-等待通知，1-可购买)
				pageData:{
					result:[]
				},
			}
		},
		mounted() {

		},
		methods: {
			/**
			 * 查询门店预定订单
			 */
			listOrderPresellByPage(){
				return new Promise((resolve,reject)=>{
					reserve.listOrderPresellByPage({}).then((res)=>{
						let list = res.data.filter((item)=>{return item.presellStatus === this.tabs[this.i].presellStatus})
						resolve(list)
					}).catch((err)=>{
						console.log("查询门店预定订单-分页失败:" + err || err.msg)
						reject(err)
					})
				})
			},
			
			/**
			 * 下拉刷新回调
			 * 优惠券状态(0:待领取，1:待使用，2:已过期，99:已使用)
			 */
			async downCallback(page) {
				// 先触发查询
				// this.listOrderPresellByPage()
				// 然后追加数据
				let curPageData = await this.listOrderPresellByPage()
				//设置列表数据
				this.pageData.result = curPageData;
				//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
				setTimeout(()=>{
					this.mescroll.endSuccess(curPageData.length);
				},1000)
			}
		}
	}
</script>

<style lang="scss">
	.cart-list {
		padding: 10px 10px 0;
		overflow: hidden;

		.item-wrap {
			background-color: #fff;
			margin-bottom: 10px;
			position: relative;
		}
	}
</style>

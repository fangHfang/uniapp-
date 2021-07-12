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
		:down="downOption"
		@down="downCallback"
		:up="upOption"
		@up="upCallback">
		<view class="product-list">
			<template v-if="index === 0">
				<card-item-all v-for="(item,cardIndex) in pageData.result" :key="cardIndex" :cardItem="item" :tabIndex="index"></card-item-all>
			</template>
			<template v-else>
				<cardItem v-for="(item,cardIndex) in pageData.result" :key="cardIndex" :cardItem="item" :tabIndex="index"></cardItem>
			</template>
		</view>
		<mescroll-empty v-if="pageData.result.length==0"></mescroll-empty>
	</mescroll-uni>
</template>

<script>
	import market from '@/api/market/market.js'
	import cardItem from "./card-item.vue";
	import cardItemAll from "./card-item-all.vue";
	import MescrollEmpty from '@/components/mescroll-uni/components/mescroll-empty.vue';
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollMoreItemMixin from "@/components/mescroll-uni/mixins/mescroll-more-item.js";
	export default {
		name: 'contractItem',
		mixins: [MescrollMixin,MescrollMoreItemMixin],
		components: {
			cardItem,
			MescrollEmpty,
			cardItemAll
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
			status: { // 类型
				type: [Number,Object],
				default(){
					return null
				}
			},
		},
		data() {
			return {
				downOption:{
					auto:false, // 不自动加载
				},
				upOption:{
					auto:false, // 不自动加载
					page: {
						num: 1, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: 10 // 每页数据的数量
					},
					empty:{
						tip: '~ 空空如也 ~', // 提示
						// btnText: '去看看'
					},
					toTop:{
						src:""
					}
				},
				// 列表数据
				pageData:{
					result:[]
				},
				// 查询条件
				searchData:{
					// 排序字段
					'page.field':"startDate",
					// 排序规则
					'page.order':"desc",
					// 当前页码
					'page.pageNum':1,
					// 当前页面数据量
					'page.pageSize':10,
				},
			}
		},
		onLoad(option) {

		},
		mounted() {
		},
		methods: {
			//分页查询数据
			listContractByPage(){
				let that = this
				let postData = JSON.parse(JSON.stringify(this.searchData))
				if(this.status !== null){
					postData.approvalStatus = this.status
				}
				let payload = this.$jsonFormat(postData)
				return new Promise((resole,reject)=>{
					market.listScStoreByPage(payload).then(res => {
						resole(res.data)
					}).catch((error) => {
						this.$message.error("查询失败,请稍后重试");
						reject(error)
					});
				})
			},
			/**
			 * 上拉加载的回调: 
			 * 其中page.num:当前页 从1开始, 
			 * page.size:每页数据条数,默认10 
			 */
			async upCallback(page) {
				if(page.startNum === this.searchData['page.pageNum']){
					 setTimeout(()=>{
						this.mescroll.endByPage(this.pageData.result.length);
					 },500)
					 return
				}
				this.searchData['page.pageNum'] = page.startNum
				// 然后追加数据
				let curPageData = await this.listContractByPage()
				//设置列表数据
				this.pageData.result = this.pageData.result.concat(curPageData.records); //追加新数据
				//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
				setTimeout(()=>{
					this.mescroll.endByPage(curPageData.records.length);
				},1000)
			},
			
			/**
			 * 下拉刷新回调
			 */
			async downCallback(page) {
				this.searchData['page.pageNum'] = 1
				this.mescroll.setPageNum(1)
				// 先触发查询
				// this.listContractByPage()
				// 然后追加数据
				let curPageData = await this.listContractByPage()
				//设置列表数据
				this.pageData.result = curPageData.records; //追加新数据
				//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
				setTimeout(()=>{
					this.mescroll.endSuccess(curPageData.records.length);
				},1000)
			},
		}
	}
</script>

<style lang="scss">
	.product-list {
		padding: 0 10px 0;
	}
</style>

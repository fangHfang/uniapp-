<template>
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
		<IntegralItem :list="pageData.result" @toDetail="toDetail"></IntegralItem>
		<mescroll-empty v-if="pageData.result.length==0"></mescroll-empty>
	 </mescroll-uni>
</template>

<script>
	import integral from "@/api/mall/integral";
	import MescrollEmpty from '@/components/mescroll-uni/components/mescroll-empty.vue';
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollMoreItemMixin from "@/components/mescroll-uni/mixins/mescroll-more-item.js"
	import IntegralItem from "../components/integral-item.vue"
	export default {
		mixins: [MescrollMixin,MescrollMoreItemMixin], // 注意此处还需使用MescrollMoreItemMixin (必须写在MescrollMixin后面)
		components:{
			IntegralItem,
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
						field:"",
						order:"",
						pageNum: 1,
						pageSize: 10
					}

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
			}
		
		},
		watch:{
			height:{
				handler(){
					this.mescrollBottom = this.$props.height
				}
			}
		},
		mounted() {
		},
		methods: {
			//分页查询数据
			listOrderIntegralByPage(){
				let that = this
				let payload = JSON.parse(JSON.stringify(this.searchData))
				payload.orderReceiveStatus = this.orderStatusKey
				return new Promise((resolve,reject)=>{
					integral.listIntegralOrderByPage(payload).then(res => {
						resolve(res.data)
					}).catch((error) => {
						this.$message.error("查询失败,请稍后重试");
						reject(error.msg)
					});
				})
			},
			/*下拉刷新的回调 */
			async downCallback(page) {
				this.searchData.pageReq.pageNum = 1
				this.mescroll.setPageNum(1)
				// 先触发查询
				// this.listOrderIntegralByPage()
				// 然后追加数据
				let curPageData = await this.listOrderIntegralByPage()
				//设置列表数据
				this.pageData.result = curPageData.records;
				//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
				setTimeout(()=>{
					this.mescroll.endSuccess(curPageData.records.length);
				},1000)
			},
			/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
			async upCallback(page) {
				let startNum = page.num + 1
				if(startNum === this.searchData.pageReq.pageNum){
					 setTimeout(()=>{
						this.mescroll.endByPage(this.pageData.result.length);
					 },500)
					 return
				}
				this.searchData.pageReq.pageNum = startNum
				// 然后追加数据
				let curPageData = await this.listOrderIntegralByPage()
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
			 * 跳转详情页
			 */
			toDetail(item){
				uni.navigateTo({
					url:"/pages/my-pages/integral/detail/integral-detail?orderNo="+item.orderNo
				})
			}
		}
	}
</script>
<style lang="scss" scoped>

</style>

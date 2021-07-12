<template>
	<view class="page">
		<view class="status-bar-placeholder" :style="{'height':systemInfo.statusBarHeight+'px' }"/>
		<view class="con-container">
			<!-- 搜索栏 -->
			<view class="flex search-box">
				<uni-search-bar
					ref="searchBar"
					class="search-bar"
					placeholder="订单编号"
					@focus='searchFocus'
					@confirm="confirm"
					@cancel="cancel"
					@clear="clear"
					:radius="20"
					type=""
					cancelButton="always"/>
			</view>
			<view class="scroll-box">
				<mescroll-uni
					ref="mescrollRef"
					@init="mescrollInit"
					:top="pageOptions.mescrollTop"
					:bottom="pageOptions.mescrollBottom"
					safearea
					:up="upOption"
					:down="downOption"
					@down="downCallback"
					@up="upCallback"
					@scroll="scroll">
					<OrderItem :list="pageData.result"></OrderItem>
					<mescroll-empty v-if="pageData.result.length==0"></mescroll-empty>
				</mescroll-uni>
			</view>
		</view>
	</view>
	</view>
</template>

<script>
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollMoreItemMixin from "@/components/mescroll-uni/mixins/mescroll-more-item.js";
	import MescrollEmpty from '@/components/mescroll-uni/components/mescroll-empty.vue';
	import vTabs from "@/components/v-tabs/v-tabs.vue";
	import OrderItem from "../components/order-item.vue";
	import order from '@/api/order/order.js'
	export default {
		name: 'orderList',
		mixins: [MescrollMixin,MescrollMoreItemMixin], // 注意此处还需使用MescrollMoreItemMixin (必须写在MescrollMixin后面)
		components: {
			vTabs,
			OrderItem,
			MescrollEmpty
		},
		data() {
			return {
				systemInfo:uni.getSystemInfoSync(),
				downOption:{
					auto:false // 不自动加载 (mixin已处理第一个tab触发downCallback)
				},
				upOption:{
					onScroll:true,
					auto:false, // 不自动加载
					// page: {
					// 	num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
					// 	size: 10 // 每页数据的数量
					// },
					noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					empty:{
						tip: '~ 空空如也 ~', // 提示
						btnText: '去看看'
					},
					toTop:{
						src:""
					},
				},
				// 列表数据 0-咨询，1-社区
				pageData:{
					result:[]
				},
				//追加数据
				currData:{
				result:[]
				},
				mescrollBottom:0,
				searchData:{
					orderNo:'',
					pageReq:{
						pageNum: 1,
						pageSize: 10
					}
				},
				// 页面配置
				pageOptions: {
					// 适配刘海屏
					mescrollTop:40,
					mescrollBottom:0
				},
				isFocus:false
			}
		},
		onLoad() {

		},
		mounted(){
			this.pageOptions.mescrollTop = this.systemInfo.safeArea.top + 50 + 'px'
			// 触发光标置入事件
			this.$refs.searchBar.searchClick()
		},
		methods: {
			//分页查询数据
			listOrderByPage(){
				return new Promise((resolve,reject)=>{
					order.listOrderByPage(this.searchData).then(res => {
						if (res.code === 200) {
							resolve(res.data)
						} else {
							this.$message.error("查询失败,请稍后重试");
							reject(res)
						}
					}).catch((err) => {
						reject(err)
					});
				})
			},
			// 输入监听
			confirm(val){
				// this.curWord = e.detail.value // 已使用v-model,无需再次赋值
				// 查询方法 val 是对象
				this.searchData.orderNo = val.value;
				this.downCallback()			
			},
			/*下拉刷新的回调 */
			async downCallback(page) {
				this.searchData.pageReq.pageNum = 1
				this.mescroll.setPageNum(1)
				// 先触发查询
				// this.listOrderByPage()
				// 然后追加数据
				let curPageData = await this.listOrderByPage()
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
				let curPageData = await this.listOrderByPage()
				//设置列表数据
				this.pageData.result = this.pageData.result.concat(curPageData.records); //追加新数据
				//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
				setTimeout(()=>{
					this.mescroll.endByPage(curPageData.records.length);
				},1000)
			},

			/**
			 * 搜索栏取消事件
			 * 返回上一页
			 */
			cancel(){
				uni.navigateBack({
					delta: 1
				})
			},

			/**
			 * 搜索框焦点选中时 
			 */
			searchFocus(){
				this.isFocus = true
			},

			/**
			 * 清除搜索条件
			 */
			clear(){
				this.searchData.orderNo = '';
				this.downCallback()		
			},
			
			/**
			 * 滚动监听，隐藏键盘
			 */
			scroll(){
				if(this.isFocus){
					this.isFocus = false
					this.$refs['searchBar'].showRefs()
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page{
		height: 100vh;
	}
	.status-bar-placeholder{
		background-color: $uni-color-primary;
		position: relative;
		z-index: 102;
	}
	// 搜索栏
	.search-box {
		background-color: $uni-color-primary;
	}
	
	/deep/.search-bar {
		width: 100%;
		background-color: $uni-color-primary;
		padding: 16rpx;
	
		>.uni-searchbar__box {
			justify-content: left;
			height: 68rpx;
			border-color: $uni-color-primary;
	
			>.uni-searchbar__text-placeholder {
				margin-left: 0px;
			}
		}
		>.uni-searchbar__cancel{
			font-size: 30rpx;
			font-weight: bold;
			color: #FFFFFF;
		}
	}

	.con-container {
		height: calc(100vh - var(--status-bar-height));
		width: 100%;

		.scroll-box {
			height: calc(100% - 100rpx);
			overflow: hidden;
			background-color: $uni-bg-color-grey;

			.product-list {
				padding: 10px 10px 0;
			}
		}
	}
</style>

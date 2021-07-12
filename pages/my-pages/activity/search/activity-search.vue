<template>
	<view class="page">
		<view class="status-bar-placeholder">
		<view class="con-container">
			<!-- 搜索栏 -->
			<view class="flex search-box">
				<uni-search-bar
					ref="searchBar"
					class="search-bar"
					placeholder="订单编号"
					@confirm=""
					@input="inputWord"
					@cancel="cancel"
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
					@emptyclick="emptyClick">
					<ActivityItem :list="pageData.result"></ActivityItem>
				</mescroll-uni>
			</view>
		</view>
	</view>
	</view>
</template>

<script>
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollMoreItemMixin from "@/components/mescroll-uni/mixins/mescroll-more-item.js";
	import vTabs from "@/components/v-tabs/v-tabs.vue";
	import ActivityItem from "../components/activity-item.vue";
	export default {
		name: 'activityList',
		mixins: [MescrollMixin,MescrollMoreItemMixin], // 注意此处还需使用MescrollMoreItemMixin (必须写在MescrollMixin后面)
		components: {
			vTabs,
			ActivityItem
		},
		data() {
			return {
				systemInfo:uni.getSystemInfoSync(),
				downOption:{
					auto:false // 不自动加载 (mixin已处理第一个tab触发downCallback)
				},
				upOption:{
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
				total:0,
				current:0,
				pages:0,
				// 页面配置
				pageOptions: {
					// 适配刘海屏
					mescrollTop:40,
					mescrollBottom:0
				}
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
				 let curPageData = [{
				 					"id": "1",
				 					"orderNo": "1237982173",
				 					"orderItemNames": "商品名称商品名称商品名称商品名称称商品名称",
				 					"orderTotalQuantity":"5",
				 					"orderStatus":1,
				 					"orderAmount":"5000",
				 					"orderTime":"2020-10-15 11:55:21"
				 				},{
				 					"id": "2",
				 					"orderNo": "1237982173",
				 					"orderItemNames": "商品名称商品名称商品名称商品名称称商品名称",
				 					"orderTotalQuantity":"5",
				 					"orderStatus":0,
				 					"orderAmount":"5000",
				 					"orderTime":"2020-10-15 11:55:21"
				 				},{
				 					"orderNo": "1237982173",
				 					"orderItemNames": "商品名称商品名称商品名称商品名称称商品名称",
				 					"orderTotalQuantity":"5",
				 					"orderStatus":0,
				 					"orderAmount":"5000",
				 					"orderTime":"2020-10-15 11:55:21"
				 				},{
				 					"id": "4",
				 					"orderNo": "1237982173",
				 					"orderItemNames": "商品名称商品名称商品名称商品名称称商品名称",
				 					"orderTotalQuantity":"5",
				 					"orderStatus":1,
				 					"orderAmount":"5000",
				 					"orderTime":"2020-10-15 11:55:21"
				 				},{
				 					"id": "5",
				 					"orderNo": "1237982173",
				 					"orderItemNames": "商品名称商品名称商品名称商品名称称商品名称",
				 					"orderTotalQuantity":"5",
				 					"orderStatus":0,
				 					"orderAmount":"5000",
				 					"orderTime":"2020-10-15 11:55:21"
				 				},{
				 					"id": "6",
				 					"orderNo": "1237982173",
				 					"orderItemNames": "商品名称商品名称商品名称商品名称称商品名称",
				 					"orderTotalQuantity":"5",
				 					"orderStatus":1,
				 					"orderAmount":"5000",
				 					"orderTime":"2020-10-15 11:55:21"
				 				},{
				 					"id": "7",
				 					"orderNo": "1237982173",
				 					"orderItemNames": "商品名称商品名称商品名称商品名称称商品名称",
				 					"orderTotalQuantity":"5",
				 					"orderStatus":1,
				 					"orderAmount":"5000",
				 					"orderTime":"2020-10-15 11:55:21"
				 				},{
				 					"id": "8",
				 					"orderNo": "1237982173",
				 					"orderItemNames": "商品名称商品名称商品名称商品名称称商品名称",
				 					"orderTotalQuantity":"5",
				 					"orderStatus":1,
				 					"orderAmount":"5000",
				 					"orderTime":"2020-10-15 11:55:21"
				 				},{
				 					"id": "9",
				 					"orderNo": "1237982173",
				 					"orderItemNames": "商品名称商品名称商品名称商品名称称商品名称",
				 					"orderTotalQuantity":"5",
				 					"orderStatus":1,
				 					"orderAmount":"5000",
				 					"orderTime":"2020-10-15 11:55:21"
				 				},{
				 					"id": "10",
				 					"orderNo": "1237982173",
				 					"orderItemNames": "商品名称商品名称商品名称商品名称称商品名称",
				 					"orderTotalQuantity":"5",
				 					"orderStatus":1,
				 					"orderAmount":"5000",
				 					"orderTime":"2020-10-15 11:55:21"
				 				}]
				 				this.pageData.result = curPageData
				},
			// 输入监听
			inputWord(val){
				// this.curWord = e.detail.value // 已使用v-model,无需再次赋值
				// 节流,避免输入过快多次请求
				this.searchTimer && clearTimeout(this.searchTimer)
				this.searchTimer = setTimeout(()=>{
				// 查询方法 val 是对象
				this.searchData.orderNo =val.value;
				this.listOrderByPage()			
			},300)
			},
			/*下拉刷新的回调 */
			downCallback() {
				// 这里加载你想下拉刷新的数据, 比如刷新轮播数据
				// loadSwiper();
				// 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
				this.listOrderByPage();
				this.mescroll.resetUpScroll(this.pageData.result.length)
			},
			/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
			upCallback(page) {
			this.searchData.pageReq.pageNum = this.current +1
			if(this.current===this.pages){
				this.mescroll.endSuccess(this.pageData.result.length);
			}else{
				order.listOrderByPage(this.searchData).then(res => {
			if (res.code === 200) {
			  this.currData.result = res.data.records,
			  this.total = res.data.total;
			  this.pages = res.data.page;
			  this.current = res.data.current;
			  this.pageData.result = this.pageData.result.concat(this.currData.result); //追加新数据
			  this.mescroll.endSuccess(this.pageData.result.length);
			} else {
			this.$message.error("查询失败,请稍后重试");
			}
				}).catch(() => {
			});
			}
			},
			//点击空布局按钮的回调
			emptyClick(){
				uni.showToast({
					title:'点击了按钮,具体逻辑自行实现'
				})
			},

			/**
			 * 搜索栏取消事件
			 * 返回上一页
			 */
			cancel(){
                uni.navigateTo({
					url:"/pages/my-pages/activity/list/activity-list?tabIndex=1"
                })
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page{
		height: 100vh;
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

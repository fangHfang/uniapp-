<template>
	<view class="page">
		<uni-nav-bar
			title="扫码记录" 
			backgroundColor="#ed6d00" 
			color="#fff"
			left-icon="back"
			@clickLeft="navBack"
		></uni-nav-bar>
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
				<view class="code-list">
					<view 
						class="code-li" 
						v-for="(item,index) in pageData.result" 
						:key="'code-item-' +  item.id">
						<view class="code-name-no">
							<text class="code-name">{{item.name}}</text>
							<view>
								<text class="code-no">{{item.no}}</text>
							</view>
						</view>
						<view class="line-gray"></view>
						<view class="code-date">
							<text>{{item.date}}</text>
						</view>
					</view>
				</view>
			</mescroll-uni>
		</view>
	</view>
</template>

<script>
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollMoreItemMixin from "@/components/mescroll-uni/mixins/mescroll-more-item.js";
	import ActivityItem from "../components/activity-item.vue";
	export default {
		name: 'activityList',
		mixins: [MescrollMixin,MescrollMoreItemMixin], // 注意此处还需使用MescrollMoreItemMixin (必须写在MescrollMixin后面)
		components: {
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
					result:[{
						"id": "1",
						"name": "145/70 R15 RP28 全诺 TRAZANO",
						"no":"IP125662155412",
						"date":"2021-01-02",
					},{
						"id": "2",
						"name": "145/70 R15 RP28 全诺 TRAZANO",
						"no":"IP125662155412",
						"date":"2021-01-02",
					}]
				},
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
		},
		methods: {
			/*下拉刷新的回调 */
			downCallback() {
				// 这里加载你想下拉刷新的数据, 比如刷新轮播数据
				// loadSwiper();
				// 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
				this.mescroll.resetUpScroll()
			},
			/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
			upCallback(page) {
				//联网加载数据
				this.pageData.result = []
				this.mescroll.endSuccess(0);
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
			navBack(){
				uni.navigateBack({
					delta:1
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page{
		height: 100vh;
		
	}

	.scroll-box {
		height: calc(100% - var(--status-bar-height) - 100rpx);
		overflow: hidden;
		background-color: $uni-bg-color-grey;
	}
	.code-list{
		.code-li{
			background-color: #FFFFFF;
			border-radius: 5rpx;
			width: calc(100% - 40rpx);
			margin: 0px auto 20rpx;
			.code-name-no{
				padding: 30rpx;
				.code-name{
					font-size: 26rpx;
					font-weight: 400;
					color: #1C1C1C;
				}
				.code-no{
					font-size: 24rpx;
					font-weight: 400;
					color: #ed6d00;
				}
			}
			.line-gray{
				width: 100%;
				height: 1rpx;
				background-color: #CCCCCC;
			}
			.code-date{
				text-align: right;
				padding: 25rpx 30rpx;
				font-size: 26rpx;
				font-weight: 400;
				color: #CCCCCC;
			}
		}
	}
</style>

<template>
	<view class="page">
		<view id="tab">
			<uni-nav-bar 
				title="积分订单" 
				backgroundColor="#ed6d00" 
				color="#fff"
				left-icon="back"
				@clickLeft="navBack"
			></uni-nav-bar>
			<!-- 搜索栏 -->
			<view class="flex search-box">
			<uni-search-bar class="search-bar" placeholder="输入订单号" @confirm="" @input="" :radius="20" type="" cancelButton="none" @focus="toSearch"/>
			</view>
			<v-tabs 
				v-model="tabIndex" 
				:tabs="tabs" 
				:scroll="false"
				class="tab-box"
				bold
				field="name"
				color="#666"
				activeColor="#ed6d00"
				lineColor="#ed6d00"
				height="80rpx"
				fontSize="24rpx"
				lineHeight="8rpx"
				@change="changeTab"></v-tabs>
		</view>
		<swiper 
			class="swiper-box"
			:style="`height:${swiperHeight}`"
			:current="tabIndex" 
			duration="300" 
			@change="swiperChange">
		  <swiper-item 
				v-for="(item,index) in tabs" 
				:key="index"
				class="swiper-item">
				<integral-list-item
					ref="mescrollItem" 
					:i="index" 
					:height='topHeight'
					:index="tabIndex" 
					:tabs="tabs"
					:orderStatusKey="item.status"
					@toDetail="toDetail"
					></integral-list-item>
		  </swiper-item>
		</swiper>
	</view>
</template>

<script>
	import vTabs from "@/components/v-tabs/v-tabs.vue";
	import IntegralListItem from "./integral-list-item.vue";
	export default {
		name: 'integralList',
		components: {
			vTabs,
			IntegralListItem
		},
		data() {
			return {
				systemInfo:uni.getSystemInfoSync(),
				// tabs
				tabs: [
					{name:"待发货",status:1},
					{name:"已发货",status:2},
				],
				// tabs下标
				tabIndex: 0 ,
				swiperHeight:'100%',
				topHeight:'100%',
			}
		},
		onLoad(e) {
			const {tabIndex} = e
			if(tabIndex){
				this.tabIndex = Number(tabIndex)
			}
		},
		created(){
		},
		mounted(){
			this.countTopBar();
		},
		methods: {
			/**
			 * 计算顶部DOM元素节点
			 */
			async countTopBar(){
				let that = this
				const topHeight = await this.$getComponentsDom('#tab');
				this.topHeight = topHeight.bottom+ 'px'
				this.swiperHeight =  (that.systemInfo.windowHeight - topHeight.bottom) + 'px'
			},
			
			/**
			 * tab切换事件
			 */	
			changeTab(index) {
				this.tabIndex = index;
			},
			/**
			 * swipe切换事件
			 * @param {Object} e
			 */
			swiperChange(e) {
				let { current } = e.target;
				this.tabIndex = current;
			},
			
			/**
			 * 跳转详情页
			 * 传入id和标题，标题需要显示
			 */
			toDetail({id,name}){
				// uni.navigateTo({
				// 	url:'/pages/community/detail/communityDetail?id=' + id + '&title=' + name
				// })
			},
			
			/**
			 * 跳转搜索页
			 */
			toSearch(){
				uni.navigateTo({
					url:"/pages/my-pages/integral/search/integral-search"
				})
			},
			
			
			/**
			 * 返回上一页
			 */
			navBack(){
				const obj = {
					"name": "my",
					"id": 4
				}
				uni.reLaunch({
					url:`/pages/index/index?name=${obj.name}&id=${obj.id}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page{
	}
	// swpier
	.swiper-box{
		background-color: #F2F2F2;
	}
	.swiper-item{
		height:100%;
		width:100%;
	}
	// swpier
	// 搜索栏
	.search-box {
	}
	/deep/.search-bar {
		width: 100%;
		background-color: #FFFFFF;
		padding: 20rpx 20rpx 0 20rpx;
	
		>.uni-searchbar__box {
			justify-content: left;
			height: 68rpx;
			border-color: $uni-color-primary;
	
			>.uni-searchbar__text-placeholder {
				margin-left: 0px;
			}
		}
	}
	// 搜索栏
	.tab-box{
		border-bottom: 1px solid #eee;
	}
</style>

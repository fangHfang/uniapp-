<template>
	<view class="page">
		<uni-nav-bar class="high-zindex" title="签约管理" left-icon="back" backgroundColor="#ed6d00" color="#fff" @clickLeft="toBack"></uni-nav-bar>
		<view class="con-container">
			<v-tabs 
				id="tab"
				v-model="tabIndex" 
				:tabs="tabs" 
				:scroll="false" 
				:lineScale="0.2" 
				activeColor="#ed6d00" 
				lineColor="#ed6d00"
				height="88rpx" 
				field="name"
				fontSize="32rpx" 
				lineHeight="4rpx" 
				@change="changeTab"></v-tabs>
			 <swiper
			 	class="swiper-box"
			 	:current="tabIndex" 
				:style="`height:${swiperHeight}`"
			 	duration="300" 
			 	@change="swiperChange">
			   <swiper-item 
			 		v-for="(item,index) in tabs" 
			 		:key="index"
			 		class="swiper-item ">
					<contract-item
						ref="contractItem" 
						:i="index" 
						:height='topHeight'
						:index="tabIndex" 
						:status="item.status"
						:tabs="tabs"></contract-item>
			   </swiper-item>
			 </swiper>
			
		</view>
	</view>
</template>

<script>
	import vTabs from "@/components/v-tabs/v-tabs.vue";
	import ContractItem from "./contract-item.vue";
	export default {
		name: 'contract',
		components: {
			vTabs,
			ContractItem
		},
		data() {
			return {
				systemInfo:uni.getSystemInfoSync(),
				// tabs
				tabs: [
					{name:'全部',status:null},
					{name:'已签约',status:1},
					{name:'审核中',status:0},
					{name:'已拒绝',status:2}],
				// tabs下标
				tabIndex: 0,
				swiperHeight:'100%',
				topHeight:'100%',
			}
		},
		onLoad(option) {

		},
		mounted() {
			this.countTopBar();
		},
		methods: {
			/**
			 * 计算顶部DOM元素节点
			 */
			async countTopBar(){
				let that = this
				const topHeight = await this.$getComponentsDom('#tab');
				this.topHeight = topHeight.bottom + 'px'
				this.swiperHeight =  (that.systemInfo.windowHeight - topHeight.bottom) - 10 + 'px'
			},
			/**
			 * 返回上一级页面
			 */
			toBack() {
				uni.navigateBack({
					delta: 1
				})
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
				let {
					current
				} = e.target;
				this.tabIndex = current;
			}
		}
	}
</script>

<style lang="scss">
	.page {
		height: 100vh;
		background-color: #F2F2F2;
	}

	.high-zindex {
		position: relative;
		z-index: 102;
	}

	.con-container {
		height: calc(100% - var(--status-bar-height) - 45px);
		overflow: auto;
		width: 100%;
		/deep/ .mescroll-uni-content{
			background-color: #F2F2F2;
		}
	}
	// swpier
	.swiper-box{
		height: calc(100% - 45px);
		margin-top: 10px;
	}
</style>

<template>
	<view class="page">
		<view id="pageHeader" class="page-header">
			<view class="header">
				<uni-nav-bar title="" backgroundColor="rgba(0,0,0,0)" left-icon="back" color="#fff" @clickLeft="toBack"></uni-nav-bar>
				<view class="header-tab flex a-center j-center">
					<view class="quota-tab flex a-center j-center flex-column">
						<view class="quota-title">信用额度</view>
						<view class="quota-credit">{{$filtersNum(whiteBarInfo.lineCredit || 0)}}</view>
					</view>
					<view class="header-money flex a-center j-center flex-column">
						<view class="available-title">可用额度</view>
						<view class="available-credit">{{$filtersNum(whiteBarInfo.currentAmount || 0)}}</view>
					</view>
					<view class="quota-tab flex a-center j-center flex-column">
						<view class="quota-title">待还额度</view>
						<view class="quota-credit">{{$filtersNum(whiteBarInfo.debtAmount || 0)}}</view>
					</view>
				</view>
			</view>
			<view class="tab flex a-center j-center">
				<v-tabs 
					v-model="tabIndex" 
					:tabs="tabs" 
					:scroll="false" 
					:lineScale="0.2" 
					field="name"
					activeColor="#ed6d00" 
					lineColor="#ed6d00"
				    height="88rpx" 
					fontSize="32rpx" 
					lineHeight="4rpx" 
					@change="changeTab"></v-tabs>
			</view>
		</view>
		<swiper
			:style="`height:${swiperHeight}`"
			:current="tabIndex" 
			duration="300" 
			@change="swiperChange">
			<swiper-item 
				v-for="(item,index) in tabs" 
				:key="index"
				class="swiper-item">
				<quota-item
					ref="mescrollItem" 
					:i="index" 
					:height='topHeight'
					:index="tabIndex" 
					:tabs="tabs"
					:statusKey="item.status"
					></quota-item>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import vTabs from "@/components/v-tabs/v-tabs.vue";
	import quotaItem from './quota-item'
	export default {
		name: 'rebate',
		components: {
			vTabs,
			quotaItem
		},
		data() {
			return {
				systemInfo:uni.getSystemInfoSync(),
				// tabs
				tabs: [
					{name:"消费记录",status:1},
					{name:"还款记录",status:2},
				],
				// tabs下标
				tabIndex: 0 ,
				swiperHeight:'100%',
				topHeight:'100%',
			}
		},
		computed: {
			...mapState({
				// 白条
				whiteBarInfo: state => state.login.whiteBarInfo,
			}),
		},
		onLoad() {
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
				const topHeight = await this.$getComponentsDom('#pageHeader');
				this.topHeight = topHeight.bottom
				this.swiperHeight =  (that.systemInfo.windowHeight - topHeight.bottom) + 'px'
				console.log(this.swiperHeight,'this.swiperHeight')
			},
			/**
			 * 返回上一级页面
			 */
			toBack(){
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
				let { current } = e.target;
				this.tabIndex = current;
			},
		}
	}
</script>

<style lang="scss">
	.page {
		background-color: #F2F2F2;
	}
	.page-header{
		background-color: #F2F2F2;
	}
	.header {
		width: 100%;
		height: 130px;
		background: url('../../../../static/image/my/wallet/fanli-bg.png') no-repeat center;
		background-size:cover;
		/deep/ .uni-navbar--border{
			border: none;
			background: none !important;
		}
		/deep/ .uni-navbar__header{
			background: none !important;
		}
		.header-tab{
			width: 100%;
			height: calc(130px - var(--status-bar-height) - 45px);
			color: #fff;
			font-size: 20px;
			margin-top: -6px;
			.quota-tab,.header-money{
				width: calc((100% - 40px) / 3);
				> view{
					margin-bottom: 3px;
				}
			}
			.quota-tab{
				font-size: 15px;
				.quota-credit{
					font-size: 18px;
				}
			}
		}
	}
	.tab{
		width: 100%;
		height: 50px;
		color: #1C1C1C;
		background-color: #fff;
		font-size: 15px;
		border-bottom: 1px solid #EAEAEA;
	}
	.test{
		width: calc(100% - 20px);
		height: 30px;
		color: #1C1C1C;
		font-size: 13px;
		background-color: #EAEAEA;
		border: 1px solid #CCCCCC;
		border-radius: 3px;
		margin: 15px 10px;
	}
</style>

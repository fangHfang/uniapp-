<template>
	<view class="page">
		<uni-nav-bar title="功能更新" left-icon="back" backgroundColor="#ed6d00" color="#fff" @clickLeft="toBack"></uni-nav-bar>
		<view class="function-list">
			<view v-for="(item,index) in functionList" :key="index" class="item-function flex a-center j-space-between" @click="toDetail(item.id)">
				<view class="function-left">
					<view class="function-name">{{item.name}}</view>
					<view class="function-time">{{item.time}}</view>
				</view>
				<icon class="iconfont right" type=""></icon>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'updateList',
		components: {},
		data() {
			return {
				functionList:[{
					id:1,
					name:'正新轮胎云V3.02主要更新内容',
					time:'2020-11-11'
				},{
					id:2,
					name:'正新轮胎云V1.02主要更新内容',
					time:'2020-10-11'
				}]
			}
		},
		onLoad() {},
		methods: {
			/**
			 * 返回上一级页面
			 */
			toBack(){
				uni.navigateBack({
					delta: 1
				})
			},
			/**
			 * 查看更新详情
			 */
			toDetail(id){
				uni.navigateTo({
					url:'../update-detail/updateDetail?id=' + 'id'
				})
			}
		}
	}
</script>

<style lang="scss">
	.page{
		height: 100vh;
		background-color: #F2F2F2;
		.item-function{
			height: 80px;
			padding: 0 10px;
			background-color: #fff;
			border-bottom: 1rpx solid #CCCCCC;
			.function-left{
				.function-name{
					color: #1C1C1C;
					font-size: 13px;
					font-weight: 600;
				}
				.function-time{
					color: #666666;
					font-size: 11px;
					margin-top: 8px;
				}
			}
			.iconfont{
				color: #1C1C1C;
				font-size: 9px;
				opacity: 0.62;
			}
		}
	}
</style>

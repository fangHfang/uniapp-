<template>
	<view class="page" :style="`height:${systemInfo.windowHeight}px`">
		<uni-nav-bar title="门店营销大数据" left-icon="back" backgroundColor="#ed6d00" color="#fff" @clickLeft="toBack"></uni-nav-bar>
		<view class="function-content">
			<view class="content-title flex a-center j-center">经营分析</view>
			<view class="feedback">
				<view class="content-title">店检数据</view>
				<view class="flex a-center j-space-between">
					<view class="target flex a-center j-center flex-column">
						<view class="flex a-center j-center flex-column mgb5">
							<view class="">
								{{store.effectiveNum}}
							</view>
							<view class="inspect">
								有效项目数量
							</view>
						</view>
						<view class="flex a-center j-center flex-column">
							<view class="">
								{{store.completedNum}}
							</view>
							<view class="inspect">
								已完成店检数量
							</view>
						</view>
					</view>
					<view class="target flex a-center j-center flex-column">
						<view class="flex a-center j-center flex-column mgb5">
							<view class="">
								{{store.incompleteProjectNum}}
							</view>
							<view class="inspect">
								未完成项目数量
							</view>
						</view>
						<view class="flex a-center j-center flex-column">
							<view class="">
								{{store.incompleteStoreNum}}
							</view>
							<view class="inspect">
								未完成店检数量
							</view>
						</view>
					</view>
					<view class="target flex a-center j-center flex-column">
						<view class="flex a-center j-center flex-column mgb5">
							<view class="">
								{{store.project}} / {{store.totalProject}}
							</view>
							<view class="inspect">
								项目完成率
							</view>
						</view>
						<view class="flex a-center j-center flex-column">
							<view class="">
								{{store.inspect}} / {{store.totalInspect}}
							</view>
							<view class="inspect">
								店检完成率
							</view>
						</view>
					</view>
					<view class="target-icon flex a-center j-center">
						<icon class="iconfont right" type=""></icon>
					</view>
				</view>
			</view>
			<view class="feedback">
				<view class="content-title">签约数据</view>
				<view class="flex a-center j-space-between">
					<view class="target flex a-center j-center flex-column">
						<view class="flex a-center j-center flex-column mgb5">
							<view class="">
								{{contract.effectiveNum}}
							</view>
							<view class="inspect">
								有效项目数量
							</view>
						</view>
						<view class="flex a-center j-center flex-column">
							<view class="">
								{{contract.completedNum}}
							</view>
							<view class="inspect">
								已完成店检数量
							</view>
						</view>
					</view>
					<view class="target flex a-center j-center flex-column">
						<view class="flex a-center j-center flex-column mgb5">
							<view class="">
								{{contract.incompleteProjectNum}}
							</view>
							<view class="inspect">
								未完成项目数量
							</view>
						</view>
						<view class="flex a-center j-center flex-column">
							<view class="">
								{{contract.incompleteStoreNum}}
							</view>
							<view class="inspect">
								未完成店检数量
							</view>
						</view>
					</view>
					<view class="target flex a-center j-center flex-column">
						<view class="flex a-center j-center flex-column mgb5">
							<view class="">
								{{contract.warehous}} / {{contract.totalWarehous}}
							</view>
							<view class="inspect">
								入库完成率
							</view>
						</view>
						<view class="flex a-center j-center flex-column">
							<view class="">
								{{contract.contract}} / {{contract.totalContract}}
							</view>
							<view class="inspect">
								签约完成率
							</view>
						</view>
					</view>
					<view class="target-icon flex a-center j-center">
						<icon class="iconfont right" type=""></icon>
					</view>
				</view>
			</view>
			<view class="feedback flex a-center j-space-between">
				<text>累计安心订单{{totalNum}}单，当月安心订单{{monthNum}}单</text>
				<button class="btn flex a-center j-center" type="default">去查看</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'market',
		components: {},
		data() {
			return {
				systemInfo: uni.getSystemInfoSync(),
				store:{
					effectiveNum:'10',
					completedNum:'10',
					incompleteProjectNum:'60',
					incompleteStoreNum:'50',
					project:'10',
					totalProject:'80',
					inspect:'10',
					totalInspect:'60'
				},
				contract:{
					effectiveNum:'10',
					completedNum:'10',
					incompleteProjectNum:'60',
					incompleteStoreNum:'50',
					warehous:'10',
					totalWarehous:'80',
					contract:'10',
					totalContract:'60'
				},
				totalNum:'xx',
				monthNum:'xx'
			}
		},
		computed:{
		},
		onLoad(option) {
		},
		methods: {
			/**
			 * 返回上一级页面
			 */
			toBack(){
				uni.navigateBack({
					delta: 1
				})
			},
		}
	}
</script>

<style lang="scss">
	.page{
		background-color: #F2F2F2;
		.function-content{
			color: #1C1C1C;
			font-size: 13px;
			padding: 10px;
			overflow: hidden;
			.content-title{
				color: #252527;
				font-size: 16px;
				font-weight: bold;
				padding: 15px 0;
				padding-top: 5px;
			}
			.feedback{
				background: #fff;
				padding: 10px;
				border-radius: 3px;
				color: #252527;
				font-size: 12px;
				font-weight: bold;
				margin-bottom: 10px;
				box-shadow: 0px 3px 15px 0px rgba(0, 0, 0, 0.05);
				.content-title{
					padding: 0;
					font-size: 14px;
					padding-top: 5px;
				}
				.target{
					width: calc((100% - 30px) / 3);
					font-size: 12px;
					padding: 10px 0;
				}
				.target-icon{
					width: 20px;
					height: 95px;
				}
			}
		}
		.btn{
			height: 30px;
			margin: 0;
			color: #fff;
			font-size: 14px;
			font-weight: 500;
			background: #ed6d00;
			border-radius: 5px;
		}
	}
	.mgb5{
		margin-bottom: 5px;
	}
</style>

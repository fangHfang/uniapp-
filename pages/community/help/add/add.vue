<template>
	<view class="page" :style="`height:${systemInfo.windowHeight}px`">
		<uni-nav-bar title="反馈" left-icon="back" backgroundColor="#ed6d00" color="#fff" @clickLeft="toBack"></uni-nav-bar>
		<view class="function-content">
			<view class="content-title">反馈内容</view>
			<view class="feedback">
				<textarea class="feedback-content" v-model="feedbackContent" auto-height maxlength="-1" value="" placeholder="请输入反馈意见" />
				</view>
		</view>
		<view class="page-bottom" :style="`height:${safeArea.bottom + 70}px`" @click="confirm">
			<text class="buttom-btn" :style="`margin-bottom:${safeArea.bottom}px`">提交反馈</text>
		</view>
	</view>
</template>

<script>
	import community from '@/api/community/community.js'
	export default {
		name: 'helpCentre',
		components: {},
		data() {
			return {
				systemInfo: uni.getSystemInfoSync(),
				feedbackContent:'',
			}
		},
		computed:{
			//安全区域
			safeArea(){
				return this.systemInfo.safeAreaInsets
			}
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

			/**
			 * 提交反馈
			 */
			confirm(){
				if(!this.feedbackContent){
					uni.showToast({
						title:'请输入反馈内容',
						icon:'none'
					})
					return 
				}
				let postData = {
					content:this.feedbackContent
				}
				community.feedbackCreate(postData).then((res) => {
					if (res.code === 200) {
						uni.showToast({
							icon: "success",
							title: '提交成功'
						})						
						setTimeout(() => {
							//返回并刷新
							let pages = getCurrentPages();
							let beforePage = pages[pages.length - 2]
							uni.navigateBack({
								delta:1,
								success: function() {
									// #ifdef APP-PLUS
									beforePage.$vm.listRemoteDataByPage()
									// #endif
									// #ifndef APP-PLUS
									beforePage.listRemoteDataByPage()
									// #endif
								}
							});
						}, 1000)
					} else {
						uni.showToast({
							icon: "none",
							title: res.msg
						})
					}
				}).catch((err) => {
					uni.showToast({
						icon: "none",
						title: err.msg
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	.page{
		background-color: #F2F2F2;
		.function-content{
			color: #1C1C1C;
			font-size: 13px;
			padding: 0 10px;
			overflow: hidden;
			.content-title{
				color: #252527;
				padding: 15px 0;
				font-weight: bold;
			}
			.feedback,.opinion-list{
				background: #fff;
				padding: 15px 10px;
				margin-bottom: 10px;
				border-radius: 3px;
				box-shadow: 0px 3px 15px 0px rgba(0, 0, 0, 0.05);
				.feedback-content{
					width: calc(100% - 2px - 26px);
					min-height: 200px;
					padding: 13px;
					color: #252527;
					font-size: 13px;
					background: #F2F2F2;
					border: 1px solid #E5E5E5;
					border-radius: 3px;
				}
			}
			.opinion-list{
				padding:0;
				.item-opinion{
					height: 49px;
					padding: 0 10px;
					color: #252527;
					display: flex;
					align-items: center;
					border-bottom: 1px solid rgba(204,204,204,0.5);
				}
				.item-opinion:nth-last-of-type(1){
					border: none;
				}
				.active{
					background: rgba(253,80,34,0.2);
				}
			}
		}
	}
	.page-bottom{
		background-color: #fff;
		position:fixed;
		bottom: 0;
		left:0;
		right:0;
		padding:0 10px;
		border-top: 1rpx solid rgba(182,182,182,.5);
	}
	.buttom-btn{
		height:40px;
		line-height: 40px;
		text-align: center;
		border-radius:20px;
		background-color: $uni-color-primary;
		color:#fff;
		position:absolute;
		top:15px;
		left:10px;
		right:10px;
		font-size: $uni-font-size-base;
		font-weight: bold;
	}
</style>

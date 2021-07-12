<template>
	<view class="no-data-box flex a-center j-center flex-column" :style="`height:${height}`">
		<image  class="no-data-img" :src="imgSrc" mode="heightFix"></image>
		<text class="text" >{{title}}</text>
		<button v-if="buttonText" class="button" @click="click">{{buttonText}}</button>
	</view>
</template>

<script>
	export default {
		name: 'NoData',
		components: {
		},
		props:{
			height:{
				type:String,
				default:()=>'100vh'
			},
			title:{
				type:String,
				default:()=>'暂无信息'
			},
			imgSrc:{
				type: String,
				default:()=>'../../../static/image/noData/n1.png'
			},
			buttonText:{
				type:String,
				default:()=>'返回'
			},
			link:{
				type:String,
				default:()=>''
			},
		},
		data() {
			return {
				
			}
		},
		computed:{
			
		},
		mounted() {
		},
		methods: {
			click(){
				if(this.link){
					uni.navigateTo({
						url:this.link
					})
					return
				}
				uni.navigateBack({
					delta:1
				})
			}
		}
	}
</script>

<style lang="scss">
	.no-data-box{
		width:100%;
		height:100%;
		.no-data-img{
			width:40%;
			margin-top:100rpx;
			margin-bottom:50rpx;
		}
		.text{
			font-size:32rpx;
			height:80rpx;
			color:$uni-color-primary;
		}
		.button{
			color:$uni-color-primary;
			border-color:$uni-color-primary;
			border-style: solid;
			border-width: 1rpx;
			padding:4rpx 66rpx;
			font-size:26rpx;
			background-color:rgba(255,255,255,0);
		}
	}
</style>

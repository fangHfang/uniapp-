<template>
	<!-- <uni-popup ref="dialogPopup" type="dialog" :mask-click="false">
		<view class="update-box">
			<view class="update-title">版本更新</view>
			<view class="line"></view>
			<view class="version-box">
				<view>最新版本：{{version.updateNum}}</view>
				<view>当前版本：{{version.editionNo}}</view>
			</view>
			<view class="force-update-btn" v-if="version.forceUpdate == '1'">
				<view @click="updateVersion">立即更新</view>
			</view>
			<view class="update-btn" v-else>
				<view @click="close">暂不更新</view>
				<view @click="updateVersion">现在更新</view>
			</view>
		</view>
	</uni-popup>	 -->
	<view></view>
</template>

<script>
	import {mapState} from 'vuex'
	import system from '@/api/system/system.js'
	import permission from '@/common/utils/permission.js'
	import appUpdate from '@/components/appUpdate/index.js'
	export default {
		name: 'versionUpdate',
		components: {},
		data() {
		  return {
			  // 版本更新信息
			  version:{
				  downloadUrl:"",
				  updateNum:"",
				  forceUpdate:"",
				  startImgUrl:"",
				  updateContent:"",
				  editionNo:"",
				  updateType:"",
			  }
		  }
		},
		computed: {
			...mapState({
				// 积分
				noUpDateVersion: state => state.app.noUpDateVersion,
			})
		},
		methods: {
			/**
			 * 检查版本更新
			 */
			checkUpdate(){
				let postData = {
					// 0-总部 1-经销商Android-APP 2-经销商IOS-APP 7-门店Android-APP；9-门店IOS-APP
					updateType:permission.isIOS ? 9 : 7
				}
				let _this = this
				system.getAppVersion(postData).then((res)=>{
					const { editionNo,updateNum,forceUpdate,downloadUrl } = res.data
					_this.version = res.data
					// #ifdef APP-PLUS
					_this.version.editionNo = plus.runtime.version
					let data = {
						versionCode: updateNum,
						versionName: updateNum,
						versionInfo: '修复漏洞',
						forceUpdate: forceUpdate == '1',
						downloadUrl: downloadUrl
					}
					if(plus.runtime.version !== updateNum){
						if(forceUpdate == '1'){
							appUpdate(data)
						}else{
							console.log(this.noUpDateVersion,'noVersion')
							if(!this.noUpDateVersion){
								appUpdate(data)
							}
						}
					}
					// #endif
				}).catch((err)=>{
					console.log(err)
				})
			},
			
			
			/**
			 * 版本更新
			 */
			updateVersion(){
				// #ifdef APP-PLUS
				// if (plus.os.name=="Android") { 
				// 	uni.showToast({
				// 		title: 'App开始进行版本更新...',
				// 		duration: 1500,
				// 		icon: 'none'
				// 	});
				// 	console.log(this.version.downloadUrl,'this.version.downloadUrl')
				// 	uni.downloadFile({
				// 		url: this.version.downloadUrl,
				// 		success: (downloadResult) => {
				// 			console.log(downloadResult,'downloadResult')
				// 			if (downloadResult.statusCode === 200) {
				// 				plus.runtime.install(downloadResult.tempFilePath, {
				// 				   force: false
				// 				}, function() {
				// 				   console.log('App安装成功！');
				// 				   plus.runtime.restart();
				// 				}, function(e) {
				// 				   console.error('App安装失败！');
				// 				 });
				// 			}
				// 		},
				// 	})
				// }else{
					plus.runtime.openURL(this.version.downloadUrl, function(res) {
						console.log(res);  
					}); 
				// }
				// #endif
			},
			/**
			 * 关闭
			 */
			close(){
				this.$store.dispatch('app/setNoUpDateVersion',true)
				this.$refs.dialogPopup.close()
			}
		},
	}
</script>

<style lang="scss">
	.update-box{
		width: 90vw;
		background-color: #fff;
		margin-bottom: 30%;
		border-radius:8rpx;
		overflow: hidden;
		.update-title{
			font-size: 36rpx;
			text-align: center;
			padding: 28rpx 0;
			color: #333;
		}
		.line{
			background-color: $uni-color-primary;
			height: 2rpx;
			width: 100%;
		}
		.version-box{
			padding: 40rpx;
			>view{
				color: #999;
			}
			>view:nth-child(2){
				margin-top: 20rpx;
			}
		}
		.update-btn{
			display: flex;
			border-top: 2rpx solid #e4e4e4;
			>view{
				width: 50%;
				text-align: center;
				padding: 26rpx 0;
				font-size: 30rpx;
			}
			>view:nth-child(1){
				color: $uni-color-primary;
				background-color: $uni-bg-color;
			}
			>view:nth-child(2){
				color: $uni-bg-color;
				background-color: $uni-color-primary;
			}
		}
		.force-update-btn{
			border-top: 2rpx solid #e4e4e4;
			>view{
				width: 100%;
				text-align: center;
				padding: 26rpx 0;
				font-size: 30rpx;
				color: $uni-color-primary;
				background-color: $uni-bg-color;
			}
		}
	}
</style>

<template>
	<view class="page">
		<uni-nav-bar 
			class="nav-bar" 
			title="限时秒杀" 
			backgroundColor="#ed6d00" 
			color="#fff"
			left-icon="back"
			@clickLeft="navBack"
		></uni-nav-bar>
		<view class="top-tabs">
			<!-- 填充背景 -->
			<!-- <view class="full-color-bg"></view> -->
			<!-- 背景半圆 -->
			<view class="background-semicircle"></view>
			<v-double-tabs
				class="double-tabs"
				v-model="tabIndex" 
				:tabs="tabs" 
				:scroll="true" 
				:lineScale="0.8"
				lineColor="#FFFFFF"
				height="88rpx"
				fontSize="32rpx"
				lineHeight="5rpx"
				@change="changeTab"></v-double-tabs>
		</view>
		<view class="carousel">
			<swiper
				class="swiper-box"
				:current="tabIndex" 
				duration="300" 
				@change="swiperChange">
			  <swiper-item 
					v-for="(item,index) in tabs" 
					:key="index"
					class="swiper-item ">
					<seckill-detail-item
						ref="mescrollItem" 
						:i="index" 
						:index="tabIndex" 
						:name="name"
						:tabItem="item"
						:itemCountDisplayType="promotion.itemCountDisplayType"
						:placardsUrl="promotion.placardsUrl"
						:dealerRelation="promotion.dealerRelation"
						:isDiscountOnly="isDiscountOnly"
						@open="openRule"
						@formatData="formatData"
						></seckill-detail-item>
			  </swiper-item>
			</swiper>
		</view>
		<uni-popup ref="popup" type="dialog" :maskClick="false">
			<view class="modal-box">
				<view class="rule-box">
					<view class="rule-title">
						<text>活动规则</text>
					</view>
					<view class="rule-content">
						<text v-html="promotion.promotionDesc"></text>
					</view>
				</view>
				<!-- 关闭按钮 -->
				<view class="dialog-close-button" @click="close()">
					<icon class="iconfont cancel" style='color:#ffffff;font-size: 44rpx;' type=""></icon>	
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="overPopup" type="dialog" :mask-click="false">
			<view class="modal-over-box">
				<view class="modal-content">
					<text>该活动商品已下架</text>
				</view>
				<view class="modal-button">
					<view class="confirm-button" @click="navBack()">
						<text>确定</text>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import seckillDetailItem from './seckill-detail-item.vue'
	import seckill from '@/api/deadline/seckill.js'
	import permision from "@/common/utils/permission.js"
	export default {
		name: 'mall',
		components: {
			seckillDetailItem
		},
		data() {
			return {
				// tabs
				tabs: [],
				// tabs下标
				tabIndex: 0 ,
				id:0,
				// 活动名称
				name:"",
				// 总的数据
				promotion:{},
				isDiscountOnly:false
			}
		},
		onLoad(e){
			let {promotionNo,name} = e
			this.name = name
			// 查询活动列表详情
			this.getDeadlineSeckillDetail({promotionNo})
		},
		mounted() {
		},
		methods: {
			/**
			 * 查询活动列表详情
			 */
			getDeadlineSeckillDetail(data){
				let payload = this.$jsonFormat(data)
				uni.showLoading({
					title: '加载中'
				});
				seckill.getDeadlineDetail(payload).then((res)=>{
					const {data} = res
					this.promotion = data
					this.isDiscountOnly = data.isDiscountOnly
					this.formatData()
					uni.hideLoading();
				}).catch((err)=>{
					uni.hideLoading();
					this.$refs.overPopup.open()
					console.log(err)
				})
			},
			/**
			 * 
			 */
			navTo(){
				
			},
			
			/**
			 * 返回上一页
			 */
			navBack(){
				uni.navigateBack({
				    delta: 1
				});
			},
			/**
			 * tab切换事件
			 */
			changeTab(index) {
				this.tabIndex = index;
			},
			/**
			 * 切换swiper
			 */
			swiperChange(e) {
				this.tabIndex = e.detail.current
			},

			openRule(){
			  // 通过组件定义的ref调用uni-方法
			  this.$refs.popup.open()
			},
			close(){
				this.$refs.popup.close()
			},
			
			/**
			 * 处理数据
			 */
			formatData(){
				// 传入的集合是所有商品,只取一个批次下的一个商品
				let batchNoGroup = []
				this.promotion.seckills.map((item,index)=>{
					if(index === 0){
						batchNoGroup.push(item)
					}else{
						let type = true
						batchNoGroup.map((group)=>{
							if(group.batchNo === item.batchNo){
								type = false
							}
						})
						if(type){
							batchNoGroup.push(item)
						}
					}
				})
				this.tabs = batchNoGroup.filter((item)=>{ 
					// 此处过滤已完成的场次
					let endTime = permision.conversionDate(item.endTime)
					return new Date().getTime() < endTime.getTime()
				}).map((item)=>{
					let startTime = permision.conversionDate(item.startTime)
					let status = '即将开始'
					if(startTime.getTime() < new Date().getTime()){
						status = '进行中'
					}
					return {
						batchNo:item.batchNo,
						promotionNo:item.promotionNo,
						time:item.startTime.substring(10,19),
						endTime:item.endTime.substring(10,19),
						status,
						start:item.startTime,
						end:item.endTime
					}
				})
				if(this.tabs.length === 0){
					this.$refs.overPopup.open()
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page{
		background-color: #F9F9F9;
		height: 100vh;
	}

	// 搜索栏
	.mescroll-uni-box{
		height: calc(100vh - 100rpx - 88rpx - 2rpx - var(--status-bar-height));
	}
	.top-tabs{
		position: relative;
	}
	// 背景-颜色填充
	.full-color-bg{
		width: 100%;
		height: 80rpx;
		background-color: #ed6d00;
	}
	// 背景-半圆
	.background-semicircle{
		width: 750rpx;
		height: 195rpx;
		background-color: #ed6d00;
		border-radius: 20%;
		position: relative;
		bottom: 52rpx;
		z-index: 0;
	}
	.double-tabs{
		position: absolute;
		top:0
	}
	.nav-bar{
		position: relative;
		z-index: 1;
	}
	/deep/.uni-navbar--border{
		border-bottom-width:0;
	}
	
	// 底部产品列表
	
	.carousel {
		height: calc(100vh - 88rpx - 195rpx + 90rpx - var(--status-bar-height));
		position: relative;
		background: transparent;
		bottom: 90rpx;
		.swiper-wrap,
		.swiper-box {
			height: 100%;
			position: relative;
		}
	
		.image-wrapper {
			width: 100%;
			height: 100%;
		}
	
		.swiper-item {
			display: flex;
			justify-content: center;
			align-content: center;
			background: transparent;
			overflow: hidden;
	
			.img {
				width: 100%;
				height: 100%;
			}
		}
	}
	.modal-box{
		width: calc(100vw - 120rpx);
		height: calc((100vw - 120rpx) * 1.03);
		background-image: url(../../../../static/image/deadline/seckill-rule-dialog.png);
		background-size: 100%;
		margin-bottom: 300rpx;
		>image{
			width: 100%;
			height: 100%;
		}
		.rule-box{
			.rule-title{
				width: 100%;
				text-align: center;
				padding-top: 38%;
				>text{
					font-size: 50rpx;
					font-family: HYYaKuHeiW;
					font-weight: bold;
					font-style: italic;
					color: #FEFEFE;
					line-height: 12rpx;
				}
			}
			.rule-content{
				display: flex;
				flex-direction: column;
				>text{
					font-size: 22rpx;
					color: #FEFEFE;
					line-height: 35rpx;
					width: calc(100% - 80rpx);
					margin: 30rpx auto 0;
				}
			}
		}
		.dialog-close-button{
			position: absolute;
			bottom: 130rpx;
			left: calc(50% - 22rpx - 30rpx);
			padding: 30rpx;
		}
	}
	
	.modal-over-box{
		width: calc(70vw - 100rpx);
		height: calc(44vw - 150rpx);
		background-color: #FFFFFF;
		border-radius: 20rpx;
		padding: 50rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		>icon{
			position: absolute;
			right: 20rpx;
			top:20rpx
		}
		.modal-content{
			display: flex;
			flex-direction: column;
			>text{
				text-align: center;
				line-height: 48rpx;
				font-size: 36rpx;
				font-weight: 400;
				color: #1C1C1C;
			}
		}
		.modal-button{
			display: flex;
			justify-content: center;
			.cancel-button{
				border: 2rpx solid #ed6d00;
				border-radius: 40rpx;
				padding: 11rpx 100rpx;
				>text{
					font-size: 38rpx;
					font-family: PingFang SC;
					font-weight: bold;
					color: #ed6d00;
				}
			}
			.confirm-button{
				background-color: #ed6d00;
				border-radius: 40rpx;
				padding: 11rpx 100rpx;
				>text{
					font-size: 28rpx;
					font-family: PingFang SC;
					color: #FFFFFF;
				}
			}
		}
	}
</style>

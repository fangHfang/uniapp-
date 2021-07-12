<template>
	<view class="page" :style="`height:${systemInfo.windowHeight}px`">
		<uni-nav-bar 
			title="新增退货" 
			left-icon="back" 
			rightText='保存'
			backgroundColor="#ed6d00" 
			color="#fff" 
			@clickLeft="toBack" 
			@clickRight="save"></uni-nav-bar>
		<view class="function-content">
			<view class="content-title">基本信息</view>
			<view class="feedback" style="padding-top: 0;">
				<view class="info">
					<view class="info-title flex a-center">退货方式</view>
					<input class="feedback-content feedback-title" :class="[returnMode !== '' ? 'bg-fff':'']" v-model="returnMode" type="text" value="" placeholder="请输入" disabled @blur="blurInp(returnMode,'returnMode')" />
				</view>
				<view class="info">
					<view class="info-title flex a-center">退货人员</view>
					<input class="feedback-content feedback-title" :class="[storeList[storeIndex].customerName !== '' ? 'bg-fff':'']" v-model="storeList[storeIndex].customerName" type="text" value="" placeholder="请输入" disabled/>
				</view>
				<view class="info">
					<view class="info-title flex a-center">退货时间</view>
					<input class="feedback-content feedback-title" :class="[returnTime !== '' ? 'bg-fff':'']" v-model="returnTime" placeholder="请输入" disabled/>
				</view>
			</view>
			<view class="flex a-center j-space-between">
				<view class="content-title">退货明细<text class="tag">（请扫码新增退货商品明细）</text></view>
				<view class="tag">向左滑动删除</view>
			</view>
			<uni-swipe-action :options="options">
				<uni-swipe-action-item
					 v-for="(item,index) in refundList"
					 :key="'refundList-' + index"
					:right-options="options"  @click="bindClick(index)">
					<view class="feedback" style="width: 100%;">
						<view class="flex">
							<view class="item-title flex j-space-between" style="width: 18%;">订<text>单</text><text>号：</text></view>
							<view>{{item.orderNo == '0' ? '-' : item.orderNo}}</view>
						</view>
						<view class="mt10 flex">
							<view class="item-title">花纹规格：</view>
							<view>{{item.itemSpecDetail}}</view>
						</view>
						<view class="mt10 flex">
							<view class="item-title flex j-space-between">条<text class="space">码：</text></view>
							<view>{{item.itemBarCode}}</view>
						</view>
						<view class="mt10 flex">
							<view class="item-title flex j-space-between">金<text class="space">额：</text></view>
							<view>￥{{item.payAmount}}</view>
						</view>
					</view>
				</uni-swipe-action-item>
			</uni-swipe-action>
			
			<view v-if="refundList.length === 0" class="no-detail">暂无退货信息</view>
			<view class="content-title">备注</view>
			<view class="feedback">
				<textarea v-if="showRemarks" class="feedback-content" :class="[remarks !== '' ? 'bg-fff':'']" v-model="remarks" value="" placeholder="请输入备注" @blur="blurInp" />
			</view>
		</view>
		<view class="page-bottom" :style="`height:${safeArea.bottom + 70}px`" @click="confirm">
			<view class="buttom-btn" :style="`margin-bottom:${safeArea.bottom}px`"><icon class="iconfont saoma" type=""></icon>扫码添加退货商品</view>
		</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	import {dateFormat} from '@/common/utils/DateUtil'
	import refund from '@/api/order/refund.js'
	export default {
		name: 'returnAdd',
		components: {},
		data() {
			return {
				systemInfo: uni.getSystemInfoSync(),
				returnMode:'扫码退货',
				consignee:'',
				returnTime:dateFormat('yyyy-MM-dd HH:mm:ss',new Date()),
				remarks:'',
				isScan:false,
				options:[{
					text: '删除',
					style: {
						backgroundColor: '#FF3A31'
					}
				}],
				// 时间定时器
				setTime:"",
				showRemarks:true
			}
		},
		computed:{
			//安全区域
			safeArea(){
				return this.systemInfo.safeAreaInsets
			},
			...mapState({
				// 退货集合
				refundList:state => state.work.returnCollection,
				// 门店集合
				storeList:state => state.login.storeList,
				// 门店选中下标
				storeIndex:state => state.login.storeIndex,
			}),
		},
		destroyed(){
			this.$store.commit('work/setReturnCollection',[])
			this.setTime && clearInterval(this.setTime)
		},
		onLoad(option) {
			// 倒计时
			this.setTime = setInterval(()=>{
				this.returnTime = dateFormat('yyyy-MM-dd HH:mm:ss',new Date())
			},1000)
		},
		methods: {
			setRemarkShake(){
				this.showRemarks=false
				setTimeout(()=>{
					this.showRemarks=true
				},20)
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
			 * 输入框失焦时触发
			 * @param {Object} e 输入框输入的内容
			 * @param {Object} title
			 */
			blurInp(e,title){
				if(title === 'returnMode'){
					this.returnMode = e
				}else if(title === 'consignee'){
					this.consignee = e
				}else{
					this.remarks = e.detail.value
				}
			},
			/**
			 * 选择时间
			 */
			bindDateChange(e) {
				this.returnTime = e
			},
			/**
			 * 删除
			 * @param {Object} e
			 */
			bindClick(index){
				this.refundList.splice(index,1)
				this.$store.commit('work/setReturnCollection',this.refundList)
			},
			/**
			 * 提交反馈
			 */
			confirm(){
				const obj = {
					name:'扫码退货',
					dec:'请对条码进行退货',
					api:'',
					// 扫码页 手动输入条码后 要跳转的指定页面
					confirmTo:'/pages/work/return/add',
				}
				uni.navigateTo({
					url:`/pages/work/com/barcode?name=${obj.name}&dec=${obj.dec}&api=${obj.api}&confirmTo=${obj.confirmTo}`
				})
			},

			/**
			 * 保存
			 */
			save(){
				if(this.refundList.length === 0){
					uni.showToast({
						title: '请先扫码',
						icon: 'none'
					});
					return
				}
				uni.showLoading({
					mask: true
				})
				let postData = {
					itemBarCodeList:this.refundList.map((item)=>{return item.itemBarCode}),
					orderRefundMemo:this.remarks
				}
				refund.createRefundOrder(postData).then((res) => {
					uni.showToast({
						title: '新增退货单成功',
						icon: 'success',
						duration: 2000
					});
					this.toBack()
				}).catch((err) => {
					console.log(err,'err')
					uni.showToast({
						title: err.msg,
						icon: 'none'
					});
				}).finally(() => {
					uni.hideLoading()
				})
			}
		}
	}
</script>

<style lang="scss">
	.page{
		background-color: #F2F2F2;
		.function-content{
			height: calc(100vh - 45px - 71px - var(--status-bar-height) - 15px);
			color: #1C1C1C;
			font-size: 13px;
			padding: 15px 10px;
			padding-top: 0;
			overflow-y: auto;
			.content-title{
				color: #252527;
				padding: 15px 0;
				font-weight: bold;
			}
			.tag{
				color: rgba(37,37,39,.5);
				font-size: 12px;
				font-weight: 400;
			}
			.feedback{
				background: #fff;
				padding: 15px 10px;
				border-radius: 3px;
				color: #252527;
				font-size: 12px;
				font-weight: bold;
				box-shadow: 0px 3px 15px 0px rgba(0, 0, 0, 0.05);
				.feedback-content{
					width: calc(100% - 2px - 26px);
					height: 74px;
					padding: 13px;
					color: rgba(37,37,39,.65);
					font-size: 13px;
					background: #F2F2F2;
					border: 1px solid #E5E5E5;
					border-radius: 3px;
					display: flex;
					align-items: center;
				}
				.feedback-title{
					height: 47px;
					padding: 0 13px;
				}
				.info-title{
					height: 50px;
					font-weight: 400;
					font-size: 13px;
				}
				.item-title{
					opacity: 0.8;
					font-weight: 400;
				}
				.space{
					text-indent: 2em;
				}
			}
			.no-detail{
				height: 80px;
				color: rgba(37,37,39,.5);
				font-size: 12px;
				background: #fff;
				display: flex;
				align-items: center;
				justify-content: center;
				box-shadow: 0px 3px 15px 0px rgba(0, 0, 0, 0.05);
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
		.iconfont{
			margin-right: 10rpx;
			font-size: 14px;
		}
	}
	.mt10{
		margin-top: 10px;
	}
	.bg-fff{
		background: #fff !important;
	}
	.uni-datetime-picker{
		/deep/ >view:nth-of-type(1){
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
		}
		/deep/ .uni-datetime-picker-timebox{
			border: none;
			padding: 0;
		}
		/deep/ .uni-datetime-picker-down-arrow{
			display: none;
		}
	}
</style>

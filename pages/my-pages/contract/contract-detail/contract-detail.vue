<template>
	<view class="page">
		<uni-nav-bar title="合同详情" left-icon="back" backgroundColor="#ed6d00" color="#fff" @clickLeft="toBack"></uni-nav-bar>
		<view class="function-content" :class="{
			'pass':contractData.scStoreAppDTO && (contractData.scStoreAppDTO.approvalStatus === 1 || contractData.scStoreAppDTO.approvalStatus === 0),
			'reject':contractData.scStoreAppDTO && contractData.scStoreAppDTO.approvalStatus === 2,
		}">
			<view class="content-title">{{contractData.ruleName}}</view>
			<view class="content">
				<image 
					v-for="(item,index) in contractData.imageList"
					style="width:100%;"
					:key="'imageList-' + index"
					loading-ing-img="oblique-light"  
					:src="item" 
					mode="widthFix"
				></image>
			</view>
		</view>
		<view class="reject-box" v-if="contractData.scStoreAppDTO && contractData.scStoreAppDTO.approvalStatus === 2">
			<view class="title">驳回原因</view>
			<view class="content">
				{{contractData.scStoreAppDTO.rejectReason}}
			</view>
		</view>
		<view v-if="!contractData.scStoreAppDTO" class="function-footer">
			<button type="primary" class="footer-btn" @click="openDialog">确认签订</button>
		</view>
		<view v-if="contractData.scStoreAppDTO && contractData.scStoreAppDTO.approvalStatus === 2" class="function-footer">
			<button type="primary" class="footer-btn" @click="openDialog">重新签订</button>
		</view>
		<uni-popup ref="dialogPopup" type="dialog">
			<!-- 关闭按钮 -->
			<view class="dialog-close-button" @click="$refs.dialogPopup.close()">
				<icon class="iconfont cancel" style='color:#000;font-size: 36rpx;' type=""></icon>	
			</view>
		    <uni-popup-dialog 
				mode="base" 
				title="选择签约等级" 
				:duration="2000" 
				:before-close="true" 
				:showCancel="false"
				confirmText="立即签订"
				@confirm="confirm">
				<template slot="content">
					<view
						v-for="(item, index) in contractData.levelList"
						:key="index"
						class="level-list flex"
					>
						<view class="check-box" :class="contractData.levelIndex === index ? 'selected' : ''" @click="checkChange(index)"></view>
						<view
							class="item flex a-center j-space-between"
						>
							<view>
								<text>入库下限</text>
								<text>{{item.lowerLimit}}</text>
							</view>
							<view>
								<text>入库上限</text>
								<text>{{item.upperLimit}}</text>
							</view>
						</view>
					</view>
				</template>
			</uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import market from '@/api/market/market.js'
	export default {
		name: 'contractDetail',
		components: {},
		data() {
			return {
				// 查询条件
				searchData:{
					// 合同编号
					ruleNo:null,
				},
				title:'XXXXX合同',
				// 数据集合
				contractData:{
					// 标题
					title:"",
					// 内容
					content:"",
					// 签约等级
					levelList:[],
					// 选中签约等级下标
					levelIndex:0,
					// 图片集合
					imageList:[],
					scStoreAppDTO:{}
				},
			}
		},
		onLoad(option) {
			this.searchData.ruleNo = option.ruleNo;
			this.getScStoreDetail()
		},
		methods: {
			/**
			 * 获取门店签约详情
			 */
			getScStoreDetail(){
				let that = this
				let postData = JSON.parse(JSON.stringify(this.searchData))
				let payload = this.$jsonFormat(postData)
				return new Promise((resole,reject)=>{
					market.getScStoreDetail(payload).then(res => {
						that.contractData = {
							...res.data,
							levelIndex:0
						}
						resole()
					}).catch((error) => {
						uni.showToast({
							title:error,
							icon:"none"
						})
						reject(error)
					});
				})
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
			 * 确认签订
			 */
			openDialog(){
				this.$refs.dialogPopup.open();
			},

			/**
			 * 点击取消按钮触发
			 * @param {Object} done
			 */
			close(done){
				done()
			},
			/**
			 * 点击确认按钮触发
			 * @param {Object} done
			 */
			confirm(done){
				let that = this
				const {levelList,levelIndex} = this.contractData
				const {ruleLevelNo,ruleNo} = levelList[levelIndex]
				let postData = {
					ruleLevelNo,
					ruleNo
				}
				let payload = this.$jsonFormat(postData)
				return new Promise((resole,reject)=>{
					market.signScRule(payload).then(res => {
						uni.showToast({
							title:'签约成功',
							icon:"success"
						})
						this.$refs.dialogPopup.close();
						uni.navigateBack({
							delta: 1
						})
						resole()
					}).catch((error) => {
						uni.showToast({
							title:error.msg,
							icon:"none"
						})
						reject(error.msg)
					});
				})
			},
			/**
			 * 切换选中等级下标
			 */
			checkChange(index){
				this.contractData.levelIndex = index
			}
		}
	}
</script>

<style lang="scss">
	.dialog-close-button{
		position: absolute;
		top: -5px;
		right: -5px;
		padding: 30rpx;
	}
	.page{
		height: 100vh;
		background-color: #F2F2F2;
		.function-content{
			height: calc(100vh - var(--status-bar-height) - 45px - 64px - 30px);
			color: #1C1C1C;
			font-size: 13px;
			margin: 12px 10px;
			background-color: #fff;
			overflow: hidden;
			.content-title{
				color: #1C1C1C;
				font-size: 25px;
				padding: 34px 0;
				font-weight: bold;
				text-align: center;
			}
			.content{
				height: calc(100% - 100px - 25px);
				color: #1C1C1C;
				padding: 0 25px;
				overflow-y: auto;
				margin-bottom: 25px;
			}
		}
		// 审核通过
		.pass{
			height: calc(100vh - var(--status-bar-height) - 45px - 30px);
		}
		// 驳回
		.reject{
			height: calc(100vh - var(--status-bar-height) - 45px - 64px - 30px - 130px);
		}
		.reject-box{
			margin: 12px 10px;
			.title{
				font-size: 26rpx;
				font-weight: bold;
				color: #252527;
				margin: 15px 0;
				line-height: 13px;
			}
			.content{
				background: #FFFFFF;
				border-radius: 5rpx;
				height: 60px;
				font-size: 26rpx;
				font-weight: 400;
				color: #252527;
				line-height: 37rpx;
				padding: 30rpx;
			}
		}
		.function-footer{
			width: calc(100% - 20px);
			padding: 12px 10px;
			background-color: #fff;
			position: fixed;
			bottom: 0;
			border-top: 1rpx solid #B6B6B6;
			.footer-btn{
				height: 40px;
				color: #fff;
				font-size: 17px;
				background-color: #ed6d00;
				border: none;
				border-radius: 20px;
			}
		}
	}

	::v-deep .check-box {
		flex: 0 0 24rpx;
		width: 24rpx;
		height: 24rpx;
		border-radius: 50%;
		position: relative;
		border: 1px solid $uni-border-color;

		&.selected {
			border: 1px solid $uni-border-color-active;
		}

		&.selected::after {
			width: 8px;
			height: 8px;
			border-radius: 50%;
			background-color: $uni-border-color-active;
			content: '';
			position: absolute;
			top: 2px;
			left: 2px;
		}
	}
	.level-list{
		width: 100%;
		align-items: center;
		margin-top: 25rpx;
		.check-box{
			margin: 0px 15px 0px 5px;
		}
		.item{
			width: 80%;
			>view{
				>text:nth-child(1){
					font-size: 26rpx;
					font-weight: 500;
					color: #000000;
					line-height: 34rpx;
				}
				>text:nth-child(2){
					margin-left: 28rpx;
					font-size: 26rpx;
					font-family: PingFang SC;
					font-weight: bold;
					color: #ed6d00;
					line-height: 34rpx;
				}
			}
		}
	}
	::v-deep .uni-popup-dialog{
		width: 93vw;
	}
	::v-deep .uni-dialog-content{
		border-top:2rpx solid #CCCCCC;
		border-bottom:2rpx solid #CCCCCC;
		display: block;
	}
	::v-deep .uni-dialog-button-group{
		padding: 25px;
		.uni-dialog-button{
			margin-left: 0px;
		}
	}
	::v-deep .uni-dialog-title{
		padding: 25px 0px;
		>text{
			font-size: 38rpx;
			font-weight: 500;
			color: #1C1C1C;
			line-height: 34rpx;
		}
	}
</style>

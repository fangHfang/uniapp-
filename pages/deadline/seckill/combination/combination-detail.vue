<template>
	<view class="page">
		<uni-nav-bar
			class="nav-bar"
			title="商品组合活动"
			backgroundColor="#ed6d00"
			color="#fff"
			left-icon="back"
			@clickLeft="navBack"
		></uni-nav-bar>
		<view class="carousel">
			<mescroll-uni
				:ref="'mescrollRef'+i"
				@init="mescrollInit"
				:top="pageOptions.mescrollTop"
				:bottom="pageOptions.mescrollBottom"
				safearea
				:up="upOption"
				:down="downOption"
				@down="downCallback"
				@emptyclick="emptyClick">
					<view class="seckill-list">
						<image :src="pageOptions.placardsUrl" mode=""></image>
						<text class="active-rule" @click="openRule()">活动规则</text>
						<view class="active-info-box">
							<view>
								<text>活动时间：</text>
								<text>{{pageOptions.startTime + '-' + pageOptions.endTime}}</text>
							</view>
							<view>{{pageOptions.promotionName}}</view>
						</view>
						<view
							:id="'seckill-item-' + resultIndex + '-' + item.id"
							class="seckill-item-box"
							v-for="(item,resultIndex) in pageData.result"
							:key="'seckill-item-' + resultIndex"
							>
							<uni-swipe-action>
								<uni-swipe-action-item :disabled="item.isForceItem">
									<view
										class="seckill-item one-item"
										:class="{'gray':!item.stock}">
										<view v-if="item.stock" class="check-box" :class="item.isChecked?'selected':''" @click="checkChange(item.isChecked,index)"></view>
										<image class="seckill-image" :src="item.itemImageUrl" alt="">
										<view class="seckill-info">
											<view class="seckill-info-top">
												<text class="seckill-name">{{item.itemName}}</text>
												<view class="seckill-detail">
													<view class="left-detail">
														<text>品牌：{{item.itemBrand}}</text>
														<text>分类：{{item.itemCategoryBackend}}</text>
													</view>
													<view class="right-detail">
														<text>库存：{{item.displayStock}}</text>
														<text>规格：{{item.itemSpec}}</text>
													</view>
												</view>
												<view class="seckill-tag-list">
													<view v-if="item.promotionRuleInfoDTO && item.promotionRuleInfoDTO.rbAmount && item.promotionRuleInfoDTO.rbRuleName">
														<text>可获{{ item.promotionRuleInfoDTO.rbAmount}}新玛元</text>
													</view>
													<view v-if="item.promotionRuleInfoDTO && item.promotionRuleInfoDTO.itAmount && item.promotionRuleInfoDTO.itRuleName">
														<text>可获{{ item.promotionRuleInfoDTO.itAmount}}积分</text>
													</view>
													<view v-if="item.promotionRuleInfoDTO && item.promotionRuleInfoDTO.epInfoDTO && item.promotionRuleInfoDTO.epInfoDTO.length > 0 && item.promotionRuleInfoDTO.epInfoDTO[0].amount && item.promotionRuleInfoDTO.epInfoDTO[0].ruleName">
														<text>可获{{ item.promotionRuleInfoDTO.epInfoDTO[0].amount}}兑换点</text>
													</view>
												</view>
											</view>
											<view class="seckill-info-bottom">
												<view class="seckill-price" v-if="item.promotionDTO && item.promotionDTO.isDiscountOnly">
													<text>已优惠￥{{item.discountAmount}}</text>
												</view>
												<view class="seckill-price" v-else>
													<text>￥{{item.amount}}</text>
													<text>￥{{item.itemAmount}}</text>
												</view>
												<!-- 此处判断个人抢购量，为0不限制，否则上限是库存 -->
												<!-- 此处判断是否为必须购买，是则最小值为1，否则为0 -->
												<uni-number-box
													:value="item.currentNum"
													:min="1"
													:max="item.personalLimitCount === 0 ? 9999 : item.personalLimitCount"
													@change="(val)=>changeNumber(val,resultIndex)"
												/>
											</view>
										</view>
										<view
											class="required"
											v-if="item.isForceItem"
										>
											必选商品
										</view>
									</view>
									<template v-slot:right>
										<view class="del" @click="del(item.id,resultIndex)"><text>删除</text></view>
									</template>
								</uni-swipe-action-item>
							</uni-swipe-action>
						</view>
					</view>
					<mescroll-empty v-if="pageData.result.length==0"></mescroll-empty>
			</mescroll-uni>
			<!-- 底部操作菜单 -->
			<view class="page-bottom">
				<button type="primary" class=" action-btn buy-now-btn" @click="buy">立即购买</button>
				<button type="primary" class=" action-btn add-cart-btn" @tap="navToOptional">自选商品</button>
			</view>
		</view>

		<yu-toast
			:message1="toastData.msg1"
			:message2="toastData.msg2"
			:duration="toastData.duration"
			verticalAlign="center"
			:backgroundColor="toastData.bgColor"
			:color="toastData.fontColor"
			ref="remind"
		></yu-toast>
		<uni-popup ref="popup" type="dialog" :maskClick="false">
			<view class="modal-box">
				<view class="rule-box">
					<view class="rule-title">
						<text>活动规则</text>
					</view>
					<view class="rule-content">
						<text v-html="dec"></text>
					</view>
				</view>
				<!-- 关闭按钮 -->
				<view class="dialog-close-button" @click="closeRule()">
					<icon class="iconfont cancel" style='color:#ffffff;font-size: 44rpx;' type=""></icon>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="dialog" type="dialog" >
			<uni-popup-dialog title='确定删除该自选商品吗？' @confirm="dialogConfirm"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import seckill from '@/api/deadline/seckill.js'
	import yuToast from '@/components/yu-toast/yu-toast'
	import MescrollEmpty from '@/components/mescroll-uni/components/mescroll-empty.vue';
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollMoreItemMixin from "@/components/mescroll-uni/mixins/mescroll-more-item.js"
	export default {
		mixins: [MescrollMixin,MescrollMoreItemMixin], // 注意此处还需使用MescrollMoreItemMixin (必须写在MescrollMixin后面)
		name: 'snapUp',
		components: {
			MescrollEmpty,
			yuToast
		},
		data() {
			return {
				downOption:{
				},
				// 不上拉加载
				upOption:{
					use:false,
					auto:false, // 不自动加载
					empty:{
						use : false
					},
					toTop: {
						src: require('@/static/image/home/top.png'),
						safearea:true
					},
				},
				// 页面配置
				pageOptions:{
					// 适配刘海屏
					mescrollTop:0,
					mescrollBottom:100,
					// 橱窗图片
					placardsUrl:'',
					// 结束时间
					endTime:"",
					// 开始时间
					startTime:"",
					// 活动名称
					promotionName:"",
					// 经销商关系
					dealerRelation:{},
					// activeType-分类类型(0:秒杀活动,1:限时抢购活动,2:商品组合活动)
					activeType:2
				},
				// 列表数据
				pageData:{
					result:[]
				},
				// 查询条件
				searchData:{
					// 活动编码
					promotionNo:"",
				},
				// 消息提醒
				toastData:{
					msg1:'设置提醒成功!',
					msg2:'',
					duration:2000,
					bgColor:"#000000cc",
					fontColor:"#00B60D",
				},
				dec:"1.本活动持续时间为2019/09/11~2019/09/30，共计20天。<br>" +
				"2.所有的玩法的礼品上架时间均为每天的10:30，14:30，20:30，中秋节前后两天（9.11-9.15）每天会有五场秒杀！每天的8：30，10:30 , 14:30 , 18:30 , 20:30 <br>" +
				"3.本活动的礼品均为商城促销礼品，部分礼品为旧库存礼品，请介意的同学们慎拍~<br>" +
				"4.兑换完成后，商品将在两周内发货<br>" +
				"5.兑换完成后，商品将在两周内发货<br>" +
				"6.兑换完成后，商品将在两周内发货<br>",
				// 要删除的对象
				delObj:{
					id:null,
					index:null
				}
			}
		},
		onLoad(e){
			let {promotionNo,name} = e
			this.name = name
			this.searchData = {
				promotionNo
			}
			// 查询活动列表详情
			this.getDeadlineSeckillDetail()
			// 查询固定商品
			this.getFixedProductList()
		},
		async onShow(){
			// 获取已选择好的自选商品
			const selectList = await uni.getStorageSync('activeProductList');
			if(selectList && selectList.length > 0){
				selectList.map((selected)=>{
					let resultItem = this.pageData.result.find((item)=>{return item.id === selected.id})
					if(resultItem){
						resultItem.currentNum += selected.currentNum
					}else{
						this.pageData.result.push(selected)
					}
				})
			}
			uni.setStorageSync('activeProductList', []);
			console.log(this.pageData.result,'this.pageData.result')
		},
		mounted() {
			// 计算顶部高度
			this.setRealMescrollPosition()
		},
		methods: {
			/**
			 * 设置实际的内容区域到顶部距离
			 */
			setRealMescrollPosition() {
				let statusHeight = uni.getSystemInfoSync().statusBarHeight
				this.pageOptions.mescrollTop = (statusHeight + 44) + 'px'
			},
			/**
			 * 查询活动列表详情
			 */
			getDeadlineSeckillDetail(){
				let _this = this
				let payload = this.$jsonFormat(this.searchData)
				uni.showLoading({
					title: '加载中'
				});
				return new Promise((resole,reject)=>{
					seckill.getDeadlineDetail(payload).then((res)=>{
						const {placardsUrl,dealerRelation,promotionName,endTime,startTime,promotionDesc} = res.data
						_this.dec = promotionDesc
						_this.pageOptions.placardsUrl = placardsUrl
						_this.pageOptions.dealerRelation = dealerRelation
						_this.pageOptions.promotionName = promotionName
						_this.pageOptions.endTime = endTime.substring(0,10).replace(/-0/g,'.').replace(/-/g,'.')
						_this.pageOptions.startTime = startTime.substring(0,10).replace(/-0/g,'.').replace(/-/g,'.')
						uni.hideLoading();
						resole()
					}).catch((err)=>{
						uni.hideLoading();
						reject(err)
					})
				})
			},

			/**
			 * 查询组合商品-固定
			 */
			getFixedProductList(){
				let _this = this
				let postData = {
					promotionNo:this.searchData.promotionNo
				}
				let payload = this.$jsonFormat(postData)
				return new Promise((resole,reject)=>{
					seckill.getFixedProductList(payload).then((res)=>{
						const {data} = res
						// 添加商品数量默认值
						let list = data.map((item)=>{
							return {
								...item,
								currentNum:1
							}
						})
						_this.pageData.result = list
						resole()
					}).catch((err)=>{
						reject(err)
					})
				})
			},

			/**
			 * 下拉刷新
			 */
			downCallback(){
				Promise.all([this.getFixedProductList(),this.getDeadlineSeckillDetail()]).then((res)=>{
					this.mescroll.endByPage(1);
				}).catch(()=>{
					this.mescroll.endByPage(1);
				})
			},

			//点击空布局按钮的回调
			emptyClick(){
				uni.showToast({
					title:'点击了按钮,具体逻辑自行实现'
				})
			},

			/**
			 * 返回上一页
			 */
			navBack(){
				uni.navigateBack({
				    delta: 1
				});
			},
			openRule(){
			  // 通过组件定义的ref调用uni-方法
			  this.$refs.popup.open()
			},
			closeRule(){
				this.$refs.popup.close()
			},

			/**
			 * 跳转自选商品
			 */
			navToOptional(){
				let {promotionNo} = this.searchData
				uni.navigateTo({
					url:"/pages/deadline/seckill/combination/combination-detail-optional?promotionNo=" + promotionNo
				})
			},

			/**
			 * 增加/减少产品数量
			 */
			changeNumber(val,index){
				this.$set(this.pageData.result[index],'currentNum',JSON.parse(val))
			},

			/**
			 * 立即购买
			 */
			buy() {
				const productList = this.pageData.result;
				const data = {
					activeProductList:productList,
					isCart:false,
					isActive:this.pageOptions.activeType,
					dealerRelation:JSON.stringify(this.pageOptions.dealerRelation)
				}
				uni.navigateTo({
					url: `/pages/products/order/confirm`,
					success: function(res) {
						res.eventChannel.emit("sendParams", data);
					}
				});
			},

			/**
			 * 打开删除弹窗
			 */
			del(id,index){
				this.$refs.dialog.open()
				this.delObj.id = id
				this.delObj.index = index
			},

			/**
			 * 确认删除
			 */
			dialogConfirm(){
				const {index,id} = this.delObj
				this.$refs.dialog.close()
        if(id !== this.pageData.result[index].id) result
				this.pageData.result.splice(index, 1)
				this.delObj = {
					id:null,
					index:null
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page{
		background-color: #F9F9F9;
		height: 100vh;
		/deep/.uni-dialog-title-text{
		  font-size: 36rpx;
		  color: #333;
		  position: relative;
		  font-weight: 400;
		  top: 50rpx;
		  text-align: center;
		  width:500rpx;
		}
		/deep/.uni-dialog-content{
			padding:0;
		}
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
	.nav-bar{
		position: relative;
		z-index: 1;
	}
	/deep/.uni-navbar--border{
		border-bottom-width:0;
	}

	// 底部产品列表
	.carousel {
		height: calc(100vh - 88rpx - var(--status-bar-height));
		background: transparent;

		.image-wrapper {
			width: 100%;
			height: 100%;
		}

		.img {
			width: 100%;
			height: 100%;
		}
	}

	// 底部产品列表
	.seckill-list {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		>image{
			width: calc(100vw - 40rpx);
			height: calc((100vw - 40rpx) * 0.42);
			border-radius: 8rpx;
			margin: 20rpx auto 0;
		}
		// 规则
		.active-rule{
			position: absolute;
			right: 20rpx;
			top: 20rpx;
			margin: 20rpx;
			background: #ed6d00;
			padding: 7rpx 12rpx;
			opacity: 0.8;
			font-size: 20rpx;
			font-weight: 500;
			color: #FFFFFF;
			border-radius: 5px;
		}
		// 活动信息盒子
		.active-info-box{
			width: calc(100vw - 80rpx);
			margin: 20rpx auto;
			background-color: #ffffff;
			border-radius: 5rpx;
			padding: 30rpx 20rpx;
			>view{
				>text:nth-child(1){
					color: #1C1C1C;
				}
				>text:nth-child(2){
					color: #ed6d00;
				}
				>text{
					font-size: 30rpx;
					line-height: 30rpx;
					font-weight: bold;
				}
			}
			>view:nth-child(2){
				margin-top: 20rpx;
				font-size: 26rpx;
				line-height: 32rpx;
				font-weight: bold;
				color: #1C1C1C;
			}
		}
		.seckill-item-box{
			margin:0 auto 20rpx;
			box-shadow: 0px 6px 26px 0px rgba(123, 71, 46, 0.05);
		}
		.seckill-item {
			background-color: #ffffff;
		}

		.seckill-info {
			padding: 25rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
		}

		.seckill-info-top {
			display: flex;
			flex-direction: column;
		}
		.seckill-info-bottom {
			display: flex;
			justify-content: space-between;
			.seckill-price{
				>text:nth-child(1){
					line-height: 22rpx;
					font-size: 22rpx;
					font-weight: bold;
					color: #ed6d00;
					margin-right: 10rpx;
				}
				>text:nth-child(2){
					font-size: 16rpx;
					font-weight: 500;
					text-decoration: line-through;
					color: #CCCCCC;
				}
			}
		}

		// 名称
		.seckill-name {
			line-height: 28rpx;
			font-size: 26rpx;
			font-weight: bold;
			color: #1C1C1C;
			overflow: hidden;
			-webkit-line-clamp: 2;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-box-orient: vertical;
		}

		// 信息
		.seckill-detail{
			display: flex;
			justify-content: space-between;
			.left-detail{
				width: 45%;
				display: flex;
				flex-direction: column;
			}
			.right-detail{
				width: 45%;
				display: flex;
				flex-direction: column;
			}
			text{
				margin-top: 10rpx;
				font-size: 20rpx;
				line-height: 20rpx;
				font-weight: 400;
				color: #666666;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
		}

		// 标签
		.seckill-tag-list{
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			margin-top: 4rpx;
			width: 100%;
			>view{
				margin-right: 10rpx;
				>text{
					border: 1rpx solid #E10000;
					border-radius: 5rpx;
					font-size: 20rpx;
					line-height: 20rpx;
					font-family: PingFang SC;
					font-weight: 400;
					color: #E10000;
					padding: 0rpx 10rpx;
				}
			}
		}

		// 必选商品
		.required{
			position: absolute;
			left: 0px;
			top: 40rpx;
			padding: 6rpx 10rpx 6rpx 8rpx;
			background: #ed6d00;
			font-size: 24rpx;
			font-weight: 500;
			color: #FFFFFF;
		}



		// 一列样式
		.one-item {
			width: calc(100vw - 40rpx);
			border-radius: 5px;
			display: flex;
			position: relative;
			.seckill-image {
				height: calc(100vw / 3 - 50rpx);
				width: calc(100vw / 3 - 25rpx);
				padding: 25rpx 0 25rpx 25rpx;
			}

			.seckill-info {
				width: calc(66.6vw - 40rpx - 10rpx - 50rpx);
				justify-content: space-between;
			}
		}
	}

	/* 底部操作菜单 */
	.page-bottom {
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 99;
		display: flex;
		align-items: center;
		right:0;
		height: 100rpx;
		padding-bottom: env(safe-area-inset-bottom);
		background-color: #fff;
		box-shadow: 0 -1px 0 0 rgba(0,0,0,0.1);

		.action-btn {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 45%;
			height: 72rpx;
			border:1px solid $uni-color-primary;
			color: $uni-color-primary;
			font-size: $uni-font-size-base;
			padding: 0;
			border-radius: 72rpx;
			background-color: #fff;
			&.buy-now-btn{
				color: #fff;
				background-color: $uni-color-primary;
			}
		}
	}


	.modal-box{
		width: calc(100vw - 100rpx);
		height: calc((100vw - 100rpx) * 1.25);
		margin-bottom: 120rpx;
		background-image: url(../../../../static/image/deadline/combination-rule-dialog.png);
		background-size: 100%;
		>image{
			width: 100%;
			height: 100%;
		}
		.rule-box{
			.rule-title{
				width: 100%;
				text-align: center;
				padding-top: 50%;
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
					margin: 20rpx auto 0;
					word-break: break-all;
				}
			}
		}
		.dialog-close-button{
			position: absolute;
			bottom: -40rpx;
			left: calc(50% - 22rpx - 30rpx);
			padding: 30rpx;
		}
	}

	.del{
		width:160rpx;
		height:100%;
		background-color:#E10000;
		display: flex;
		align-items: center;
		justify-content: center;
		text{
			color:#fff
		}
	}
	/deep/.uni-numbox__value{
		width: 50px;
	}
</style>

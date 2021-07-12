<template>
	<view class="page">
		<uni-nav-bar
			class="nav-bar"
			title="限时抢购"
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
						<view class="seckill-time-box">
							<text>{{name}}</text>
							<view class="time-item" :class="{'all-border-radius':!calcShowTime}">
								<text class="time-type">{{calcShowType}}</text>
								<text v-if="calcShowTime" class="time-time">{{calcShowTime}}</text>
							</view>
						</view>
					<view
						:id="'seckill-item-' + resultIndex + '-' + item.id"
						class="seckill-item one-item"
						:class="{'gray':(item.saleStock/item.stock) === 1}"
						v-for="(item,resultIndex) in pageData.result"
						:key="'seckill-item-' + resultIndex"
						@click="navToDetail(item)">
						<image class="seckill-image" :src="item.itemImageUrl" alt="">
						<view class="seckill-info">
							<view class="seckill-info-top">
									<!-- 名称 -->
								<text class="seckill-name">{{item.itemName}}</text>
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
						</view>
						<!-- 右下角按钮 -->
						<view class="right-bottom-box" v-if="(item.saleStock/item.stock) !== 1">
							<view class="sell-price" v-if="!isDiscountOnly">
								<text>{{item.amount}}</text>
								<text>￥{{item.itemAmount}}</text>
							</view>
							<view class="sell-price-only" v-else>
								<text>已优惠</text>
								<text>￥{{item.discountAmount}}</text>
							</view>
							<text class="hot-sale">仅剩{{item.displayStock}}件</text>
						</view>
						<view
							class="sell-out"
							v-if="(item.saleStock/item.stock) === 1"
						>
							已售罄
						</view>
					</view>
					</view>
					<mescroll-empty v-if="pageData.result.length==0"></mescroll-empty>
			</mescroll-uni>
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
					mescrollBottom:20,
					// 橱窗图片
					placardsUrl:'',
					// 结束时间
					endTime:"",
					// 开始时间
					startTime:"",
					promotionStatus:'',
					// 经销商关系
					dealerRelation:{}
				},
				// 列表数据
				pageData:{
					result:[]
				},
				// 仅显示优惠价格
				isDiscountOnly:false,
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
				// 当前时间
				now:new Date(),
				// 倒计时
				setTime:"",
				dec:"1.本活动持续时间为2019/09/11~2019/09/30，共计20天。<br> 2.所有的玩法的礼品上架时间均为每天的10:30，14:30， 20:30，中秋节前后两天（9.11-9.15）每天会有五场秒杀！每天的8：30，10:30 , 14:30 , 18:30 , 20:30 <br> 3.本活动的礼品均为商城促销礼品，部分礼品为旧库存礼品，请介意的同学们慎拍~<br> 4.兑换完成后，商品将在两周内发货"
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
		},
		computed:{
			/**
			 * 显示
			 * 距本场结束/距本场开始
			 */
			calcShowType(){
				let title = this.pageOptions.promotionStatus===0?'距本活动开始':'距本活动结束'
				if(new Date(this.pageOptions.endTime.replace(/-/g, "/")).getTime() < this.now.getTime()){
					title = '本活动已结束'
				}
				return title
			},

			/**
			 * 显示时间
			 */
			calcShowTime(){
				let time = ''
				if(this.pageOptions.promotionStatus===0){
					if(new Date(this.pageOptions.startTime.replace(/-/g, "/")).getTime() > this.now.getTime()){
						// 距本场开始
						time = this.timedate(this.pageOptions.startTime.replace(/-/g, "/"),new Date())
					}
				}else{
					if(new Date(this.pageOptions.endTime.replace(/-/g, "/")).getTime() > this.now.getTime()){
						// 距本场开始
						time = this.timedate(this.pageOptions.endTime.replace(/-/g, "/"),new Date())
					}
				}
				return time
			}
		},
		destroyed(){
			this.setTime && clearInterval(this.setTime)
		},
		mounted() {
			// 倒计时
			this.setTime = setInterval(()=>{
				this.now = new Date()
			},1000)
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
						const {dealerRelation,placardsUrl,endTime,startTime,flashsales,promotionDesc,promotionStatus} = res.data
						_this.dec = promotionDesc
						_this.pageOptions.placardsUrl = placardsUrl
						_this.pageOptions.dealerRelation = dealerRelation
						_this.pageOptions.endTime = endTime
						_this.pageOptions.startTime = startTime
						_this.pageOptions.promotionStatus = promotionStatus
						_this.pageData.result = flashsales
						_this.isDiscountOnly = res.data.isDiscountOnly
						uni.hideLoading();
						resole()
					}).catch((err)=>{
						uni.hideLoading();
						this.$refs.overPopup.open()
						reject(err)
					})
				})
			},

			/**
			 * 下拉刷新
			 */
			downCallback(){
				this.getDeadlineSeckillDetail().then(()=>{
					this.mescroll.endByPage(1);
				}).catch((err)=>{
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
			 * 跳转详情页
			 */
			navToDetail(row){
				// 判断该活动分类是否是进行中
				if(new Date(this.pageOptions.startTime.replace(/-/g, "/")).getTime() > this.now.getTime()){
					this.toastData = {
						msg1:'活动还未开始',
						msg2:'去看看别的吧',
						duration:2000,
						bgColor:"#000000cc",
						fontColor:"#ed6d00",
					}
					this.$refs.remind.show()
					return
				}
				// promotionId-活动id
				// promotionNo-活动编码
				// itemNo-活动商品编码
				// 分类类型(0:秒杀活动,1:限时抢购活动,2:商品组合活动)
				const {id,promotionNo,itemNo,stock,saleStock} = row
				// 判断该商品是否售空
				if((saleStock/stock) === 1){
					this.toastData = {
						msg1:'该商品已被抢完啦',
						msg2:'去看看别的吧',
						duration:2000,
						bgColor:"#000000cc",
						fontColor:"#ed6d00",
					}
					this.$refs.remind.show()
					return
				}
				let params = {
					id,
					promotionNo,
					itemNo,
					activeType:1
				}
				let str = this.$jsonFormat(params)
				uni.navigateTo({
					url:'/pages/deadline/product/product-deadline-detail' + str + '&dealerRelation=' + JSON.stringify(this.pageOptions.dealerRelation)
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

			//a为结束时间
			timedate(start,end) {
				let date1 = new Date(start);
				let date2 = new Date(end);
				let date3 = date1.getTime() - date2.getTime()
				return this.showTime(date3)
			},
			//创建补0函数
			p(s) {
				let text = s
				if(s < 0){
					text = '00'
				}else if(s < 10){
					text = '0' + s
				}
				return text
			},
			//根据秒数得出时分秒
			showTime(val) {
				//计算出相差天数
				let days = Math.floor(val/(24*3600*1000))
				//计算出小时数
				let leave1 = val%(24*3600*1000)    //计算天数后剩余的毫秒数
				let hours = Math.floor(leave1/(3600*1000))
				//计算相差分钟数
				let leave2 = leave1%(3600*1000)        //计算小时数后剩余的毫秒数
				let minutes = Math.floor(leave2/(60*1000))
				//计算相差秒数
				let leave3 = leave2%(60*1000)      //计算分钟数后剩余的毫秒数
				let seconds = Math.round(leave3/1000)
				return days + "天 " + this.p(hours) + ":" + this.p(minutes) + ":" + this.p(seconds)
			},
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
			margin: 10px auto 0;
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
		.seckill-time-box{
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 100%;
			padding: 20rpx;
			position: sticky;
			top: 0px;
			z-index: 2;
			background-color: #F9F9F9;
			>text{
				font-size: 26rpx;
				font-family: HYYaKuHeiW;
				font-weight: bold;
				font-style: italic;
				color: #1C1C1C;
			}
			.time-item{
				display: flex;
				align-items: center;
				border-radius: 4rpx;
				.time-type{
					font-size: 24rpx;
					font-weight: 500;
					color: #FFFFFF;
					background: #E10000;
					padding: 4rpx 12rpx;
					border-top-left-radius: 6rpx;
					border-bottom-left-radius: 6rpx;
				}
				.time-time{
					font-size: 24rpx;
					font-weight: 500;
					padding: 4rpx 17rpx;
					background: #E1000015;
					color: #E10000;
					border-top-right-radius: 6rpx;
					border-bottom-right-radius: 6rpx;
				}
			}
			.all-border-radius{
				.time-type{
					border-radius: 6rpx;
				}
			}
		}
		.seckill-item {
			background-color: #ffffff;
		}

		.seckill-info {
			padding: 25rpx;
			display: flex;
			flex-direction: column;
		}

		.seckill-info-top {
			display: flex;
			flex-direction: column;
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

		// 标签
		.seckill-tag-list{
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			margin-top: 4rpx;
			width: 70%;
			>view{
				margin-bottom: 4rpx;
				margin-right: 8rpx;
				>text{
					border: 1rpx solid #E10000;
					border-radius: 5rpx;
					font-size: 20rpx;
					font-family: PingFang SC;
					font-weight: 400;
					color: #E10000;
					padding: 0rpx 10rpx;
				}
			}
		}

		.right-bottom-box{
			position: absolute;
			right: 24rpx;
			bottom: 24rpx;
			width: 20vw;
			height: 20vw;
			background-image: url(../../../../static/image/deadline/snap-up-price.png);
			background-size: 100%;
			text-align: center;
			display: flex;
			flex-direction: column;
			// 价格
			.sell-price{
				display: flex;
				flex-direction: column;
				margin-top: 33rpx;
				>text:nth-child(1){
					font-size: 34rpx;
					font-family: HYYaKuHeiW;
					color: #FD264C;
					line-height: 34rpx;
					font-weight: 600;
				}
				>text:nth-child(2){
					font-size: 16rpx;
					font-weight: 500;
					text-decoration: line-through;
					color: #CCCCCC;
					line-height: 16rpx;
				}
			}
			.sell-price-only{
				display: flex;
				flex-direction: column;
				margin-top: 33rpx;
				>text:nth-child(1){
					font-size: 24rpx;
					color: #FD264C;
					line-height: 24rpx;
				}
				>text:nth-child(2){
					font-size: 24rpx;
					font-weight: 500;
					color: #FD264C;
					line-height: 24rpx;
				}
			}
			// 热销
			.hot-sale{
				margin-top: 10rpx;
				font-size: 18rpx;
				line-height: 18rpx;
				font-weight: 500;
				color: #FFDE02;
			}
		}

		.sell-out{
			position: absolute;
			left: 0px;
			top: 40rpx;
			padding: 8rpx 20rpx 8rpx 8rpx;
			background: #666666;
			border-radius: 0px 5px 5px 0px;
			font-size: 24rpx;
			font-weight: 500;
			color: #CCCCCC;
		}

		// 一列样式
		.one-item {
			width: calc(100vw - 40rpx);
			margin:0 auto 20rpx;
			box-shadow: 0px 6px 26px 0px rgba(123, 71, 46, 0.05);
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


	.modal-box{
		width: calc(100vw - 120rpx);
		height: calc((100vw - 120rpx) * 1.2);
		margin-bottom: 120rpx;
		background-image: url(../../../../static/image/deadline/snap-up-rule-dialog.png);
		background-size: 100%;
		>image{
			width: 100%;
			height: 100%;
		}
		.rule-box{
			.rule-title{
				width: 100%;
				text-align: center;
				padding-top: 53%;
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

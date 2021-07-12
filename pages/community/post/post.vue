<template>
	<view class="page">
		<uni-nav-bar id="topBar" title="发帖" left-icon="back" backgroundColor="#ed6d00" color="#fff" @clickLeft="toBack"></uni-nav-bar>
		<view class="function-content" :style="'height:'+contentHeight+'px'">
			<view class="content-title">发帖标题</view>
			<view class="feedback">
				<input class="feedback-content feedback-title" v-model="title" type="text" value="" placeholder="请输入标题" />
			</view>
			<view class="content-title" v-if="rule.format!==1">发帖内容</view>
			<view class="feedback" v-if="rule.format!==1">
				<textarea class="feedback-content textarea JTxtArea" :data-maxnum="content.length+'/'+(rule.contentMaxCount || -1)" auto-height :maxlength="(rule.contentMaxCount || -1)" :class="!rule.contentMaxCount?'no-limit':''" v-model="content" value="" placeholder="请输入内容" @input="inputContent"/>
			</view>
			<view class="content-title" v-if="rule.format!==2">添加图片 <text v-if="rule.imgMaxCount" class="tips"> (最多{{rule.imgMaxCount}}张)</text></view>
			<view class="grid grid-square flex-sub" v-if="rule.format!==2">
				<view class="bg-img flex a-center j-center" v-for="(item,index) in imgList" :key="index" @tap="ViewImage" :data-url="imgList[index].url">
					<image style="width: 100%; height: 100%;" :src="imgList[index].url" mode="heightFix"></image>
					<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
						<uni-icons type="clear" color="#ed6d00" size="20"></uni-icons>
					</view>
				</view>
				<view class="solids flex a-center j-center" @tap="ChooseImage" v-if="imgList.length<(rule.imgMaxCount || 9)">
					<uni-icons type="camera"></uni-icons>
				</view>
			</view>
			<view v-if="history && auditReason" class="content-title" style="padding-top:10px;">驳回原因</view>
			<view v-if="history && auditReason" class="feedback">
				<textarea class="feedback-content audit-reason" auto-height maxlength="-1" disabled v-model="auditReason" value="" placeholder="" />
			</view>
		</view>
		<view class="fixed-bottom-box" id="bottomBox" @click="confirm">
			<view class="btn" v-if="history">重新提交</view>
			<view class="btn" v-else>提交</view>
		</view>
	</view>
</template>

<script>
	import {upLoadURL} from '@/static/base/system-constant.js'
	import AjaxUtil from "@/common/utils/request.js"
	import community from '@/api/community/community.js'
	export default {
		name: 'post',
		components: {},
		data() {
			return {
				systemInfo: uni.getSystemInfoSync(),
				contentHeight:500,
				title:'',
				content:'',
				imgList: [],
				attachmentId: '',
				articleType:1,
				rule:{},
				articleNo:'',
				isPass:false,
				history:'',
				auditReason:'',
				id:''
			}
		},
		computed:{
		},
		onLoad(option) {
			// 20210426 11:29 刘自成： app创建的文章类型固定是1，论坛类型，审核状态默认都是未审核
			// this.articleType=parseInt(option.articleType || 1)
			this.isPass=option.isPass || false
			this.articleNo=option.articleNo || ''
			this.history=option.history || ''
			if(this.articleNo){
				this.getCommunityDetail()
			}
		},
		mounted(){
			this.countTopBar()
			this.getPublishRule()
		},
		methods: {
			/**
			 * 计算顶部DOM元素节点
			 */
			async countTopBar() {
				const topBar =  await this.$getComponentsDom('#topBar');
				const bottomBox =  await this.$getComponentsDom('#bottomBox');
				this.contentHeight = this.systemInfo.windowHeight-topBar.height-bottomBox.height
			},
			/**
			 * 返回上一级页面
			 */
			toBack(){
				uni.navigateBack({
					delta: 1
				})
			},
			inputContent(e){
				this.content=e.detail.value;
			},
			/**
			 * 根据id获取详情
			 */
			getCommunityDetail() {
				let postData = {
					articleNo: this.articleNo
				}
				uni.showLoading({
					title: '加载中···'
				})
				community.getArticleDetail(postData).then((res) => {
					if (res.code === 200) {
						this.title=res.data.title
						this.id=res.data.id
						this.articleType=res.data.articleType
						let srcList=[]
						let formatCon=res.data.content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, (match, capture,i,str)=> {
						  srcList.push(capture);
							return ''
						})
						formatCon=res.data.content.replace(/<\/?.+?\/?>/g,'')
						this.content=formatCon
						this.auditReason=res.data.auditReason
						this.imgList=srcList.map(x=>{
							return {
								url:x
							}
						})
					} else {
						uni.showToast({
							icon: "none",
							title: res.msg
						})
					}
					uni.hideLoading()
				}).catch((err) => {
					uni.hideLoading()
					uni.showToast({
						icon: "none",
						title: err.msg
					})
				})
			},
			isBetweenDate (beginDateStr, endDateStr) {
				let curDate = new Date(),
						beginDate = new Date((beginDateStr || '').replace(/-/g, "/")),
						endDate = new Date((endDateStr || '').replace(/-/g, "/"));
				if (curDate >= beginDate && curDate <= endDate) {
						return true;
				}
				return false;
			},
			/**
			 * 获取发帖规则
			 */
			getPublishRule(){
				community.getArticleRule('').then((res) => {
					if (res.code === 200) {
						//发帖格式限制 0-无限制 1-只允许发图 2-只允许发文字
						if(res.data.format!==0){
							if(this.isBetweenDate(res.data.ruleStartTime,res.data.ruleEndTime)){
								this.rule=res.data
							}else{
								this.rule={
									contentMaxCount: '',
									format: 0,
									imgMaxCount: '',
									ruleEndTime: '',
									ruleStartTime: ''
								}
							}
						}else{
							this.rule=res.data
						}
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
			},
			/**
			 * 输入框失焦时触发
			 * @param {Object} e 输入框输入的内容
			 * @param {Object} title 标题输入框
			 */
			blurInp(e,title){
				if(title === 'inp'){
					this.title = e
				}else{
					this.content = e.detail.value
				}
			},
			//上传图片
			ChooseImage() {
				let self = this;
				let header=AjaxUtil.getHeader()
				uni.chooseImage({
					// count: (this.rule.imgMaxCount || 9), // 抱歉，接口不支持一次性选择多个照片上传
					count: 1,
					success: async (res) => {
						uni.showLoading({
							title:'加载图片中···'
						})
						uni.uploadFile({
							url:upLoadURL + '/basic/admin/oss/upload?target=item',
							filePath: res.tempFiles[0].path,
							name:'file',
							header:{
								...header,
								"Content-Type": "multipart/form-data",

							},
							success:(uploadFileRes) => {
								console.log(uploadFileRes)
								let result = JSON.parse(uploadFileRes.data)
								if (result.code == 200){
									const image = {
										'url': result.data.objectUrl,
									};
									self.imgList.push(image)
								}
								uni.hideLoading()
							},
							fail:(err)=>{
								uni.hideLoading()
								console.log(err,'err')
							}
						});
					}
				});
			},
			//查看图片
			ViewImage(e) {
				let urls = [];
				for (let i = 0; i < this.imgList.length; i++) {
					urls.push(this.imgList[i].url);
				}
				uni.previewImage({
					urls: urls,
					current: e.currentTarget.dataset.url
				});
			},
			//删除图片
			DelImg(e) {
				let self = this;
				uni.showModal({
					title: '',
					content: '确定要删除么',
					cancelText: '取消',
					confirmText: '确定',
					success: res => {
						if (res.confirm) {
							self.imgList = []
						} else if (res.cancel) {
						}
					}
				})
			},
			/**
			 * 提交
			 */
			confirm(){
				// let content={
				// 	img:this.imgList,
				// 	content:this.content
				// }
				let imgLabel=this.imgList.map(x=>{
					return `<img style="100%" src="${x.url}">`
				})
				let con=`<span>${this.content}</span>`
				let content=imgLabel.join(' ')+con
				let postData = {
					title:this.title,
					articleType:this.articleType,
					openComment:0,
					platformType:2,
					isPublish:1,
					content:content
				}
				if(this.history && this.id){
					postData.id=this.id
					community.modifyArticle(postData).then((res) => {
						if (res.code === 200) {
							uni.showToast({
								icon: "success",
								title: '提交成功'
							})
							setTimeout(()=>{
								this.toBack()
							},1000)
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
					return
				}
				community.createArticle(postData).then((res) => {
					if (res.code === 200) {
						uni.showToast({
							icon: "success",
							title: '提交成功'
						})
						setTimeout(()=>{
							this.toBack()
						},1000)
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
		height:100vh;
		overflow:hidden;
		.function-content{
			color: #1C1C1C;
			font-size: 13px;
			padding: 15px 10px;
			box-sizing: border-box;
			overflow: auto;
			.content-title{
				color: #252527;
				padding-bottom:10px;
				font-weight: bold;
				.tips{
					margin-left:5px;
					font-weight:400;
					font-size:22rpx;
					color:#999;
				}
			}
			.feedback{
				background: #fff;
				padding: 10px 10px;
				border-radius: 3px;
				margin-bottom:10px;
				box-shadow: 0px 3px 15px 0px rgba(0, 0, 0, 0.05);
				.feedback-content{
					width: calc(100% - 2px - 26px);
					padding: 13px;
					color: #252527;
					font-size: 13px;
					background: #F2F2F2;
					border: 1px solid #E5E5E5;
					border-radius: 3px;
				}
				.textarea{
					min-height: 200px;
				}
				.audit-reason{
					background: #fff;
					border:none;
					padding:0;
					// min-height:30px;
				}
				.feedback-title{
					height: 47px;
					padding: 0 13px;
				}
			}
		}
	}
	.fixed-bottom-box{
		width: 100%;
		background-color: #fff;
		position: fixed;
		bottom: 0;
		left: 0;
		box-sizing: border-box;
		padding:20rpx 36rpx;
		padding-bottom:calc(20rpx + constant(safe-area-inset-bottom) / 2);
		padding-bottom:calc(20rpx + env(safe-area-inset-bottom) / 2);
		display: flex;
		justify-content: space-between;
		align-items: center;
		.btn{
			color: #fff;
			font-size: 36rpx;
			background-color: $uni-color-primary;
			width: 100%;
			margin: auto;
			border-radius: 50rpx;
			text-align: center;
			padding: 20rpx;
		}
	}
	.bg-img{
		width: 158px;
		height: 88px;
		border: 1rpx solid rgba(102,102,102,.4);
		border-radius:5px;
		position: relative;
		margin:5px;
	}
	.cu-tag{
		position: absolute;
		top: -10px;
		right: -7px;
		border-radius:50%;
	}
	.solids{
		width: 158px;
		height: 88px;
		margin:5px;
		background: #EEEEEE;
		border: 1rpx solid rgba(102,102,102,.4);
		border-radius:5px;
		.uni-icons{
			color: #9B9B9B !important;
			font-size: 37px !important;
		}
	}
	.grid-square{
		display:flex;
		justify-content: flex-start;
		align-items: flex-start;
		flex-wrap: wrap;
	}
	.JTxtArea {
		position: relative;
		&::after{
			content: attr(data-maxnum);
			position: absolute;
			right: 5px;
			bottom: 2px;
			font-size: 12px;
			color: #999;
		}
		&.no-limit{
			&::after{
				display: none;
			}
		}
	}

</style>

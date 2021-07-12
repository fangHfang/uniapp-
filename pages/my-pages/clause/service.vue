<template>
	<view class="page">
		<uni-nav-bar
			id="topBar"
			class=""
			:title="pageOptions.name"
			backgroundColor="#ed6d00"
			color="#fff"
			left-icon="back"
			@clickLeft="navBack"
		></uni-nav-bar>
		<scroll-view class="mescroll-uni-box" scroll-y>
			<view class="weight">尊敬的加盟客户，欢迎您使用玛商发APP!</view>
			<view>为促进双方平等互利，合力共赢，请您注册玛商发账号成为我们的加盟伙伴前，务必认真阅读本协议。</view>
			<view class="weight">一、适用主体范围</view>
			<view>1、协议适用玛吉斯签约店；</view>
			<view>2、本协议是您与玛商发之间关于下载、安装、注册、使用玛商发相关服务所共同订立的协议；</view>
			<view>3、玛吉斯签约店需具备中华人民共和国法律规定的与您行为相适应的民事行为能力。</view>
			<view class="weight">二、您的权利和义务</view>
			<view>1、您可获得为销售玛吉斯产品所需的宣传品、店招等支持；</view>
			<view>2、您可获得新店开业大礼包适用于APP下单使用；</view>
			<view>3、您可使用玛商发下单、入库、出库等管理，并获得相应返利；</view>
			<view>4、您可获得所属经销商向您提供玛吉斯合格产品以及必要的配送和服务；</view>
			<view>5、您须提交真实、准确、及时、详尽和完整的注册信息(包括您的姓名及联系电话、营业执照、联系电话、联系地址、门店基础信息等)获取玛商发账号，否则无法获取玛商发平台使用权限。并不断更新注册资料，以符合及时、详尽和准确的要求；</view>
			<view>6、您可使用玛商发授权您使用的账号登录玛商发平台。玛商发提供给您的账户由您自行保管好，若账户因您主动泄露或您遭受他人诈骗等导致的损失及后果由您自行承担；</view>
			<view>7、您须保证销玛吉斯产品，均从所属经销商进货，并依门店与经销商双方之约定回款；</view>
			<view>8、您须完成玛商发设定之进货目标：玛吉斯15 寸及寸以上PCR 轮胎每月至少完成签约条数；</view>
			<view>9、您须对现行双方运营模式等，具有保密义务；</view>
			<view>10、您不得有任何违反国家法律、法规及中华人民共和国承认或加入的国际条约的内容的行为，且您通过玛商发所从事的一切活动都是合法、真实的，不侵害任何第三方的合法权益；</view>
			<view>11、您须清楚知道玛商发软件提供的第三方内容或通往第三方网站的链接，由您自行判断,并承担因使用而引起的所有风险。对于您与第三方的纠纷，玛商发不承担任何责任；</view>
			<view>12、您如违反本协议规定的任何条款，或恶意扰乱市场行为，玛商发有权单方判断立即终止您使用玛商发的权限，而无需事先通知并不退还已收取的任何费用。</view>
			<view class="weight">三、玛商发的权利和义务</view>
			<view>1、有责对符合加盟条件店面给予玛商发使用授权；</view>
			<view>2、连续三个月未使用玛商发或提交注册信息不真实，有权注销账户；</view>
			<view>3、有责提供对玛吉斯签约店店面予以运营、销售技巧等培训指导；</view>
			<view>4、有责协助您在代理商变更时做好市场交接相关工作；</view>
			<view>5、有权随时删除任何含有违反法律法规及软件使用许可协议、玛商发各项规则的信息或链接，包括玛商发对此有合理怀疑的信息；</view>
			<view>6、有权依据自己的判断，对违反本协议有关的条款约定行为，在不经事先通知的情况下，立即终止您使用玛商发软件的权利，而无需承担任何责任；</view>
			<view>7、有责不得向任何无关第三方提供、出售、出租、或交易您的个人信息，除非是为了遵守法律法规的规定或遵照司法部门对玛商发的要求；</view>
			<view>8、玛商发不保证服务的及时、安全、准确及可靠。玛商发有权不经通知随时变更、中断或终止部分或全部的网络服务，而无需对用户和/或任何第三人承担任何责任。对于因不可抗力因素、玛商发不能控制的原因或本网站正常的设备维修升级而造成的网络服务中断，不承担任何责任，但是会尽可能合理地协助处理善后事宜，并努力使您免受经济损失；</view>
			<view>9、不对任何用户上传信息的删除或储存失败负责，也不对用户因上传信息引起的任何名誉或财产损失负责；</view>
			<view>10、有权删除所引起的任何后果或导致用户的任何损失承担任何责任；</view>
			<view>11、有权根据国家法律法规变化及维护交易秩序、保护消费者权益需要，不时修改本协议、补充协议，变更后的协议、补充协议(下称 变更事项)并以公示的文案、站内信、客户端推送的消息、短信、函件等方式通知您。</view>
			<view class="weight">四、费用</view>
			<view>玛商发目前免费许可用户使用。玛商发有权根据实际情况随时单方调整费用标准及收费方式，并公示于玛商发平台，而无需获得您的事先同意。但调整日前已经支付软件许可使用费的用户不受影响。</view>
			<view class="weight">五、如何联系我们</view>
			<view>如果您对本协议声明有任何疑问、意见、建议，或者您需要进行变更、删除、停用等业务,可联系玛商发客服。</view>
			<view>客服电话：<text class="weight">0512-57673888转8142</text></view>
			<view>客服微信号：<text class="weight">15050274734</text></view>
			<view>我们会积极进行查证、处理并尽快答复。</view>
	</scroll-view>
	</view>
</template>

<script>
	export default {
		name: 'mall',
		data() {
			return {
				// 回到顶部按钮配置
				upOption: {
					auto:false,
					use:false,
					page: {
						size: 10
					},
					noMoreSize: 4,
					empty: {
						tip: '~ 暂无数据哦 ~',
						// btnview: '去看看'
					},
					toTop: {
						src: require('@/static/image/home/top.png'),
						safearea:true
					},
				},
				// 下拉刷新组件实例
				mescroll: null,
				// 页面配置
				pageOptions: {
					// 适配刘海屏
					mescrollTop:0,
					mescrollBottom:0,
					name:"玛商发APP注册协议"
				},
			}
		},
		onLoad(e){
		},
		mounted() {
		},
		methods: {
			/**
			 * 设置实际的内容区域到顶部距离
			 */
			setRealMescrollPosition() {
				let statusHeight = uni.getSystemInfoSync().statusBarHeight
				this.pageOptions.mescrollTop = (statusHeight + 44 + 50) + 'px'
			},
			
			/**
			 * 初始化回调方法
			 * @param {Object} mescroll
			 */
			mescrollInit(mescroll) {
				this.mescroll = mescroll
			},

			/**
			 * 返回上一页
			 */
			navBack(){
				uni.navigateBack({
				    delta: 1
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.page{
		background-color: #F9F9F9;
		height: 100vh;
	}

	/deep/.search-bar {
		width: 100%;
		background-color: #FFFFFF;
		padding: 16rpx;

		>.uni-searchbar__box {
			justify-content: left;
			height: 68rpx;
			border-color: $uni-color-primary;

			>.uni-searchbar__view-placeholder {
				margin-left: 0px;
			}
		}
	}

	// 搜索栏
	.mescroll-uni-box{
		height: calc(100vh - 88rpx - 2rpx - 40rpx - var(--status-bar-height));
		padding: 20rpx;
		width: calc(100vw - 40rpx);
		font-size: 28rpx;
		line-height: 44rpx;
		view{
			font-size: 12px;
		}
		.weight{
			font-weight: 600;
			font-size: 14px;
		}
	}
	/* 适配 iPhoneX */
	@supports (bottom: constant(safe-area-inset-bottom)) or (bottom: env(safe-area-inset-bottom)) {
		.mescroll-uni-box {
			height: calc(100vh - 88rpx - 2rpx - 40rpx - var(--status-bar-height) - env(safe-area-inset-bottom));
		}
	}
</style>

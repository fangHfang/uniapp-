<template>
	<view class="page-container">
		<!-- 工作台 -->
		<view class="page-tab" v-show="tabIndex===0" v-if="openedTabs.includes('workbench')">
			<tabWorkbench ref="tabWorkbench" />
		</view>
		<!-- 商城 -->
		<view class="page-tab" v-show="tabIndex===1" v-if="openedTabs.includes('mall')">
			<tabMall ref="tabMall" />
		</view>
		<!-- 首页 -->
		<view class="page-tab" v-show="tabIndex===2" v-if="openedTabs.includes('home')">
			<tabHome ref="tabHome" />
		</view>
		<!-- 欢乐社区 -->
		<view class="page-tab" v-show="tabIndex===3" v-if="openedTabs.includes('community')">
			<tabCommunity ref="tabCommunity" />
		</view>
		<!-- 我的 -->
		<view class="page-tab" v-show="tabIndex===4" v-if="openedTabs.includes('my')">
			<tabMy ref="tabMy" @changeStore="changeStore"/>
		</view>
		<view class="tabbar">
			<view v-for="item in tabList" :key="item.id" @tap="switchTab(item.id,item.name)" class="action" :class="{'middle-button':item.id===2}">
				<image class="icon" :class="{'popIn':tabIndex === item.id}" :src="tabIndex === item.id?item.selectedIconPath:item.iconPath"></image>
				<view class="text" :class="tabIndex ===  item.id?'active':''">{{item.text}}</view>
			</view>
		</view>
		<!-- 版本更新弹窗 -->
		<version-update ref="update"></version-update>
		<!-- 版本更新弹窗 -->
	</view>
</template>

<script>
	import tabWorkbench from '../tab-bar/workbench/workbench.nvue'
	import tabMall from '../tab-bar/mall/mall.nvue'
	import tabHome from '../tab-bar/home/home.nvue'
	import tabCommunity from '../tab-bar/community/community.nvue'
	import tabMy from '../tab-bar/my/my.nvue'
	import versionUpdate from '@/components/version-update/version-update.vue'
	export default {
		name: 'index',
		components: {
			tabWorkbench,
			tabMall,
			tabHome,
			tabCommunity,
			tabMy
		},
		onLoad(option) {
			const { ...a } = option
			this.option = a
		},
		data() {
			return {
				// 传入参数
				option:{},
				// 当前tab索引
				tabIndex: 2,
				openedTabs: ['home'],
				//tab列表
				tabList: [{
						"pagePath": "pages/tab-bar/workbench/workbench",
						"iconPath": "../../static/image/tab/workbench.svg",
						"selectedIconPath": "../../static/image/tab/workbench-select.svg",
						"text": "工作台",
						"name": "workbench",
						"id": 0
					},
					{
						"pagePath": "pages/tab-bar/mall/mall",
						"iconPath": "../../static/image/tab/mall.svg",
						"selectedIconPath": "../../static/image/tab/mall-select.svg",
						"text": "商城",
						"name": "mall",
						"id": 1
					}, {
						"pagePath": "pages/tab-bar/home/home",
						"iconPath": "../../static/image/tab/home.svg",
						"selectedIconPath": "../../static/image/tab/home-select.svg",
						"text": "首页",
						"name": "home",
						"id": 2
					}, {
						"pagePath": "pages/tab-bar/community/community",
						"iconPath": "../../static/image/tab/community.svg",
						"selectedIconPath": "../../static/image/tab/community-select.svg",
						"text": "欢乐社区",
						"name": "community",
						"id": 3
					}, {
						"pagePath": "pages/tab-bar/my/my",
						"iconPath": "../../static/image/tab/my.svg",
						"selectedIconPath": "../../static/image/tab/my-select.svg",
						"text": "我的",
						"name": "my",
						"id": 4
					}
				]
			}
		},
		created() {
			
			
		},
		mounted(){
			if(this.option.name){
				this.switchTab(Number(this.option.id),this.option.name)
			}
			this.$nextTick(function(){
				this.$refs.update.checkUpdate()
			})
		},
		methods: {
			// 切换组件
			switchTab(type, name) {
				// 检查版本更新
				this.$refs.update.checkUpdate()
				this.openedTabs.push(name)
				this.openedTabs = Array.from(new Set(this.openedTabs))
				this.tabIndex = type
			},
			
			/**
			 * 切换门店后重置请求
			 * 
			 * 此处不点击tab则不会渲染dom，会找不到
			 * 不影响切换门店，因为第一次进去会直接请求
			 */
			changeStore(){
				this.$refs.tabHome.initPage()
				this.$refs.tabCommunity && this.$refs.tabCommunity.refresh()
				this.$refs.tabMall && this.$refs.tabMall.refresh()
			}
		}
	}
</script>

<style lang="scss">
	.page-container {
		width: 100vw;
		height: 100vh;
		.page-tab {
			height: calc(100vh - 50px);
			height: calc(100vh - 50px - env(safe-area-inset-bottom));
			position: relative;
			z-index:100;

			.page {
				position: relative;
				box-sizing: border-box;
				height: 100%;
				width: 100vw;
				z-index: 20;
				background-color: $uni-bg-color-grey;
				overflow: auto;
			}
		}

		.tabbar {
			width: 100vw;
			height: 49px;
			flex: 0 0 49px;
			display: flex;
			background-color: #fff;
			position: fixed;
			bottom: 0;
			z-index: 140;
			justify-content: space-around;
			border-top: 1px solid $uni-border-color;
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);

			.action {
				flex: 0 0 20%;
				display: flex;
				flex-direction: column;
				align-items: center;
				position: relative;
				justify-content: center;

				&.middle-button::after {
					content: '';
					width: 36px;
					height: 30px;
					border-top: 1px solid $uni-border-color;
					background-color: #fff;
					top: -10px;
					left: 50%;
					position: absolute;
					margin-left: -18px;
					border-radius: 50%;
				}

				&.middle-button {
					.icon {
						margin-top: -5px;
						margin-bottom: 5px;
						width: $uni-img-size-base;
					}
				}

				.icon {
					width: $uni-img-size-sm;
					height: $uni-img-size-base;
					position: relative;
					z-index: 10;
				}

				.text {
					font-size: $uni-font-size-sm;

					&.active {
						color: #ed6d00;
					}
				}
			}
		}
	}

	/* 弹入 */
	.pop-In {
		-webkit-animation: fadeleftIn .4s;
		animation: fadeleftIn .4s;
		-webkit-animation-name: popIn;
		animation-name: popIn;
	}

	@-webkit-keyframes popIn {
		0% {
			-webkit-transform: scale3d(0, 0, 0);
			transform: scale3d(0.5, 0.5, 0.5);
			opacity: 0;
		}

		50% {
			-webkit-animation-timing-function: cubic-bezier(0.47, 0, 0.745, 0.715);
			animation-timing-function: cubic-bezier(0.47, 0, 0.745, 0.715);
		}

		100% {
			-webkit-transform: scale3d(1, 1, 1);
			transform: scale3d(1, 1, 1);
			-webkit-animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
			animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
			opacity: 1;
		}
	}

	@keyframes popIn {
		0% {
			-webkit-transform: scale3d(0, 0, 0);
			transform: scale3d(0.5, 0.5, 0.5);
			opacity: 0;
		}

		50% {
			-webkit-animation-timing-function: cubic-bezier(0.47, 0, 0.745, 0.715);
			animation-timing-function: cubic-bezier(0.47, 0, 0.745, 0.715);
		}

		100% {
			-webkit-transform: scale3d(1, 1, 1);
			transform: scale3d(1, 1, 1);
			-webkit-animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
			animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
			opacity: 1;
		}
	}
</style>

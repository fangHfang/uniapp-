<template>
	<view>
		<!-- <web-view :webview-styles="webviewStyles" :src="url"></web-view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: '',
				webviewStyles: {
					progress: {
						color: '#67C23A'
					}
				},
				wv: null,
				canBack: false
			}
		},
		onLoad(option) {
			// this.url = decodeURIComponent(option.webUrl)
			this.initWeb(option)
		},
		methods: {
			initWeb(params) {
				const self = this
				if (!params.webUrl) {
					return
				}
				if (params.title) {
					uni.setNavigationBarTitle({
						title: params.title
					})
				}
				// #ifdef APP-PLUS
				const url = decodeURIComponent(params.webUrl)
				const wv = plus.webview.create("", "custom-webview", {
					"plusrequire": "none",
					"uni-app": 'none',
					"top": uni.getSystemInfoSync().statusBarHeight + 44
				})
				wv.loadURL(url)
				const currentWebview = self.$scope.$getAppWebview() || self.$mp.page.$getAppWebview();
				currentWebview.append(wv);
				let loading = plus.nativeUI.showWaiting();
				wv.addEventListener('loading', e => {
					loading.show()
				})
				wv.addEventListener('loaded', e => {
					loading.close()
					loading = null
					wv.canBack(e => {
						self.canBack = e.canBack
						currentWebview.setTitleNViewButtonStyle(0, {
							color: e.canBack ? '#000' : '#fff',
						});
					})
				})
				self.wv = wv
				// #endif
			}
		},
		onBackPress(e) {
			console.log(e)
			if (e.from === 'navigateBack') {
				return false
			}
			// #ifdef APP-PLUS
			if (this.wv && this.canBack) {
				this.wv.back()
				return true
			}
			// #endif
		},
		onNavigationBarButtonTap(e) {
			uni.navigateBack()
		}
	}
</script>

<style>

</style>

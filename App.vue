<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			//#ifdef APP-PLUS  
			this.getClientInfo()
			this.handlePush()
			//#endif 
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			getClientInfo(count = 0) {
				let tempCount = count
				setTimeout(() => {
					var info = plus.push.getClientInfo();
					if (info.clientid && info.clientid !== 'null') {
						console.log(JSON.stringify(info));
						// 存储clientid信息
						this.$store.commit('login/setClientInfo', info)
					} else {
						tempCount++
						// 当循环次数大于10次时，退出循环
						if (tempCount > 100) {
							return
						}
						console.log(tempCount)
						this.getClientInfo(tempCount)
					}
				}, 50)
			},
			/**
			 * 处理推送消息
			 */
			handlePush() {
				// #ifdef APP-PLUS
				const _self = this
				const _handlePush = function(msg) {
					try {
						//这里可以写跳转业务代码
						console.log("recevice:" + JSON.stringify(msg))
						if (msg.payload) {
							if (~(msg.payload + '').indexOf('pages/')) {
								uni.navigateTo({
									url: msg.payload
								})
							} else if (~(msg.payload + '').indexOf('http')) {
								uni.navigateTo({
									url: '/pages/webview/webview?webUrl=' + encodeURIComponent((msg.payload + ''))
								})
							}
						}
					} catch (e) {}
				}
				// 事件处理
				plus.push.addEventListener('click', _handlePush)
				plus.push.addEventListener('receive', _handlePush)
				// #endif
			},
		}

	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import url("/static/iconfont/iconfont.css");
	@import url("/static/zkfont/stylesheet.css");
</style>

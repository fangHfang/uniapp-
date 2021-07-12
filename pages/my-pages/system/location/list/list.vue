<template>
	<view class="page" :style="conContinerStyle">
		<uni-nav-bar id="fixedNavBar" fixed statusBar title="门店定位" left-icon="back" backgroundColor="#ed6d00" color="#fff"
		 @clickLeft="toBack" />
		<view class="con-container">
			<view class="card-box">
				<view class="card">
					<view class="card-header">{{card.title}}</view>
					<view class="card-code">门店code：{{card.code}}</view>
					<view class="map-box" id="mapBox">
						<map v-show="showMap" ref="map" class="map" :style="mapStyle" :latitude="card.latitude" :longitude="card.longitude"
						 :markers="card.covers">
							<cover-view class="location-icon" @click="doGetLocation"></cover-view>
							<cover-view class="icon" @click="doGetLocation"></cover-view>
						</map>
					</view>
				</view>
			</view>
			<view class="info-box" v-for="(info,i) in infoList" :key="i" :class="i===infoList.length-1?'last':''">
				<view class="info">
					<view class="title">定位信息{{i+1}}</view>
					<view class="con">{{info.completeAddress}}</view>
					<view class="title">定位标题</view>
					<view class="con">{{info.title}}</view>
					<view class="title">定位说明</view>
					<view class="con">{{info.describes}}</view>
					<view class="verifying" v-if="info.approveStatus==='0'">审核中</view>
					<view class="verifying" v-if="info.approveStatus==='1'">已通过</view>
					<view class="verifying" v-if="info.approveStatus==='2'">已拒绝</view>
					<view class="edit-box">
						<button type="primary" class="edit-btn" v-if="info.approveStatus==='2'" @tap="viewDetail(info,'edit')">修改信息</button>
						<button type="primary" class="edit-btn" v-else @tap="viewDetail(info,'detail')">查看信息</button>
					</view>
				</view>
			</view>
		</view>
		<view class="page-bottom" :style="`height:${safeArea.bottom + 70}px`">
			<text class="buttom-btn" @click="addLocation" :style="`margin-bottom:${safeArea.bottom}px`">添加定位</text>
		</view>
	</view>
</template>

<script>
	import system from '@/api/system/system.js'
	export default {
		name: 'location',
		data() {
			return {
				// 分页数据
				pages: {
					num: 1,
					allPages: 1,
					size: 100
				},
				systemInfo: uni.getSystemInfoSync(),
				card: {
					title: '测试门店',
					code: '11',
					latitude: 31.20,
					longitude: 121.46,
					address: '',
					covers: [{
						latitude: 31.20,
						longitude: 121.46,
						iconPath: '/static/image/my/location.png',
						width: 20,
						height: 20
					}],
				},
				infoList: [],
				mapBoxTop: 50,
				showMap: true
			}
		},
		computed: {
			//安全区域
			safeArea() {
				return this.systemInfo.safeAreaInsets
			},
			//内容区域样式
			conContinerStyle() {
				let height = this.systemInfo.windowHeight
				let paddingBottom = 70 + this.safeArea.bottom
				// return `min-height:${height}px;padding-bottom:${paddingBottom}px;`
				return `padding-bottom:${paddingBottom}px;`
			},
			// 地图宽高
			mapStyle() {
				let width = this.systemInfo.windowWidth - 40
				return `height:${width}px;width:${width}px;`
			}
		},
		mounted() {
			this.countTopBar()
			this.getStoreDetail()
			this.listRemoteDataByPage()
		},
		/**
		 * 监听滚动
		 * @param {Object} option
		 */
		onPageScroll(option) {
			let scrollTop = option.scrollTop
			this.showMap = scrollTop < this.mapBoxTop
		},
		methods: {
			/**
			 * 计算顶部DOM元素节点
			 */
			async countTopBar() {
				const mapBox = await this.$getComponentsDom('#mapBox');
				const fixedNavBar = await this.$getComponentsDom('#fixedNavBar');
				this.mapBoxTop = mapBox.top - fixedNavBar.height
			},
			/**
			 * 分页查询列表数据
			 */
			listRemoteDataByPage() {
				let postData = {
					pageNum: this.pages.num,
					pageSize: this.pages.size
				}
				uni.showLoading({
					title: '加载中···'
				})
				system.locationPageList(this.$jsonFormat(postData)).then((res) => {
					if (res.code === 200) {
						let data = res.data.records.map(x => {
							let district = (x.districtName || '').split('/').join('')
							return {
								...x,
								completeAddress: district + x.address
							}
						})
						this.infoList = this.pages.num === 1 ? data : [...this.infoList, ...data]
						this.pages.allPages = res.pages
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
			/**
			 * 查询门店详情
			 */
			getStoreDetail() {
				system.storeDetail('').then((res) => {
					if (res.code === 200) {
						this.card = {
							title: res.data.name,
							code: res.data.storeNo,
							latitude: res.data.latitude,
							longitude: res.data.longitude,
							address: res.data.address,
							covers: [{
								latitude: res.data.latitude,
								longitude: res.data.longitude,
								iconPath: '/static/image/my/location.png',
								width: 20,
								height: 20
							}]
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
			 * 返回上一页
			 */
			toBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			/**
			 * 获取位置
			 */
			doGetLocation() {
				let that = this
				uni.getLocation({
					type: 'wgs84',
					geocode: true,
					success: (res) => {
						let markers = [{
							latitude: res.latitude,
							longitude: res.longitude,
							iconPath: '/static/image/my/location.png',
							width: '20px',
							height: '20px'
						}]
						that.card.latitude = res.latitude
						that.card.longitude = res.longitude
						that.card.covers = [...markers]
					},
					fail: (err) => {
						uni.showToast({
							icon: 'none',
							title: "访问位置被拒绝"
						})
						console.log(err.errMsg)
					}
				})
			},
			/**
			 * 添加定位
			 */
			addLocation() {
				uni.navigateTo({
					url: '/pages/my-pages/system/location/edit/edit?pageTitle=添加定位'
				})
			},
			/**
			 * 定位详情
			 */
			viewDetail(info, mark) {
				let pageTitle = '修改定位'
				if (mark === 'detail') {
					pageTitle = '查看定位'
				}
				uni.navigateTo({
					url: '/pages/my-pages/system/location/edit/edit?pageTitle=' + pageTitle + '&storeLocationNo=' + info.storeLocationNo
				})
			}
		}
	}
</script>

<style lang="scss">
	.page {
		background-color: #F2F2F2;
		position: relative;
		overflow: auto;
		min-height: calc(100vh - 70px);
	}

	.map-box {
		position: relative;
		width: calc(100vw - 40px);
		height: calc(100vw - 40px);
		background-color: #f2f2f2;
	}

	.map {
		position: absolute;
		top: 0;
		left: 0;
	}

	.card-box {
		padding: 15px 10px;
		color: $uni-text-color;
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		/* #endif */
	}

	.card {
		background-color: #fff;
		padding: 10px;
		border-radius: $uni-border-radius-base;
	}

	.card-header {
		font-size: $uni-font-size-base;
		line-height: 30px;
	}

	.card-code {
		font-size: $uni-font-size-sm;
		color: $uni-text-color-grey;
		margin-bottom: $uni-spacing-col-base;
	}

	.location-icon {
		position: absolute;
		right: 5px;
		bottom: 5px;
		border-radius: 50%;
		width: 36px;
		height: 36px;
		background-color: #fff;
		box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2);
		box-sizing: content-box;
	}

	.icon {
		position: absolute;
		right: 15px;
		bottom: 15px;
		width: 16px;
		height: 16px;
		z-index: 10;
		border-radius: 50%;
		background-color: $uni-color-primary;
	}

	.info-box {
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		/* #endif */
		padding: $uni-spacing-col-sm $uni-spacing-col-base;
		color: $uni-text-color;
		font-size: $uni-font-size-base;
	}

	.last {
		padding-bottom: $uni-spacing-col-base;
	}

	.info {
		border-style: solid;
		border-width: 1px;
		border-color: $uni-color-primary;
		border-radius: $uni-border-radius-base;
		padding: $uni-spacing-col-base;
		position: relative;
	}

	.verifying {
		position: absolute;
		top: 15px;
		right: 10px;
		color: $uni-color-primary;
		font-size: $uni-font-size-base;
	}

	.title {
		font-weight: 600;
		line-height: 30px;
		font-size: $uni-font-size-base;
	}

	.con {
		font-size: $uni-font-size-sm;
		line-height: 20px;
	}

	.page-bottom {
		background-color: #fff;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 0 10px;
	}

	.buttom-btn {
		height: 40px;
		line-height: 40px;
		text-align: center;
		border-radius: 40px;
		background-color: $uni-color-primary;
		color: #fff;
		position: absolute;
		top: 15px;
		left: 10px;
		right: 10px;
		font-size: $uni-font-size-base;
	}

	.edit-box {
		display: flex;
		justify-content: flex-end;

		.edit-btn {
			display: flex;
			margin: 0;
			align-items: center;
			justify-content: center;
			width: 70px;
			height: 24px;
			border: none;
			font-size: $uni-font-size-sm;
			padding: 0;
			border-radius: 4px;
			color: #fff;
			background-color: $uni-color-primary;
		}
	}
</style>

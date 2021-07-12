<template>
	<view class="page">
		<uni-nav-bar id="topBar" title="员工账号配置" left-icon="back" backgroundColor="#ed6d00" :border="false" color="#fff"
		 @clickLeft="toBack">
			<template slot="right">
				<view class="" @click="addStaff">
					<uni-icons type="plusempty" size="18" color="#fff"></uni-icons>
				</view>
			</template>
		</uni-nav-bar>
		<mescroll-uni :top="options.mescrollTop" :bottom="options.mescrollBottom" ref="mescrollRef" safearea height="100%"
		 @init="mescrollInit" :down="options.downOption" :up="options.upOption" @down="downCallback" @up="upCallback">
			<view class="inner-container">
				<uni-swipe-action>
					<uni-swipe-action-item v-for="(item,index) in staffList" :key="item.accountNumber +'-'+ index" :right-options="actionOptions"
					 @click="bindClick($event, index)" @change="swipeChange($event, index)">
						<view class="staff flex a-center j-space-between">
							<view class="flex a-center">
								<view class="staff-sort flex a-center j-center">{{index + 1}}</view>
								<view class="staff-name">{{item.name}}</view>
								<view class="staff-num">{{item.phone}}</view>
							</view>
							<view class="jurisdiction flex a-center" @click="jurisdiction(item)">设置权限</view>
						</view>
					</uni-swipe-action-item>
				</uni-swipe-action>
			</view>
		</mescroll-uni>
		<!-- 设置权限弹框 -->
		<uni-popup ref="jurisdictionPopup" type="bottom">
			<view class="popup-content juris">
				<view class="popup-header">
					<text class="popup-delete" @click="closeJurisdictionPop">取消</text>
					<text class="popup-title">设置权限</text>
					<view class="action-btn" @click="submit">确定</view>
				</view>
				<view class="jurisdiction-box">
					<v-tabs v-model="tabIndex" :tabs="tabs" :scroll="false" :lineScale="0.2" activeColor="#ed6d00" lineColor="#ed6d00"
					 height="88rpx" fontSize="30rpx" lineHeight="4rpx" color="#CCCCCC" @change="changeTab" border="true"></v-tabs>
					<swiper class="swiper-box" :current="tabIndex" duration="300" @change="swiperChangeJurisdiction">
						<swiper-item v-for="(item,index) in staffSourceData" :key="index" class="swiper-item ">
							<scroll-view class="uni-list" scroll-y>
								<view class="list-content">
									<ly-tree :ref="'tree'+index" :tree-data="item.children" :props="defaultProps" node-key="resourceNo"
									 show-checkbox highlight-current :default-checked-keys="checkedKeys" />
								</view>
							</scroll-view>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="staffPopup" type="dialog" @onTap="onTap" id="popup">
			<uni-popup-dialog mode="base" :title="title" content="" :duration="2000" :before-close="true" @close="close"
			 @confirm="confirm">
				<template slot="content">
					<view class="content">
						<view class="">
							<view class="staff-name">员工姓名</view>
							<input class="staff-input" type="text" v-model="staffName" :maxlength="10" value="" placeholder="请输入授权员工姓名" />
						</view>
						<view>
							<view class="staff-name staff-tel">手机号</view>
							<input class="staff-input" type="number" v-model="phoneNum" value="" placeholder="请输入授权员工手机号" />
						</view>
					</view>
				</template>
			</uni-popup-dialog>
		</uni-popup>
		<uni-popup ref="popup" type="center" class="popup-tips">
			<view class="popup-content" :class="[isSuccess ? 'seccess-color' : '']">{{popMessage}}</view>
		</uni-popup>

		<uni-popup ref="dialogDel" type="dialog">
			<uni-popup-dialog title='提示' content="确定删除该员工吗？" type="warn" @confirm="dialogConfirm"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import system from '@/api/system/system.js'
	import vTabs from "@/components/v-tabs/v-tabs.vue";
	import LyTree from '@/components/ly-tree/ly-tree.vue'
	export default {
		name: 'staff',
		components: {
			vTabs,
			LyTree
		},
		data() {
			return {
				// 页面前端参数
				options: {
					mescroll: '',
					// 下拉容器居顶部距离
					mescrollTop: 0,
					// 下拉容器居底部距离
					mescrollBottom: 0,
					downOption: {},
					upOption: {
						// 如果列表已无数据,可设置列表的总数量要大于5条才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
						noMoreSize: 7,
						empty: {
							tip: '~ 暂无数据哦 ~',
						}
					},
				},
				// 分页数据
				pages: {
					num: 1,
					allPages: 2,
					size: 100
				},
				actionOptions: [{
					text: '编辑',
					style: {
						backgroundColor: '#FD8922'
					}
				}, {
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}],
				staffList: [],
				staffName: '',
				phoneNum: '',
				editStaff: {},
				tabIndex: 0,
				tabs: ['工作台', '商城', '欢乐社区', '我的'],
				staffSourceData: [],
				defaultProps: {
					children: 'children',
					label: 'name'
				},
				checkedKeys: [],
				popMessage: '',
				isSuccess: false,
				title: '添加授权员工'
			}
		},
		onLoad() {},
		mounted() {
			this.countTopBar()
			this.getSourceTree()
		},
		methods: {
			/**
			 * 计算顶部DOM元素节点
			 */
			async countTopBar() {
				const topBar = await this.$getComponentsDom('#topBar');
				this.options.mescrollBottom = topBar.height + 'px'
			},
			/**
			 * 初始化回调方法
			 * @param {Object} mescroll
			 */
			mescrollInit(mescroll) {
				this.options.mescroll = mescroll
			},
			/**
			 * 下拉刷新
			 * */
			async downCallback() {
				// 重置列表为第一页 (自动执行 page.num=1, 再触发upCallback方法
				this.options.mescroll.resetUpScroll();
			},
			/**
			 * 上拉分页 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10
			 */
			async upCallback(page) {
				const that = this
				this.pages.num = page.num
				const res = await that.listRemoteDataByPage()
				setTimeout(() => {
					//联网成功的回调,隐藏下拉刷新的状态
					that.options.mescroll.endByPage(res.data.length, that.pages.allPages)
				}, 300);
			},

			/**
			 * 分页查询列表数据
			 */
			listRemoteDataByPage() {
				const that = this
				return new Promise((resolve, reject) => {
					let postData = {
						pageNum: that.pages.num,
						pageSize: that.pages.size
					}
					system.pageListStaff(this.$jsonFormat(postData)).then((res) => {
						if (res.code === 200) {
							that.staffList = that.pages.num === 1 ? res.data : [...that.staffList, ...res.data]
							that.pages.allPages = 1
							resolve(res)
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
						reject(err)
					})
				})

			},
			/**
			 * 返回上一级页面
			 */
			toBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			/**
			 * tab切换事件
			 */
			changeTab(index) {
				this.tabIndex = index;
			},
			/**
			 * swipe切换事件
			 * @param {Object} e
			 */
			swiperChangeJurisdiction(e) {
				let {
					current
				} = e.target;
				this.tabIndex = current;
			},
			/**
			 * 向左滑动选择编辑或删除
			 * @param {Object} e
			 */
			bindClick(e, index) {
				if (e.content.text === '编辑') {
					this.title = '修改授权员工'
					this.staffName = this.staffList[index].name
					this.phoneNum = this.staffList[index].phone
					this.editStaff = this.staffList[index]
					this.$refs.staffPopup.open();
				} else if (e.content.text === '删除') {
					this.editStaff = this.staffList[index]
					this.$refs.dialogDel.open()
				}
			},
			swipeChange(e, index) {
				// console.log('当前状态：' + e + '，下标：' + index)
			},
			dialogConfirm(done) {
				let postData = {}
				postData.operatorNo = this.editStaff.operatorNo
				postData.userNo = this.editStaff.userNo
				system.delStaff(postData).then((res) => {
					if (res.code === 200) {
						uni.showToast({
							icon: "success",
							title: '删除成功'
						})
						setTimeout(() => {
							done()
							this.downCallback()
						}, 1500)
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
			checkboxChange(e) {
				var items = this.items,
					values = e.detail.value;
				for (var i = 0, lenI = items.length; i < lenI; ++i) {
					const item = items[i]
					if (values.includes(item.value)) {
						this.$set(item, 'checked', true)
					} else {
						this.$set(item, 'checked', false)
					}
				}
			},
			/**
			 * 打开设置权限弹框
			 */
			jurisdiction(item) {
				this.editStaff = item
				this.getStaffSource(item.operatorNo)
				this.$refs.jurisdictionPopup.open()
			},
			/**
			 * 关闭设置权限弹框
			 */
			closeJurisdictionPop() {
				this.$refs.jurisdictionPopup.close()
			},
			/**
			 * 选择权限，关闭设置权限弹框
			 */
			submit() {
				let keys = []
				this.tabs.forEach((x, i) => {
					let temp = this.$refs['tree' + i][0].getCheckedKeys()
					keys = [...keys, ...temp]
				})
				let postData = {
					"operatorNo": this.editStaff.operatorNo,
					"resourceNos": keys,
					"userNo": this.editStaff.userNo
				}
				system.setStaffResource(postData).then((res) => {
					if (res.code === 200) {
						uni.showToast({
							icon: "success",
							title: '权限配置成功'
						})
						this.$refs.jurisdictionPopup.close()
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
			 * 添加/修改授权员工
			 */
			addStaff() {
				this.title = '添加授权员工'
				this.staffName = ''
				this.phoneNum = ''
				this.$refs.staffPopup.open();
			},
			/**
			 * 点击取消按钮触发
			 * @param {Object} done
			 */
			close(done) {
				done()
			},
			/**
			 * 点击确认按钮触发
			 * @param {Object} done
			 */
			confirm(done) {
				const reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
				if (!this.staffName) {
					this.popMessage = '请输入姓名'
					this.$refs.popup.open()
					this.isSuccess = false
					setTimeout(() => {
						this.$refs.popup.close()
					}, 2000)
				} else if (!this.phoneNum) {
					this.popMessage = '请输入手机号码'
					this.$refs.popup.open()
					this.isSuccess = false
					setTimeout(() => {
						this.$refs.popup.close()
					}, 2000)
				} else if (!reg.test(this.phoneNum)) {
					this.popMessage = '手机号码格式不正确\n请重新输入'
					this.$refs.popup.open()
					this.isSuccess = false
					setTimeout(() => {
						this.$refs.popup.close()
					}, 2000)
				} else {
					let phoneArr = this.staffList.map(x => x.phone)
					if (phoneArr.includes(this.phoneNum) && this.title !== '修改授权员工') {
						this.popMessage = '手机号已被绑定\n请选择其他手机号'
						this.isSuccess = false
						this.$refs.popup.open()
						setTimeout(() => {
							this.$refs.popup.close()
						}, 2000)
					} else {
						let postData = {
							"name": this.staffName,
							"phone": this.phoneNum
						}
						if (this.title === '修改授权员工') {
							postData.operatorNo = this.editStaff.operatorNo
							postData.userNo = this.editStaff.userNo
							system.modifyStaff(postData).then((res) => {
								if (res.code === 200) {
									this.popMessage = '修改成功！\n该员工可继续使用此手机号\n登录订货助手'
									this.isSuccess = true
									this.$refs.popup.open()
									setTimeout(() => {
										this.$refs.popup.close()
										done()
										this.downCallback()
									}, 1500)
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
						} else {
							system.createStaff(postData).then((res) => {
								if (res.code === 200) {
									this.popMessage = '添加成功！\n该员工可使用此手机号\n登录订货助手'
									this.isSuccess = true
									this.$refs.popup.open()
									setTimeout(() => {
										this.$refs.popup.close()
										done()
										this.downCallback()
									}, 1500)
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
			},
			/**
			 * 获取资源树
			 */
			getSourceTree() {
				system.resourceTree('').then((res) => {
					if (res.code === 200) {
						this.staffSourceData = res.data || []
						this.tabs = this.staffSourceData.map(x => x.name)
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
			 * 获取当前用户权限
			 */
			getStaffSource(operatorNo) {
				this.checkedKeys=[]
				let params = '?operatorNo=' + operatorNo
				system.staffResourceList(params).then((res) => {
					if (res.code === 200) {
						this.checkedKeys = res.data.map(x => x.resourceNo)
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
	.page {
		height: 100vh;
		z-index: 1;
		overflow: hidden;
		position: relative;
		background-color: #F2F2F2;
	}

	// 背景图
	.bg-color {
		position: fixed;
		top: 0;
		z-index: 0;
		width: 100vw;
		height: 30vh;
		background-color: $uni-color-primary;
	}

	.inner-container {
		min-height: 30vh;
		background-color: #F2F2F2;
	}

	.staff {
		width: calc(100% - 20px);
		height: 49px;
		background: #fff;
		padding: 0 10px;
		border-bottom: 1px solid #CCCCCC;

		.staff-sort {
			width: 18px;
			height: 18px;
			color: #fff;
			font-size: 13px;
			background: #ed6d00;
			border-radius: 50%;
		}

		.staff-name {
			color: #1C1C1C;
			font-size: 15px;
			font-weight: bold;
			margin: 0 10px 0 15px;
		}

		.staff-num {
			color: #1C1C1C;
			font-size: 13px;
		}

		.jurisdiction {
			color: #ed6d00;
			font-size: 12px;
		}
	}

	// 设置权限弹窗
	.popup-content.juris {
		height: 400px;
		border-radius: $uni-border-radius-base $uni-border-radius-base 0 0;
		background-color: #fff;

		.popup-header {
			height: 44px;
			border-bottom: 1px solid $uni-border-color;
			position: relative;
			text-align: center;
			line-height: 44px;
			font-size: 15px;

			.popup-delete {
				position: absolute;
				left: 10px;
				top: 0;
				width: 36px;
				height: 100%;
				color: #666666;
			}

			.action-btn {
				width: 36px;
				height: 100%;
				right: 10px;
				top: 0;
				color: #ed6d00;
				position: absolute;
			}
		}

		.jurisdiction-box {
			height: calc(100% - 45px);

			/deep/ .v-tabs__container {
				border-bottom: 1px solid #ddd;
			}

			.uni-list {
				height: 100%;
				box-sizing: border-box;

				.uni-list-cell {
					height: 40px;

					.check-box {
						.check-item {
							display: flex;
							align-items: center;
						}

						/deep/ .uni-checkbox-input {
							width: 14px;
							height: 14px;
							display: flex;
							align-items: center;
							justify-content: center;
							background: #fff;
							border-radius: 50%;
							border-color: #CCCCCC;
						}

						/deep/ .uni-checkbox-input::before {
							font-size: 13px;
							background: #ed6d00;
							color: #ed6d00;
							border-radius: 50%;
						}

						/deep/ .uni-checkbox-input-checked {
							border-color: #ed6d00;
						}
					}

					.check-name {
						color: #1C1C1C;
						font-size: 15px;
						margin-left: 5px;
					}
				}
			}

			// swpier
			.swiper-box {
				height: calc(100% - 45px);
			}
		}
	}

	#popup {
		/deep/ .uni-dialog-content {
			padding-left: 0;
			padding-right: 0;
		}

		/deep/ .uni-popup__error {
			color: #1C1C1C;
			font-size: 19px;
		}

		/deep/ .uni-dialog-title {
			padding-bottom: 15px;
		}

		.content {
			width: calc(100% - 20px);
			padding: 25px 10px;
			border-top: 1px solid #ddd;
			border-bottom: 1px solid #ddd;

			.staff-name {
				color: #252527;
				font-size: 13px;
				margin-bottom: 12px;
			}

			.staff-tel {
				margin-top: 19px;
			}

			.staff-input {
				height: 49px;
				font-size: 13px;
				background: #F2F2F2;
				border: 1px solid #E5E5E5;
				border-radius: 3px;
				display: flex;
				align-items: center;
				padding: 0 12px;

				/deep/ .uni-input-placeholder {
					color: #CCCCCC;
					font-size: 13px;
				}
			}
		}
	}

	.popup-tips {
		/deep/ .uni-transition {
			display: none;
		}

		.popup-content {
			width: 200px;
			height: 75px;
			white-space: pre;
			text-align: center;
			display: flex;
			color: #ed6d00 !important;
			font-size: 13px;
			align-items: center;
			justify-content: center;
			color: rgba(0, 0, 0, 0.8);
			border-radius: 5px;
			background: rgba(0, 0, 0, 0.8);
		}

		.seccess-color {
			color: #00B60D !important;
		}
	}
</style>

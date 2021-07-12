import wallet from '@/api/wallet/wallet.js'
import mall from '@/api/mall/mall.js'
import order from '@/api/order/order.js'
import userApi from '@/api/user/user.js'
import systemApi from '@/api/system/system.js'
import exchangeApi from '@/api/user/exchange.js'
import AjaxUtil from "@/common/utils/request.js"
import * as utils from '@/common/utils/index'

const user = {
	namespaced: true,
	state: {
		// 登录状态：0-未登录，1-登录中(无验证码无登陆中)，2-登录成功，3-登录失败
		loginStatus: 0,
		userInfo: {},
		// 积分信息
		integralInfo: {},
		// 返利信息
		rebateInfo: {},
		// 白条
		whiteBarInfo: {},
		// 优惠券数量
		couponNumber: 0,
		// 兑换券数量
		exchangeNumber: 0,
		// 兑换点数量、抵扣券、消费券数量
		epStoreNumber: 0,
		// 待付款数量
		waitPayNumber: 0,
		// 门店集合（用于切换）
		storeList: [],
		// 门店选中下标
		storeIndex: 0,
		// 用户名称
		userName: "",
		// 门店支付渠道
		payChannel: [],
		//个推 需要的配置信息
		clientInfo: {},
		// 我的页面-兑换点种类数量
		exchangeType:0,
		// 下单-返利上线
		rebateLimit:null,
		// 季度排名信息
		quarterlyRankInfo:{},
		// 门店可选签约汇总
		summaryOptionalInfo:{},
		// 年度签约汇总
		summaryRequiredInfo:{},
		// 权限列表
		resourceList:[]
	},

	mutations: {
		// 设置积分
		setIntegral(state, {
			data
		}) {
			state.integralInfo = data;
		},
		// 设置返利
		setRebate(state, {
			data
		}) {
			state.rebateInfo = data;
		},
		// 设置白条
		setWhiteBar(state, {
			data
		}) {
			state.whiteBarInfo = data;
		},
		// 设置优惠券数量
		setCouponNumber(state, couponNumber) {
			state.couponNumber = couponNumber;
		},
		// 设置兑换券数量
		setExchangeNumber(state, exchangeNumber) {
			state.exchangeNumber = exchangeNumber;
		},
		// 设置抵扣券、消费券数量
		setEpStoreNumber(state, epStoreNumber) {
			state.epStoreNumber = epStoreNumber;
		},
		// 设置待付款数量
		setWaitPayNumber(state, waitPayNumber) {
			state.waitPayNumber = waitPayNumber;
		},
		// 设置门店集合（用于切换）
		setStoreList(state, storeList) {
			state.storeList = storeList;
		},
		// 设置选中门店下标
		setStoreIndex(state, index) {
			state.storeIndex = index;
		},
		// 设置用户名称
		setUserName(state, name) {
			state.userName = name;
		},
		// 设置门店支付渠道
		setPayChannel(state, payChannel) {
			state.payChannel = payChannel;
		},
		// 设置个推配置信息
		setClientInfo(state, payload) {
			state.clientInfo = payload;
		},
		// 设置兑换点种类数量
		setExchangeType(state, number) {
			state.exchangeType = number;
		},
		// 设置下单-返利上限
		setRebateLimit(state, number) {
			state.rebateLimit = number;
		},
		// 设置季度排名信息
		setQuarterlyRank(state, info) {
			state.quarterlyRankInfo = info;
		},
		// 设置门店可选签约汇总
		setSummaryOptional(state, info) {
			state.summaryOptionalInfo = info;
		},
		// 设置年度签约汇总
		setSummaryRequired(state, info) {
			state.summaryRequiredInfo = info;
		},
		// 设置权限列表
		setResourceList(state, list) {
			state.resourceList = list;
		},

	},
	getters: {},

	actions: {
		/**
		 * 返利使用限额
		 * */
		getRebateLimit({commit,state}) {
			return new Promise((resolve, reject) => {
				userApi.getConfigRebateLimit().then((res) => {
					const {data} = res
					commit('setRebateLimit', data)
					resolve(res)
				}).catch((err) => {
					console.log(err, '获取返利使用限额失败')
					reject()
				})
			})
		},

		/**
		 * 更新账户信息
		 * @param  state 存储数据和状态
		 * @param  userDTO 账户信息
		 */
		updateUserInfo({
			commit,
			state
		}, userDTO) {
			return new Promise((rs, rj) => {
				// 查询积分
				let integral = new Promise((resolve, reject) => {
					wallet.integralDetail().then((res) => {
						commit('setIntegral', res)
						resolve(res)
					}).catch((err) => {
						console.log(err, '查询积分错误')
						reject()
					})
				})
				// 查询返利
				let rebate = new Promise((resolve, reject) => {
					wallet.rebateDetail().then((res) => {
						commit('setRebate', res)
						resolve(res)
					}).catch((err) => {
						console.log(err, '查询返利错误')
						reject()
					})
				})
				// 查询返利
				let whiteBar = new Promise((resolve, reject) => {
					wallet.whiteBarDetail().then((res) => {
						commit('setWhiteBar', res)
						resolve(res)
					}).catch((err) => {
						console.log(err, '查询返利错误')
						reject()
					})
				})
        // 获取门店优惠券数量
        let coupon = new Promise((resolve, reject )=>{
          mall.getCouponStoreNumber('').then((res)=>{
            const { cpCount } = res.data
            commit('setCouponNumber',cpCount)
            resolve(res)
          }).catch((err)=>{
            console.log(err,'查询优惠券错误')
            reject()
          })
        })
				// 获取兑换券数量
				let exchange = new Promise((resolve, reject) => {
					let postData = '?couponClass=1'
					mall.getCouponStoreNumber(postData).then((res) => {
						const {
							cpCount
						} = res.data
						commit('setExchangeNumber', cpCount)
						resolve(res)
					}).catch((err) => {
						console.log(err, '查询优惠券错误')
						reject()
					})
				})
				// 获取抵扣券/消费券数据
				let epStore = new Promise((resolve, reject) => {
					let postData = '?couponClass=0'
					mall.getCouponStoreNumber(postData).then((res) => {
						const {
							cpCount
						} = res.data
						commit('setEpStoreNumber', cpCount)
						resolve(res)
					}).catch((err) => {
						console.log(err, '查询优惠券错误')
						reject()
					})
				})
				// 查询待付款订单数量
				// orderStatus 状态 0 待付款、1 待收货  ，2 部分收货 ，3 取消、4 已完成，5 强制收货
				let waitPay = new Promise((resolve, reject) => {
					let postData = {
						'pageReq.pageNum': 1,
						'pageReq.pageSize': 10,
						orderStatus: 0
					}
					order.listOrderByPage(postData).then((res) => {
						const {
							total
						} = res.data
						commit('setWaitPayNumber', total)
						resolve(res)
					}).catch((err) => {
						console.log(err, '查询返利错误')
						reject()
					})
				})
				// 查询返利
				let storeList = new Promise((resolve, reject) => {
					wallet.getStoreList().then((res) => {
						res.data.map((item, index) => {
							// 默认选中
							if (item.checked) {
								commit('setStoreIndex', index)
							}
						})
						commit('setStoreList', res.data)
						resolve(res)
					}).catch((err) => {
						console.log(err, '获取门店错误')
						reject()
					})
				})

				// 查询用户名称
				let userName = new Promise((resolve, reject) => {
					userApi.getLoginUserName().then((res) => {
						const {
							name
						} = res.data
						commit('setUserName', name)
						resolve(res)
					}).catch((err) => {
						console.log(err, '获取用户名称失败')
						reject()
					})
				})

				// 查询门店支付渠道
				let payChannel = new Promise((resolve, reject) => {
					systemApi.getPayChannel().then((res) => {
						const {
							data
						} = res
						commit('setPayChannel', data)
						resolve(res)
					}).catch((err) => {
						console.log(err, '获取用户名称失败')
						reject()
					})
				})

				// 返利使用限额
				let rebateLimit = new Promise((resolve, reject) => {
					userApi.getConfigRebateLimit().then((res) => {
						const {data} = res
						commit('setRebateLimit', data)
						resolve(res)
					}).catch((err) => {
						console.log(err, '获取用户名称失败')
						reject()
					})
				})

				// 获取兑换点种类数量
				let exchangeTypeNumber = new Promise((resolve, reject) => {
					exchangeApi.getExchangeTypeNumber().then((res) => {
						const {data} = res
						commit('setExchangeType', data)
						resolve(res)
					}).catch((err) => {
						console.log(err, '获取用户名称失败')
						reject()
					})
				})


				// 获取季度排名
				let quarterlyRank = new Promise((resolve, reject) => {
					systemApi.getQuarterlyRank().then((res) => {
						const {data} = res
						commit('setQuarterlyRank', data)
						resolve(res)
					}).catch((err) => {
						console.log(err, '获取用户名称失败')
						reject()
					})
				})

				// 获取门店可选签约汇总
				let summaryOptional = new Promise((resolve, reject) => {
					systemApi.getSummaryOptional().then((res) => {
						const {data} = res
						commit('setSummaryOptional', data)
						resolve(res)
					}).catch((err) => {
						console.log(err, '获取用户名称失败')
						reject()
					})
				})

				// 获取年度签约汇总
				let summaryRequired = new Promise((resolve, reject) => {
					systemApi.getSummaryRequired().then((res) => {
						const {data} = res
						commit('setSummaryRequired', data)
						resolve(res)
					}).catch((err) => {
						console.log(err, '获取用户名称失败')
						reject()
					})
				})


				// 获取用户权限列表
				let resourceList = new Promise((resolve, reject) => {
					userApi.getUserResourceList().then((res) => {
						const {data} = res
						commit('setResourceList', data)
						resolve(res)
					}).catch((err) => {
						console.log(err, '获取用户权限列表失败')
						reject()
					})
				})






				Promise.all([integral, rebate, whiteBar, exchange, epStore, waitPay, storeList, userName,rebateLimit,exchangeTypeNumber]).then((result) => {
					rs()
				}).catch((error) => {
					rj()
				})
			})
		},

		uniPushCid({commit,state}) {
			return new Promise((resolve, reject) => {
				// 查询用户名称
				userApi.getLoginUserName().then((res) => {
					if(res.code===200){
						let params={
								"cid": state.clientInfo.clientid,
								"operatorNo": res.data.operatorNo
							}
						userApi.buidOneAlias(params).then((res) => {
							if(res.code===200){
								console.log('推送clientid成功')
							}
						}).catch((err) => {
							console.log(err, '推送clientid失败')
							reject()
						})
					}
				}).catch((err) => {
					console.log(err, '获取用户名称失败')
					reject()
				})
			})
		},
		/**
		 * 切换门店
		 */
		changeStore({
			commit,
			state
		}, {
			postData,
			index
		}) {
			return new Promise((resolve, reject) => {
				wallet.changeStore(postData).then((res) => {
					const {
						access_token,
						token_type
					} = res.data
					// 将登录后的token存入 local Storage
					AjaxUtil.setAccessToken(token_type + access_token)
					uni.showToast({
						icon: "none",
						title: "切换门店成功",
					})
					commit('setStoreIndex', index)
					resolve(res)
				}).catch((err) => {
					console.log(err)
					reject(err)
				})
			})
		}
		// /**
		//  * 重置账户密码
		//  * @param  state 存储数据和状态
		//  * @param  id 账户id
		//  */
		// resetUserPwd (state, id) {
		//   return new Promise((resolve, reject) => {
		//     resetUserPwd(id).then((res) => {
		//       resolve(res)
		//     }).catch((err) => {
		//       reject(err)
		//       console.log(err)
		//     })
		//   })
		// },
	}
}

export default user

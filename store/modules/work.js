import refund from '@/api/order/refund.js'
import easeOrder from '@/api/ease/order.js'
import easeRenew from '@/api/ease/renew.js'
import AjaxUtil from '@/common/utils/request.js'
import * as utils from '@/common/utils/index'

const work = {
	'namespaced': true,
	'state': {
		// 退货集合
		'returnCollection': [],
		// 扫码出库商品集合
		'outInfoList': [],
		// 扫码出库车主手机号
		'outCarMaster': {},
		// 换新-扫码出库商品集合
		'renewOutInfoList': []
	},

	'mutations': {
		// 设置用户名称
		setReturnCollection(state, list) {
			state.returnCollection = list
		},
		// 设置 扫码出库商品
		setOutInfoList(state, list) {
			state.outInfoList = list
		},
		// 删除 扫码出库商品
		deleteOutInfoList(state, itemBarCode) {
			const index = state.outInfoList.findIndex((item) => {
				return item.itemBarCode === itemBarCode
			})
			state.outInfoList.splice(index, 1)
		},
		// 设置 换新-扫码出库商品
		setRenewOutInfoList(state, list) {
			state.renewOutInfoList = list
		},
		// 删除 换新-扫码出库商品
		deleteRenewOutInfoList(state, itemBarCode) {
			const index = state.renewOutInfoList.findIndex((item) => {
				return item.itemBarCode === itemBarCode
			})
			state.renewOutInfoList.splice(index, 1)
		},
		// 扫码设置车主手机号
		setCarMasterPhone(state, payload) {
			state.outCarMaster = payload
		}
	},
	'getters': {},

	'actions': {

		/**
		 * 根据条码查询商品
		 */
		getRefundProductByCode({
			commit,
			state
		}, postData) {
			return new Promise((resolve, reject) => {
				refund.getRefundProductByCode(postData).then((res) => {
					const {
						itemBarCode
					} = res.data
					// 查询订单编号，是否已经添加
					const isAdd = state.returnCollection.find((item) => {
						return item.itemBarCode === itemBarCode
					})
					if (isAdd) {
						uni.showToast({
							'icon': 'none',
							'title': '请勿重复添加'
						})
					} else {
						commit('setReturnCollection', state.returnCollection.concat([res.data]))
						uni.showToast({
							'icon': 'none',
							'title': '添加成功'
						})
					}
					resolve(res)
				}).catch((err) => {
					uni.showToast({
						'icon': 'none',
						'title': err.msg
					})
					console.log(err)
					reject(err)
				})
			})
		},
		/**
		 * 扫码出库-查询条码信息
		 */
		getOutInfoEaseOrder({
			commit,
			state
		}, postData) {
			return new Promise((resolve, reject) => {
				easeOrder.outInfoEaseOrder(postData).then((res) => {
					if(res.code===200){
						const {
							itemBarCode
						} = res.data
						// 查询订单编号，是否已经添加
						const isAdd = state.outInfoList.find((item) => {
							return item.itemBarCode === itemBarCode
						})
						if (isAdd) {
							uni.showToast({
								'icon': 'none',
								'title': '请勿重复添加'
							})
							reject(res)
						} else {
							commit('setOutInfoList', state.outInfoList.concat([res.data]))
							uni.showToast({
								'icon': 'none',
								'title': '添加成功'
							})
						}
						resolve(res)
					}else{
						uni.showToast({
							'icon': 'none',
							'title': err.msg || '扫码识别失败'
						})
						reject(err)
					}
				}).catch((err) => {
					uni.showToast({
						'icon': 'none',
						'title': err.msg || '扫码识别失败'
					})
					console.log(err)
					reject(err)
				})
			})
		},
		/**
		 * 换新-扫码出库-查询条码信息
		 */
		getOutInfoRenewOrder({
			commit,
			state
		}, postData) {
			return new Promise((resolve, reject) => {
				easeRenew.scanRenew(postData).then((res) => {
					const {
						itemBarCode
					} = res.data
					// 查询订单编号，是否已经添加
					const isAdd = state.renewOutInfoList.find((item) => {
						return item.itemBarCode === itemBarCode
					})
					if (isAdd) {
						uni.showToast({
							'icon': 'none',
							'title': '请勿重复添加'
						})
						reject(res)
					} else {
						commit('setRenewOutInfoList', state.renewOutInfoList.concat([res.data]))
						uni.showToast({
							'icon': 'none',
							'title': '添加成功'
						})
					}
					resolve(res)
				}).catch((err) => {
					uni.showToast({
						'icon': 'none',
						'title': err.msg
					})
					console.log(err)
					reject(err)
				})
			})
		}
	}
}

export default work

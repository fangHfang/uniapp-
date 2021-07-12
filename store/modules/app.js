const app = {
	'namespaced': true,
	'state': {
		// app暂不更新
		'noUpDateVersion': false,
		// 触发更新数量视图-购物车
		'triggerNumber': false,
		// 触发更新数量视图-商城tab
		'triggerNumberMallTab': false
	},

	'mutations': {
		// 设置用户名称
		setNoUpDateVersion(state, type) {
			state.noUpDateVersion = type
		},
		// 触发更新数量视图-购物车
		setTriggerNumber(state) {
			state.triggerNumber = !state.triggerNumber
		},
		// 触发更新数量视图-商城tab
		setTriggerNumberMallTab(state) {
			state.triggerNumberMallTab = !state.triggerNumberMallTab
		},
	},
	'getters': {},

	'actions': {

		/**
		 * 根据条码查询商品
		 */
		setNoUpDateVersion({
			commit,
			state
		}, type) {
			return new Promise((resolve, reject) => {
				commit('setNoUpDateVersion', type)
			})
		},
		
		/**
		 * 触发更新数量视图-购物车
		 */
		setTriggerNumber({
			commit,
			state
		}) {
			return new Promise((resolve, reject) => {
				commit('setTriggerNumber')
			})
		},
		
		/**
		 * 触发更新数量视图-商城tab
		 */
		setTriggerNumberMallTab({
			commit,
			state
		}) {
			return new Promise((resolve, reject) => {
				commit('setTriggerNumberMallTab')
			})
		},
		
		
	}
}

export default app

import AjaxUtil from '@/common/utils/request.js'

export default {
	
	
	/**
	 * 分页查询门店兑换点列表
	 * @param postData
	 */
	listExchangeByPage(postData) {		
		return new Promise((resolve,reject)=>{
			AjaxUtil.get(`/api/market/store/app/epStore/page` + postData,(result) => {
				resolve(result);
			}, (err) => {
				reject(err);
			});
		})
	},
	
	/**
	 * 获取兑换点详情
	 * @param postData
	 */
	getExchangeDetail(postData) {		
		return new Promise((resolve,reject)=>{
			AjaxUtil.get(`/api/market/store/app/epStore/detail` + postData,(result) => {
				resolve(result);
			}, (err) => {
				reject(err);
			});
		})
	},
	
	
	/**
	 * 获取兑换点详情里的列表
	 * @param postData
	 */
	getExchangeDetailList(postData) {		
		return new Promise((resolve,reject)=>{
			AjaxUtil.post(`/api/market/store/app/epStore/detail/list`,postData,(result) => {
				resolve(result);
			}, (err) => {
				reject(err);
			});
		})
	},
	
	/**
	 * 获取兑换点种类数量
	 * @param postData
	 */
	getExchangeTypeNumber() {		
		return new Promise((resolve,reject)=>{
			AjaxUtil.get(`/api/market/store/app/epStore/count`,(result) => {
				resolve(result);
			}, (err) => {
				reject(err);
			});
		})
	},
	
	/**
	 * 创建兑换点订单
	 */
	createOrderExchange(postData) {
		return new Promise((resolve,reject)=>{
			AjaxUtil.post(`/api/trade/store/app/order/exchange/create`,postData,(result) => {
				resolve(result);
			}, (err) => {
				reject(err);
			});
		})
	},
	
}
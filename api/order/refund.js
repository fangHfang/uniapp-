import AjaxUtil from '@/common/utils/request.js'
export default {
	
	/**
	 * 查询分页查询退货记录
	 */
	listRefundByPage(postData) {
		return new Promise((resolve,reject)=>{
			AjaxUtil.post('/api/trade/store/app/order/refund/query/page',postData,(result) => {
				resolve(result);
			}, (err) => {
				reject(err);
			});
		})
	},
	/**
	 * 查询退货详情
	 * @param {Object} postData
	 */
	getRefundDetail(postData) {
		return new Promise((resolve,reject)=>{
			AjaxUtil.post('/api/trade/store/app/order/refund/query/page/detail',postData,(result) => {
				resolve(result);
			}, (err) => {
				reject(err);
			});
		})
	},

	/**
	 * 根据条码查询商品信息
	 * @param {Object} postData
	 */
	 getRefundProductByCode(postData) {
		return new Promise((resolve,reject)=>{
			AjaxUtil.post('/api/trade/store/app/order/refund/query/order/item',postData,(result) => {
				resolve(result);
			}, (err) => {
				reject(err);
			});
		})
	},

	/**
	 * 创建退货单
	 * @param {Object} postData
	 */
	 createRefundOrder(postData) {
		return new Promise((resolve,reject)=>{
			console.log(postData,'postData')
			AjaxUtil.post('/api/trade/store/app/order/refund/create',postData,(result) => {
				resolve(result);
			}, (err) => {
				reject(err);
			});
		})
	},
	

}
import AjaxUtil from '@/common/utils/request.js'
export default {
	
	/**
	 * 查询分页查询
	 */
	listOrderByPage(postData) {
		return new Promise((resolve,reject)=>{
			AjaxUtil.post('/api/trade/store/app/order/query/page',postData,(result) => {
				resolve(result);
			}, (err) => {
				reject(err);
			});
		})
	},
	
	/**
	 * 确认收货
	 */
	createOrder(postData) {
		return new Promise((resolve,reject)=>{
			AjaxUtil.post('/api/trade/store/app/order/confirm/received',postData,(result) => {
				resolve(result);
			}, (err) => {
				reject(err);
			});
		})
	},
	/**
	 * 订单详情
	 * @param {*} postData 
	 * @returns 
	 */
	orderDetail(postData) {
		return new Promise((resolve,reject)=>{
			AjaxUtil.post('/api/trade/store/app/order/query/order/detail',postData,(result) => {
				resolve(result);
			}, (err) => {
				reject(err);
			});
		})
	},
	/**
	 * 退款
	 * @param {*} postData 
	 * @returns 
	 */
	 orderRefund(postData) {
		return new Promise((resolve,reject)=>{
			AjaxUtil.post('/api/trade/store/app/order/refund/create/refund/pay',postData,(result) => {
				resolve(result);
			}, (err) => {
				reject(err);
			});
		})
	},
	
	/**
	 * 商城订单-待支付订单-主动取消
	 * @param {*} postData 
	 * @returns 
	 */
	 cancelOrder(postData) {
		return new Promise((resolve,reject)=>{
			AjaxUtil.post('/api/trade/store/app/order/voluntarily/cancel',postData,(result) => {
				resolve(result);
			}, (err) => {
				reject(err);
			});
		})
	},
	
	/**
	 * 积分订单-修改地址
	 * @param {*} postData 
	 * @returns 
	 */
	editAddress(postData) {
		return new Promise((resolve,reject)=>{
			AjaxUtil.post('/api/trade/store/app/order/modify/address',postData,(result) => {
				resolve(result);
			}, (err) => {
				reject(err);
			});
		})
	},
	
	/**
	 * 积分订单-修改地址
	 * @param {*} postData 
	 * @returns 
	 */
	payChannelConfirm(postData) {
		return new Promise((resolve,reject)=>{
			AjaxUtil.post('/api/trade/store/app/order/pay/channel/confirm',postData,(result) => {
				resolve(result);
			}, (err) => {
				reject(err);
			});
		})
	},
	
	/**
	 * 根据订单号查询订单支付结果
	 */
	getPayResultByOrderNo(orderNo) {
		return new Promise((resolve,reject)=>{
			AjaxUtil.get('/api/trade/store/app/order/query/order/payResult?orderNo=' + orderNo,(result) => {
				resolve(result);
			}, (err) => {
				reject(err);
			});
		})
	},

}
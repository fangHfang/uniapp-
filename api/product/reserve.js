import AjaxUtil from '@/common/utils/request.js'

// 预定商品
export default {
	
	
	/**
	 * 添加预定商品
	 * @param postData
	 */
	orderPresellAdd(postData) {		
		return new Promise((resolve,reject)=>{
			AjaxUtil.post(`/api/trade/store/app/presell/order/create`, postData, (result) => {
				resolve(result);
			}, (err) => {
				reject(err);
			});
		})
	},
	
	/**
	 * 删除预定商品
	 * @param postData
	 */
	orderPresellDelete(postData) {		
		return new Promise((resolve,reject)=>{
			AjaxUtil.post(`/api/trade/store/app/presell/order/delete`, postData, (result) => {
				resolve(result);
			}, (err) => {
				reject(err);
			});
		})
	},
	
	
	/**
	 * 查询预定商品分页列表
	 * @param postData
	 */
	listOrderPresellByPage(postData) {
		return new Promise((resolve,reject)=>{
			AjaxUtil.post(`/api/trade/store/app/presell/order/query/page`, postData, (result) => {
				resolve(result);
			}, (err) => {
				reject(err);
			});
		})
	},
	
	
	/**
	 * 预定单个商品
	 * @param postData
	 */
	orderSingleCreate(postData) {
		return new Promise((resolve,reject)=>{
			AjaxUtil.post(`/api/trade/store/app/presell/order/single/create`, postData, (result) => {
				resolve(result);
			}, (err) => {
				reject(err);
			});
		})
	}
	
	
}

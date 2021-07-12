import AjaxUtil from '@/common/utils/request.js'

export default {
	
	
	/**
	 * 查询购物车列表
	 * @param postData
	 */
	listCart(postData) {		
		return new Promise((resolve,reject)=>{
			AjaxUtil.post(`/api/trade/store/app/cart/public/list` , postData, (result) => {
				resolve(result);
			}, (err) => {
				reject(err);
			});
		})
	},
	
	/**
	 * 删除购物车商品
	 * @param postData
	 */
	batchDeleteCart(postData) {		
		return new Promise((resolve,reject)=>{
			AjaxUtil.post(`/api/trade/store/app/cart/delete` , postData, (result) => {
				resolve(result);
			}, (err) => {
				reject(err);
			});
		})
	}
	
	
}

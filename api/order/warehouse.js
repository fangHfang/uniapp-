import AjaxUtil from '@/common/utils/request.js'

export default {
	
	
	/**
	 * 扫码入库
	 * @param postData
	 */
	warehouseCreate(postData) {		
		return new Promise((resolve,reject)=>{
			AjaxUtil.post(`/api/trade/store/app/warehouse/create` , postData, (result) => {
				resolve(result);
			}, (err) => {
				reject(err);
			});
		})
	},

	/**
	 * 根据时间查询扫码入库记录(分页) --- 工作台
	 * @param postData
	 */
	 listWarehouseByPage(postData) {		
		return new Promise((resolve,reject)=>{
			AjaxUtil.post(`/api/trade/store/app/warehouse/query/page`, postData, (result) => {
				resolve(result);
			}, (err) => {
				reject(err);
			});
		})
	},
	
	
	/**
	 * 根据时间查询扫码入库记录(分页) --- 工作台
	 * @param postData
	 */
	 listWarehouseOrderNoByPage(postData) {		
		return new Promise((resolve,reject)=>{
			AjaxUtil.post(`/api/trade/store/app/warehouse/query/page/orderno`, postData, (result) => {
				resolve(result);
			}, (err) => {
				reject(err);
			});
		})
	},
	
}
	
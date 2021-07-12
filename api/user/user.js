import AjaxUtil from '@/common/utils/request.js'

export default {
	
	
	/**
	 * 创建收货地址
	 * @param postData
	 */
	createUserAddress(postData) {		
		return new Promise((resolve,reject)=>{
			AjaxUtil.post(`/api/user/store/app/user/address/create` , postData, (result) => {
				resolve(result);
			}, (err) => {
				reject(err);
			});
		})
	},
	
	/**
	 * 修改收货地址
	 * @param postData
	 */
	modifyUserAddress(postData) {		
		return new Promise((resolve,reject)=>{
			AjaxUtil.put(`/api/user/store/app/user/address/modify` , postData, (result) => {
				resolve(result);
			}, (err) => {
				reject(err);
			});
		})
	},
	
	/**
	 * 获取用户名称
	 */
	getLoginUserName() {		
		return new Promise((resolve,reject)=>{
			AjaxUtil.get(`/api/user/store/app/user/loginUser`, (result) => {
				resolve(result);
			}, (err) => {
				reject(err);
			});
		})
	},

	/**
	 * 删除收货地址
	 * @param postData
	 */
	 delUserAddress(postData) {		
		return new Promise((resolve,reject)=>{
			AjaxUtil.del(`/api/user/store/app/user/address/delete` , postData, (result) => {
				resolve(result);
			}, (err) => {
				reject(err);
			});
		})
	},
	
	/**
	 * 个推：单个用户绑定别名
	 * @param postData
	 */
	 buidOneAlias(postData) {		
		return new Promise((resolve,reject)=>{
			AjaxUtil.post(`/api/basic/admin/getui/buidOneAlias` , postData, (result) => {
				resolve(result);
			}, (err) => {
				reject(err);
			});
		})
	},
	
	/**
	 * 查询返利使用限额
	 * @param postData
	 */
	 getConfigRebateLimit() {		
		return new Promise((resolve,reject)=>{
			AjaxUtil.get(`/api/market/store/app/config/rebateLimit`, (result) => {
				resolve(result);
			}, (err) => {
				reject(err);
			});
		})
	},
	
	
	/**
	 * 获取用户权限列表
	 * @param postData
	 */
	 getUserResourceList() {		
		return new Promise((resolve,reject)=>{
			AjaxUtil.get(`/api/user/store/app/resource/user/list`, (result) => {
				resolve(result);
			}, (err) => {
				reject(err);
			});
		})
	},
	
	

}
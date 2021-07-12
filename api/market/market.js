import AjaxUtil from '@/common/utils/request.js'
export default {
	
	/**
	 * 分页门店签约列表
	 */
	listScStoreByPage(postData) {
		let url = '/store/app/scRule/page'
		// 判断是否传递了审批状态
		if(postData.indexOf('approvalStatus') !== -1){
			url = '/store/app/scStore/page'
		}
		return new Promise((resolve,reject)=>{
			AjaxUtil.get('/api/market' + url + postData,(result) => {
				resolve(result);
			}, (err) => {
				reject(err);
			});
		})
	},

	/**
	 * 签约规则详情
	 */
	 getScStoreDetail(postData) {
		return new Promise((resolve,reject)=>{
			AjaxUtil.get('/api/market/store/app/scRule/detail' + postData,(result) => {
				resolve(result);
			}, (err) => {
				reject(err);
			});
		})
	},

	/**
	 * 门店签约
	 */
	 signScRule(postData) {
		return new Promise((resolve,reject)=>{
			AjaxUtil.get('/api/market/store/app/scRule/sign' + postData,(result) => {
				resolve(result);
			}, (err) => {
				reject(err);
			});
		})
	},
	
	/**
	 * 查询门店签到记录
	 */
	 getSiStoreDetail() {
		return new Promise((resolve,reject)=>{
			AjaxUtil.post('/api/market/store/app/siStore/detail',{},(result) => {
				resolve(result);
			}, (err) => {
				reject(err);
			});
		})
	},
	
	/**
	 * 门店签到
	 */
	 signInSiStore(postData) {
		return new Promise((resolve,reject)=>{
			AjaxUtil.post('/api/market/store/app/siStore/signin',{},(result) => {
				resolve(result);
			}, (err) => {
				reject(err);
			});
		})
	},
	
	/**
	 * 查询是否可以签到
	 */
	 siStoreHasStatus(postData) {
		return new Promise((resolve,reject)=>{
			AjaxUtil.get('/api/market/store/app/siStore/hasStatus',(result) => {
				resolve(result);
			}, (err) => {
				reject(err);
			});
		})
	},
	
	
	/**
	 * 分页查询门店签到明细
	 */
	 listSiStoreDetailByPage(postData) {
		return new Promise((resolve,reject)=>{
			AjaxUtil.get('/api/market/store/app/siStoreDetail/page' + postData,(result) => {
				resolve(result);
			}, (err) => {
				reject(err);
			});
		})
	},
	
	
	/**
	 * 查询门店已签到日期集合
	 */
	 listSiStoreDateArray(postData) {
		return new Promise((resolve,reject)=>{
			AjaxUtil.get('/api/market/store/app/siStoreDetail/queryDateList' + postData,(result) => {
				resolve(result);
			}, (err) => {
				reject(err);
			});
		})
	},
	
	/**
	 * 优惠券叠加限制
	 */
	getCouponLimit(postData) {
		return new Promise((resolve,reject)=>{
			AjaxUtil.get('/api/market/store/app/config/couponLimit',(result) => {
				resolve(result);
			}, (err) => {
				reject(err);
			});
		})
	},
	

}
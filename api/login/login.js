import AjaxUtil from '@/common/utils/request.js'
import * as SystemConstant from '@/static/base/system-constant.js'
export default {
	/**
	 * 发送验证码
	 * @param postData
	 */
	sendCode(postData) {
		return new Promise((resolve,reject)=>{
			AjaxUtil.post(`/api/user/store/app/login/send/code` + postData,{},(result) => {
				resolve(result);
			}, (err) => {
				reject(err);
			});
		})
	},
	
	/**
	 * 登录
	 * @param postData
	 */
	login(postData) {
		return new Promise((resolve,reject)=>{
			AjaxUtil.post(`/api/user/store/app/login` + postData,{},(result) => {
				resolve(result);
			}, (err) => {
				reject(err);
			});
		})
	},
	
	/**
	 * 一键登录
	 * @param postData
	 */
	autoLogin(postData) {
		console.log(postData)
		return new Promise((resolve,reject)=>{
			AjaxUtil.post(`/api/user/store/app/login/quick` + postData,{},(result) => {
				resolve(result);
			}, (err) => {
				reject(err);
			});
		})
	},
	
	
	
}

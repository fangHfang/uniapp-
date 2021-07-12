import AjaxUtil from '@/common/utils/request.js'
import * as SystemConstant from '@/static/base/system-constant.js'
export default {
	/**
	 * 上传图片
	 * @param postData
	 */
	uploadImage(postData) {
		return new Promise((resolve,reject)=>{
			AjaxUtil.post(`/api/user/store/app/register/oss/upload?target=` + postData.target,postData,(result) => {
				resolve(result);
			}, (err) => {
				reject(err);
			});
		})
	},
	
	/**
	 * 营业执照OCR
	 */
	ocrBizLicenseInfo(postData) {
		return new Promise((resolve,reject)=>{
			AjaxUtil.post(`/api/basic/store/app/ocr/ocrBizLicenseInfo` + postData,{},(result) => {
				resolve(result);
			}, (err) => {
				reject(err);
			});
		})
	},
	
	/**
	 * 身份证OCR
	 */
	ocrIdCardPortraitInfo(postData) {
		return new Promise((resolve,reject)=>{
			AjaxUtil.post(`/api/basic/store/app/ocr/ocrIdCardPortraitInfo` + postData,{},(result) => {
				resolve(result);
			}, (err) => {
				reject(err);
			});
		})
	},

	/**
	 * 门店注册
	 */
	storeRegister(postData) {
		return new Promise((resolve,reject)=>{
			AjaxUtil.post(`/api/user/store/app/register`,postData,(result) => {
				resolve(result);
			}, (err) => {
				reject(err);
			});
		})
	},

	
}

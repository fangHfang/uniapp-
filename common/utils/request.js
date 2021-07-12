import * as SystemConstant from '@/static/base/system-constant.js'
import store from '@/store'

/**
 * get请求
 * @param {Object} url
 * @param {Object} data
 */
function get(url, successCallback, failCallback) {
	request(url, 'GET', null, successCallback, failCallback)
}

/**
 * post请求
 * @param {Object} url
 * @param {Object} data
 */
function post(url, data, successCallback, failCallback) {
	request(url, 'POST', data, successCallback, failCallback)
}

/**
 * put请求
 * @param {Object} url
 * @param {Object} data
 */
function put(url, data, successCallback, failCallback) {
	request(url, 'PUT', data, successCallback, failCallback)
}
// 删除
function del(url, data, successCallback, failCallback) {
	request(url, 'DELETE', data, successCallback, failCallback)
}

/**
 * 设置访问令牌
 * @param accessToken
 */
function setAccessToken(accessToken) {
	// #ifdef APP-PLUS
	plus.storage.setItem(SystemConstant.API_TOKEN_KEY, JSON.stringify(accessToken))
	// #endif
	// #ifdef H5
	window.localStorage.setItem(SystemConstant.API_TOKEN_KEY,JSON.stringify(accessToken));
	// #endif
}

/**
* 获取访问令牌
*/
function getAccessToken() {
	// #ifdef APP-PLUS
	let token = plus.storage.getItem(SystemConstant.API_TOKEN_KEY)
	return JSON.parse(token)
	// #endif
	// #ifdef H5
	let token = window.localStorage.getItem(SystemConstant.API_TOKEN_KEY);
	return JSON.parse(token)
	// #endif
}

/**
*  删除访问令牌
*/
function delAccessToken() {
	// #ifdef APP-PLUS
	plus.storage.removeItem(SystemConstant.API_TOKEN_KEY)
	// #endif
	// #ifdef H5
	window.localStorage.removeItem(SystemConstant.API_TOKEN_KEY);
	// #endif
}


/**
 * 获取请求头
 */
function getHeader() {
	// 获取请求来源
	let accessToken = getAccessToken()
	return {
		'Authorization': accessToken,
	}
}



function request(url, method, postData, successCallback, failCallback) {
	let header = getHeader();
	let uniUrl = ""
	// #ifdef APP-PLUS
	// 手动拼接全路径
	if(url.indexOf("http") === 0){
		uniUrl = url
	}else if(url.indexOf("/api/") !== -1){
		url = url.substring(url.indexOf("/api/") + 4)
		uniUrl = SystemConstant.URL + url
	}else if(url.indexOf("/upload/") !== -1){
		uniUrl = SystemConstant.upLoadURL + url
	}else{
		uniUrl = SystemConstant.URL + url
	}
	// #endif
	// #ifdef H5
	uniUrl = url
	// #endif
	uni.request({
		url:uniUrl,
		data: postData,
		header,
		method,
		success: (result) => {
			const { msg, code } = result.data;
			if (code === 200) {
				// 成功
				successCallback(result.data)
				return
			}else{
				// 处理其他情况
				processFetchFail(result,failCallback)
			}
		},
		fail: (err) => {
			// 处理其他情况
			failCallback(err)
			// processFetchFail(resData, failCallback)
		},
		complete: (data) => {
		}
	})
}

/**
 * 处理请求失败情况
 * @param resData
 * @param failCallback
 * @private
 */
function processFetchFail(resData,failCallback) {
	const { msg, code } = resData.data;
	switch (code) {
		case 403:
			// 需要登录
			// 跳转到登录页面
			delAccessToken()
			const pages = getCurrentPages();
			if(pages.length !== 0){
				uni.reLaunch({
					url: '/pages/login/login'
				})
			}
      		failCallback && failCallback(resData.data)
			break
		default:
			failCallback && failCallback(resData.data)
	}
}

export default {
	del,
	get,
	post,
	put,
	delAccessToken,
	setAccessToken,
	getAccessToken,
	getHeader,
}

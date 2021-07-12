import AjaxUtil from "@/common/utils/request.js"
export default {

  /**
	 * 查询换新分页查询
	 */
  listRenewOrderByPage(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.post("/api/trade/store/app/renew/query/page", postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },

  /**
	 * 换新扫码
	 */
  scanRenew(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.post("/api/trade/store/app/renew/query/item", postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },

  /**
	 * 换新明细
	 */
  getRenewDetail(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.post("/api/trade/store/app/renew/query/detail", postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },
  /**
	 * 修改重新上传图片
	 * @param {Object} postData
	 */
  modifyRenewImage(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.post("/api/trade/store/app/renew/modify/image", postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },
  /**
	 * 换新订单-添加新的轮胎
	 * @param {Object} postData
	 */
  modifyRenewAddTyre(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.post("/api/trade/store/app/renew/create/also/modify", postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },
  /**
	 * 创建换新订单
	 * @param {Object} postData
	 */
  createRenewOrder(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.post("/api/trade/store/app/renew/create", postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  }

}

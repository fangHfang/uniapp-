import AjaxUtil from "@/common/utils/request.js"
export default {
  /**
	 * 查询门店APP积分账户
	 * @param postData
	 */
  integralDetail() {
    return new Promise((resolve, reject) => {
      AjaxUtil.get("/api/user/store/app/integral/detail", (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },
  /**
	 * 查询门店APP积分明细分页列表
	 * @param postData
	 */
  integralPageDetail(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.get("/api/user/store/app/integral/page/detail" + postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },
  /**
	 * 查询门店APP返利账户
	 * @param postData
	 */
  rebateDetail() {
    return new Promise((resolve, reject) => {
      AjaxUtil.get("/api/user/store/app/rebate/detail", (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },
  /**
	 * 查询门店APP返利明细分页列表
	 * @param postData
	 */
  rebatePageDetail(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.get("/api/user/store/app/rebate/page/detail" + postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },

  /**
	 * 查询门店白条账户详情
	 * @param postData
	 */
   whiteBarDetail() {
    return new Promise((resolve, reject) => {
      AjaxUtil.get("/api/user/store/app/white/bar/detail", (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },
  /**
   * 查询门店白条账户明细分页列表
   * @param postData
   */
   listWhiteBarByPage(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.get("/api/user/store/app/white/bar/page/detail" + postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },

  /**
   * 获取门店
   */
  getStoreList() {
    return new Promise((resolve, reject) => {
      AjaxUtil.post("/api/user/store/app/user/identity/query",{},(result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },


  /**
   * 切换门店身份
   */
  changeStore(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.put("/api/user/store/app/user/identity/change",postData,(result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },


}

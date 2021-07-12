import AjaxUtil from "@/common/utils/request.js"

export default {

  /**
	 * 发送验证码
	 * @param postData
	 */
  userSendCode(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.put("/api/user/store/app/user/sms/code", postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },

  /**
	 * 修改手机号
	 * @param postData
	 */
  userModifyPhone(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.put("/api/user/store/app/user/modify/phone", postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },
  /**
	 * 门店定位申请
	 * @param postData
	 */
  locationApply(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.put("/api/user/store/app/location/apply", postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },
  /**
	 * 门店定位修改
	 * @param postData
	 */
  locationModify(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.put("/api/user/store/app/location/modify", postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },
  /**
	 * 门店定位删除
	 * @param postData
	 */
  locationDelete(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.del("/api/user/store/app/location/delete" + postData, "", (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },
  /**
	 * 门店定位详情
	 * @param postData
	 */
  locationDetail(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.get("/api/user/store/app/location/info" + postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },
  /**
	 * 门店定位列表
	 * @param postData
	 */
  locationPageList(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.get("/api/user/store/app/location/page" + postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },
  /**
	 * 门店详情
	 * @param postData
	 */
  storeDetail(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.get("/api/user/store/app/location/query/store" + postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },

  /**
	 * 添加门店员工
	 * @param postData
	 */
  createStaff(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.post("/api/user/store/app/user/create", postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },

  /**
	 * 删除门店员工
	 * @param postData
	 */
  delStaff(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.del("/api/user/store/app/user/delete", postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },

  /**
	 * 门店员工详情
	 * @param postData
	 */
  detailStaff(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.get("/api/user/store/app/user/detail" + postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },

  /**
	 * 修改门店员工
	 * @param postData
	 */
  modifyStaff(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.put("/api/user/store/app/user/modify", postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },

  /**
	 * 门店员工列表
	 * @param postData
	 */
  pageListStaff(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.get("/api/user/store/app/user/page" + postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },

  /**
  * 获取门店支付渠道
  * @params:
  */
  getPayChannel(){
    return new Promise((resolve, reject) => {
      AjaxUtil.get("/api/user/store/app/location/pay/list", (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },

  /**
	 * 资源树
	 * @param postData
	 */
  resourceTree(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.get("/api/user/store/app/resource/tree" + postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },

  /**
	 * 员工权限列表
	 * @param postData
	 */
  staffResourceList(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.get("/api/user/store/app/resource/list" + postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },

  /**
	 * 配置员工权限
	 * @param postData
	 */
  setStaffResource(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.post("/api/user/store/app/user/config/perms", postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },
  
  /**
	* 季度排名
	* @param postData
	*/
  getQuarterlyRank() {
    return new Promise((resolve, reject) => {
      AjaxUtil.get("/api/market/store/app/scStore/quarterlyRanking", (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },
  
  /**
  	* 门店可选签约汇总
  	* @param postData
  	*/
  getSummaryOptional() {
    return new Promise((resolve, reject) => {
      AjaxUtil.get("/api/market/store/app/scStore/summaryOptional", (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },
  
  /**
  	* 年度签约汇总
  	* @param postData
  	*/
  getSummaryRequired() {
    return new Promise((resolve, reject) => {
      AjaxUtil.get("/api/market/store/app/scStore/summaryRequired", (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },
  
  
  /**
  	* App查询版本
  	* @param postData
  	*/
  getAppVersion(data) {
    return new Promise((resolve, reject) => {
      AjaxUtil.post("/api/basic/store/app/version/query", data, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },
  
  
  
  
  

}

import AjaxUtil from "@/common/utils/request.js"
export default {

  /**
	 * 查询首页店检列表
	 */
  getInspectionList(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.post("/api/basic/store/app/inspect/audit/query/page", postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },

  /**
	 * 查询店检审核周期表格(根据店检编号)
	 */
  getInspectionTable(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.post("/api/basic/store/app/inspect/audit/query/list", postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },
  /**
	 * 查询店检审核详情
	 */
  getInspectionDetail(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.post("/api/basic/store/app/inspect/audit/query", postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },
  /**
	 * 上传店检
	 */
  submitInspection(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.post("/api/basic/store/app/inspect/audit/submit", postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },

}

import AjaxUtil from "@/common/utils/request.js"
export default {

  /**
	 * 查询安心跑订单分页查询
	 */
  listEaseOrderByPage(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.post("/api/trade/store/app/warehouse/out/query/page", postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },

  /**
	 * 查询暂存订单分页查询
	 */
  listTempOrderByPage(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.post("/api/trade/store/app/warehouse/out/query/temporary/page", postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },

  /**
	 * 创建安心跑订单
	 */
  createEaseOrder(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.post("/api/trade/store/app/warehouse/out/create", postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },
  /**
	 * 安心跑订单详情
	 * @param {Object} postData
	 */
  getEaseOrderDetail(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.post("/api/trade/store/app/warehouse/out/query/detail", postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },
  /**
	 * 作废未激活的安心跑订单
	 * @param {Object} postData
	 */
  invalidEaseOrder(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.post("/api/trade/store/app/warehouse/out/invalid", postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },
  /**
	 * 删除安心跑暂存订单
	 * @param {Object} postData
	 */
  deleteTempEaseOrder(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.post("/api/trade/store/app/warehouse/out/delete/temporary", postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },
  /**
	 * 扫码出库-查询条码信息
	 * @param {Object} postData
	 */
  outInfoEaseOrder(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.post("/api/trade/store/app/warehouse/out/query/item", postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },
  /**
	 * 重新申请订单
	 * @param {Object} postData
	 */
  reapplyEaseOrder(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.post("/api/trade/store/app/warehouse/out/reapply", postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },
  /**
	 * 创建暂存订单
	 * @param {Object} postData
	 */
  createTempEaseOrder(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.post("/api/trade/store/app/warehouse/out/temporary/create", postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },
  /**
	 * 暂存订单修改为安心跑订单
	 * @param {Object} postData
	 */
  updateTransferEaseOrder(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.post("/api/trade/store/app/warehouse/out/update/temporary", postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },
  /**
	 * 车牌扫描，范湖车牌
	 * @param {Object} postData
	 */
  carNumberDistinguish(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.post("/api/trade/store/app/warehouse/out/vehiclePlateDistinguish", postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },
  /**
	 * 车牌扫描，范湖车牌
	 * @param {Object} postData
	 */
  vinDistinguish(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.post("/api/trade/store/app/warehouse/out/vinDistinguish", postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },
  
  
  /**
	 * 检查 车辆-门店-用户 的关系
	 * @param {Object} postData
	 */
  checkVehicleStoreUser(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.post("/api/user/store/app/anxinpao/vehicle/checkVehicleStoreUser", postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },

}

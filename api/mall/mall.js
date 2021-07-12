import AjaxUtil from '@/common/utils/request.js'

export default {
  /**
   * 查询全部品牌
   */
  listBrandAll() {
    return new Promise((resolve,reject)=>{
      AjaxUtil.get(`/api/item/admin/itemBrand/list`, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },

  /**
   * 查询全部标签
   */
  listLabelAll(postData) {
    return new Promise((resolve,reject)=>{
      AjaxUtil.post(`/api/basic/store/app/label/appSearchLabel`, postData,(result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },

  /**
   * 查询全部分类
   */
  listCategoryAll() {
    return new Promise((resolve,reject)=>{
      AjaxUtil.get(`/api/item/store/app/itemInfo/frontCategory`,(result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },


  /**
   * 查询商品详情
   * @param subItemNo 商品编码
   */
  getProductItem(subItemNo) {
    return new Promise((resolve,reject)=>{
      AjaxUtil.get(`/api/item/store/app/itemInfo/itemDetail?subItemNo=` + subItemNo, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },
	
	/**
	 * 查询商品详情
	 * @param subItemNo 商品编码
	 */
	getProductItemByItemNo(itemNo) {
	  return new Promise((resolve,reject)=>{
	    AjaxUtil.get(`/api/item/store/app/itemInfo/itemDetailByItemNo?itemNo=` + itemNo, (result) => {
	      resolve(result);
	    }, (err) => {
	      reject(err);
	    });
	  })
	},
	

  /**
   * 分页查询商品详情
   */
  listProductListByPage(postData) {
    return new Promise((resolve,reject)=>{
      AjaxUtil.get('/api/item/store/app/itemInfo/itemQuery' + postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },

  /**
   * 商品增加到购物车接口
   * @param postData 商品编号
   */
  cartAdd(postData) {
    return new Promise((resolve,reject)=>{
      AjaxUtil.post('/api/trade/store/app/cart/public/create', postData,(result) => {
        console.log(result,'result')
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },

  /**
   * 商品下单
   * @param postData 商品编号
   */
  orderAdd(postData) {
    return new Promise((resolve,reject)=>{
      AjaxUtil.post('/api/trade/store/app/order/create', postData,(result) => {
        console.log(result,'result')
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },

  /**
   * 获取收货地址列表
   */
  listAddressAll() {
    return new Promise((resolve,reject)=>{
      AjaxUtil.get('/api/user/store/app/user/address/list',(result) => {
        console.log(result,'result')
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },
	
	/**
	 * 商品下单-活动
	 * @param consumeRebateAmount 消耗的返利
   * @param couponNoList 优惠券编号
   * @param latitude 纬度
   * @param longitude 经度
   * @param memo 备注
   * @param payChannel 支付渠道
   * @param promotionNo 活动编号
   * @param subPromotionNo 子活动编号
   * @param userAddressNo 下单人地址编号
	 */
	orderActiveAdd(postData) {
	  return new Promise((resolve,reject)=>{
	    AjaxUtil.post('/api/trade/store/app/promotion/order/create', postData,(result) => {
	      resolve(result);
	    }, (err) => {
	      reject(err);
	    });
	  })
	},

  /**
	 * 查询优惠券列表
   * @param pageNum 当前页
   * @param pageSize 分页大小
   * @param status 状态 0:待领取，1:待使用，2:已过期，99:已使用
	 */
	listCouponByPage(postData) {
	  return new Promise((resolve,reject)=>{
	    AjaxUtil.get('/api/market/store/app/coupon/page' + postData,(result) => {
	      resolve(result);
	    }, (err) => {
	      reject(err);
	    });
	  })
	},

  /**
	 * 查询适用优惠券
	 */
	getCouponApplyList(postData) {
	  return new Promise((resolve,reject)=>{
	    AjaxUtil.post('/api/market/store/app/coupon/queryAvailableCpRecordList',postData,(result) => {
	      resolve(result);
	    }, (err) => {
	      reject(err);
	    });
	  })
	},
	
	/**
	 * 查询可用/不可用优惠券
	 */
	getCouponApplyAllList(postData) {
	  return new Promise((resolve,reject)=>{
	    AjaxUtil.post('/api/market/store/app/coupon/queryAllCpRecordList',postData,(result) => {
	      resolve(result);
	    }, (err) => {
	      reject(err);
	    });
	  })
	},

  /**
   * 查询优惠券发放/领取列表
   * @param pageNum 当前页
   * @param pageSize 分页大小
   * @param isReceived true-  false-
	 */
	listCouponGrantByPage(postData) {
	  return new Promise((resolve,reject)=>{
	    AjaxUtil.get('/api/market/store/app/coupon/queryGrantList' + postData,(result) => {
	      resolve(result);
	    }, (err) => {
	      reject(err);
	    });
	  })
	},
	
	/**
	 * 获取门店优惠券数量
	 */
	getCouponStoreNumber(postData) {
	  return new Promise((resolve,reject)=>{
	    AjaxUtil.get('/api/market/store/app/coupon/count' + postData,(result) => {
	      resolve(result);
	    }, (err) => {
	      reject(err);
	    });
	  })
	},
	
	
	

  
}
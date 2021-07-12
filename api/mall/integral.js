import AjaxUtil from '@/common/utils/request.js'

// 积分
export default {
  /**
   * 查询全部起订分 用于积分商城
   */
  getStartPointList() {
    return new Promise((resolve,reject)=>{
      AjaxUtil.get(`/api/item/admin/startPoint/list`, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },

  /**
   * 积分商品分页查询列表，支持按分类（分组和分类）、品牌、规格、商品编号查询
   */
  listIntegralProductByPage(postData) {
    return new Promise((resolve,reject)=>{
      AjaxUtil.get(`/api/item/store/app/itemInfo/integralItemQuery` + postData,(result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },

  /**
   * 积分商品获取详情
   */
   getIntegralProductDetail(postData) {
    return new Promise((resolve,reject)=>{
      AjaxUtil.get(`/api/item/store/app/itemInfo/integralItemDetail` + postData,(result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },
  

  /**
   * 查询积分商品购物车
   */
   getIntegralCartList() {
    return new Promise((resolve,reject)=>{
      AjaxUtil.post(`/api/trade/store/app/cart/integral/list`,{},(result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },

  /**
   * 添加积分商品到购物车
   */
  addIntegralCart(postData) {
    return new Promise((resolve,reject)=>{
      AjaxUtil.post(`/api/trade/store/app/cart/integral/create`,postData,(result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },

  /**
   * 修改购物车内积分商品数量
   */
  editIntegralCart(postData) {
    return new Promise((resolve,reject)=>{
      AjaxUtil.post(`/api/trade/store/app/cart/modify`,postData,(result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },

  /**
   * 删除购物车里的积分商品
   */
   delIntegralCart(postData) {
    return new Promise((resolve,reject)=>{
      AjaxUtil.post(`/api/trade/store/app/cart/delete`,postData,(result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },

  /**
   * 创建积分订单
   */
  createIntegralOrder(postData) {
    return new Promise((resolve,reject)=>{
      AjaxUtil.post(`/api/trade/store/app/order/integral/create`,postData,(result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },


  /**
   * 分页查询积分订单
   */
  listIntegralOrderByPage(postData) {
    return new Promise((resolve,reject)=>{
      AjaxUtil.post(`/api/trade/store/app/order/query/integral/page`,postData,(result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },

  /**
   * 查询积分订单详情
   */
  getIntegralOrderDetail(postData) {
    return new Promise((resolve,reject)=>{
      AjaxUtil.post(`/api/trade/store/app/order/query/integral/detail`,postData,(result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },
  
  
  
}
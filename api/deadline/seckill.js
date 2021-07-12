import AjaxUtil from "@/common/utils/request.js"
export default {

	/**
	 * 活动列表
	 */
	 listActiveByPage(postData) {
	   return new Promise((resolve, reject) => {	
			 AjaxUtil.get("/api/item/store/app/promotion/page" + postData,(result) => {
				 resolve(result);
			 }, (err) => {
				 reject(err);
			 });
	   })
	 },
	 
	 /**
	  * 获取页面名称，橱窗配图
	  */
	  getPageNameAndImage(postData) {
	    return new Promise((resolve, reject) => {	
	 		 AjaxUtil.get("/api/item/store/app/promotionCategory/detail" + postData,(result) => {
	 			 resolve(result);
	 		 }, (err) => {
	 			 reject(err);
	 		 });
	    })
	  },
		
		
		
		/**
		 * 获取活动详情列表
		 */
		 getDeadlineDetail(postData) {
		   return new Promise((resolve, reject) => {	
				 AjaxUtil.get("/api/item/store/app/promotion/detail" + postData,(result) => {
					 resolve(result);
				 }, (err) => {
					 reject(err);
				 });
		   })
		 },
		 
		 /**
		  * 获取限时秒杀活动的产品详情
			* @param {integer} batchNo integer
			* @param {integer} id 秒杀活动ID
			* @param {string} itemNo 活动商品编码
			* @param {string} promotionNo 活动编码
		  */
		getDeadlineProductDetail(postData) {
			return new Promise((resolve, reject) => {	
			 AjaxUtil.get("/api/item/store/app/promotion/seckill/detail" + postData,(result) => {
				 resolve(result);
			 }, (err) => {
				 reject(err);
			 });
			})
		},

		/**
		* 获取限时抢购活动的产品详情
		* @param {integer} id 秒杀活动ID
		* @param {string} itemNo 活动商品编码
		* @param {string} promotionNo 活动编码
		*/
		getFlashSaleProductDetail(postData) {
			return new Promise((resolve, reject) => {	
				AjaxUtil.get("/api/item/store/app/promotion/flashsale/detail" + postData,(result) => {
					resolve(result);
				}, (err) => {
					reject(err);
				});
			})
		},

		 
		 /**
		  * 查询秒杀活动批次信息
		  */
		  listDeadlineProductByPage(postData) {
		    return new Promise((resolve, reject) => {	
		 		 AjaxUtil.get("/api/item/store/app/promotion/seckill/batch/query" + postData,(result) => {
		 			 resolve(result);
		 		 }, (err) => {
		 			 reject(err);
		 		 });
		    })
		  },

		 /**
		  * 查询组合商品-固定
		  * @param promotionNo 活动编码
		  */
		 getFixedProductList(postData) {
		    return new Promise((resolve, reject) => {	
		 		 AjaxUtil.get("/api/item/store/app/promotion/productmix/required/list" + postData,(result) => {
		 			 resolve(result);
		 		 }, (err) => {
		 			 reject(err);
		 		 });
		    })
		  },

		  /**
		  * 查询组合商品-自选
		  * @param page.pageNum 当前页
		  * @param page.pageSize 分页大小
		  * @param itemName 商品名称
		  * @param page.field 排序字段
		  * @param page.order 排序规则
		  * @param promotionNo 活动编码
		  */
		 listOptionalProductByPage(postData) {
		    return new Promise((resolve, reject) => {	
		 		 AjaxUtil.get("/api/item/store/app/promotion/productmix/optional/page" + postData,(result) => {
		 			 resolve(result);
		 		 }, (err) => {
		 			 reject(err);
		 		 });
		    })
		  },

		  /**
		  * 查询组合商品-详情
		  */
		 getCombinationProductDetail(postData) {
		    return new Promise((resolve, reject) => {	
		 		 AjaxUtil.get("/api/item/store/app/promotion/productmix/detail" + postData,(result) => {
		 			 resolve(result);
		 		 }, (err) => {
		 			 reject(err);
		 		 });
		    })
		  },


		  
		  /**
		   * 查询活动订单-列表
		   */
		  listActiveOrderByPage(postData){
			return new Promise((resolve, reject) => {	
				AjaxUtil.get("/api/trade/store/app/promotion/order/page" + postData,(result) => {
					resolve(result);
				}, (err) => {
					reject(err);
				});
		  	})
		  },


		  /**
		   * 查询活动订单-详情
		   */
		  getActiveOrderItemDetail(postData){	
			return new Promise((resolve, reject) => {	
				AjaxUtil.get("/api/trade/store/app/promotion/order/detail" + postData,(result) => {
					resolve(result);
				}, (err) => {
					reject(err);
				});
		  	})
		  }
	  
	 
	  
	   
}

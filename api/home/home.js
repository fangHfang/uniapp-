import AjaxUtil from "@/common/utils/request.js"
export default {

	/**
	 * 轮播图列表
	 */
	 bannerList(postData) {
	   return new Promise((resolve, reject) => {	
		 AjaxUtil.post("/api/basic/store/app/picture/banner/query/list", postData,(result) => {
		   resolve(result);
		 }, (err) => {
		   reject(err);
		 });
	   })
	 },
	 
	 /**
	  * 横幅列表
	  */
	 horizontalList(postData) {
	    return new Promise((resolve, reject) => {	
	 	 AjaxUtil.post("/api/basic/store/app/picture/horizontal/query/list", postData,(result) => {
	 	   resolve(result);
	 	 }, (err) => {
	 	   reject(err);
	 	 });
	    })
	  },
	  
	  /**
	   * 子导航列表
	   */
	   navigationList(postData) {
	     return new Promise((resolve, reject) => {	
	  	 AjaxUtil.post("/api/basic/store/app/picture/navigation/query/list",postData, (result) => {
	  	   resolve(result);
	  	 }, (err) => {
	  	   reject(err);
	  	 });
	     })
	   },
	   
	   /**
	    * 广告列表
	    */
	    advertList(postData) {
	      return new Promise((resolve, reject) => {	
	   	 AjaxUtil.post("/api/basic/store/app/picture/advert/query/list",postData, (result) => {
	   	   resolve(result);
	   	 }, (err) => {
	   	   reject(err);
	   	 });
	      })
	    },
		
		/**
		 * 橱窗
		 */
		 displayList(postData) {
		   return new Promise((resolve, reject) => {	
			 AjaxUtil.post("/api/basic/store/app/picture/display/query/list",postData, (result) => {
			   resolve(result);
			 }, (err) => {
			   reject(err);
			 });
		   })
		 },


		/**
		 * 查询橱窗-更多商品列表
		 */
		MoreProductDisplayList(postData) {
			return new Promise((resolve, reject) => {	
				AjaxUtil.post("/api/basic/store/app/picture/display/item/query/page",postData, (result) => {
					resolve(result);
				}, (err) => {
					reject(err);
				});
			})
		},
		/**
		 * 查询注册礼包列表，list为空则没有
		 */
		getRegPkgList(postData) {
			return new Promise((resolve, reject) => {	
				AjaxUtil.get("/api/market/store/app/regPkg/list", (result) => {
					resolve(result);
				}, (err) => {
					reject(err);
				});
			})
		},
		/**
		 * 分页查询公告列表
		 */
		getNoticeList(postData) {
			return new Promise((resolve, reject) => {	
				AjaxUtil.post("/api/basic/store/app/notice/query/page",postData, (result) => {
					resolve(result);
				}, (err) => {
					reject(err);
				});
			})
		},
		/**
		 * 查看公告详情
		 */
		getNoticeById(postData) {
			return new Promise((resolve, reject) => {	
				AjaxUtil.get("/api/basic/store/app/notice/query"+postData, (result) => {
					resolve(result);
				}, (err) => {
					reject(err);
				});
			})
		},
		/**
		 * 店检截止弹框列表
		 */
		getInspectScheduleList(postData) {
			return new Promise((resolve, reject) => {	
				AjaxUtil.post("/api/basic/store/app/inspect/schedule/list", postData, (result) => {
					resolve(result);
				}, (err) => {
					reject(err);
				});
			})
		},
}

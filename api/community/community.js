import AjaxUtil from "@/common/utils/request.js"

export default {

  /**
	 * 查询帖子列表
	 * @param postData
	 */
  getAppQueryArticleList(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.post("/api/bbs/store/app/article/appQueryArticle", postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },
  /**
	 * 查询通过历史帖子列表
	 * @param postData
	 */
  getAppQueryAuditHistoryList(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.post("/api/bbs/store/app/article/appQueryAuditHistory", postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },
  /**
	 * 查询未通过历史帖子列表
	 * @param postData
	 */
  getAppQueryUnAuditHistoryList(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.post("/api/bbs/store/app/article/appQueryUnAuditHistory", postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },
  /**
	 * 创建帖子
	 * @param postData
	 */
  createArticle(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.post("/api/bbs/store/app/article/create", postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },
  /**
	 * 修改帖子
	 * @param postData
	 */
  modifyArticle(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.post("/api/bbs/store/app/article/modify", postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },

  /**
	 * 获取发帖规则
	 * @param postData
	 */
  getArticleRule(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.post("/api/bbs/store/app/article/getArticleRule", postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },
  /**
	 * 获取帖子详情
	 * @param postData
	 */
  getArticleDetail(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.post("/api/bbs/store/app/article/query/detail", postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },
  /**
	 * 获取评论列表
	 * @param postData
	 */
  getCommentByPage(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.post("/api/bbs/store/app/comment/query/page", postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },
  /**
	 * 获取评论下的回复
	 * @param postData
	 */
  getCommentByComment(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.post("/api/bbs/store/app/comment/query", postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },
  /**
	 * 收藏 点赞
	 * @param postData
	 */
  doLikeOrCollect(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.post("/api/bbs/store/app/comment/likeOrCollect", postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },
  /**
	 * 评论 回复
	 * @param postData
	 */
  doCommentOrReply(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.post("/api/bbs/store/app/comment/commentOrReply", postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },
  /**
	 * 上传文件/图片
	 * @param postData
	 */
  uploadImage(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.post("/api/basic/admin/oss/upload", postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },
  /**
	 * 用户反馈
	 * @param postData
	 */
  feedbackCreate(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.post("/api/bbs/store/app/feedback/create", postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  },
  /**
	 * 用户反馈列表
	 * @param postData
	 */
  feedbackList(postData) {
    return new Promise((resolve, reject) => {
      AjaxUtil.post("/api/bbs/store/app/feedback/query/help/page", postData, (result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  }

}

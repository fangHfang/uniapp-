<template>
  <view class="container page">
    <view class="carousel">
      <view class="swiper-wrap" v-if="productInfo.bannerPicture">
        <swiper class="swiper-box" @change="swiperChange" duration="400">
          <swiper-item
            class="swiper-item"
            v-for="(bannerPath, index) in productInfo.bannerPicture"
            :key="index"
          >
            <view class="image-wrapper">
              <fr-image
                loading-ing-img="oblique-light"
                :src="bannerPath"
                class="img"
                mode="aspectFill"
              ></fr-image>
            </view>
          </swiper-item>
        </swiper>
        <view class="swipe-dot">
          <text class="swiper-dot-item">{{
            swiperCurrent + 1 + "/" + productInfo.bannerPicture.length
          }}</text>
        </view>
      </view>
    </view>

    <!-- 秒杀倒计时 -->
    <view class="deadline-count-down">
      <image
        src="../../../static/image/deadline/deadline-product-discount.png"
        mode="aspectFit"
      ></image>
      <view class="deadline-count-down-info">
        <view class="deadline-left">
          <view  v-if="!isDiscountOnly" class="deadline-left-price">
            <text>￥</text>
            <text>{{productInfo.amount}}</text>
            <text>￥{{productInfo.itemAmount}}</text>
          </view>
		  <view v-if="isDiscountOnly" class="deadline-left-price-only">
				<text>已优惠￥</text>
				<text>{{productInfo.discountAmount}}</text>
				<!-- <text>元</text> -->
		  </view>
		 
          <view class="deadline-left-number">
            <view>热销{{productInfo.saleStock}}件</view>
            <text>仅剩{{productInfo.displayStock}}件</text>
          </view>
        </view>
        <view class="deadline-right">
          <text>距离{{params.activeType == 1 ? '抢购' : '秒杀'}}结束仅剩</text>
          <view>
            <text style="margin-left: 25rpx">{{calcShowTime[0]}}</text>
            <text>:</text>
            <text>{{calcShowTime[1]}}</text>
            <text>:</text>
            <text style="margin-right: 25rpx">{{calcShowTime[2]}}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="introduce-section">
      <view class="introduce-section-info">
        <view class="title"
          >{{productInfo.itemName}}</view
        >
		<view class="price-wrap isPreferential" v-if="!isDiscountOnly" :class="{'noPreferential':!(productInfo.rebateRuleName && productInfo.rebateAmount) && !(productInfo.inteRuleName && productInfo.inteAmount)}">
			<text class="price-tip">¥</text>
			<text class="price">{{ calcRebateAmount() }}</text>
			<text class="m-price">预估到手价</text>
		</view>
        <view 
			v-if="(productInfo.promotionRuleInfoDTO && productInfo.promotionRuleInfoDTO.rbAmount && productInfo.promotionRuleInfoDTO.rbRuleName) ||
			(productInfo.promotionRuleInfoDTO && productInfo.promotionRuleInfoDTO.itAmount && productInfo.promotionRuleInfoDTO.itRuleName) ||
			(productInfo.promotionRuleInfoDTO && productInfo.promotionRuleInfoDTO.epInfoDTO && productInfo.promotionRuleInfoDTO.epInfoDTO.length > 0 && productInfo.promotionRuleInfoDTO.epInfoDTO[0].amount && productInfo.promotionRuleInfoDTO.epInfoDTO[0].ruleName)"
			class="integral-rule">
          <view v-if="productInfo.promotionRuleInfoDTO && productInfo.promotionRuleInfoDTO.rbAmount && productInfo.promotionRuleInfoDTO.rbRuleName">
            <view>{{productInfo.promotionRuleInfoDTO.rbRuleName}}</view>
            <text>可获{{productInfo.promotionRuleInfoDTO.rbAmount}}新玛元</text>
          </view>
          <view v-if="productInfo.promotionRuleInfoDTO && productInfo.promotionRuleInfoDTO.itAmount && productInfo.promotionRuleInfoDTO.itRuleName">
            <view>{{productInfo.promotionRuleInfoDTO.itRuleName}}</view>
            <text>可获{{productInfo.promotionRuleInfoDTO.itAmount}}积分</text>
          </view>
          <view v-if="productInfo.promotionRuleInfoDTO && productInfo.promotionRuleInfoDTO.epInfoDTO && productInfo.promotionRuleInfoDTO.epInfoDTO.length > 0 && productInfo.promotionRuleInfoDTO.epInfoDTO[0].amount && productInfo.promotionRuleInfoDTO.epInfoDTO[0].ruleName">
            <view>{{productInfo.promotionRuleInfoDTO.epInfoDTO[0].ruleName}}</view>
            <text>可获{{productInfo.promotionRuleInfoDTO.epInfoDTO[0].amount}}兑换点</text>
          </view>
        </view>
        <view class="bot-row" v-if="false">
          <text>销量: 108</text>
          <text>库存: 4690</text>
          <text>浏览量: 768</text>
        </view>
      </view>
    </view>
    <view class="sku-table">
      <view class="tr">
        <text class="td-label">品牌</text>
        <text class="td-con">{{ productInfo.itemBrand }}</text>
      </view>
      <view class="tr">
        <text class="td-label">分类</text>
        <text class="td-con">{{ productInfo.itemCategoryBackend }}</text>
      </view>
      <view class="tr">
        <text class="td-label">规格</text>
        <text class="td-con">{{ productInfo.itemSpec }}</text>
      </view>
      <view class="tr">
        <text class="td-label">限购</text>
        <text class="td-con">{{ productInfo.personalLimitCount === 0 ? '无限制' : productInfo.personalLimitCount}}</text>
      </view>
    </view>

    <view class="c-list" v-if="false">
      <view class="c-row b-b" @click="toggleSpec">
        <text class="tit">购买类型</text>
        <view class="con">
          <text
            class="selected-text"
            v-for="(sItem, sIndex) in specSelected"
            :key="sIndex"
          >
            {{ sItem.name }}
          </text>
        </view>
        <text class="yticon icon-you"></text>
      </view>
      <view class="c-row b-b">
        <text class="tit">优惠券</text>
        <text class="con t-r red">领取优惠券</text>
        <text class="yticon icon-you"></text>
      </view>
      <view class="c-row b-b">
        <text class="tit">促销活动</text>
        <view class="con-list">
          <text>新人首单送20元无门槛代金券</text>
          <text>订单满50减10</text>
          <text>订单满100减30</text>
          <text>单笔购买满两件免邮费</text>
        </view>
      </view>
      <view class="c-row b-b">
        <text class="tit">服务</text>
        <view class="bz-list con">
          <text>7天无理由退换货 ·</text>
          <text>假一赔十 ·</text>
        </view>
      </view>
    </view>

    <!-- 评价 -->
    <view class="eva-section" v-if="false">
      <view class="e-header">
        <text class="tit">评价</text>
        <text>(86)</text>
        <text class="tip">好评率 100%</text>
        <text class="yticon icon-you"></text>
      </view>
      <view class="eva-box">
        <fr-image
          loading-ing-img="oblique-light"
          class="portrait"
          src="http://img3.imgtn.bdimg.com/it/u=1150341365,1327279810&fm=26&gp=0.jpg"
          mode="aspectFill"
        ></fr-image>
        <view class="right-con">
          <text class="name">Leo yo</text>
          <text class="con"
            >商品收到了，79元两件，质量不错，试了一下有点瘦，但是加个外罩很漂亮，我很喜欢</text
          >
          <view class="bot">
            <text class="attr">购买类型：XL 红色</text>
            <text class="time">2019-04-01 19:21</text>
          </view>
        </view>
      </view>
    </view>

    <view class="detail-desc">
      <view class="d-header">
        <text>商品详情</text>
      </view>
      <rich-text :nodes="details"></rich-text>
    </view>

    <!-- 猜你喜欢 -->
    <view class="u-like" v-if="false">
      <view class="d-header">
        <text>~~~ 猜你喜欢 ~~~</text>
      </view>
      <!-- 产品列表 -->
      <view class="product-list">
        <view
          v-for="(item, index) in likeList"
          :key="'product-item-' + index"
          class="product-item two-item"
        >
          <fr-image
            loading-ing-img="oblique-light"
            class="product-image"
            :src="item.goodImg"
            alt=""
          ></fr-image>
          <view class="product-info">
            <view class="product-info-top">
              <text class="product-name">{{ item.goodName }}</text>
              <text class="product-brand">品牌:{{ item.brand }}</text>
            </view>
            <text class="product-price">￥{{ item.goodPrice }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部操作菜单 -->
    <view class="page-bottom">
      <button type="primary" class="action-btn buy-now-btn" @click="buy">
        立即购买
      </button>
    </view>

    <!-- 规格-模态层弹窗 -->
    <view
      class="popup spec"
      :class="specClass"
      @touchmove.stop.prevent="stopPrevent"
      @click="toggleSpec"
    >
      <!-- 遮罩层 -->
      <view class="mask"></view>
      <view class="layer attr-content" @click.stop="stopPrevent">
        <view class="a-t">
          <fr-image
            loading-ing-img="oblique-light"
            src="../../../static/image/mall/detail.png"
          ></fr-image>
          <view class="right-con">
            <text class="price">¥328.00</text>
            <text class="stock">库存：188件</text>
            <view class="selected">
              已选：
              <text
                class="selected-text"
                v-for="(sItem, sIndex) in specSelected"
                :key="sIndex"
              >
                {{ sItem.name }}
              </text>
            </view>
          </view>
        </view>
        <view v-for="(item, index) in specList" :key="index" class="attr-list">
          <text>{{ item.name }}</text>
          <view class="item-list">
            <block
              v-for="(childItem, childIndex) in specChildList"
              :key="childIndex"
            >
              <text
                v-if="childItem.pid === item.id"
                class="tit"
                :class="{ selected: childItem.selected }"
                @click="selectSpec(childIndex, childItem.pid)"
              >
                {{ childItem.name }}
              </text>
            </block>
          </view>
        </view>
        <button class="btn" @click="toggleSpec">完成</button>
      </view>
    </view>
  </view>
</template>

<script>
import iProductItem from "@/components/i-product-item/i-product-item.vue";
import seckill from "@/api/deadline/seckill.js";
export default {
  name: "productDetail",
  components: { iProductItem },
  data() {
    return {
      // 商品信息
      productInfo: {},
	  // 是否仅展示优惠价格
	  isDiscountOnly:false,
      swiperInfo: [],
      swiperCurrent: 0,
      //模态框内参数
      specClass: "none",
      specSelected: [],
      specList: [
        {
          id: 1,
          name: "尺寸",
        },
        {
          id: 2,
          name: "颜色",
        },
      ],
      specChildList: [
        {
          id: 1,
          pid: 1,
          name: "XS",
        },
        {
          id: 2,
          pid: 1,
          name: "S",
        },
        {
          id: 3,
          pid: 1,
          name: "M",
        },
        {
          id: 4,
          pid: 1,
          name: "L",
        },
        {
          id: 5,
          pid: 1,
          name: "XL",
        },
        {
          id: 6,
          pid: 1,
          name: "XXL",
        },
        {
          id: 7,
          pid: 2,
          name: "墨黑",
        },
        {
          id: 8,
          pid: 2,
          name: "深灰",
        },
        {
          id: 9,
          pid: 2,
          name: "暗灰",
        },
      ],
      //内容详情
      details: `
					<div style="width:100%">
					</div>
				`,
      likeList: [
        {
          id: "1",
          goodImg: require("@/static/image/home/pic1.png"),
          goodName: "玛吉斯汽车轮胎MA656 205 5R16 91V逸动XT逸动逸动逸动逸动",
          goodPrice: "300.00",
          brand: "玛吉斯",
        },
      ],
      //购物车弹框
      cartItem: {
        id: "6",
        image: require("../../../static/image/mall/tyre.png"),
        name: "玛吉斯汽车轮胎MA656 205 5R16 91V逸动XT逸动逸动逸动逸动",
        price: "300.00",
        brand: "玛吉斯",
        sku: "225/60 r16",
        remains: 300,
        model: "飞驰者",
        currentNum: 1,
        tags: [],
        seckill: false,
        snapUp: false,
        commodityMix: false,
      },
      // 父页面参数
      params: {
        /**
         * id-活动id
         * promotionNo-活动编码
         * itemNo-活动商品编码
         * batchNo-活动批次
         * activeType-分类类型(0:秒杀活动,1:限时抢购活动,2:商品组合活动)
         */
      },
	  // 当前时间
	  now:new Date(),
	  // 倒计时
	  setTime:""
    };
  },
  computed:{
		/**
		 * 显示显示倒计时-小时
		 */
		calcShowTime(){
			let time = '00:00:00'
			try{
				if(new Date(this.productInfo.endTime.replace(/-/g, '/')).getTime() > this.now.getTime()){
					// 距本场结束
					time = this.timedate(new Date(this.productInfo.endTime.replace(/-/g, '/')),new Date())
				}
			}catch(e){
				
			}
			
			return time.split(':')
		},
	},
  async onLoad(options) {
    this.params = options;
    // 倒计时
    this.setTime = setInterval(()=>{
      this.now = new Date()
    },1000)
    this.getProductItem();
  },
  onUnload(){
    this.setTime && clearInterval(this.setTime)
  },
  methods: {
    /**
     * 获取商品详细信息
     */
    getProductItem() {
      const { activeType = 0 } = this.params;
      // 分类类型(0:秒杀活动,1:限时抢购活动,2:商品组合活动)
	  // 商品组合活动没有详情页
      switch (activeType) {
        // 秒杀活动
        case '0':
          this.getSeckillProduct();
          break;
        // 限时抢购活动
        case '1':
          this.getFlashSaleProduct();
          break;
        default:
          this.getSeckillProduct();
          break;
      }
    },

    /**
     * 获取限时抢购
     * @param {Object} e
     */
    getFlashSaleProduct() {
		  // promotionId-活动id
        // promotionNo-活动编码
        // itemNo-活动商品编码
        // batchNo-活动批次
      const {id,promotionNo,itemNo } = this.params
      let postData = {
        itemNo,
        promotionNo,
        id,
      }
      let payload = this.$jsonFormat(postData)
      seckill.getFlashSaleProductDetail(payload).then((res)=>{
        const {flashsales} = res.data
		this.isDiscountOnly = res.data.isDiscountOnly
        this.productInfo = flashsales[0]
        this.productInfo.endTime = res.data.endTime
        this.productInfo.startTime = res.data.startTime
        this.productInfo.bannerPicture = JSON.parse(this.productInfo.itemBannerUrls || '[]')
        this.productInfo.itemDetailUrls = JSON.parse(this.productInfo.itemDetailUrls || '[]')
        // 拼接商品详情标签
        let details = '<div style="width:100%"> \r\n'
        this.productInfo.itemDetailUrls && this.productInfo.itemDetailUrls.forEach(item =>{
          details += '<img style="width:100%;display:block;" src=' + "\"" +item + "\"" + '/> \r\n'
          console.log(details)
        })
        details += '</div>'
        this.details = details
      }).catch((err)=>{
        console.log('获取秒杀活动产品详情失败:' + err || err.message)
      })
    },


    /**
     * 获取秒杀活动产品详情
     * @param {Object} e
     */
    getSeckillProduct() {
		  // promotionId-活动id
        // promotionNo-活动编码
        // itemNo-活动商品编码
        // batchNo-活动批次
      const {id,promotionNo,itemNo,batchNo } = this.params
      let postData = {
        itemNo,
        promotionNo,
        id,
        batchNo
      }
      let payload = this.$jsonFormat(postData)
      seckill.getDeadlineProductDetail(payload).then((res)=>{
        const {seckills} = res.data
				this.isDiscountOnly = res.data.isDiscountOnly
        this.productInfo = seckills[0]
        this.productInfo.endTime = res.data.endTime
        this.productInfo.startTime = res.data.startTime
        this.productInfo.bannerPicture = JSON.parse(this.productInfo.itemBannerUrls || '[]')
        this.productInfo.itemDetailUrls = JSON.parse(this.productInfo.itemDetailUrls || '[]')
        // 拼接商品详情标签
        let details = '<div style="width:100%"> \r\n'
        this.productInfo.itemDetailUrls && this.productInfo.itemDetailUrls.forEach(item =>{
          details += '<img style="width:100%;display:block;" src=' + "\"" +item + "\"" + '/> \r\n'
        })
        details += '</div>'
        this.details = details
      }).catch((err)=>{
        console.log('获取秒杀活动产品详情失败:' + err || err.message)
      })
    },

    swiperChange(e) {
      this.swiperCurrent = e.detail.current;
    },
    //规格弹窗开关
    toggleSpec() {
      if (this.specClass === "show") {
        this.specClass = "hide";
        setTimeout(() => {
          this.specClass = "none";
        }, 250);
      } else if (this.specClass === "none") {
        this.specClass = "show";
      }
    },
    //选择规格
    selectSpec(index, pid) {
      let list = this.specChildList;
      list.forEach((item) => {
        if (item.pid === pid) {
          this.$set(item, "selected", false);
        }
      });

      this.$set(list[index], "selected", true);
      //存储已选择
      this.specSelected = [];
      list.forEach((item) => {
        if (item.selected === true) {
          this.specSelected.push(item);
        }
      });
    },
    /**
     * 立即购买
     */
    buy() {
      const productList = [];
	  let productInfo = {
		  ...this.productInfo,
		  promotionDTO:{
			  isDiscountOnly:this.isDiscountOnly
		  }
	  }
      productList.push(productInfo);
	  const data = {
	  	activeProductList:productList,
	  	isCart:false,
	  	isActive:JSON.parse(this.params.activeType),
	  	dealerRelation:this.params.dealerRelation
	  }
      uni.navigateTo({
        url: `/pages/products/order/confirm`,
		success: function(res) {
			res.eventChannel.emit("sendParams", data);
		}
      });
    },
    stopPrevent() {},
	//a为结束时间
	timedate(start,end) {
		let date1 = new Date(start);
		let date2 = new Date(end);
		let date3 = (date1 - date2) / 1000;
		return this.showTime(date3)
	},
	//创建补0函数
	p(s) {
		return s < 10 ? '0' + s : s;
	},
	//根据秒数得出时分秒
	showTime(val) {
		if (val < 60) {
			return '00:00:' + this.p(val);
		} else {
			let min_total = Math.floor(val / 60); // 分钟
			let sec = Math.floor(val % 60); // 余秒
			if (min_total < 60) {
				return '0:' + this.p(min_total) + ":" + this.p(sec);
			} else {
				let hour_total = Math.floor(min_total / 60); // 小时数
				let min = Math.floor(min_total % 60); // 余分钟
				return this.p(hour_total) + ":" + this.p(min) + ":" + this.p(sec);
			}
		}
	},
	
	/**
	 * 计算预计到手价
	 */
	calcRebateAmount(){
		let {amount,promotionRuleInfoDTO} = this.productInfo
		let calcRebateAmount = 0
		let rbAmount = 0
		if(promotionRuleInfoDTO && promotionRuleInfoDTO.rbAmount){
			rbAmount = promotionRuleInfoDTO.rbAmount
		}
		calcRebateAmount = Number(amount || 0).sub(Number(rbAmount))
		if(Number(calcRebateAmount) < 0){
			calcRebateAmount = 0
		}
		return Number(calcRebateAmount).toFixed(2)
	}
  },
};
</script>

<style lang='scss'>
.page {
  padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
  background-color: $uni-bg-color-grey;
}

.carousel {
  height: 100vw;
  position: relative;
  background-color: #f1f1f1;
  .swiper-wrap,
  .swiper-box {
    height: 100%;
    position: relative;
  }

  .image-wrapper {
    width: 100%;
    height: 100%;
  }

  .swiper-item {
    display: flex;
    justify-content: center;
    align-content: center;
    height: 100vw;
    background-color: #fff;
    overflow: hidden;

    .img {
      width: 100%;
      height: 100%;
    }
  }
  .swipe-dot {
    position: absolute;
    bottom: 20px;
    right: $uni-spacing-col-base;
    color: #fff;
    padding: 2px $uni-spacing-col-base;
    border-radius: $uni-border-radius-lg;
    background-color: rgba(0, 0, 0, 0.6);
  }
}

.deadline-count-down {
  position: relative;
  height: calc(100vw * 0.217);
  bottom:20rpx;
  > image {
    position: absolute;
    top: 0;
    z-index: 0;
    width: 100vw;
    height: calc(100vw * 0.217);
  }
  .deadline-count-down-info {
    position: relative;
    z-index: 1;
    display: flex;
    height: 100%;
    justify-content: space-between;
    .deadline-left {
      padding: 44rpx 0rpx 34rpx 20rpx;
      .deadline-left-price {
        line-height: 30rpx;
        margin-bottom: 20rpx;
        > text:nth-child(1) {
          font-size: 16rpx;
          color: #ffffff;
        }
        > text:nth-child(2) {
          font-size: 40rpx;
          color: #ffffff;
          font-weight: bold;
          margin-right: 12rpx;
        }
        > text:nth-child(3) {
          font-size: 20rpx;
          text-decoration: line-through;
          color: #ffffff;
        }
      }
	  .deadline-left-price-only{
		  line-height: 30rpx;
		  margin-bottom: 20rpx;
		  > text:nth-child(1) {
		    font-size: 16rpx;
		    color: #ffffff;
		  }
		  > text:nth-child(2) {
		    font-size: 40rpx;
		    color: #ffffff;
		    font-weight: bold;
		    margin-right: 12rpx;
			margin-left: 12rpx;
		  }
		  > text:nth-child(3) {
		    font-size: 16rpx;
		    color: #ffffff;
		  }
	  }
      .deadline-left-number {
        display: flex;
        line-height: 35rpx;
        > view {
          font-size: 22rpx;
          font-weight: 500;
          color: #fd5223;
          padding: 0rpx 33rpx 0rpx 17rpx;
          background: #ffffff;
          margin-right: 12rpx;
          border-radius: 5rpx;
        }
        > text {
          font-size: 22rpx;
          font-weight: 500;
          color: #fff600;
        }
      }
    }
    .deadline-right {
      padding: 30rpx 45rpx 30rpx 0px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      > text {
        font-size: 30rpx;
        font-weight: 500;
        color: #fd5223;
        line-height: 30rpx;
      }
      > view {
        background-color: #000000;
        opacity: 0.9;
        border-radius: 5rpx;
        width: calc(100% - 20rpx);
        margin: 0 auto;
        height: 55rpx;
        line-height: 55rpx;
        display: flex;
        justify-content: space-around;
        > text {
          color: #ffffff;
        }
      }
    }
  }
}

/* 标题简介 */
.introduce-section {
  position: relative;
  margin: 0 20rpx 20rpx;
  border-radius: $uni-border-radius-base;
  background-image: url('../../../static/image/deadline/deadline-product-info.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: right bottom;
  .introduce-section-info {
    z-index: 3;
    top: 0;
    padding: $uni-spacing-col-base;
    width: calc(100% - 40rpx);
  }
  .title {
    line-height: 28rpx;
    font-size: 26rpx;
    font-weight: bold;
    color: $uni-text-color;
  }
  .price-wrap {
    display: flex;
    align-items: baseline;
	font-size: 26rpx;
	color: $uni-color-primary;
	margin-top: 20rpx;
	.price-tip{
		font-weight: 600;
	}
	.price{
		font-size: $uni-font-size-huge;
		margin-left:12rpx;
		font-weight: 600;
	}
	.m-price{
		margin-left: 36rpx;
		font-size: 20rpx;
	}
  }

  .bot-row {
    display: flex;
    align-items: center;
    height: 50rpx;
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;

    text {
      flex: 1;
    }
  }

  .integral-rule {
    margin-top: 20rpx;
    > view {
      display: flex;
      margin-top: 10rpx;
      > view:nth-child(1) {
        border: 1rpx solid #e10000;
        border-radius: 5rpx;
        font-size: 20rpx;
        font-weight: 400;
        color: #e10000;
        margin-right: 16rpx;
        text-align: center;
        padding: 0rpx 10rpx;
        line-height: 32rpx;
      }
      > text:nth-child(2) {
        font-size: 20rpx;
        font-weight: 400;
        color: #333333;
      }
    }
  }
}

.sku-table {
  background-color: #fff;
  padding: $uni-spacing-col-base;
  margin: $uni-spacing-col-base $uni-spacing-col-base 0;
  border-radius: $uni-border-radius-base;
  .tr {
    border: 1px solid $uni-border-color;
    border-top: none;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 40px;
    font-size: $uni-font-size-base;
    color: $uni-text-color-subsidiary;
    &:first-of-type {
      border-top: 1px solid $uni-border-color;
    }
    .td-label {
      background-color: $uni-bg-color-grey;
      height: 40px;
      width: 90px;
      flex: 0 0 90px;
      box-sizing: border-box;
      line-height: 40px;
      padding-left: $uni-spacing-col-lg;
    }
    .td-con {
      flex: 1;
      padding-left: $uni-spacing-col-lg;
      width: 100%;
      overflow: hidden;
      font-size: $uni-font-size-base;
      color: $uni-text-color;
      text-overflow: ellipsis;
      word-break: break-all;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
}
.c-list {
  font-size: $uni-font-size-sm;
  color: $uni-text-color-grey;
  background-color: #fff;

  .c-row {
    display: flex;
    align-items: center;
    padding: 20rpx 30rpx;
    position: relative;
  }

  .tit {
    width: 140rpx;
  }

  .con {
    flex: 1;
    color: $uni-text-color;

    .selected-text {
      margin-right: 10rpx;
    }
  }

  .bz-list {
    height: 40rpx;
    font-size: $uni-font-size-sm;
    color: $uni-text-color;

    text {
      display: inline-block;
      margin-right: 30rpx;
    }
  }

  .con-list {
    flex: 1;
    display: flex;
    flex-direction: column;
    color: $uni-text-color;
    line-height: 40rpx;
  }

  .red {
    color: $uni-color-primary;
  }
}

/* 评价 */
.eva-section {
  display: flex;
  flex-direction: column;
  padding: 20rpx 30rpx;
  background-color: #fff;
  margin-top: 16rpx;

  .e-header {
    display: flex;
    align-items: center;
    height: 70rpx;
    font-size: uni-font-size-sm;
    color: $uni-text-color-grey;

    .tit {
      font-size: $uni-font-size-base;
      color: $uni-text-color;
      margin-right: 4rpx;
    }

    .tip {
      flex: 1;
      text-align: right;
    }

    .icon-you {
      margin-left: 10rpx;
    }
  }
}

.eva-box {
  display: flex;
  padding: 20rpx 0;

  .portrait {
    flex-shrink: 0;
    width: 80rpx;
    height: 80rpx;
    border-radius: 100px;
  }

  .right-con {
    flex: 1;
    display: flex;
    flex-direction: column;
    font-size: $uni-font-size-base;
    color: $uni-text-color;
    padding-left: 26rpx;

    .con {
      font-size: $uni-font-size-base;
      color: $uni-text-color;
      padding: 20rpx 0;
    }

    .bot {
      display: flex;
      justify-content: space-between;
      font-size: $uni-font-size-base;
      color: $uni-text-color-grey;
    }
  }
}

/*  详情 */
.detail-desc {
  background-color: #fff;
  .d-header {
    height: 80rpx;
    line-height: 80rpx;
    padding-left: $uni-spacing-col-base;
    font-size: $uni-font-size-lg;
    color: $uni-text-color;
    font-weight: 600;
    position: relative;
    background-color: $uni-bg-color-grey;

    text {
      position: relative;
      z-index: 1;
    }
  }
}

/* 规格选择弹窗 */
.attr-content {
  padding: 10rpx 30rpx;

  .a-t {
    display: flex;

    image {
      width: 170rpx;
      height: 170rpx;
      flex-shrink: 0;
      margin-top: -40rpx;
      border-radius: 8rpx;
    }

    .right-con {
      display: flex;
      flex-direction: column;
      padding-left: 24rpx;
      font-size: $uni-font-size-sm;
      color: $uni-text-color;
      line-height: 42rpx;

      .price {
        font-size: $uni-font-size-lg;
        color: $uni-color-primary;
        margin-bottom: 10rpx;
      }

      .selected-text {
        margin-right: 10rpx;
      }
    }
  }

  .attr-list {
    display: flex;
    flex-direction: column;
    font-size: $uni-font-size-sm;
    color: $uni-text-color;
    padding-top: 30rpx;
    padding-left: 10rpx;
  }

  .item-list {
    padding: 20rpx 0 0;
    display: flex;
    flex-wrap: wrap;

    text {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #eee;
      margin-right: 20rpx;
      margin-bottom: 20rpx;
      border-radius: 100rpx;
      min-width: 60rpx;
      height: 60rpx;
      padding: 0 20rpx;
      font-size: $uni-font-size-base;
      color: $uni-text-color;
    }

    .selected {
      background-color: #fbebee;
      color: $uni-color-primary;
    }
  }
}

/*  弹出层 */
.popup {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 99;

  &.show {
    display: block;

    .mask {
      animation: showPopup 0.2s linear both;
    }

    .layer {
      animation: showLayer 0.2s linear both;
    }
  }

  &.hide {
    .mask {
      animation: hidePopup 0.2s linear both;
    }

    .layer {
      animation: hideLayer 0.2s linear both;
    }
  }

  &.none {
    display: none;
  }

  .mask {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background-color: rgba(0, 0, 0, 0.4);
  }

  .layer {
    position: fixed;
    z-index: 99;
    bottom: 0;
    min-height: 40vh;
    border-radius: 10rpx 10rpx 0 0;
    background-color: #fff;
    padding-bottom: env(safe-area-inset-bottom);

    .btn {
      height: 36px;
      line-height: 36px;
      border-radius: 36px;
      background-color: $uni-color-primary;
      font-size: $uni-font-size-base;
      color: #fff;
      margin: $uni-spacing-col-lg auto;
    }
  }

  @keyframes showPopup {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  @keyframes hidePopup {
    0% {
      opacity: 1;
    }

    100% {
      opacity: 0;
    }
  }

  @keyframes showLayer {
    0% {
      transform: translateY(120%);
    }

    100% {
      transform: translateY(0%);
    }
  }

  @keyframes hideLayer {
    0% {
      transform: translateY(0);
    }

    100% {
      transform: translateY(120%);
    }
  }
}

/* 底部操作菜单 */
.page-bottom {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 99;
  display: flex;
  align-items: center;
  right: 0;
  height: 100rpx;
  padding-bottom: env(safe-area-inset-bottom);
  background-color: #fff;
  box-shadow: 0 -1px 0 0 rgba(0, 0, 0, 0.1);

  .action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 90%;
    height: 72rpx;
    border: 1px solid $uni-color-primary;
    color: $uni-color-primary;
    font-size: $uni-font-size-base;
    padding: 0;
    border-radius: 72rpx;
    background-color: #fff;
    &.buy-now-btn {
      color: #fff;
      background-color: $uni-color-primary;
    }
  }
}

/*猜你喜欢 */
.u-like {
  .d-header {
    height: 80rpx;
    text-align: center;
    line-height: 80rpx;
    padding-left: $uni-spacing-col-base;
    font-size: $uni-font-size-base;
    color: $uni-color-primary;
    position: relative;
    background-color: $uni-bg-color-grey;
  }
  .product-list {
    width: calc(100% - 40rpx);
    margin: 10rpx auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .product-item {
      background-color: #ffffff;
    }

    .product-info {
      padding: 25rpx 15rpx;
      display: flex;
      flex-direction: column;
    }

    .product-info-top {
      display: flex;
      flex-direction: column;
    }

    // 名称
    .product-name {
      line-height: 28rpx;
      font-size: 26rpx;
      font-weight: bold;
      color: #1c1c1c;
      overflow: hidden;
      -webkit-line-clamp: 2;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      margin-bottom: 10rpx;
    }

    // 品牌
    .product-brand {
      line-height: 20rpx;
      font-size: 20rpx;
      font-weight: 400;
      color: #666666;
      margin-bottom: 20rpx;
    }

    // 价格
    .product-price {
      line-height: 18rpx;
      font-size: 20rpx;
      font-weight: bold;
      color: $uni-color-primary;
    }
    // 两列样式
    .two-item {
      width: calc((100vw - 40rpx - 10rpx) / 2);
      margin-bottom: 10rpx;
      box-shadow: 0px 6px 26px 0px rgba(123, 71, 46, 0.05);
      border-radius: 5px;

      .product-image {
        height: calc((100vw - 40rpx - 10rpx) / 2);
        width: calc((100vw - 40rpx - 10rpx) / 2);
      }
      .product-info {
        padding: 0 25rpx 25rpx 25rpx;
      }
    }
  }
}
/*购物车弹出框*/
.popup-content {
  height: 300px;
  border-radius: $uni-border-radius-base $uni-border-radius-base 0 0;
  background-color: #fff;
  .popup-header {
    height: 44px;
    border-bottom: 1px solid $uni-border-color;
    position: relative;
    text-align: center;
    line-height: 44px;
    .popup-delete {
      position: absolute;
      right: 0;
      top: 0;
      width: 36px;
      height: 100%;
    }
  }
  .action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 90%;
    position: absolute;
    bottom: 0;
    left: 5%;
    margin-bottom: calc(20px + env(safe-area-inset-bottom));
    height: 72rpx;
    border: 1px solid $uni-color-primary;
    color: #fff;
    font-size: $uni-font-size-base;
    padding: 0;
    border-radius: 72rpx;
    background-color: $uni-color-primary;
  }
}
</style>

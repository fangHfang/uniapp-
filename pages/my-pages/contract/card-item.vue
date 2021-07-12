<template>
	<view class="product-item" @click="toDetail(cardItem.id)">
		<view class="item-head flex a-center j-space-between">
			<view class="item-name">{{cardItem.ruleName}}</view>
			<view class="item-time" :class="['yellow','green','red'][cardItem.approvalStatus]">{{['审核中','已签约','已拒绝'][cardItem.approvalStatus]}}</view>
		</view>
		<view class="item-con flex a-center j-space-between">
			<view class="item-contracted-volume">
				<view class="item-title">入库上限</view>
				<view class="item-number">{{cardItem.upperLimit}}</view>
			</view>
			<view class="item-contracted-volume">
				<view class="item-title">入库下限</view>
				<view class="item-contracted-number">{{cardItem.lowerLimit}}</view>
			</view>
		</view>
		<view class="item-foot flex a-center j-space-between">
			<view class="item-contract">
				<view class="item-contract-date">可签约时间：<text class="item-contract-color">{{cardItem.scRuleAppDTO && cardItem.scRuleAppDTO.startDate}}~{{cardItem.scRuleAppDTO && cardItem.scRuleAppDTO.endDate}}</text></view>
			</view>
			<icon class="iconfont right" type=""></icon>
		</view>
	</view>
</template>

<script>
  export default {
    name: 'i-card-item',
    props: {
      cardItem: {
        type: Object,
        default () {
          return {}
        }
      },
      tabIndex:{
        type: Number,
        default: 0,
      }
    },
    components: {},
    data() {
      return {
      }
    },
    mounted() {

    },
    watch:{
      tabIndex(curVal,oldVal){
        if(curVal){
          this.tabIndex=curVal;
        }
      }
    },
    methods: {
      /**
       * 查看签约详情
       */
      toDetail() {
        uni.navigateTo({
          url:'contract-detail/contract-detail?ruleNo=' + this.cardItem.ruleNo
        })
      }
    }
  }
</script>

<style lang="scss">
	.product-item {
		background-color: #fff;
		margin-bottom: $uni-spacing-row-base;
		border-radius: $uni-border-radius-base;
		.item-head{
			height: 39px;
			color: #1C1C1C;
			font-size: 15px;
			font-weight: bold;
			padding: 0 $uni-spacing-row-base;
			border-bottom: 1px solid #CCCCCC;
			.item-time{
				color: #fff;
				font-size: 13px;
				font-weight: 400;
				background: #DDDDDD;
				border-radius: 5rpx;
				padding: 8rpx 20rpx;
			}
			.yellow{
				background-color: #FFBA00;
			}
			.red{
				background-color: #A50B09;
			}
			.green{
				background-color: #00C52E;
			}
		}
		.item-con {
			height: 68px;
			border-bottom: 1px solid #CCCCCC;
			padding: 0 $uni-spacing-row-base;
			.item-contracted-volume{
				width: 50%;
				color: #1C1C1C;
				font-size: 13px;
				text-align: center;
				.item-title{
					margin-bottom: 8px;
				}
				.item-contracted-number{
					color: #ed6d00;
				}
			}
		}
		.item-foot{
			height: 36px;
			padding: 0 $uni-spacing-row-base;
			.item-contract{
				color: #666666;
				font-size: 13px;
				.item-contract-type{
					margin-bottom: 10px;
					.item-contract-color{
						color: #1C1C1C;
					}
				}
			}
		}
	}
</style>

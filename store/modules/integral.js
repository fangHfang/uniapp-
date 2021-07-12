import integralApi from "@/api/mall/integral";
import AjaxUtil from '@/common/utils/request.js'
import * as utils from '@/common/utils/index'

const integral = {
	'namespaced': true,
	'state': {
		// 积分购物车列表
		'integralCartList': [],
		// 购物车底部条
		'integralOptions':[{
			icon: 'cart',
			text: '',
			info: 0,
			infoBackgroundColor:'#DB0000',
			infoColor:"#FFFFFF"
		}]
	},

	'mutations': {
		// 积分购物车列表
		setIntegralCartList(state, list) {
			state.integralCartList = list
		},
		// 积分购物车列表
		setIntegralOptions(state, number) {
			state.integralOptions = [{
				icon: 'cart',
				text: '',
				info: number,
				infoBackgroundColor:'#DB0000',
				infoColor:"#FFFFFF"
			}]
		}
	},
	'getters': {},

	'actions': {

		/**
		 * 获取积分商品购物车
		 */
		getIntegralCartList({commit,state}){
			return new Promise((resolve, reject) => {
				integralApi.getIntegralCartList().then((res)=>{
					const { integralCartRespList } = res.data
					let number = 0, list = []
					if(integralCartRespList && integralCartRespList.length > 0){
						list = integralCartRespList.map((item)=>{
							return {
								...item,
								price:item.itemPrice,
								stock:item.isItemStock,
								listPicture:item.itemImageUrl,
								currentNum:item.cartItemQuantity,
								categoryName:item.itemCategory,
								itemType:item.integralItemType
							}
						})
					}
					number = list.length
					commit('setIntegralOptions',number)
					commit('setIntegralCartList',list)
					resolve(list)
				}).catch((err)=>{
					console.log(err)
					reject()
				})
			})
		}
	}
}

export default integral

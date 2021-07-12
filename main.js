import Vue from 'vue'
import App from './App'
import store from './store'
import Utils from './common/utils'
import frImage from "@/components/fr-image/fr-image.vue"
import MescrollBody from "@/components/mescroll-uni/mescroll-body.vue"
import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue"
import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
Vue.mixin(MescrollMixin);
Vue.component('fr-image', frImage)
Vue.component('mescroll-body', MescrollBody)
Vue.component('mescroll-uni', MescrollUni)

Vue.config.productionTip = false
Vue.prototype.$store = store
App.mpType = 'app'


// /**
//  * 获取手机信息，放到全局缓存里
//  */
// uni.setStorageSync(KEY,DATA)


/**
 * 将所有util添加至Vue对象内，供页面直接调用
 */
Object.keys(Utils).forEach(key => {
	Vue.prototype["$" + key] = Utils[key];
});
const app = new Vue({
	...App
})
app.$mount()

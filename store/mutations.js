import {
  TOKEN_UPDATE, STORE_RESET
} from '@/store/types'
import modules from './modules'

const mutations = {
  /**
   * 更新token
   */
  [TOKEN_UPDATE]: (state, token) => {
    state.token = token
  },

  /**
   * 重置store
   */
  [STORE_RESET]: (state, moduleState) => {
    for (const moduleState in modules) {
      const mState = state[moduleState]

      if (mState.initState && typeof mState.initState === 'function') {
        const initState = mState.initState()

        for (const key in initState) {
          mState[key] = initState[key]
        }
      }
    }
  }
}
export default mutations

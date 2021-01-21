import { login, logout } from '@/api/login'
import { queryApiPermNames, queryRoleNames } from '@/api/privilege'
import router from '@/router/index.js'

const user = {
  state: {
    name: '',
    avatar: '',
    roles: [],
    apiPermNames: []
  },

  mutations: {
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_API_PERM_NAMES: (state, apiPermNames) => {
      state.apiPermNames = apiPermNames
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          const data = response.data
          commit('SET_NAME', data.name)

          queryApiPermNames().then(res => {
              let apiPermNames = res.data
              commit('SET_API_PERM_NAMES', apiPermNames)
          })

          queryRoleNames().then(res => {
              let roleNames = res.data
              commit('SET_ROLES', roleNames)
          })

          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          commit('SET_NAME', '')
          commit('SET_ROLES', [])
          commit('SET_API_PERM_NAMES', [])
          window.localStorage.removeItem('token')
          router.push({path: '/'})
        }).catch(error => {
          reject(error)
        })
      })
    },
  }
}

export default user

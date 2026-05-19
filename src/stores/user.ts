import { ref } from 'vue'
import { defineStore } from 'pinia'
export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const userType = ref('')
  const permission = ref<string[]>([])

  function initUser() {
    token.value = localStorage.getItem('loginInfo') || ''
    userType.value = localStorage.getItem('userType') || ''
    permission.value = JSON.parse(localStorage.getItem('permissions') || '[]')
  }

  function setUser(t: string, type: string, perms: string[]) {
    token.value = t
    userType.value = type
    permission.value = perms
    localStorage.setItem('loginInfo', t)
    localStorage.setItem('userType', type)
    localStorage.setItem('permissions', JSON.stringify(perms))
  }

  function logout(){
    token.value = ''
    userType.value = ''
    permission.value = []
    localStorage.removeItem('loginInfo')
    localStorage.removeItem('userType')
    localStorage.removeItem('permissions')
  }

  return { token, userType, permission, setUser,initUser,logout }
})

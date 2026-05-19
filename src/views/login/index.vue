<template>
  <div class="login-page">
    <div class="login-title">登录</div>
    <div class="login-card">
      <div class="login-item">
        <label>用户名：</label><input type="text" v-model="loginData.username" />
      </div>
      <div class="login-item">
        <label>密码：</label><input type="password" v-model="loginData.password" />
      </div>
      <div class="login-btn" @click="handleLogin()">登录</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { userLogin } from '@/api/auth'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

interface loginForm {
  username: string
  password: string
}

const router = useRouter()
const userStore = useUserStore()
const loginData = ref<loginForm>({ username: '', password: '' })

async function handleLogin() {
  const res = await userLogin(loginData.value)

  if (res.data.code === 0) {
  userStore.setUser(res.data.token, res.data.type, res.data.permissions)
router.push('/dashboard')
  } else {
    alert('登录失败')
  }
}
</script>

<style>
body {
  margin: 0;
}
</style>
<style scoped>
.login-page {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(to bottom right, #1a2a4a, #0d1b2a);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.login-title {
  font-size: 24px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 24px;
}

.login-card {
  width: 380px;
  padding: 40px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.login-item {
  margin-bottom: 20px;
}

.login-item label {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 6px;
}

.login-item input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
}

.login-item input:focus {
  border-color: #1890ff;
}

.login-btn {
  width: 100%;
  background: #1890ff;
  color: #fff;
  text-align: center;
  padding: 12px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 8px;
}

.login-btn:hover {
  opacity: 0.85;
}
</style>

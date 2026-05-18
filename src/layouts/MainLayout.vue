<template>
  <el-container class="layout">
    <el-aside width="220px" class="sidebar">
      <div class="logo">游梦体育</div>

      <el-menu
        router
        background-color="#001529"
        text-color="#ffffff"
        active-text-color="#409eff"
        :default-active="route.path"
      >
        <el-menu-item index="/dashboard">
          首页
        </el-menu-item>

        <el-menu-item index="/matches">
          比赛管理
        </el-menu-item>

        <el-menu-item index="/teams">
          球队管理
        </el-menu-item>

        <el-menu-item index="/players">
          球员管理
        </el-menu-item>

          <el-menu-item index="/users">
          用户管理
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="header">
        后台管理系统
          <span class="logout" @click="handleLogout">退出登录</span>

      </el-header>

      <el-main class="content">
        <RouterView />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { RouterView,useRoute,useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

function handleLogout() {
  localStorage.removeItem('loginInfo')
  router.push('/login')
}
</script>

<style scoped>
.layout {
  height: 100vh;
}

.sidebar {
  background: #001529;
}

.logo {
  height: 60px;
  color: #fff;
  font-size: 20px;
  font-weight: bold;

  display: flex;
  align-items: center;
  justify-content: center;
}

.header {
  background: #fff;
  border-bottom: 1px solid #eee;

  display: flex;
  align-items: center;
  justify-content: space-between;  /* 加这一行让两端对齐 */

  font-weight: bold;
}

.content {
  background: #f5f5f5;
  padding: 20px;
}

:deep(.el-menu) {
  border-right: none;
}



.logout {
  font-size: 14px;
  color: #999;
  cursor: pointer;
  font-weight: normal;
}

.logout:hover {
  color: #ff4d4f;
}
</style>
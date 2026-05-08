<template>
  <div class="matches-page">
    <div class="page-header">
      <h2>比赛管理</h2>
    </div>

    <div class="search-bar">
      <input
        v-model="keyword"
        placeholder="请输入比赛名称"
      />

      <button>搜索</button>

      <button>新增比赛</button>
    </div>

    <table class="match-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>比赛名称</th>
          <th>队伍</th>
          <th>比赛时间</th>
          <th>状态</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="item in matchList"
          :key="item.id"
        >
          <td>{{ item.id }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.team }}</td>
          <td>{{ item.time }}</td>
          <td>{{ item.status }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const keyword = ref('')

const matchList = ref([
  {
    id: 1,
    name: 'NBA总决赛',
    team: '湖人 VS 勇士',
    time: '2026-05-01',
    status: '未开始',
  },
  {
    id: 2,
    name: '英超联赛',
    team: '曼联 VS 阿森纳',
    time: '2026-05-03',
    status: '进行中',
  },
])
</script>

<style scoped>
.matches-page {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.search-bar input {
  width: 220px;
  padding: 6px 10px;
}

.match-table {
  width: 100%;
  border-collapse: collapse;
}

.match-table th,
.match-table td {
  border: 1px solid #ddd;
  padding: 12px;
}

.match-table th {
  background: #f5f5f5;
}
</style>
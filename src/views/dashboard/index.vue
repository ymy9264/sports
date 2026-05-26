<template>
  <div class="dashboard-page">
    <div class="page-title">后台首页</div>

    <el-row :gutter="20" class="card-row">
      <el-col
        v-for="item in cards"
        :key="item.id"
        :xs="24"
        :sm="12"
        :md="12"
        :lg="6"
      >
        <el-card shadow="hover" class="data-card">
          <div class="card-title">
            {{ item.title }}
          </div>

          <div class="card-amount">
            {{ item.amount }}
            <span class="unit">{{ item.unit }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never" class="chart-card">
      <template #header>
        <div class="chart-header">
          各联赛比赛数量
        </div>
      </template>

      <div ref="chartRef" class="chart-box"></div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import { getDashboard } from '@/api/dashboard'

interface Card {
  id: number
  title: string
  amount: number
  unit: string
}

interface LeagueItem {
  name: string
  total: number
}


const cards = ref<Card[]>([
  { id: 1, title: '比赛总数', amount: 8, unit: '场' },
  { id: 2, title: '球队总数', amount: 10, unit: '队' },
  { id: 3, title: '球员总数', amount: 20, unit: '人' },
    { id: 4, title: '今日比赛总数', amount: 20, unit: '场' },

])



const chartRef = ref<HTMLElement | null>(null)

onMounted(async() => {
   const res = await getDashboard()
  cards.value[0]!.amount = res.data.match
  cards.value[1]!.amount = res.data.team
  cards.value[2]!.amount = res.data.player
  cards.value[3]!.amount = res.data.todayMatch

  if (!chartRef.value) return
  const chart = echarts.init(chartRef.value)


 chart.setOption({
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c}场 ({d}%)'
  },
  series: [{
    name: '今日比赛',
    type: 'pie',
    radius: '60%',
    data: res.data.todayLeague.map((item: LeagueItem) => ({
      name: item.name,
      value: item.total
    })),
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }
    }
  }]
})

  window.addEventListener('resize', () => {
    chart.resize()
  })
})
</script>

<style scoped>
.dashboard-page {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.page-title {
  font-size: 22px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 20px;
}

.card-row {
  margin-bottom: 20px;
}

.data-card {
  border-radius: 12px;
}

.card-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 12px;
}

.card-amount {
  font-size: 30px;
  font-weight: 700;
  color: #303133;
}

.unit {
  font-size: 14px;
  margin-left: 4px;
  color: #909399;
}

.chart-card {
  border-radius: 12px;
}

.chart-header {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.chart-box {
  height: 400px;
}
</style>
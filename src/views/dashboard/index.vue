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
          各联赛球队数量
        </div>
      </template>

      <div ref="chartRef" class="chart-box"></div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

interface Card {
  id: number
  title: string
  amount: number
  unit: string
}

const cards = ref<Card[]>([
  { id: 1, title: '比赛总数', amount: 8, unit: '场' },
  { id: 2, title: '球队总数', amount: 10, unit: '队' },
  { id: 3, title: '球员总数', amount: 20, unit: '人' },
  { id: 4, title: '进行中比赛数', amount: 2, unit: '场' },
])

const chartRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (!chartRef.value) return

  const chart = echarts.init(chartRef.value)

  chart.setOption({
    tooltip: {
      trigger: 'axis',
    },

    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },

    xAxis: {
      type: 'category',
      data: ['NBA', '英超', '中超', '西甲'],
      axisTick: {
        alignWithLabel: true,
      },
    },

    yAxis: {
      type: 'value',
    },

    series: [
      {
        name: '球队数量',
        type: 'bar',
        barWidth: '45%',
        data: [10, 8, 16, 12],

        itemStyle: {
          borderRadius: [6, 6, 0, 0],
        },
      },
    ],
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
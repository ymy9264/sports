<template>
  <div class="dashboard-page">
    <div>后台首页</div>
    <div class="cards-wrapper">
      <div v-for="item in cards" :key="item.id" class="card">
        <div class="title">{{ item.title }}</div>
        <div class="amount">{{ item.amount }}{{ item.unit }}</div>
      </div>
    </div>
    <div ref="chartRef" style="height:300px; margin-top:24px"></div>
  </div>
</template>

<script setup lang="ts">
import { ref,onMounted } from 'vue'
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
const chartRef = ref<HTMLElement|null>(null);

onMounted(()=>{
  console.log(chartRef.value)
    if (!chartRef.value) return

  const chart = echarts.init(chartRef.value)
  chart.setOption({
    title:{ text: '各联赛球队数量'},
    xAxis:{ 
      type:'category',
      data:['NBA','英超','中超','西甲']
     },
     yAxis:{ type:'value' },
     series:[{
      type:'bar',
      data:[10,8,16,12]
     }]

  })
})
</script>

<style scoped>
.cards-wrapper {
  display: flex;
  flex-direction: row;
  gap: 16px;
}
.card {
  background: #fff;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 2px 2px 3px #ccc;
  text-align: center;
  flex: 1;
}
.title {
  font-size: 14px;
  color: #aaa;
}
.amount {
  font-size: 18px;
  color: #666;
}
</style>

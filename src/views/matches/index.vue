<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getMatches,addMatch } from '@/api/matches'
interface Match {
  id: number
  name: string
  team: string
  time: string
  status: '未开始' | '进行中' | '已结束'
}

onMounted(async()=>{
  const res = await getMatches()
  matchList.value = res.data;
})


const matchList = ref<Match[]>([
 // { id: 1, name: 'NBA总决赛', team: '湖人 VS 勇士', time: '2026-05-01', status: '未开始' },
 // { id: 2, name: '英超联赛', team: '曼联 VS 阿森纳', time: '2026-05-03', status: '进行中' },
])

// 搜索
const keyword = ref('')
const filteredList = computed(() => {
  const k = keyword.value.trim().toLowerCase()
  if (!k) return matchList.value
  return matchList.value.filter(
    m => m.name.toLowerCase().includes(k) || m.team.toLowerCase().includes(k)
  )
})

// 弹窗
const showModal = ref(false)
const isEdit = ref(false)

const statusOptions: Match['status'][] = ['未开始', '进行中', '已结束']

const emptyForm = (): Omit<Match, 'id'> => ({
  name: '',
  team: '',
  time: '',
  status: '未开始',
})

const form = ref<Match>({ id: 0, ...emptyForm() })

function openAdd() {
  isEdit.value = false
  form.value = { id: 0, ...emptyForm() }
  showModal.value = true
}

function openEdit(match: Match) {
  isEdit.value = true
  form.value = { ...match }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

async function submitForm() {
  if (!form.value.name || !form.value.team || !form.value.time) {
    alert('请填写必填项：比赛名称、队伍、比赛时间')
    return
  }
  if (isEdit.value) {
    const idx = matchList.value.findIndex(m => m.id === form.value.id)
    if (idx !== -1) matchList.value[idx] = { ...form.value }
  } else {
      const res = await addMatch(form.value);
      if(res.data.code == 0){
         const res_match = await getMatches()
        matchList.value = res_match.data;
      }

  }
  closeModal()
}

// 删除
const deleteTargetId = ref<number | null>(null)
const showDeleteConfirm = ref(false)

function openDelete(id: number) {
  deleteTargetId.value = id
  showDeleteConfirm.value = true
}

function confirmDelete() {
  if (deleteTargetId.value !== null) {
    matchList.value = matchList.value.filter(m => m.id !== deleteTargetId.value)
  }
  showDeleteConfirm.value = false
  deleteTargetId.value = null
}

function cancelDelete() {
  showDeleteConfirm.value = false
  deleteTargetId.value = null
}

// 状态样式
const statusClass: Record<Match['status'], string> = {
  '未开始': 'status-pending',
  '进行中': 'status-ongoing',
  '已结束': 'status-ended',
}
</script>

<template>
  <div class="matches-page">
    <div class="page-header">
      <h2>比赛管理</h2>
    </div>

    <div class="search-bar">
      <input
        v-model="keyword"
        type="text"
        placeholder="请输入比赛名称"
        class="search-input"
      />
      <button class="btn btn-default">搜索</button>
      <button class="btn btn-primary" @click="openAdd">新增比赛</button>
    </div>

    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>比赛名称</th>
            <th>队伍</th>
            <th>比赛时间</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredList.length === 0">
            <td colspan="6" class="empty-tip">暂无数据</td>
          </tr>
          <tr v-for="item in filteredList" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.team }}</td>
            <td>{{ item.time }}</td>
            <td>
              <span class="status-tag" :class="statusClass[item.status]">
                {{ item.status }}
              </span>
            </td>
            <td>
              <button class="btn-link edit" @click="openEdit(item)">编辑</button>
              <span class="divider">|</span>
              <button class="btn-link delete" @click="openDelete(item.id)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 新增/编辑弹窗 -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ isEdit ? '编辑比赛' : '新增比赛' }}</h3>
          <button class="modal-close" @click="closeModal">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-item">
            <label>比赛名称 <span class="required">*</span></label>
            <input v-model="form.name" type="text" placeholder="请输入比赛名称" />
          </div>
          <div class="form-item">
            <label>队伍 <span class="required">*</span></label>
            <input v-model="form.team" type="text" placeholder="如：湖人 VS 勇士" />
          </div>
          <div class="form-item">
            <label>比赛时间 <span class="required">*</span></label>
            <input v-model="form.time" type="date" />
          </div>
          <div class="form-item">
            <label>状态</label>
            <select v-model="form.status">
              <option v-for="s in statusOptions" :key="s" :value="s">{{ s }}</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-default" @click="closeModal">取消</button>
          <button class="btn btn-primary" @click="submitForm">确定</button>
        </div>
      </div>
    </div>

    <!-- 删除确认弹窗 -->
    <div v-if="showDeleteConfirm" class="modal-overlay" @click.self="cancelDelete">
      <div class="modal modal-sm">
        <div class="modal-header">
          <h3>确认删除</h3>
          <button class="modal-close" @click="cancelDelete">✕</button>
        </div>
        <div class="modal-body">
          <p>确定要删除这场比赛吗？此操作不可恢复。</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-default" @click="cancelDelete">取消</button>
          <button class="btn btn-danger" @click="confirmDelete">确认删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.matches-page {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.search-input {
  width: 260px;
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: #1890ff;
}

.btn {
  padding: 6px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: opacity 0.2s;
}

.btn:hover {
  opacity: 0.85;
}

.btn-default {
  background: #fff;
  border-color: #d9d9d9;
  color: #333;
}

.btn-primary {
  background: #1890ff;
  color: #fff;
}

.btn-danger {
  background: #ff4d4f;
  color: #fff;
}

.table-wrapper {
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.data-table th,
.data-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

.data-table th {
  background: #fafafa;
  font-weight: 600;
  color: #333;
}

.data-table tr:last-child td {
  border-bottom: none;
}

.data-table tbody tr:hover {
  background: #f5f9ff;
}

.empty-tip {
  text-align: center;
  color: #999;
  padding: 40px 0;
}

/* 状态标签 */
.status-tag {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.status-pending {
  background: #fff7e6;
  color: #d46b08;
}

.status-ongoing {
  background: #e6f7ff;
  color: #0958d9;
}

.status-ended {
  background: #f5f5f5;
  color: #8c8c8c;
}

.btn-link {
  background: none;
  border: none;
  padding: 0;
  font-size: 14px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-link:hover {
  opacity: 0.75;
}

.btn-link.edit {
  color: #1890ff;
}

.btn-link.delete {
  color: #ff4d4f;
}

.divider {
  color: #d9d9d9;
  margin: 0 8px;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #fff;
  border-radius: 8px;
  width: 480px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
}

.modal-sm {
  width: 360px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 16px;
  color: #999;
  cursor: pointer;
  line-height: 1;
  padding: 0;
}

.modal-close:hover {
  color: #333;
}

.modal-body {
  padding: 20px;
}

.modal-body p {
  margin: 0;
  color: #555;
  font-size: 14px;
}

.form-item {
  margin-bottom: 16px;
}

.form-item label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  color: #333;
}

.required {
  color: #ff4d4f;
}

.form-item input,
.form-item select {
  width: 100%;
  padding: 7px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;
  background: #fff;
}

.form-item input:focus,
.form-item select:focus {
  border-color: #1890ff;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 12px 20px;
  border-top: 1px solid #f0f0f0;
}
</style>
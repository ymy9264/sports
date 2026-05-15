<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getMatches, addMatch, updateMatch, deleteMatch } from '@/api/matches'

interface Match {
  id: number
  name: string
  home_team: string
  visit_team: string
  match_time: string
  score: string
}

onMounted(async () => {
  const res = await getMatches()
  matchList.value = res.data
})

const matchList = ref<Match[]>([])

// 搜索
const keyword = ref('')
const filteredList = computed(() => {
  const k = keyword.value.trim().toLowerCase()
  if (!k) return matchList.value
  return matchList.value.filter(
    (m) =>
      m.name.toLowerCase().includes(k) ||
      m.home_team.toLowerCase().includes(k) ||
      m.visit_team.toLowerCase().includes(k),
  )
})

// 弹窗
const showModal = ref(false)
const isEdit = ref(false)

const emptyForm = (): Omit<Match, 'id'> => ({
  name: '',
  home_team: '',
  visit_team: '',
  match_time: '',
  score: '',
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
  if (!form.value.name || !form.value.home_team || !form.value.visit_team || !form.value.match_time) {
    alert('请填写必填项：联赛、主队、客队、比赛时间')
    return
  }

  if (isEdit.value) {
    const res = await updateMatch(form.value)
    if (res.data.code == 0) {
      const resMatch = await getMatches()
      matchList.value = resMatch.data
    }
  } else {
    const res = await addMatch(form.value)
    if (res.data.code == 0) {
      const resMatch = await getMatches()
      matchList.value = resMatch.data
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

async function confirmDelete() {
  if (deleteTargetId.value !== null) {
    const res = await deleteMatch(deleteTargetId.value)
    if (res.data.code === 0) {
      const resMatch = await getMatches()
      matchList.value = resMatch.data
    }
  }
  showDeleteConfirm.value = false
  deleteTargetId.value = null
}

function cancelDelete() {
  showDeleteConfirm.value = false
  deleteTargetId.value = null
}
</script>

<template>
  <div class="matches-page">
    <div class="page-header">
      <h2>比赛管理</h2>
    </div>

    <div class="search-bar">
      <input v-model="keyword" type="text" placeholder="请输入联赛或球队名称" class="search-input" />
      <button class="btn btn-default">搜索</button>
      <button class="btn btn-primary" @click="openAdd">新增比赛</button>
    </div>

    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>联赛</th>
            <th>主队</th>
            <th>客队</th>
            <th>比赛时间</th>
            <th>比分</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredList.length === 0">
            <td colspan="7" class="empty-tip">暂无数据</td>
          </tr>
          <tr v-for="item in filteredList" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.home_team }}</td>
            <td>{{ item.visit_team }}</td>
            <td>{{ item.match_time }}</td>
            <td>{{ item.score }}</td>
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
            <label>联赛 <span class="required">*</span></label>
            <input v-model="form.name" type="text" placeholder="请输入联赛名称" />
          </div>
          <div class="form-row">
            <div class="form-item">
              <label>主队 <span class="required">*</span></label>
              <input v-model="form.home_team" type="text" placeholder="请输入主队名称" />
            </div>
            <div class="form-item">
              <label>客队 <span class="required">*</span></label>
              <input v-model="form.visit_team" type="text" placeholder="请输入客队名称" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-item">
              <label>比赛时间 <span class="required">*</span></label>
              <input v-model="form.match_time" type="datetime-local" />
            </div>
            <div class="form-item">
              <label>比分</label>
              <input v-model="form.score" type="text" placeholder="如：2-1" />
            </div>
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
  width: 520px;
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 16px;
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
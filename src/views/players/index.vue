<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getPlayers } from '@/api/players'

interface Player {
  id: number
  name: string
  team: string
  position: string
  number: number
  nationality: string
  age: number
}

const playerList = ref<Player[]>([

])



const positionOptions = ['控球后卫', '得分后卫', '小前锋', '大前锋', '中锋', '前锋', '中场', '后卫', '守门员', '右翼', '左翼']

// 搜索
const keyword = ref('')
const filteredList = computed(() => {
  const k = keyword.value.trim().toLowerCase()
  if (!k) return playerList.value
  return playerList.value.filter(
    p =>
      p.name.toLowerCase().includes(k) ||
      p.team.toLowerCase().includes(k) ||
      p.nationality.toLowerCase().includes(k)
  )
})

// 弹窗
const showModal = ref(false)
const isEdit = ref(false)

const emptyForm = (): Omit<Player, 'id'> => ({
  name: '',
  team: '',
  position: '',
  number: 1,
  nationality: '',
  age: 20,
})

const form = ref<Player>({ id: 0, ...emptyForm() })

  onMounted(async()=>{
    const res = await getPlayers()
    playerList.value = res.data
  })

function openAdd() {
  isEdit.value = false
  form.value = { id: 0, ...emptyForm() }
  showModal.value = true
}

function openEdit(player: Player) {
  isEdit.value = true
  form.value = { ...player }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function submitForm() {
  if (!form.value.name || !form.value.team || !form.value.position) {
    alert('请填写必填项：球员姓名、所属球队、位置')
    return
  }
  if (isEdit.value) {
    const idx = playerList.value.findIndex(p => p.id === form.value.id)
    if (idx !== -1) playerList.value[idx] = { ...form.value }
  } else {
    const newId = playerList.value.length ? Math.max(...playerList.value.map(p => p.id)) + 1 : 1
    playerList.value.push({ ...form.value, id: newId })
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
    playerList.value = playerList.value.filter(p => p.id !== deleteTargetId.value)
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
  <div class="players-page">
    <div class="page-header">
      <h2>球员管理</h2>
    </div>

    <div class="search-bar">
      <input
        v-model="keyword"
        type="text"
        placeholder="请输入球员姓名、球队或国籍"
        class="search-input"
      />
      <button class="btn btn-default">搜索</button>
      <button class="btn btn-primary" @click="openAdd">新增球员</button>
    </div>

    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>姓名</th>
            <th>所属球队</th>
            <th>位置</th>
            <th>号码</th>
            <th>国籍</th>
            <th>年龄</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredList.length === 0">
            <td colspan="8" class="empty-tip">暂无数据</td>
          </tr>
          <tr v-for="player in filteredList" :key="player.id">
            <td>{{ player.id }}</td>
            <td class="name-cell">{{ player.name }}</td>
            <td>{{ player.team }}</td>
            <td>
              <span class="position-tag">{{ player.position }}</span>
            </td>
            <td>
              <span class="number-badge">{{ player.number }}</span>
            </td>
            <td>{{ player.nationality }}</td>
            <td>{{ player.age }}</td>
            <td>
              <button class="btn-link edit" @click="openEdit(player)">编辑</button>
              <span class="divider">|</span>
              <button class="btn-link delete" @click="openDelete(player.id)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 新增/编辑弹窗 -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ isEdit ? '编辑球员' : '新增球员' }}</h3>
          <button class="modal-close" @click="closeModal">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <div class="form-item">
              <label>球员姓名 <span class="required">*</span></label>
              <input v-model="form.name" type="text" placeholder="请输入姓名" />
            </div>
            <div class="form-item">
              <label>国籍</label>
              <input v-model="form.nationality" type="text" placeholder="如：美国" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-item">
              <label>所属球队 <span class="required">*</span></label>
              <input v-model="form.team" type="text" placeholder="请输入球队名称" />
            </div>
            <div class="form-item">
              <label>位置 <span class="required">*</span></label>
              <select v-model="form.position">
                <option value="" disabled>请选择位置</option>
                <option v-for="p in positionOptions" :key="p" :value="p">{{ p }}</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-item">
              <label>号码</label>
              <input v-model.number="form.number" type="number" placeholder="球衣号码" min="1" max="99" />
            </div>
            <div class="form-item">
              <label>年龄</label>
              <input v-model.number="form.age" type="number" placeholder="年龄" min="15" max="50" />
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
          <p>确定要删除该球员吗？此操作不可恢复。</p>
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
.players-page {
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

.name-cell {
  font-weight: 500;
  color: #222;
}

.position-tag {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 12px;
  background: #f0f5ff;
  color: #2f54eb;
}

.number-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #f5f5f5;
  color: #333;
  font-size: 13px;
  font-weight: 600;
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

/* 两列表单布局 */
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